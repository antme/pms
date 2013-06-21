$(document).ready(function () {
	var currentObj;
	var baseUrl = "../../service/";
	var subModel = kendo.data.Model.define({
		id : "itemNo",
		fields : {
			itemNo: {nullable: true},
			itemMonth: {editable: false,nullable: true},
			itemContent: {editable: false,nullable:true},
			itemComment: {editable: false},
			itemMoney: {editable: false,type: "number",validation: {min: 0}}
		}
	});	
	var myModel = kendo.data.Model.define({
		id : "_id",
		fields : {
			payInvoiceDepartment: {editable: false, nullable: true},
			payInvoiceProposerId: {editable: false},
			payInvoiceProposerName: {editable: false},
			payInvoicePlanDate: {editable: false},
			payInvoiceReceivedMoneyStatus: {editable: false},
			payInvoiceSubmitDate: {editable: false},
			payInvoiceApproveDate: {editable: false},
			payInvoiceCheckDate: {editable: false},
			payInvoiceSignDate: {editable: false},
			payInvoiceMoney: {editable: false},
			payInvoiceItemList: {editable: false}
		}
	});
	
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
	  	toolbar: [{text:"保存",name:"save"}]
	});

	$("#searchfor").kendoDropDownList({
		dataTextField : "contractCode",
		dataValueField : "_id",
		dataSource : {
			transport : {
				read : {
					dataType : "jsonp",
					url : "/service/sc/listforselect",
				}
			}
		}
	});	

	$(".submitform").click(function(){
		if(confirm(this.value + "表单，确认？")){
			if(this.value == "提交"){
				postAjaxRequest( baseUrl+"/purcontract/invoice/add", {models:kendo.stringify(currentObj)} , saveSuccess);
			}else if(this.value=="取消"){
				location.reload();
			}
		}
	});

	$("#searchbt").click(function(){
		var vv = $("#searchfor").val();
		if(vv != ""){
			postAjaxRequest(baseUrl+"/purcontract/invoice/add", {contractCode:vv}, edit);
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
	
	
	
});


