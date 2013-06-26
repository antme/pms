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
		payInvoicePlanDate: {type:"date"},
		payInvoiceReceivedMoneyStatus:{},
		payInvoiceSubmitDate: {},
		payInvoiceApproveDate: {},
		payInvoiceCheckDate: {},
		payInvoiceSignDate: {},
		payInvoiceMoney: {},
		payInvoiceItemList: {},
		payInvoiceActualMoney:{},
		payInvoiceActualDate:{type:"date"},
		payInvoiceActualInvoiceNum:{},
		payInvoiceActualSheetCount:{},
		invoiceType:{},
		salesContractId:{},
		contractCode:{},
		projectId:{},
		operateType:{}
	}
});
var currentObj = new myModel();

$(document).ready(function () {
	checkRoles();
	
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
					url : "/service/sc/listforselect"
				}
			},
			schema : {
				total: "total",
				data: "data"
			}
		}
	});	

	$("#form-container-button button").click(function(){
		if(this.value == "cancel") {
			loadPage("payInvoice");
		} else if(confirm("提交表单，确认？")){
			postAjaxRequest("/service/sc/invoice/"+this.value, {models:kendo.stringify(currentObj)} , saveSuccess);
		}
	});
	
	$("#searchbt").click(function(){
		var scId = $("#searchfor").val();
		if(scId != ""){
			postAjaxRequest("/service/sc/invoice/prepare", {contractCode:scId}, editSucess);
		}else{
			alert("请选择合同编号");
		}
	});
	if(popupParams){
		postAjaxRequest("/service/sc/invoice/load", popupParams, editSucess);
		disableAllInPoppup();
	} else if(redirectParams){
		if(redirectParams._id){
			postAjaxRequest(baseUrl+"/sc/invoice/load", redirectParams, editSucess);
		} else {
			$("#searchDiv").show();
		}
	}
	kendo.bind($("#form-container"), currentObj);
});

function saveSuccess(){
	loadPage("payInvoice");
}
function editSucess(e){
	if(!e) return;
	if(e.payInvoiceStatus == "已出票"){
		$("#form-container .invoicedone").show();
		$("#form-container-button [value=done]").hide();
		$("#form-container-button [value=financeapprove]").hide();
		$("#form-container-button [value=financereject]").hide();		
	} else if(e.payInvoiceStatus == "财务已审核"){
		$("#form-container .invoicedone").show();
		$("#form-container-button [value=financeapprove]").hide();
		$("#form-container-button [value=financereject]").hide();		
	}else if(e.payInvoiceStatus == "经理已审核"){
		$("#form-container-button [value=done]").hide();
	}
	currentObj = new myModel(e);
	currentObj.set("payInvoicePlanDate", kendo.toString(currentObj.payInvoicePlanDate, 'd'));
	currentObj.set("payInvoiceActualDate", kendo.toString(currentObj.payInvoiceActualDate, 'd'));	
	kendo.bind($("#form-container"), currentObj);
}

