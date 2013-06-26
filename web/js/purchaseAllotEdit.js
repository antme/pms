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
           }
       },
       pbSubmitDate:{}
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
			aggregate: [ 
			    { field: "eqcostNo", aggregate: "count" },
			    { field: "paCount", aggregate: "sum" },
			    { field: "pbTotalCount", aggregate: "sum" }
			]			
		},
	    columns: [
			{ field: "eqcostNo", title: "序号" ,footerTemplate: "总共: #=count#"},
			{ field: "eqcostMaterialCode", title: "物料代码" },
			{ field: "eqcostProductName", title: "产品名称" },
			{ field: "eqcostProductType", title: "规格型号" },
			{ field: "eqcostUnit", title: "单位" },
			{ field: "paCount", title: "调拨数量", attributes: { "style": "color:red"}, footerTemplate: "总共: #=sum#"},
			{ field: "pbTotalCount", title: "备货数量", footerTemplate: "总共: #=sum#"},
			{ field: "eqcostBasePrice", title: "预估单价" },
			{ field: "eqcostBrand", title: "品牌" },
			{ field: "eqcostMemo", title: "备注" }
	  	],	 
	  	editable:true,
	  	toolbar: [{text:"计算",name:"save"}]
	});
	
	$("#form-container-button button").click(function(){
		if(this.value == "cancel") {
			loadPage("purchaseAllot");
		} else if(confirm("提交表单，确认？")){
			postAjaxRequest("/service/purchase/allot/"+this.value, {models:kendo.stringify(currentObj)} , saveSuccess);
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
	//currentObj.set("pbPlanDate", kendo.toString(currentObj.pbPlanDate, 'd'));
	kendo.bind($("#form-container"), currentObj);	
}