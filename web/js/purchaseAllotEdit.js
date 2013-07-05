intSelectInput();
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
       }
	}
});
var myModel = kendo.data.Model.define({
	id : "_id",
	fields : {
		pbCode:{},
		pbDepartment:{},
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
		paShelfCode:{}
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
			{ field: "eqcostNo", title: "序号"},
			{ field: "eqcostMaterialCode", title: "物料代码" },
			{ field: "eqcostProductName", title: "产品名称" },
			{ field: "eqcostProductType", title: "规格型号" },
			{ field: "eqcostUnit", title: "单位" },
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
			loadPage("purchaseAllot");
		} else if(validateModel()){
			if(confirm("提交表单，确认？")){
				postAjaxRequest("/service/purchase/allot/"+this.value, {models:kendo.stringify(currentObj)} , saveSuccess);
			}
		}
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
		// 检测总的申请数量
		if(item.paCount > item.pbLeftCount){
			alert("最大数量为" + item.pbLeftCount);
			item.paCount=item.pbLeftCount;
		}
	}
}

function saveSuccess(){
	loadPage("purchaseAllotManage");
}
function editSuccess(e){
	if(!e) return;
	if(e._id) {
		$("#form-container :input").attr("disabled","disabled");
		$("#form-container-button button").attr("disabled","disabled");
	}
	currentObj = new myModel(e);
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
	console.log(eqTotalCount);
	if(eqTotalCount == 0){
		alert("请审核设备清单");
		return false;
	}
	return true;
}