
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
		archiveStatus : {},
		runningStatus : {},
		contractAmount : {},
		invoiceType : {},
		estimateEqCost0 : {},
		estimateEqCost1 : {},
		estimateSubCost : {},
		estimatePMCost : {},
		estimateDeepDesignCost:{},
		estimateDebugCost:{},
		estimateOtherCost:{},
		debugCostType:{},
		taxType:{},
		contractCode : {},
		contractPerson : {},
		contractType : {},
		contractDate : {},
		contractDownPayment : {},
		progressPayment : {},
		qualityMoney : {},
		contractMemo : {},
		eqcostList : {},
		scInvoiceInfo : {},
		scGotMoneyInfo : {},
		scMonthShipmentsInfo : {},
		scYearShipmentsInfo : {}
	}
});
var scm;

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
	var invoiceTypeItems = [{ text: "增值税专用", value: 1 }, { text: "增值税普通", value: 2 }, { text: "建筑业发票", value: 3 }, { text: "服务业发票", value: 4 }];
	$("#invoiceType").kendoDropDownList({
		dataTextField : "text",
		dataValueField : "value",
        optionLabel: "选择发票类型...",
		dataSource : invoiceTypeItems,
	});
	
	//税收类型
	var taxTypeItems = [{ text: "taxType1", value: "1" }, { text: "taxType2", value: "2" }, { text: "taxType3", value: "3" }];
	$("#taxType").kendoDropDownList({
		dataTextField : "text",
		dataValueField : "value",
        optionLabel: "选择税收类型...",
		dataSource : taxTypeItems,
	});
	
	//调试费用类型
	var debugCostTypeItems = [{ text: "debugCostType1", value: "1" }, { text: "debugCostType2", value: "2" }, { text: "debugCostType3", value: "3" }];
	$("#debugCostType").kendoDropDownList({
		dataTextField : "text",
		dataValueField : "value",
        optionLabel: "选择调试费用类型...",
		dataSource : debugCostTypeItems,
	});

	//合同类型
	//弱电工程、产品集成（灯控/布线，楼控，其他）、产品销售、维护及服务
	var contractTypeItems = [{ text: "弱电工程", value: 1 }, { text: "产品集成（灯控/布线，楼控，其他）", value: 2 }, { text: "产品销售", value: 3 }, { text: "维护及服务", value: 4 }];
	$("#contractType").kendoDropDownList({
		dataTextField : "text",
		dataValueField : "value",
        optionLabel: "选择合同类型...",
		dataSource : contractTypeItems,
	});
	
	//归档状态：已归档，未归档
	var archiveStatusItems = [{ text: "已归档", value: 1 }, { text: "未归档", value: 2 }];
	$("#archiveStatus").kendoDropDownList({
		dataTextField : "text",
		dataValueField : "value",
        optionLabel: "选择归档状态...",
		dataSource : archiveStatusItems,
	});
	
	//执行状态： 执行中、中止或暂停、收尾阶段、结束、质保期、作废
	var runningStatusItems = [{ text: "执行中", value: 1 }, { text: "中止或暂停", value: 2 }, { text: "收尾阶段", value: 3 }, { text: "结束", value: 4 }, { text: "质保期", value: 5 }, { text: "作废", value: 6 }];
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
		dataTextField : "projectName",
		dataValueField : "_id",
        optionLabel: "选择项目...",
		dataSource : projectItems,
	});
	
	//合同签订日期控件
	$("#contractDate").kendoDatePicker();
	
	$("#contractAmount").kendoNumericTextBox({
		min:0
	});
	$("#estimateEqCost0").kendoNumericTextBox({
		min:0
	});
	$("#estimateEqCost1").kendoNumericTextBox({
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
	$("#progressPayment").kendoNumericTextBox({
		min:0
	});
	$("#qualityMoney").kendoNumericTextBox({
		min:0
	});
	
	postAjaxRequest("/service/sc/get", redirectParams, edit);
	
});//end dom ready	

function edit(data){
	scm = new scModel(data);
	//成本设备清单_old
	if (!$("#scEqCostListOld").data("kendoGrid")){
		$("#scEqCostListOld").kendoGrid({
			dataSource : scm.eqcostList,
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
	}//成本设备清单_old

	if (!$("#invoiceList").data("kendoGrid")){
		$("#invoiceList").kendoGrid({
			dataSource : scm.scInvoiceInfo,
			columns : [ {
				field : "scInvoiceMoney",
				title : "开票金额"
			}, {
				field : "invoiceType",
				title : "开票类型"
			}, {
				field : "scInvoiceDate",
				title : "开票日期"
			}],
			scrollable : true
		});
	}
	
	if (!$("#gotMoneyList").data("kendoGrid")){
		$("#gotMoneyList").kendoGrid({
			dataSource : scm.scGotMoneyInfo,
			columns : [ {
				field : "scGotMoney",
				title : "收款金额"
			}, {
				field : "scGotMoneyDate",
				title : "收款日期"
			}],
			scrollable : true
		});
	}
	
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
	
	kendo.bind($("#editSalesContract"), scm);
}
