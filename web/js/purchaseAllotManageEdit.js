var subModel = kendo.data.Model.define({
	id : "eqcostNo",
	fields : {
        eqcostNo: {
			editable : false,
			nullable : true	
        },
        eqcostMaterialCode: {
        	editable : false
        },
        eqcostProductName: {
        	editable : false
        },
        eqcostProductType: {
        	editable : false
        },
        eqcostRealAmount: {
        	editable : false
        },
        eqcostUnit: {
        	editable : false
        },
        eqcostBrand: {
        	editable : false
        },
        eqcostBasePrice: {
        	editable : false
        },
        eqcostMemo: {
        	editable : false
        },
        eqcostLeftAmount: {
        	editable : false
        },
        eqcostCategory: {
       		editable : false
        },
        pbTotalCount: {
        	editable : false
        },
        pbLeftCount: {
        	editable : false
        },
        paCount:{
        	editable : false,
        	type: "number",
       	 	validation: {
                min: 0
            }
       },
       pbComment:{
    	   editable : false
       },
       paComment:{
    	   editable : false
       }
	}
});	
var myModel = kendo.data.Model.define({
	id : "_id",
	fields : {
		paCode:{},
		paStatus:{},
		paSubmitDate: {},
		paApproveDate: {},
		pbDepartment: {},
		pbType: {},
		pbStatus: {},
		pbSpecialRequire: {},
		pbComment: {},
		pbMoney: {},
		projectName: {},
		projectCode: {},
		projectManager: {},
		customer: {},
		scId:{},
		contractCode: {},
		contractAmount: {},
	}
});
var currentObj = new myModel();

$(document).ready(function () {
	checkRoles();
	$("#subGrid").kendoGrid({
		dataSource: {
			schema: {
				model: subModel
			}			
		},
	    columns: [
			{ field: "eqcostNo", title: "序号"},
			{ field: "eqcostMaterialCode", title: "物料代码" },
			{ field: "eqcostProductName", title: "产品名称" },
			{ field: "eqcostProductType", title: "规格型号" },
			{ field: "paCount", title: "本次申请数量", attributes: { "style": "color:red"}},
			{ field: "pbLeftCount", title: "可申请数量"},
			{ field: "pbTotalCount", title: "备货数量"},
			{ field: "eqcostBasePrice", title: "预估单价" },
			{ field: "eqcostCategory", title: "类别" },
			{ field: "eqcostMemo", title: "备注1" },
			{ field: "pbComment", title: "备注2" }
	  	],	 
	  	editable:true
	});

	$("#form-container-button button").click(function(){
		if(this.value == "cancel") {
			loadPage("purchaseAllotManage");
		} else if(validateModel()){
			if(confirm("提交表单，确认？")){
				postAjaxRequest("/service/purchase/allot/"+this.value, {models:kendo.stringify(currentObj)} , saveSuccess);
			}	
		}
	});	
	
	
	if(popupParams){
		postAjaxRequest("/service/purchase/allot/load", popupParams, editSucess);
		disableAllInPoppup();
	}else if(redirectParams){
		if(redirectParams._id) {
			postAjaxRequest("/service/purchase/allot/load", redirectParams, editSucess);
		}	
	}
	
});

function saveSuccess(){
	loadPage("purchaseAllotManage");
}
function editSucess(e){
	$("#form-container [name!='tempComment']").attr("disabled",true);
	if(e.paStatus == "已结束"){
		$("#paNumberTd").show();
	}else if(e.paStatus == "已终审") {
		if(redirectParams) {
			$("#paNumberTd").show();
			$("#paNumberTd input").attr("disabled",false);
			$("#form-container-button button[value!='cancel'][value!='done']").hide();
		}
	}else if(e.paStatus == "已提交"){
		$("#form-container-button button[value='done']").hide();
	}
	currentObj = new myModel(e);
	currentObj.set("pbPlanDate", kendo.toString(currentObj.pbPlanDate, 'd'));
	kendo.bind($("#form-container"), currentObj);
}
function validateModel(){
	if(currentObj.paStatus == "已终审") {
		var validator = $("#form-container").kendoValidator().data("kendoValidator");
		if(!validator.validate()){
			return false;
		}
	}
	return true;
}