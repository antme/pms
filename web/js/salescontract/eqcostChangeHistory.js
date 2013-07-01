var eqCostListDataSourceHistory = new kendo.data.DataSource({
	group: {
		field: "versionNo",
		aggregates: [
                     { field: "versionNo", aggregate: "count" }
                  ]
	},
	
	aggregate: [ { field: "versionNo", aggregate: "count" }],
	
	schema : {
		model : {
            fields: {
            	eqcostNo: { type: "string" },
            	eqcostMaterialCode: { type: "string" },
            	eqcostProductName: { type: "string" },
            	eqcostProductType: { type: "string" },
            	eqcostAmount: { type: "number" },
            	eqcostUnit: { type: "string" },
            	eqcostBrand: { type: "string" },
            	eqcostBasePrice: { type: "number" },
            	eqcostSalesBasePrice: { type: "number" },
            	eqcostDiscountRate : {type: "number"},
            	eqcostMemo: { type: "string" },
        		eqcostTaxType : {type: "string"},
        		eqcostCategory : {type: "string"}
            }
        }
	}
});

var eqCostListDataSourceLatest = new kendo.data.DataSource({
	group: {
		field: "eqcostCategory",
		aggregates: [
                     { field: "eqcostCategory", aggregate: "count" }
                  ]
	},
	
	aggregate: [ { field: "eqcostCategory", aggregate: "count" }],
	
	schema : {
		model : {
            fields: {
            	eqcostNo: { type: "string" },
            	eqcostMaterialCode: { type: "string" },
            	eqcostProductName: { type: "string" },
            	eqcostProductType: { type: "string" },
            	eqcostAmount: { type: "number" },
            	eqcostUnit: { type: "string" },
            	eqcostBrand: { type: "string" },
            	eqcostBasePrice: { type: "number" },
            	eqcostSalesBasePrice: { type: "number" },
            	eqcostDiscountRate : {type: "number"},
            	eqcostMemo: { type: "string" },
        		eqcostTaxType : {type: "string"},
        		eqcostCategory : {type: "string"}
            }
        }
	}
});

$(document).ready(function() {
	//选项卡
	if (!$("#eqHistoryTabstrip").data("kendoTabStrip")){
		$("#eqHistoryTabstrip").kendoTabStrip({
	        animation:  {
	            open: {
	                effects: "fadeIn"
	            }
	        }
	    });
	};
	
	if(popupParams){
		postAjaxRequest("/service/sc/eqhistory", popupParams, edit);
	}
});

function edit(data){
	eqCostListDataSourceHistory.data(data.allEqList);
	if (!$("#scEqCostListHistory").data("kendoGrid")){
		$("#scEqCostListHistory").kendoGrid({
			dataSource : eqCostListDataSourceHistory,
			columns : [ {
				field:"versionNo",
				title:"版本号",
				groupHeaderTemplate: "版本号：#= value # (数量: #= count#)", footerTemplate: "总数: #=count#"
			},
			{
			field : "eqcostNo",
			title : "序号"
			}, 
			{
				field : "eqcostMaterialCode",
				title : "物料代码"
			}, {
				field : "eqcostProductName",
				title : "产品名称"
			}, {
				field : "eqcostProductType",
				title : "规格型号"
			
			}, {
				field : "eqcostAmount",
				title : "数量"
			}, {
				field : "eqcostUnit",
				title : "单位"
			}, 
			//{
			//field : "eqcostBrand",
			//title : "品牌"
			//}, 
			{
				field : "eqcostBasePrice",
				title : "成本价"
			}, {
				field : "eqcostSalesBasePrice",
				title : "销售单价"
			}, {
				field : "eqcostDiscountRate",
				title : "折扣率"
			}, {
				field : "eqcostTaxType",
				title : "税收类型"
			}, {
				field : "eqcostCategory",
				title : "类别"
			}, {
				field : "eqcostMemo",
				title : "备注"
			} ],
			scrollable : true
		});
	}//成本设备清单历史
	
	eqCostListDataSourceLatest.data(data.latestEqList);
	if (!$("#scEqCostListLatest").data("kendoGrid")){
		$("#scEqCostListLatest").kendoGrid({
			dataSource : eqCostListDataSourceLatest,
			columns : [ 
				{
				field : "eqcostNo",
				title : "序号"
				}, 
				{
				field : "eqcostMaterialCode",
				title : "物料代码"
				}, {
				field : "eqcostProductName",
				title : "产品名称"
				}, {
				field : "eqcostProductType",
				title : "规格型号"
				
				}, {
				field : "eqcostAmount",
				title : "数量"
				}, {
				field : "eqcostUnit",
				title : "单位"
				}, 
				//{
				//field : "eqcostBrand",
				//title : "品牌"
				//}, 
				{
				field : "eqcostBasePrice",
				title : "成本价"
				}, {
				field : "eqcostSalesBasePrice",
				title : "销售单价"
				}, {
				field : "eqcostDiscountRate",
				title : "折扣率"
				}, {
				field : "eqcostTaxType",
				title : "税收类型"
				}, {
				field : "eqcostCategory",
				title : "类别",
				groupHeaderTemplate: "#= value # (数量: #= count#)", footerTemplate: "总数: #=count#"//, groupFooterTemplate: "数量: #=count#"
				}, {
				field : "eqcostMemo",
				title : "备注"
				} ],
			scrollable : true
		});
	}//最新成本设备清单
}