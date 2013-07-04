
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
		customer:{},
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
		estimateTax:{},
		totalEstimateCost:{},
		estimateOtherCost:{},
		//debugCostType:{},
		//taxType:{},
		contractCode : {},
		contractPerson : {},
		contractType : {},
		contractDate : {},
		contractDownPayment : {},
		contractDownPaymentMemo:{},
		progressPayment : {},
		qualityMoney : {},
		qualityMoneyMemo:{},
		contractMemo : {},
		eqcostList : {},
		estimateGrossProfit : {},
		estimateGrossProfitRate : {}
	}
});

var scm;

var dataSource_SC = new kendo.data.DataSource({
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
	group: {
		field:"eqcostCategory",
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
        		eqcostCategory : {type: "string"},
        		eqcostLastBasePrice: { type: "number" },
        		eqcostTotalAmount : {type: "number"}
            }
        }
	}
});
var projectItems = new kendo.data.DataSource({
	transport : {
		read : {
			url : "../service/project/listforselect",
			dataType : "jsonp"
		}
	},
	schema: {
	    data: "data",
	    model: { id: "_id" }
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
	$("#customer").kendoDropDownList({
		dataTextField : "name",
		dataValueField : "_id",
        optionLabel: "选择客户...",
		dataSource : customerItems,
	});
	
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
	
	$("#projectId").kendoDropDownList({
		dataTextField : "projectCode",
		dataValueField : "_id",
        optionLabel: "选择项目...",
		dataSource : projectItems,
		select:function(e){
			var dataItem = this.dataItem(e.item.index());
//            console.log("*******dataItem"+dataItem.projectName+"****projectType"+dataItem.projectType);
            $("#selProjectName").html(dataItem.projectName);
            showTabs(dataItem.projectStatus);
		}
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
	/*$("#progressPayment").kendoNumericTextBox({
		min:0
	});*/
	$("#qualityMoney").kendoNumericTextBox({
		min:0
	});
	$("#estimateTax").kendoNumericTextBox({
		min:0
	});
	
	//进度款
	if (!$("#progressPayment").data("kendoGrid")){
		$("#progressPayment").kendoGrid({
			dataSource : scProgressPaymentDatasource,
			columns : [ {
				field : "progressPaymentNo",
				title : "序号"
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
	
	//成本设备清单
	if (!$("#scEqCostList").data("kendoGrid")){
		$("#scEqCostList").kendoGrid({
			dataSource : eqCostListDataSource,
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
//			{
//				field : "eqcostBrand",
//				title : "品牌"
//			}, 
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
				title : "最终成本价"
			}, {
				field : "eqcostTotalAmount",
				title : "小计"
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

			toolbar : [ {name:"create",text:"新增成本项"} ],
			editable : true,
			scrollable : true
		});
	}//成本设备清单
	
    $("#files").kendoUpload({
        async: {
            saveUrl: "/service/sc/upload/eqlist",
            autoUpload: true
        },
        success:function(e){
        	eqCostListDataSource.data(e.response.data);
        }
    });	
	
	//添加表单绑定一个空的 Model
	scm = new scModel();
	kendo.bind($("#addSalesContract"), scm);
	
});//end dom ready	

function saveSC(){
	var validator = $("#addSalesContract").kendoValidator().data("kendoValidator");
	var validatestatus = $("#validate-status");
	var eqCostData = eqCostListDataSource.data();
	var progressPaymentData = scProgressPaymentDatasource.data();
	var projectId = scm.get("projectId");
//	console.log("************"+projectId);
//	console.log(projectItems.get(projectId).get("projectStatus"));
	var projectStatus = projectItems.get(projectId).get("projectStatus")

	if (eqCostListDataSource.total() == 0){
		alert("成本设备清单为空！");
		return;
	}
	if(!validator.validate() && projectStatus == "销售正式立项") {
		validatestatus.text("表单验证不通过！")
        .removeClass("valid")
        .addClass("invalid");
		alert("表单验证不通过！");
		return;
    } else {
		scm.set("eqcostList", eqCostData);
		scm.set("progressPayment", progressPaymentData);

		var profit = $("#estimateGrossProfit").val();
		var profitRate = $("#estimateGrossProfitRate").val();
		var totalEstimate = $("#totalEstimateCost").val();
		scm.set("estimateGrossProfit", profit);
		scm.set("estimateGrossProfitRate", profitRate);
		scm.set("totalEstimateCost", totalEstimate);
		
		dataSource_SC.add(scm);
		dataSource_SC.sync();
		loadPage("scList");
    }
};

function addAProject(){
	var options = { width:"680px", height: "520px", title:"新建一个项目"};
	openRemotePageWindow(options, "html/project/addProject.html", {scAddProject:1});
}

function moneyOnChange(){
	var scAmount = $("#contractAmount").val();
	
	var estimateEqCost0 = $("#estimateEqCost0").val();
	var estimateEqCost1 = $("#estimateEqCost1").val();
	var estimateSubCost = $("#estimateSubCost").val();
	var estimatePMCost = $("#estimatePMCost").val();
	var estimateDeepDesignCost = $("#estimateDeepDesignCost").val();
	var estimateDebugCost = $("#estimateDebugCost").val();
	var estimateOtherCost = $("#estimateOtherCost").val();
	var estimateTax = $("#estimateTax").val();

	if (estimateEqCost0==""){
		estimateEqCost0=0;
	}
	if (estimateEqCost1==""){
		estimateEqCost1=0;
	}
	if (estimateSubCost==""){
		estimateSubCost=0;
	}
	if (estimatePMCost==""){
		estimatePMCost=0;
	}
	if (estimateDeepDesignCost==""){
		estimateDeepDesignCost=0;
	}
	if (estimateDebugCost==""){
		estimateDebugCost=0;
	}
	if (estimateOtherCost==""){
		estimateOtherCost=0;
	}
	if (estimateTax==""){
		estimateTax=0;
	}
	
	var totalCost = estimateEqCost0*1 + estimateEqCost1*1 + estimateSubCost*1 
		+ estimatePMCost*1 + estimateDeepDesignCost*1 + estimateDebugCost*1
		+ estimateOtherCost*1 + estimateTax*1;
//	console.log("***********totalCost" + totalCost);
	$("#totalEstimateCost").val(totalCost);
	if (scAmount != null && scAmount != ""){
		var profit = scAmount - totalCost;
		var profitRate = profit/scAmount * 100;
		$("#estimateGrossProfit").val(profit);
		$("#estimateGrossProfitRate").val(profitRate+" %");
	}
}

function showTabs(projectStatus){
//	console.log("showTabs*************projectStatus"+projectStatus);
	if (projectStatus == "销售正式立项"){
		$("#tabDiv").show();
	}else{//虚拟合同，只显示 设备清单Tab
		$("#tabDiv").show();
	}
}