intSelectInput();
var currentObj;
var baseUrl = "../../service/";
var subModel = kendo.data.Model.define({
	id : "itemNo",
	fields : {
		itemNo: {nullable: true},
		itemMonth: {nullable: true},
		itemContent: {nullable:true},
		itemComment: {},
		itemMoney: {type: "number",validation: {min: 0}}
	}
});	
var myModel = kendo.data.Model.define({
	id : "_id",
	fields : {
		payInvoiceDepartment: {nullable: true},
		payInvoiceProposerId: {},
		payInvoiceProposerName: {},
		payInvoiceStatus:{},
		payInvoicePlanDate: {nullable: true},
		payInvoiceReceivedMoneyStatus:{},
		payInvoiceSubmitDate: {},
		payInvoiceApproveDate: {},
		payInvoiceCheckDate: {},
		payInvoiceSignDate: {},
		payInvoiceMoney: {},
		payInvoiceItemList: {nullable: true},
		payInvoiceActualMoney:{type:"number"},
		payInvoiceActualDate:{type:"date"},
		payInvoiceActualInvoiceNum:{type:"string"},
		payInvoiceActualSheetCount:{type:"number"},
		invoiceType:{},
		salesContractId:{},
		contractCode:{},
		projectId:{},
		operateType:{}
	}
});
$(document).ready(function () {
	currentObj = new myModel();
	
	$("#subGrid").kendoGrid({
		dataSource: {
			schema: {
				model: subModel
			},
			aggregate: [ 
			    { field: "itemNo", aggregate: "count" },
			    { field: "itemMoney", aggregate: "sum"}
			]			
		},
	    columns: [
			{ field: "itemNo", title: "编号" ,footerTemplate: "总共: #=count#"},
			{ field: "itemMonth", title: "所属月份" },
			{ field: "itemContent", title: "开票内容" },
			{ field: "itemComment", title: "备注" },
			{ field: "itemMoney", title: "金额",footerTemplate: "总共: #=sum#" }
	  	],	 
	  	editable:true,
	  	toolbar: [{text:"新增",name:"create"},{text:"计算",name:"save"}]
	});

	$("#searchfor").kendoDropDownList({
		dataTextField : "contractCode",
		dataValueField : "_id",
		dataSource : {
			transport : {
				read : {
					dataType : "jsonp",
					url : "/service/sc/listforselect"
				}
			},
			schema: {data:"data"}
		}
	});	

	$(".submitform").click(function(){
		if(confirm(this.value + "表单，确认？")){
			currentObj.operateType=this.value;
			if(this.value == "提交"){
				postAjaxRequest( baseUrl+"/sc/invoice/add", {models:kendo.stringify(currentObj)} , saveSuccess);
			} else if(this.value == "批准" || this.value == "拒绝"){
				postAjaxRequest( baseUrl+"/sc/invoice/update", {models:kendo.stringify(currentObj)} , saveSuccess);
			}else if(this.value=="取消"){
				location.reload();
			}
		}
	});
	$("#searchbt").click(function(){
		var vv = $("#searchfor").val();
		if(vv != ""){
			currentObj.operateType="prepare";
			currentObj.contractCode=vv;
			postAjaxRequest(baseUrl+"/sc/invoice/add", {models:kendo.stringify(currentObj)}, edit);
		}else{
			alert("请选择合同编号");
		}
	});
	
	function edit(e){
		currentObj = new myModel(e);
		kendo.bind($("#form-container"), currentObj);
	}
	function saveSuccess(){
		location.reload();
	}
	
	if(redirectParams){//批准
		$("#searchDiv").hide();
		$("#foradddiv").hide();
		$(".foredit").attr("disabled","disabled");
		var _id = redirectParams._id;
		if(_id) {
			postAjaxRequest(baseUrl+"sc/invoice/load", {_id:_id}, edit);
		}
	}else{//添加
		$("#forapprovediv").hide();
	}
	kendo.bind($("#form-container"), currentObj);	
});


