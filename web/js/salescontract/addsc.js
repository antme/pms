
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
		customerName : {
			validation : {
				required : true
			}
		},
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
		eqcostList : {}
	}

});

var scm;

var dataSource = new kendo.data.DataSource({
	transport : {
		read : {
			url : "../service/salescontract/list",
			dataType : "jsonp"
		},
		update : {
			url : "../service/salescontract/update",
			dataType : "jsonp",
			method : "post"
		},
		create : {
			url : "../service/salescontract/add",
			dataType : "jsonp",
			method : "post"
		},

		parameterMap : function(options, operation) {
			if (operation !== "read" && options.models) {
				return {
					models : kendo.stringify(options.models)
				};
			}
		}
	},
	pageSize: 10,
	batch : true,
	
	schema : {
		model : scModel
	}
});

//成本设备清单数据源
var eqCostListDataSource = new kendo.data.DataSource({
//	data:[],
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
            	eqcostMemo: { type: "string" }
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
	var invoiceTypeItems = [{ text: "invoiceType1", value: "1" }, { text: "invoiceType2", value: "2" }, { text: "invoiceType3", value: "3" }];
	$("#invoiceType").kendoDropDownList({
		dataTextField : "text",
		dataValueField : "value",
        optionLabel: "选择发票类型...",
		dataSource : invoiceTypeItems,
	});
	var taxTypeItems = [{ text: "taxType1", value: "1" }, { text: "taxType2", value: "2" }, { text: "taxType3", value: "3" }];
	$("#taxType").kendoDropDownList({
		dataTextField : "text",
		dataValueField : "value",
        optionLabel: "选择税收类型...",
		dataSource : taxTypeItems,
	});
	
	var debugCostTypeItems = [{ text: "debugCostType1", value: "1" }, { text: "debugCostType2", value: "2" }, { text: "debugCostType3", value: "3" }];
	$("#debugCostType").kendoDropDownList({
		dataTextField : "text",
		dataValueField : "value",
        optionLabel: "选择调试费用类型...",
		dataSource : debugCostTypeItems,
	});

	var contractTypeItems = [{ text: "contractType1", value: "1" }, { text: "contractType2", value: "2" }, { text: "contractType3", value: "3" }];
	$("#contractType").kendoDropDownList({
		dataTextField : "text",
		dataValueField : "value",
        optionLabel: "选择合同类型...",
		dataSource : contractTypeItems,
	});
	
	var projectIdItems = [{ text: "项目1", value: "51b1e09ff5429da33cdbfdff" }, { text: "项目2", value: "51b1e13af5429da33cdbfe01" }, { text: "项目3", value: "51b1e309f5429da33cdbfe03" }];
	$("#projectId").kendoDropDownList({
		dataTextField : "text",
		dataValueField : "value",
        optionLabel: "选择项目...",
		dataSource : projectIdItems,
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
	
	//成本设备清单
	if (!$("#scEqCostList").data("kendoGrid")){
		$("#scEqCostList").kendoGrid({
			dataSource : eqCostListDataSource,
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
				field : "eqcostMemo",
				title : "备注"
			} ],

			toolbar : [ {name:"create",text:"新增成本项"} ],
			editable : true,
			scrollable : true
		});
	}//成本设备清单
	
	//添加表单绑定一个空的 Model
	scm = new scModel();
	kendo.bind($("#addSalesContract"), scm);
	
});//end dom ready	
		
function saveSC(){
	console.log("saveProject *****************************");
	var _id = scm.get("_id");
	console.log(_id);
	console.log("save scm &&&&&&&&&&&&"+kendo.stringify(scm));
	var data = eqCostListDataSource.data();
	scm.set("eqcostList", data);
	console.log(dataSource);
	if (_id == null){
		dataSource.add(scm);
	}
	dataSource.sync();
	loadPage("scList");
};

	
	
	
	
	
	
	
	
	
	
	