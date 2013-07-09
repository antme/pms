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
		getInvoiceReceivedMoneyStatus:{},
		getInvoiceItemList: {},
		getInvoiceActualMoney:{type:"number"},
		getInvoiceActualDate:{type:"date"},
		getInvoiceActualInvoiceNum:{type:"number"},
		getInvoiceActualSheetCount:{},
		requestedTotalMoney:{type:"number"},
		getInvoiceItemList:{}
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
			{ field: "itemContent", title: "内容" },
			{ field: "itemComment", title: "备注" },
			{ field: "itemMoney", title: "金额",footerTemplate: "总共: #=sum#" }
	  	],	 
	  	editable:true,
	  	toolbar: [{text:"新增",name:"create"},{text:"计算",name:"save"}]
	});

	$("#form-container-button button").click(function(){
		if(this.value == "cancel") {
			location.reload();
		}else if(validateModel()){
			if(confirm("提交表单，确认？")){
				postAjaxRequest("/service/purcontract/invoice/"+this.value, {models:kendo.stringify(currentObj)} , saveSuccess);
			}	
		}
	});

	if(popupParams){
		postAjaxRequest("/service/purcontract/invoice/load", popupParams, editSucess);
		disableAllInPoppup();
	} else if(redirectParams){
		if(redirectParams._id){
			postAjaxRequest("/service/purcontract/invoice/load", redirectParams, editSucess);
		} else if(redirectParams.purchaseContractId){
			postAjaxRequest("/service/purcontract/invoice/prepare", redirectParams, editSucess);
		}
	}
	kendo.bind($("#form-container"), currentObj);
});

function saveSuccess(){
	location.reload();
}
function editSucess(e){
	if(!e) return;
	currentObj = new myModel(e);
	currentObj.set("getInvoiceActualDate", kendo.toString(currentObj.getInvoiceActualDate, 'd'));
	kendo.bind($("#form-container"), currentObj);
}

function validateModel(){
	var validator = $("#form-container").kendoValidator().data("kendoValidator");
	if(!validator.validate()){
		return false;
	}
	return true;
}