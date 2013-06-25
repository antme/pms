
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
		//debugCostType:{},
		//taxType:{},
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
			url : "../service/sc/list",
			dataType : "jsonp"
		},
		update : {
			url : "../service/sc/update",
			dataType : "jsonp",
			method : "post"
		},
		create : {
			url : "../service/sc/add",
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
            	eqcostDiscountRate : {type: "number"},
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
	
	$("#invoiceType").kendoDropDownList({
		dataTextField : "text",
		dataValueField : "value",
        optionLabel: "选择发票类型...",
		dataSource : invoiceTypeItems,
	});
	
//	var taxTypeItems = [{ text: "taxType1", value: "1" }, { text: "taxType2", value: "2" }, { text: "taxType3", value: "3" }];
//	$("#taxType").kendoDropDownList({
//		dataTextField : "text",
//		dataValueField : "value",
//        optionLabel: "选择税收类型...",
//		dataSource : taxTypeItems,
//	});
	
//	var debugCostTypeItems = [{ text: "debugCostType1", value: "1" }, { text: "debugCostType2", value: "2" }, { text: "debugCostType3", value: "3" }];
//	$("#debugCostType").kendoDropDownList({
//		dataTextField : "text",
//		dataValueField : "value",
//        optionLabel: "选择调试费用类型...",
//		dataSource : debugCostTypeItems,
//	});

	//弱电工程、产品集成（灯控/布线，楼控，其他）、产品销售、维护及服务
	$("#contractType").kendoDropDownList({
		dataTextField : "text",
		dataValueField : "value",
        optionLabel: "选择合同类型...",
		dataSource : contractTypeItems,
	});
	
	//已归档，未归档
	
	$("#archiveStatus").kendoDropDownList({
		dataTextField : "text",
		dataValueField : "value",
        optionLabel: "选择归档状态...",
		dataSource : archiveStatusItems,
	});
	
	//执行中、收尾阶段、质保期、结束、中止或暂停、作废
	
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
	var ddd = $("#contractDate").kendoDatePicker({
		format: "yyyy/MM/dd",
		parseFormats: ["yyyy/MM/dd"]
	});
	//ddd.value("2013/06/06");
	
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
				field : "eqcostDiscountRate",
				title : "折扣率"
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
	var validator = $("#addSalesContract").kendoValidator().data("kendoValidator");
	var validatestatus = $("#validate-status");
	if(!validator.validate()) {
		validatestatus.text("表单验证不通过！")
        .removeClass("valid")
        .addClass("invalid");
		alert("表单验证不通过！");
		return;
    } else {
		var _id = scm.get("_id");
		var contractDate = $("#contractDate").val();
		scm.set("contractDate", contractDate);
		var data = eqCostListDataSource.data();
		scm.set("eqcostList", data);
		dataSource.add(scm);
		dataSource.sync();
		loadPage("scList");
    }
};

function addAProject(){
	var options = { width:"680px", height: "520px", title:"新建一个项目"};
	openRemotePageWindow(options, "html/project/addProject.html", {scAddProject:1});
}