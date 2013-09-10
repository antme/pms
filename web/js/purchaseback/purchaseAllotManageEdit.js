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
    	   type: "number",
    	   defaultValue:0
       },
       eqcostDepotPrice:{
    	   type: "number",
    	   defaultValue:0
       },
       allotProductType:{}
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
			{ field: "allotProductType", title: "调拨型号",attributes: { "style": "color:red"},
				template :  function(dataItem) {
					if(!dataItem.allotProductType && dataItem.eqcostProductType){
						dataItem.allotProductType = dataItem.eqcostProductType;
					}
					return dataItem.allotProductType;
				}
			},
			{ field: "paCount", title: "本次申请数量",width:"90px"},
			{ field: "pbTotalCount", title: "备货数量"},
			{ field: "eqcostBasePrice", title: "标准成本价" },
			{ field: "eqcostSalesBasePrice", title : "销售单价"}, 
			{ field: "eqcostDiscountRate",title : "折扣率"},
			{ field: "eqcostLastBasePrice",title : "最终成本价",attributes: { "style": "color:red"},
				template :  function(dataItem) {
					if(!dataItem.eqcostLastBasePrice){
						dataItem.eqcostLastBasePrice = 0;
					}
					return dataItem.eqcostLastBasePrice;
				}
			},
			{ field: "eqcostCategory", title: "类别" },
			{ field: "eqcostProductType", title: "规格型号" }
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
	//审核的时候禁止掉页面一些元素
	$(":input").attr("disabled",true);
	$("#tempComment").removeAttr("disabled");
	$(":button").removeAttr("disabled");	
	
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