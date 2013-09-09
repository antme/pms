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
		payInvoiceComment:{defaultValue:""},
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
	  	toolbar: [{text:"新增开票内容",name:"create"},{text:"计算",name:"save"}]
	});

	$("#form-container-button button").click(function(){
		if(this.value == "cancel") {
			loadPage("finance_payInvoice");
		} else if(validateModel()){
			if(confirm("提交表单，确认？")){
				currentObj.payInvoicePlanDate = kendo.toString(currentObj.payInvoicePlanDate,"yyyy-MM-dd");
				postAjaxRequest("/service/sc/invoice/"+this.value, {models:kendo.stringify(currentObj)} , saveSuccess);
			}
		}
	});
	if(popupParams){
		postAjaxRequest("/service/sc/invoice/load", popupParams, editSucess);
		disableAllInPoppup();
	} else if(redirectParams){
		if(redirectParams._id){
			postAjaxRequest(baseUrl+"/sc/invoice/load", redirectParams, editSucess);
		} else if(redirectParams.scId){
			postAjaxRequest(baseUrl+"/sc/invoice/prepare", redirectParams, editSucess);
		}
	}
	kendo.bind($("#form-container"), currentObj);
});

function saveSuccess(){
	loadPage("finance_payInvoice");
}
function editSucess(e){
	if(e.payInvoiceStatus == '草稿'){//只 提交 可见
		$(".invoicedone").remove();
		$("#form-container-button button[value!='add'][value!='cancel']").hide();
	}else if(e.payInvoiceStatus == '待部门经理审核'){//只 经理批准 拒绝可见
		$(".invoicedone").remove();
		$("#form-container [name!='tempComment']").attr("disabled",true);
		$("#form-container-button button[value!='managerapprove'][value!='managerreject'][value!='cancel']").hide();
	}else if(e.payInvoiceStatus == '待财务经理审核'){//只 财务批准 拒绝可见
		$(".invoicedone").remove();
		$("#form-container [name!='tempComment']").attr("disabled",true);
		$("#form-container-button button[value!='financeapprove'][value!='financereject'][value!='cancel']").hide();
	}else if(e.payInvoiceStatus == '开票中'){//只开票可见
		$("#form-container [name!='tempComment']").attr("disabled",true);
		$("#form-container-button button[value!='done'][value!='cancel']").hide();
		$(".invoicedone").show();
		$(".invoicedone input").attr("disabled",false);
	}else if(e.payInvoiceStatus == '开票完毕'){//都不可见
		$(".invoicedone").show();
		$("#form-container [name!='tempComment']").attr("disabled",true);
		$("#form-container-button button[value!='cancel']").hide();
	}else if(e.payInvoiceStatus == '拒绝'){//只提交可见
		$(".invoicedone").remove();
		$("#form-container-button button[value!='add'][value!='cancel']").hide();
	}		
	currentObj = new myModel(e);
	currentObj.set("payInvoicePlanDate", kendo.toString(currentObj.payInvoicePlanDate, 'd'));
	currentObj.set("payInvoiceActualDate", kendo.toString(currentObj.payInvoiceActualDate, 'd'));	
	kendo.bind($("#form-container"), currentObj);
}
function validateModel(){
	var validator = $("#form-container").kendoValidator().data("kendoValidator");
	if(!validator.validate()){
		return false;
	}
	return true;
}
