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
        	editable : false,
        	type: "number",
       	 	validation: {
                min: 0
            }
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
			{ field: "pbTotalCount", title: "备货数量",footerTemplate: "总共: #=sum#"},
			{ field: "eqcostBasePrice", title: "预估单价" },
			{ field: "eqcostBrand", title: "品牌" },
			{ field: "eqcostMemo", title: "备注" }
	  	],	 
	  	editable:true,
	  	toolbar: [{text:"保存",name:"save"}]
	});

	$(".submitform").click(function(){
		if(confirm(this.value + "表单，确认？")){
			if(this.value == "批准"){
				postAjaxRequest( baseUrl+"/purchase/allot/approve", {models:kendo.stringify(currentObj)} , saveSuccess);
			} else if(this.value == "拒绝"){
				postAjaxRequest( baseUrl+"/purchase/allot/reject", {models:kendo.stringify(currentObj)} , saveSuccess);
			}else if(this.value=="取消"){
				loadPage("purchaseAllotManage");
			}
		}
	});
	$(".foredit ").attr("disabled","disabled");
	if(popupParams){
		postAjaxRequest(baseUrl+"/purchase/allot/load", popupParams, edit);
		disableAllInPoppup();
	}else if(redirectParams){
		if(redirectParams._id) {
			postAjaxRequest(baseUrl+"/purchase/allot/load", {_id:redirectParams._id}, edit);
		}	
	}
	
});

function saveSuccess(){
	loadPage("purchaseAllotManage");
}
function edit(e){
	if(e.paStatus !="已提交"){
		$(".foreditbt").hide();
	}
	currentObj = new myModel(e);
	kendo.bind($("#form-container"), currentObj);
}