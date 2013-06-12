$(document).ready(function () {
	var currentObj;
	var baseUrl = "../../service/purchase";
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
            	type: "number",
            	 validation: { // validation rules
                     //required: true, // the field is required
                     min: 0 // the minimum value is 1
                 }
            },
            allotCount:{
            	type: "number",
           	 	validation: { // validation rules
                    //required: true, // the field is required
                    min: 0 // the minimum value is 1
                }
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
			projectName: {},
			projectCode: {},
			projectManager: {},
			customer: {},
			salesContract_id:{},
			scontractCode: {},
			contractAmount: {},
			purchaseOrderCode: {},
			purchaseContractCode: {}
		}
	});
	
	$("#subGrid").kendoGrid({
		dataSource: {
			schema: {
				model: subModel
			},
			aggregate: [ 
			    { field: "eqcostNo", aggregate: "count" },
			    { field: "allotCount", aggregate: "sum" },
			    { field: "backTotalCount", aggregate: "sum" },
			    { field: "eqcostAmount", aggregate: "sum" }
			]			
		},
	    columns: [
			{ field: "eqcostNo", title: "序号" ,footerTemplate: "总共: #=count#"},
			{ field: "eqcostMaterialCode", title: "物料代码" },
			{ field: "eqcostProductName", title: "产品名称" },
			{ field: "eqcostProductType", title: "规格型号" },
			{ field: "eqcostUnit", title: "单位" },
			{ field: "allotCount", title: "调拨数量", attributes: { "style": "color:red"}, footerTemplate: "总共: #=sum#"},
			{ field: "backTotalCount", title: "备货数量",footerTemplate: "总共: #=sum#"},
			{ field: "eqcostBasePrice", title: "预估单价￥" },
			{ field: "eqcostBrand", title: "品牌" },
			{ field: "eqcostMemo", title: "备注" }
	  	],	 
	  	editable:true,
	  	toolbar: [{text:"保存",name:"save"}]
	});

	$(".submitform").click(function(){
		if(confirm(this.value + "表单，确认？")){
			if(this.value == "批准"){
				postAjaxRequest( baseUrl+"/allot/approve", {models:kendo.stringify(currentObj)} , saveSuccess);
			} else if(this.value == "拒绝"){
				postAjaxRequest( baseUrl+"/allot/reject", {models:kendo.stringify(currentObj)} , saveSuccess);
			}else if(this.value=="取消"){
				location.reload();
			}
		}
	});
	$(".foredit ").attr("disabled","disabled");
	function edit(e){
		currentObj = new myModel(e);
		kendo.bind($("#form-container"), currentObj);
	}
	
	function saveSuccess(){
		location.reload();
	}
	
	
	if(redirectParams){
		if(redirectParams._id) {
			postAjaxRequest(baseUrl+"/allot/load", {_id:redirectParams._id}, edit);
		}	
	}

	
	
});


