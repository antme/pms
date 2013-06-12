$(document).ready(function () {
	var currentObj;
	var baseUrl = "../../service/purchase/back";
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
            eqcostAmount: {
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
            backTotalCount: {
            	editable : false
            },
            backUsedCount: {
            	type: "number",
           	 	validation: {
                    min: 0
                },
           }
		}
	});	
	var myModel = kendo.data.Model.define({
		id : "_id",
		fields : {
			department: {},
			submitDate: {},
			approveDate: {},
			planDate: {},
			type: {},
			status: {},
			specialRequire: {},
			comment: {},
			money: {},
			project_name: {},
			project_code: {},
			project_managerName: {},
			customer_name: {},
			customer_code: {},
			salesContract_id:{},
			salesContract_code: {},
			salesContract_money: {},
			purchaseOrder_code: {},
			purchaseContract_code: {}
		}
	});
	
	$("#subGrid").kendoGrid({
		dataSource: {
			schema: {
				model: subModel
			},
			aggregate: [ 
			    { field: "eqcostNo", aggregate: "count" },
			    { field: "backUsedCount", aggregate: "sum" },
			    { field: "backTotalCount", aggregate: "sum" },
			]			
		},
	    columns: [
			{ field: "eqcostNo", title: "序号" ,footerTemplate: "总共: #=count#"},
			{ field: "eqcostMaterialCode", title: "物料代码" },
			{ field: "eqcostProductName", title: "产品名称" },
			{ field: "eqcostProductType", title: "规格型号" },
			{ field: "eqcostUnit", title: "单位" },
			{ field: "backUsedCount", title: "调拨数量", attributes: { "style": "color:red"}, footerTemplate: "总共: #=sum#"},
			{ field: "backTotalCount", title: "本次申请数量", footerTemplate: "总共: #=sum#"},
			{ field: "eqcostBasePrice", title: "预估单价￥" },
			{ field: "eqcostBrand", title: "品牌" },
			{ field: "eqcostMemo", title: "备注" }
	  	],	 
	  	editable:true,
	  	toolbar: [{text:"保存",name:"save"}]
	});

	$(".submitform").click(function(){
		if(confirm(this.value + "表单，确认？")){
			postAjaxRequest( baseUrl+"/approveallot", {models:kendo.stringify(currentObj)} , saveSuccess);
		}
	});
	
	function edit(e){
		currentObj = new myModel(e);
		kendo.bind($("#form-container"), currentObj);
	}
	
	function saveSuccess(){
		location.reload();
	}
	$(".foredit").attr("disabled","disabled");
	if(redirectParams){
		var backId = redirectParams._id;
		if(backId) {
			postAjaxRequest(baseUrl+"/load", {_id:backId}, edit);
		}	
	}
	
	
});


