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
	if (!$("#scEqCostListHistory").data("kendoGrid")){
		$("#scEqCostListHistory").kendoGrid({
			dataSource : data.allEqList,
			columns : [ {
				field : "versionNo",
				title : "版本号"
			},{
				field : "eqcostNo",
				title : "序号"
			}, {
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
			}, {
				field : "eqcostBrand",
				title : "品牌"
			}, {
				field : "eqcostBasePrice",
				title : "成本价"
			}, {
				field : "eqcostDiscountRate",
				title : "折扣率"
			}, {
				field : "eqcostMemo",
				title : "备注"
			} ],
			scrollable : true
		});
	}//成本设备清单历史
	
	if (!$("#scEqCostListLatest").data("kendoGrid")){
		$("#scEqCostListLatest").kendoGrid({
			dataSource : data.allEqList,
			columns : [ {
				field : "eqcostNo",
				title : "序号"
			}, {
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
			}, {
				field : "eqcostBrand",
				title : "品牌"
			}, {
				field : "eqcostBasePrice",
				title : "成本价"
			}, {
				field : "eqcostDiscountRate",
				title : "折扣率"
			}, {
				field : "eqcostMemo",
				title : "备注"
			} ],
			scrollable : true
		});
	}//最新成本设备清单
}