
var scModel = kendo.data.Model.define({
	id : "_id",
	fields : {
		_id : {
			editable : false,
			nullable : true
		},
		projectId : {
			validation : {
				required : true
			}
		},
		customerId:{},
		archiveStatus : {},
		runningStatus : {},
		contractAmount : {},
		equipmentAmount : {},
		serviceAmount : {},
		invoiceType : {},
		estimateEqCostAddedTax : {},
		estimateEqCostTax : {},
		estimateSubCost : {},
		estimatePMCost : {},
		estimateDeepDesignCost:{},
		estimateDebugCost:{},
		estimateTax:{},
		totalEstimateCost:{},
		estimateOtherCost:{},
		//debugCostType:{},
		//taxType:{},
		contractCode : {},
		contractPerson : {},
		contractType : {},
		contractDate : {
			type:"date"
		},
		contractDownPayment : {},
		contractDownPaymentMemo:{},
		progressPayment : {},
		qualityMoney : {},
		qualityMoneyMemo:{},
		contractMemo : {},
		eqcostList : {},
		scInvoiceInfo : {},
		scGotMoneyInfo : {},
		scMonthShipmentsInfo : {},
		scYearShipmentsInfo : {},
		estimateGrossProfit : {},
		estimateGrossProfitRate : {},
		scModifyTimes:{}
	}
});
var scm;

var eqCostListDataSourceView = new kendo.data.DataSource({
	group: {
		field:"eqcostCategory",
		aggregates: [
                     { field: "eqcostCategory", aggregate: "count" },
                     { field: "eqcostRealAmount", aggregate: "sum" },
                     { field: "eqcostTotalAmount", aggregate: "sum" }
                  ]
	},
	
	aggregate: [ 
	             { field: "eqcostCategory", aggregate: "count" },
                 { field: "eqcostRealAmount", aggregate: "sum" },
                 { field: "eqcostTotalAmount", aggregate: "sum" }
               ],
	
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
        		eqcostCategory : {type: "string"},
        		eqcostLastBasePrice: { type: "number" },
        		eqcostTotalAmount : {type: "number"}
            }
        }
	}
});

$(document).ready(function() {
	//选项卡
	if (!$("#tabstrip").data("kendoTabStrip")){
		$("#tabstrip").kendoTabStrip({
	        animation:  {
	            open: {
	                effects: "fadeIn"
	            }
	        }
	    });
	};
	
	//表单中的各种控件
	//发票类型
	//var invoiceTypeItems = [{ text: "增值税专用", value: 1 }, { text: "增值税普通", value: 2 }, { text: "建筑业发票", value: 3 }, { text: "服务业发票", value: 4 }];
	$("#invoiceType").kendoDropDownList({
		dataTextField : "text",
		dataValueField : "value",
        optionLabel: "选择发票类型...",
		dataSource : invoiceTypeItems,
	});
	
	//税收类型
//	var taxTypeItems = [{ text: "taxType1", value: "1" }, { text: "taxType2", value: "2" }, { text: "taxType3", value: "3" }];
//	$("#taxType").kendoDropDownList({
//		dataTextField : "text",
//		dataValueField : "value",
//        optionLabel: "选择税收类型...",
//		dataSource : taxTypeItems,
//	});
	
	//调试费用类型
//	var debugCostTypeItems = [{ text: "debugCostType1", value: "1" }, { text: "debugCostType2", value: "2" }, { text: "debugCostType3", value: "3" }];
//	$("#debugCostType").kendoDropDownList({
//		dataTextField : "text",
//		dataValueField : "value",
//        optionLabel: "选择调试费用类型...",
//		dataSource : debugCostTypeItems,
//	});

	var customerItems = new kendo.data.DataSource({
		transport : {
			read : {
				url : "/service/customer/list",
				dataType : "jsonp"
			}
		},
		schema: {
		    data: "data"
		}
	});
	$("#customerId").kendoDropDownList({
		dataTextField : "name",
		dataValueField : "_id",
        optionLabel: "选择客户...",
		dataSource : customerItems,
	});
	//合同类型
	//弱电工程、产品集成（灯控/布线，楼控，其他）、产品销售、维护及服务
	$("#contractType").kendoDropDownList({
		dataTextField : "text",
		dataValueField : "value",
        optionLabel: "选择合同类型...",
		dataSource : contractTypeItems,
	});
	
	//归档状态：已归档，未归档
	//var archiveStatusItems = [{ text: "已归档", value: 1 }, { text: "未归档", value: 2 }];
	$("#archiveStatus").kendoDropDownList({
		dataTextField : "text",
		dataValueField : "value",
        optionLabel: "选择归档状态...",
		dataSource : archiveStatusItems,
	});
	
	//执行状态： 执行中、中止或暂停、收尾阶段、结束、质保期、作废
	//var runningStatusItems = [{ text: "执行中", value: 1 }, { text: "中止或暂停", value: 2 }, { text: "收尾阶段", value: 3 }, { text: "结束", value: 4 }, { text: "质保期", value: 5 }, { text: "作废", value: 6 }];
	$("#runningStatus").kendoDropDownList({
		dataTextField : "text",
		dataValueField : "value",
        optionLabel: "选择执行状态...",
		dataSource : runningStatusItems,
	});
	
	var projectItems = new kendo.data.DataSource({
		transport : {
			read : {
				url : "../service/project/listforselect",
				dataType : "jsonp"
			}
		},
		schema: {
		    data: "data"
		}
	});
	$("#projectId").kendoDropDownList({
		dataTextField : "projectCode",
		dataValueField : "_id",
        optionLabel: "选择项目...",
		dataSource : projectItems,
	});
	
	//合同签订日期控件
	$("#contractDate").kendoDatePicker();
	
	$("#serviceAmount").kendoNumericTextBox({
		min:0
	});
	
	$("#contractAmount").kendoNumericTextBox({
		min:0
	});
	$("#equipmentAmount").kendoNumericTextBox({
		min:0
	});
	
	$("#estimateEqCostAddedTax").kendoNumericTextBox({
		min:0
	});
	$("#estimateEqCostTax").kendoNumericTextBox({
		min:0
	});
	$("#estimateSubCost").kendoNumericTextBox({
		min:0
	});
	$("#estimatePMCost").kendoNumericTextBox({
		min:0
	});
	$("#estimateDeepDesignCost").kendoNumericTextBox({
		min:0
	});
	$("#estimateDebugCost").kendoNumericTextBox({
		min:0
	});
	$("#estimateOtherCost").kendoNumericTextBox({
		min:0
	});
	$("#contractDownPayment").kendoNumericTextBox({
		min:0
	});
	/*$("#progressPayment").kendoNumericTextBox({
		min:0
	});*/
	$("#qualityMoney").kendoNumericTextBox({
		min:0
	});
	$("#estimateTax").kendoNumericTextBox({
		min:0
	});

	// 财务数据
	var data = [
        { text: "按月统计", value: "1" },
        { text: "按年统计", value: "2" }
    ];

    $("#date").kendoDropDownList({
        dataTextField: "text",
        dataValueField: "value",
        dataSource: data,
        index: 0,
        change: function(e) {
            var value = $("#date").val();
            var chart = $('#container').highcharts();
            if (value == 1) {
            	chart.xAxis[0].setCategories(scm.scGotMoneyInfo.monthDateList);
        		chart.series[0].update({
        			name: '月度金额',
        			data: scm.scGotMoneyInfo.monthMoneyList
                });
    		} else {
    			chart.xAxis[0].setCategories(scm.scGotMoneyInfo.yearDateList);
        		chart.series[0].update({
        			name: '年度金额',
        			data: scm.scGotMoneyInfo.yearMoneyList
                });
    		}
        }
    });
    
    // 图表
    $('#container').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: '收款信息'
        },
        yAxis: {
            title: {
                text: '金额'
            }
        },
        xAxis: {},
        series: [{}]
    });
    
	if(popupParams){
		postAjaxRequest("/service/sc/get", popupParams, edit);
		disableAllInPoppup();
	}else if (redirectParams) {//Edit
		postAjaxRequest("/service/sc/get", redirectParams, edit);
	}
	
	
});//end dom ready	

function edit(data){
	scm = new scModel(data);
	//进度款
	/*if (!$("#progressPayment").data("kendoGrid")){
		$("#progressPayment").kendoGrid({
			dataSource : scm.progressPayment,
			columns : [ {
				field : "progressPaymentNo",
				title : "序号",
				width : "50px"
			}, 
			{
				field : "progressPaymentAmount",
				title : "进度款额"
			}, {
				field : "progressPaymentMemo",
				title : "备注"//, width: 110
			} ],

			toolbar : [ {name:"create",text:"新增"} ],
			editable : true,
			scrollable : true
		});
	}//进度款
*/	eqCostListDataSourceView.data(scm.eqcostList);
	//成本设备清单_old
	if (!$("#scEqCostListOld").data("kendoGrid")){
		$("#scEqCostListOld").kendoGrid({
			dataSource : eqCostListDataSourceView,
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
				title : "规格型号",
				groupFooterTemplate: "合计：", 
				footerTemplate: "总计："

			}, {
				field : "eqcostRealAmount",
				title : "数量",
				groupFooterTemplate: "#= sum.toFixed(2)#", 
				footerTemplate: "#=sum.toFixed(2)#"
			}, {
				field : "eqcostUnit",
				title : "单位"
			}, 
			{
				field : "eqcostBrand",
				title : "品牌"
			}, 
			{
				field : "eqcostBasePrice",
				title : "标准成本价"
			}, {
				field : "eqcostSalesBasePrice",
				title : "销售单价"
			}, {
				field : "eqcostDiscountRate",
				title : "折扣率"
			}, {
				field : "eqcostLastBasePrice",
				title : "最终成本价",
				groupFooterTemplate: "合计：", 
				footerTemplate: "总计："
			}, {
				field : "eqcostTotalAmount",
				title : "小计",
//				format: "{0:c}",
				groupFooterTemplate: "#= sum.toFixed(2)#", 
				footerTemplate: "#=sum.toFixed(2)#"
			}, {
				field : "eqcostTaxType",
				title : "税收类型"
			}, {
				field : "eqcostMemo",
				title : "备注"
			}, {
				field : "eqcostCategory",
				title : "类别",
				groupHeaderTemplate: "#= value # (物料数: #= count#)", 
				footerTemplate: "总数: #=count#"
			} ],
			scrollable : true,
			resizable: true,
			sortable : true
		});
	}//成本设备清单_old

//	if (!$("#invoiceList").data("kendoGrid")){
//		$("#invoiceList").kendoGrid({
//			dataSource : scm.scInvoiceInfo,
//			columns : [ {
//				field : "scInvoiceMoney",
//				title : "开票金额"
//			}, {
//				field : "invoiceType",
//				title : "开票类型"
//			}, {
//				field : "scInvoiceDate",
//				title : "开票日期"
//			}],
//			scrollable : true
//		});
//	}
//	
//	if (!$("#gotMoneyList").data("kendoGrid")){
//		$("#gotMoneyList").kendoGrid({
//			dataSource : scm.scGotMoneyInfo,
//			columns : [ {
//				field : "scGotMoney",
//				title : "收款金额"
//			}, {
//				field : "scGotMoneyDate",
//				title : "收款日期"
//			}],
//			scrollable : true
//		});
//	}
	
	if (!$("#monthShipmentsGrid").data("kendoGrid")){
		$("#monthShipmentsGrid").kendoGrid({
			dataSource : scm.scMonthShipmentsInfo,
			columns : [ {
					field : "month",
					title : "发货月份"
				},{
					field : "scShipmentsMoney",
					title : "发货金额金额"
				}],
			scrollable : true
		});
	}
	
	if (!$("#yearShipmentsGrid").data("kendoGrid")){
		$("#yearShipmentsGrid").kendoGrid({
			dataSource : scm.scYearShipmentsInfo,
			columns : [ {
					field : "year",
					title : "发货年份"
				},{
					field : "scShipmentsMoney",
					title : "发货金额金额"
				}],
			scrollable : true
		});
	}
	
	var chart = $('#container').highcharts();
	
	chart.xAxis[0].setCategories(scm.scGotMoneyInfo.monthDateList);
	chart.series[0].update({
		name: '月度金额',
		data: scm.scGotMoneyInfo.monthMoneyList
    });
	
	scm.set("contractDate", kendo.toString(scm.contractDate, 'd'));
	kendo.bind($("#editSalesContract"), scm);
	
	//Render the title show info
//	var showSCAmount = scm.get("contractAmount");
//	var showSCLastAmount = scm.get("scLastTotalAmount");
//	$("#titleShowContractAmount").html(showSCAmount);
//	$("#titleShowLastContractAmount").html(showSCLastAmount);
	
	if (!$("#titleCompare").data("kendoGrid")){
		$("#titleCompare").kendoGrid({
			dataSource : [
			              { name: "第一次", contractAmount: scm.firstContractAmount, equipmentAmount: scm.firstEquipmentAmount, serviceAmount: scm.firstServiceAmount, estimateGrossProfit: scm.firstEstimateGrossProfit },
			              { name: "最后一次", contractAmount: scm.contractAmount, equipmentAmount: scm.equipmentAmount, serviceAmount: scm.serviceAmount, estimateGrossProfit: scm.estimateGrossProfit }
			          ],
			columns : [ {
				field : "name",
				title : "数据源"
			}, {
				field : "contractAmount",
				title : "合同金额"
			}, {
				field : "equipmentAmount",
				title : "设备金额"
			}, {
				field : "serviceAmount",
				title : "服务金额"
			}, {
				field : "estimateGrossProfit",
				title : "预计毛利"
			}],
			scrollable : true
		});
	}
	
	if (!$("#titleShowSCModifyHistory").data("kendoGrid")){
		$("#titleShowSCModifyHistory").kendoGrid({
			dataSource : scm.scModifyHistory,
			columns : [ {
				field : "addNewEqCostMoney",
				title : "变更额"
			}, {
				field : "addNewEqCostTime",
				title : "变更时间"
			}, {
				field : "addNewEqCostPerson",
				title : "变更操作人"
			}, {
				field : "addNewEqCostReason",
				title : "变更原因"
			}, {
				field : "addNewEqCostMemo",
				title : "变更备注"
			}],
			scrollable : true
		});
	}
	
}

function openTraceWindow(){
	var options = { width:"680px", height: "400px", title:"合同金额变更历史"};
	openRemotePageWindow(options, "salescontract_traceSCAmount", {_id : scm._id});
}
