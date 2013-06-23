intSelectInput();
$(document).ready(function () {
	var currentObj;
	var baseUrl = "../../service/purchase/allot";
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
			pbPlanDate:{},
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
	
	$("#subGrid").kendoGrid({
		dataSource: {
			schema: {
				model: subModel
			},
			aggregate: [ 
			    { field: "eqcostNo", aggregate: "count" },
			    { field: "paCount", aggregate: "sum" },
			    { field: "pbLeftCount", aggregate: "sum" },
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
			{ field: "pbLeftCount", title: "备货剩余数量", footerTemplate: "总共: #=sum#"},
			{ field: "pbTotalCount", title: "备货数量", footerTemplate: "总共: #=sum#"},
			{ field: "eqcostBasePrice", title: "预估单价" },
			{ field: "eqcostBrand", title: "品牌" },
			{ field: "eqcostMemo", title: "备注" }
	  	],	 
	  	editable:true,
	  	toolbar: [{text:"保存",name:"save"}]
	});

	$(".submitform").click(function(){
		if(confirm(this.value + "表单，确认？")){
			postAjaxRequest( baseUrl+"/submit", {models:kendo.stringify(currentObj)} , saveSuccess);
		}
	});
	function edit(e){
		currentObj = new myModel(e);
		kendo.bind($("#form-container"), currentObj);
	}
	
	function saveSuccess(){
		location.reload();
	}
	
	if(redirectParams){
		var backId = redirectParams.backId;
		var id = redirectParams._id;
		if(backId) {
			postAjaxRequest(baseUrl+"/prepare", {_id:backId}, edit);
		}else if(id) {
			postAjaxRequest(baseUrl+"/load", {_id:backId}, edit);
			$(".foredit").attr("disabled","disabled");
		}
	}
	
	
});


