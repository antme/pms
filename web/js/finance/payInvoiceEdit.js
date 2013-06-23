intSelectInput();
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
		payInvoiceDepartment: {},
		payInvoiceProposerId: {},
		payInvoiceProposerName: {},
		payInvoiceStatus:{},
		payInvoicePlanDate: {},
		payInvoiceReceivedMoneyStatus:{},
		payInvoiceSubmitDate: {},
		payInvoiceApproveDate: {},
		payInvoiceCheckDate: {},
		payInvoiceSignDate: {},
		payInvoiceMoney: {},
		payInvoiceItemList: {},
		payInvoiceActualMoney:{type:"number"},
		payInvoiceActualDate:{type:"date"},
		payInvoiceActualInvoiceNum:{},
		payInvoiceActualSheetCount:{type:"number"},
		invoiceType:{},
		salesContractId:{},
		contractCode:{},
		projectId:{},
		operateType:{}
	}
});
var currentObj = new myModel();

$(document).ready(function () {
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
		template:  '${ data.projectName }:<strong>${ data.contractCode }</strong>',
		dataSource : {
			transport : {
				read : {
					dataType : "jsonp",
					url : baseUrl+"/sc/listforselect"
				}
			},
			schema : {
				total: "total",
				data: "data"
			}
		}
	});	

	$(".submitform").click(function(){
		if(confirm(this.value + "表单，确认？")){
			currentObj.operateType=this.name;
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

	if(popupParams){
		postAjaxRequest(baseUrl+"/sc/invoice/load", popupParams, edit);
		disableAllInPoppup();
	}else if(redirectParams){
		var actionType = redirectParams.actionType;
		if(actionType == "add"){
			$("#formapprove").hide();
		}else if(actionType == "approve"){
			$("#searchDiv").hide();
			$("#formadd").hide();
			postAjaxRequest(baseUrl+"/sc/invoice/load", redirectParams, edit);
		}
	}
	
	kendo.bind($("#form-container"), currentObj);	
});

function saveSuccess(){
	location.reload();
}
function edit(e){
	if(!e) return;
	if(e.payInvoiceStatus == "已出票"){
		$("#form-container :input").attr("disabled","disabled");
	}
	currentObj = new myModel(e);
	kendo.bind($("#form-container"), currentObj);	
}

