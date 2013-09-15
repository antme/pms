var commerceInfoHistoryDS = new kendo.data.DataSource({
	group: {
		field: "time",
		aggregates: [
		             	{ field: "key", aggregate: "count" }
	    ]
	}, 
	
	schema : {
		model : {
            fields: {
            	key: { type: "string" },
            	oldValue: { type: "number" },
            	newValue: { type: "number" },
            	operator : {type: "string"},
            	time : {type: "string"}
            }
        }
	}
});



$(document).ready(function() {
	if(popupParams){
		postAjaxRequest("/service/sc/commercehistory", popupParams, edit);
	}
});

function edit(data){
	commerceInfoHistoryDS.data(data.data);
	if (!$("#historyGrid").data("kendoGrid")){
		$("#historyGrid").kendoGrid({
			dataSource : commerceInfoHistoryDS,
			columns : [ {
				field:"key",
				title:"信息名称",
				values: [
				         	{ text: "合同金额", value: "contractAmount" },
				         	{ text: "服务金额", value: "serviceAmount" },
				         	{ text: "设备金额", value: "equipmentAmount" },
				         	{ text: "预估设备成本（增值税）", value: "estimateEqCost0" },
				         	{ text: "预估设备成本（非增值税）", value: "estimateEqCost1" },
				         	{ text: "预估分包成本", value: "estimateSubCost" },
				         	{ text: "预估项目管理成本", value: "estimatePMCost" },
				         	{ text: "预估深化设计成本", value: "estimateDeepDesignCost" },
				         	{ text: "预估调试费用", value: "estimateDebugCost" },
				         	{ text: "预估其他成本", value: "estimateOtherCost" },
				         	{ text: "发票类型", value: "invoiceType" },
				         ],
				groupHeaderTemplate: function(dataItem){
					var keyValue = dataItem.value;		
					var keyShow = genChineseName(keyValue);
					return keyShow;
				}
//				groupHeaderTemplate: "信息名称：#= value # (修改次数: #= count#)"
			},
			{
				field : "oldValue",
				title : "修改前"
			}, 
			{
				field : "newValue",
				title : "修改后"
			}, {
				field : "operator",
				title : "修改人"
			}, {
				field : "time",
				title : "修改时间"
			
			} ],
			scrollable : true,
			sortable : true
		});
	}
	
	
function genChineseName(data){
	if (data == "contractAmount"){
		return "合同金额";
	} else if (data == "serviceAmount"){
		return "服务金额";
	} else if (data == "equipmentAmount"){
		return "设备金额";
	} else if (data == "estimateEqCost0"){
		return "预估设备成本（增值税）";
	} else if (data == "estimateEqCost1"){
		return "预估设备成本（非增值税）";
	} else if (data == "estimateSubCost"){
		return "预估分包成本";
	} else if (data == "estimatePMCost"){
		return "预估项目管理成本";
	} else if (data == "estimateDeepDesignCost"){
		return "预估深化设计成本";
	} else if (data == "estimateDebugCost"){
		return "预估调试费用";
	} else if (data == "estimateOtherCost"){
		return "预估其他成本";
	} else if (data == "invoiceType"){
		return "发票类型";
	}else{
		return data;
	}
}
}