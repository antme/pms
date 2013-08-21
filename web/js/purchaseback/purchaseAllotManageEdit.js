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
       },
       eqcostSalesBasePrice:{
       		editable : false
       },
       eqcostDiscountRate:{
       		editable : false
       },
       eqcostLastBasePrice:{
       		editable : false
       },
       eqcostDepotPrice:{
    	   type: "number",
    	   defaultValue:0
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
			/*{ field: "pbLeftCount", title: "可申请数量"},*/
			{ field: "pbTotalCount", title: "备货数量"},
			{ field: "eqcostBasePrice", title: "标准成本价" },
			{ field: "eqcostSalesBasePrice", title : "销售单价"}, 
			{ field: "eqcostDiscountRate",title : "折扣率"},
			{ field: "eqcostLastBasePrice",title : "最终成本价"},
			{ field: "eqcostDepotPrice",
				title : "库存单价", 
				attributes: { "style": "color:red"},
				template :  function(dataItem) {
					if(dataItem.eqcostDepotPrice == null){
						return 0;
					} else {
						return dataItem.eqcostDepotPrice;
					}
				}
			},
			{ field: "eqcostCategory", title: "类别" },
			{ field: "pbComment", title: "备注" }
	  	],	
	  	sortable : true,
	  	editable:true
	});

	$("#form-container-button button").click(function(){
		if(this.value == "cancel") {
			loadPage("purchaseback_purchaseAllotManage");
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
	loadPage("purchaseback_purchaseAllotManage");
}
function editSucess(e){
	$("#form-container [name!='tempComment']").attr("disabled",true);
	if(e.paStatus == "已提交"){
		$("#paNumberTd").hide();
		$("#form-container-button button[value!='approve'][value!='reject'][value!='cancel']").hide();
	}else if(e.paStatus == "已批准"){
		$("#paNumberTd").hide();
		$("#form-container-button button[value!='finalapprove'][value!='finalreject'][value!='cancel']").hide();
	}else if(e.paStatus == "已终审"){
		$("#paNumberTd input").attr("disabled",false);
		$("#form-container-button button[value!='done'][value!='cancel']").hide();
	}else if(e.paStatus == "已结束"){
		$("#form-container-button button[value!='cancel']").hide();
	}else{
		$("#paNumberTd").hide();
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