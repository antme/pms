intSelectInput();
var subModel = kendo.data.Model.define({
	id : "_id",
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
        eqcostBasePrice: {
        	editable : false
        },
        eqcostMemo: {
        	editable : false
        },
        eqcostLeftAmount: {
        	editable : false
        },
        pbTotalCount: {
        	editable : false
        },
        pbLeftCount: {
        	editable : false
       },
       paCount:{
    	   type: "number",
           validation: {
               min: 0
           },
           defaultValue:0
       },
       eqcostCategory: {
       		editable : false
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
       }
	}
});
var myModel = kendo.data.Model.define({
	id : "_id",
	fields : {
		pbCode:{},
		applicationDepartment:{},
		pbSubmitDate:{},
		pbPlanDate:{type:"date"},
		pbType:{},
		pbStatus:{},
		pbComment:{},
		pbMoney:{},
		projectName: {},
		projectCode: {},
		projectManager: {},
		customer: {},
		scId:{},
		contractCode: {},
		contractAmount: {},
		eqcostList:{},
		paShelfCode:{},
		paCount:{
	    	   type: "number",
	           validation: {
	               min: 0
	           },
	           defaultValue:0
	     }
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
			change: dataBound
		},
	    columns: [
			
			{ field: "eqcostMaterialCode", title: "物料代码" },
			{ field: "eqcostProductName", title: "产品名称" },
			{ field: "eqcostProductType", title: "规格型号" },
			{ field: "eqcostUnit", title: "单位" },
			{ field: "paCount", title: "本次申请数量", attributes: { "style": "color:red"}},
			{ field: "pbLeftCount", title: "备货申请下可申请数量"},
			{ field: "pbTotalCount", title: "备货数量"},
			{ field: "eqcostLastBasePrice",title : "最终成本价"},
			{ field: "pbComment", title: "备注" }
	  	],
	  	sortable : true,
	  	resizable: true,
	  	editable:true
	});


	if(popupParams){
		postAjaxRequest("/service/purchase/allot/load", popupParams, editSuccess);
		disableAllInPoppup();
	}else if(redirectParams){
		if(redirectParams.pbId) {
			postAjaxRequest("/service/purchase/allot/prepare", redirectParams, editSuccess);
		}else if(redirectParams._id) {
			postAjaxRequest("/service/purchase/allot/load", redirectParams, editSuccess);
		}
	}
	
});

function cancleAllotEdit(){
	loadPage("purchaseback_purchaseAllotManage");
}

function submitEditAllot() {
	if (validateModel()) {
		if (confirm("提交表单，确认？")) {
			postAjaxRequest("/service/purchase/allot/submit" , {
				models : kendo.stringify(currentObj)
			}, saveSuccess);
		}
	}
}
function dataBound(e) {
	var data = $("#subGrid").data("kendoGrid").dataSource.data();
	var totalRequestCount=0;
	var totalRequestMoney=0;
	var totalCount = 0;
	var totalMoney=0;
	for (i = 0; i < data.length; i++) {
		var item = data[i];
		if (!item.paCount) {item.paCount = 0;}
		if (!item.pbLeftCount) {item.pbLeftCount = 0;}
		if (!item.pbTotalCount) {item.pbTotalCount = 0;}
		if (!item.eqcostBasePrice) {item.eqcostBasePrice = 0;}
		
		if(!item.oldPaCount){
			item.oldPaCount = item.paCount;
		}
		
		if(currentObj.paStatus == "已提交"){
			// 检测总的申请数量
			if(item.paCount > (item.pbLeftCount + item.oldPaCount)){
				item.paCount= (item.pbLeftCount + item.oldPaCount);
			}
		}else{
			// 检测总的申请数量
			if(item.paCount > item.pbLeftCount){
				item.paCount= item.pbLeftCount;
			}
		}
	
	}
}

function saveSuccess(){
	loadPage("purchaseback_purchaseAllotManage");
}
function editSuccess(e){
	if(!e) return;

	currentObj = new myModel(e);
	currentObj.set("pbPlanDate", kendo.toString(currentObj.pbPlanDate, 'd'));
	kendo.bind($("#form-container"), currentObj);	
}

function validateModel(){
	if(!currentObj.scId){
		return false;
	}
	var validator = $("#form-container").kendoValidator().data("kendoValidator");
	if(!validator.validate()){
		return false;
	}	
	var eqList = currentObj.eqcostList;
	var eqTotalCount = 0;
	for(var i=0;i<eqList.length;i++){
		if(eqList[i].paCount) eqTotalCount+=eqList[i].paCount;
	}
	if(eqTotalCount == 0){
		alert("请审核设备清单");
		return false;
	}
	return true;
}