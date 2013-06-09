
$(document).ready(function () {
	var baseUrl = "../../service/purchase/request";
	
	var myModel = kendo.data.Model.define({
		id : "_id",
		fields : {
		    project_name: {},
		    project_managerName: {},
		    customer_name: {},
		    project_code: {},
		    salesContract_code: {},
		    salesContract_money: {},
		    eqcostList: [
		        {
		            eqcostNo: {},
		            eqcostMaterialCode: {},
		            eqcostProductName: {},
		            eqcostProductType: {},
		            eqcostAmount: {},
		            eqcostUnit: {},
		            eqcostBrand: {},
		            eqcostBasePrice: {},
		            eqcostMemo: {},
		            eqcost_hasApplyAmount: {},
		            eqcost_leftAmount: {}
		        },
		        {
		            eqcostNo: {},
		            eqcostMaterialCode: {},
		            eqcostProductName: {},
		            eqcostProductType: {},
		            eqcostAmount: {},
		            eqcostUnit: {},
		            eqcostBrand: {},
		            eqcostBasePrice: {},
		            eqcostMemo: {},
		            eqcost_hasApplyAmount: {},
		            eqcost_leftAmount: {}
		        }
		    ]
		}
	});
	
	$("#subGrid").kendoGrid({
		dataSource: {
			schema: {
				model: { 
					id : "eqcostNo",
					fields : {
						eqcostNo : {
							editable : false,
							nullable : true	
						},
						eqcostApplyAmount : {
							type: "number"
						}
					}					
				}
			}
		},
	    columns: [
			{ field: "eqcostNo", title: "序号" },
			{ field: "eqcostMaterialCode", title: "物料代码" },
			{ field: "eqcostProductName", title: "产品名称" },
			{ field: "eqcostProductType", title: "规格型号" },
			{ field: "eqcostUnit", title: "单位" },
			{ field: "eqcostApplyAmount", title: "本次申请数量" },
			{ field: "eqcostLeftAmount", title: "可申请数量" },
			{ field: "eqcostAmount", title: "总数" },
			{ field: "eqcostBasePrice", title: "预估单价" },
			{ field: "eqcostBrand", title: "品牌" },
			{ field: "eqcostMemo", title: "备注" },
  	        { command: [{name: "edit", text: "编辑"},{name: "destroy", text: "删除"}] }
	  	],	    
	    editable: {
	        mode: "popup",
	        template: kendo.template($("#popup-editor").html())
	    }
	});
	

	postAjaxRequest(baseUrl+"/prepare", redirectParams, edit);
	
	function edit(e){
		var mydata = new myModel(e);
		kendo.bind($("#form-container"), mydata);
	}
});


