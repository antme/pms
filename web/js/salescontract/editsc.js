
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
//		debugCostType:{},
//		taxType:{},
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
		addNewEqCostReason : {},
		addNewEqCostMemo : {}
	}
});
var scm;

var scInvoiceModel = kendo.data.Model.define({
	id : "_id",
	fields : {
		_id : {
			editable : false,
			nullable : true
		},
		scInvoiceMoney:{},
		invoiceType:{},
		scId:{},
		scInvoiceDate:{}
	}
});
var im;

var scGotMoneyModel = kendo.data.Model.define({
	id : "_id",
	fields : {
		_id : {
			editable : false,
			nullable : true
		},
		scGotMoney:{},
		scId:{},
		scGotMoneyDate:{}
	}
});
var gmm;

var scMonthShipmentsModel = kendo.data.Model.define({
	id : "_id",
	fields : {
		_id : {
			editable : false,
			nullable : true
		},
		scShipmentsMoney:{},
		scId:{},
		month:{}
	}
});
var msm;

var invoiceDataSource = new kendo.data.DataSource({
	transport : {
		read : {
			url : "../service/sc/invoice/list",
			dataType : "jsonp"
		},
		update : {
			url : "../service/sc/invoice/update",
			dataType : "jsonp",
			method : "post"
		},
		create : {
			url : "../service/sc/invoice/add",
			dataType : "jsonp",
			method : "post"
		},

		parameterMap : function(options, operation) {
			if (operation !== "read" && options.models) {
				return {
					//options.models.set("cid":"aaaaaaaaaaaaaa");
					models : kendo.stringify(options.models)
				};
			}
		}
	},
	pageSize: 10,
	batch : true,
	
	schema : {
		model : scInvoiceModel
	}
});

var gotMoneyDataSource = new kendo.data.DataSource({
	transport : {
		read : {
			url : "../service/sc/gotmoney/list",
			dataType : "jsonp"
		},
		update : {
			url : "../service/sc/gotmoney/update",
			dataType : "jsonp",
			method : "post"
		},
		create : {
			url : "../service/sc/gotmoney/add",
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
		model : scGotMoneyModel
	}
});

var monthShipmentsSource = new kendo.data.DataSource({
	transport : {
		read : {
			url : "../service/sc/monthshipments/list",
			dataType : "jsonp"
		},
		update : {
			url : "../service/sc/monthshipments/update",
			dataType : "jsonp",
			method : "post"
		},
		create : {
			url : "../service/sc/monthshipments/add",
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
		model : scMonthShipmentsModel
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

//变更-新的成本设备清单
var eqCostListDataSourceNew = new kendo.data.DataSource({
	group: {
		field: "eqcostCategory",
		aggregates: [
						{ field: "eqcostCategory", aggregate: "count" },
						{ field: "eqcostAmount", aggregate: "sum" },
						{ field: "eqcostTotalAmount", aggregate: "sum" }
		             ]
	},
	
	aggregate: [ { field: "eqcostCategory", aggregate: "count" },
                 { field: "eqcostAmount", aggregate: "sum" },
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

var eqCostListDataSourceOld = new kendo.data.DataSource({
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
	$("#customer").kendoDropDownList({
		dataTextField : "name",
		dataValueField : "_id",
        optionLabel: "选择客户...",
		dataSource : customerItems,
		enable:false
	});
	//合同类型
	//弱电工程、产品集成（灯控/布线，楼控，其他）、产品销售、维护及服务
	$("#contractType").kendoDropDownList({
		dataTextField : "text",
		dataValueField : "value",
        optionLabel: "选择合同类型...",
		dataSource : contractTypeItems,
		enable:false
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
	
	var addNewEqCostReasonItems = [{ text: "勘误", value: "勘误" }, { text: "变更", value: "变更" }];
	$("#addNewEqCostReason").kendoDropDownList({
		dataTextField : "text",
		dataValueField : "value",
        optionLabel: "选择增补原因...",
		dataSource : addNewEqCostReasonItems,
	});
	
	
	$("#projectId").kendoDropDownList({
		dataTextField : "projectCode",
		dataValueField : "_id",
        optionLabel: "选择项目...",
		dataSource : projectItems,
		enable:false
	});
	
	//合同签订日期控件
	$("#contractDate").kendoDatePicker({
		max: new Date()
	});
	
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
	
	//成本设备清单_new
	if (!$("#scEqCostListNew").data("kendoGrid")){
		$("#scEqCostListNew").kendoGrid({
			dataSource : eqCostListDataSourceNew,
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
				field : "eqcostAmount",
				title : "数量",
				groupFooterTemplate: "#= sum#", 
				footerTemplate: "#=sum#"
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
				groupFooterTemplate: "#= sum#", 
				footerTemplate: "#=sum#"
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

			toolbar : [ {name:"create",text:"新增成本项"} ],
			editable : true,
			scrollable : true,
			sortable : true
		});
	}//成本设备清单_new
	
	$("#files").kendoUpload({
        async: {
            saveUrl: "/service/sc/upload/eqlist",
            autoUpload: true
        },
        success:function(e){
        	eqCostListDataSourceNew.data(e.response.data);
        }
    });	
	
	if(popupParams){
		postAjaxRequest("/service/sc/get", popupParams, edit);
		disableAllInPoppup();
	}else{
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
*/	
	eqCostListDataSourceOld.data(scm.eqcostList);
	//成本设备清单_old
	if (!$("#scEqCostListOld").data("kendoGrid")){
		$("#scEqCostListOld").kendoGrid({
			dataSource : eqCostListDataSourceOld,
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
				groupFooterTemplate: "#= sum#", 
				footerTemplate: "#=sum#"
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
				title : "折扣率 %"
			}, {
				field : "eqcostLastBasePrice",
				title : "最终成本价",
				groupFooterTemplate: "合计：", 
				footerTemplate: "总计："
			}, {
				field : "eqcostTotalAmount",
				title : "小计",
//				format: "{0:c}",
				groupFooterTemplate: "#= sum#", 
				footerTemplate: "#=sum#"
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
			sortable : true
		});
	}//成本设备清单_old

	invoiceDataSource.data(scm.scInvoiceInfo);
	if (!$("#invoiceList").data("kendoGrid")){
		$("#invoiceList").kendoGrid({
			dataSource : invoiceDataSource,
			editable : "popup",
//			toolbar : [ {
//				template : kendo.template($("#addInvoiceButtonTem").html())
//			} ],
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
	
	gotMoneyDataSource.data(scm.scGotMoneyInfo);
	if (!$("#gotMoneyList").data("kendoGrid")){
		$("#gotMoneyList").kendoGrid({
			dataSource : gotMoneyDataSource,
			editable : "popup",
//			toolbar : [ {
//				template : kendo.template($("#addGotMoneyButtonTem").html())
//			} ],
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
	
	monthShipmentsSource.data(scm.scMonthShipmentsInfo);
	if (!$("#monthShipmentsGrid").data("kendoGrid")){
		$("#monthShipmentsGrid").kendoGrid({
			dataSource : monthShipmentsSource,
			editable : "popup",
//			toolbar : [ {
//				template : kendo.template($("#addMonthShipmentsButtonTem").html())
//			} ],
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
	
	scm.set("contractDate", kendo.toString(scm.contractDate, 'd'));
	kendo.bind($("#editSalesContract"), scm);
}
		
function saveSC(){
	var validator = $("#editSalesContract").kendoValidator().data("kendoValidator");
	
	var projectId = scm.get("projectId");
	var projectStatus = projectItems.get(projectId).get("projectStatus")
	
	if (!validator.validate() && projectStatus == "销售正式立项") {
		alert("表单验证不通过！");
		return;
    } else {
    	//如果添加新的成本设备，严重增补原因、增补备注必填
    	var newEqTotal = eqCostListDataSourceNew.total();
		var reason = $("#addNewEqCostReason").data("kendoDropDownList").value();
		scm.set("addNewEqCostReason", reason);
    	if (newEqTotal>0){
    		if (reason == null || reason == ""){
    			alert("请选择增补原因！");
    			return;
    		}
    		var newEqMemo = $("#addNewEqCostMemo").val().trim();
    		if (newEqMemo == null || newEqMemo == ""){
    			alert("请填写增补备注！");
    			return;
    		}
    		
    		var map = new Map();
    		for(i=0; i<newEqTotal; i++){
    			var item = eqCostListDataSourceNew.at(i);
    			var itemCate = item.eqcostCategory;
    			var itemTaxType = item.eqcostTaxType;
    			
    			//---start : add logic for check can not empty col
    			var itemUnit = item.eqcostUnit;  //单位
    			if (itemUnit==null || itemUnit.length == 0){
    				alert("单位不能为空！");
    				return;
    			}
    			
    			var itemProductType = item.eqcostProductType;  //规格型号
    			if (itemProductType==null || itemProductType.length == 0){
    				alert("规格型号不能为空！");
    				return;
    			}
    			
    			var itemProductName = item.eqcostProductName;  //产品名称
    			if (itemProductName==null || itemProductName.length == 0){
    				alert("产品名称不能为空！");
    				return;
    			}
    			
    			var itemAmount = item.eqcostAmount;  //数量
    			if (itemAmount==null || itemAmount.length == 0){
    				alert("数量不能为空！");
    				return;
    			}
    			
    			var itemBasePrice = item.eqcostBasePrice;  //标准成本价
    			if (itemBasePrice==null || itemBasePrice.length == 0){
    				alert("标准成本价不能为空！");
    				return;
    			}
    			
    			var itemDiscountRate = item.eqcostDiscountRate;  //折扣率
    			if (itemDiscountRate==null || itemDiscountRate.length == 0){
    				alert("折扣率不能为空！");
    				return;
    			}
    			//---end : add logic for check can not empty col
    			
    			//---start : add logic for check new record amount is negative number
    			if (itemAmount < 0){
    				var oldEqTotal = eqCostListDataSourceOld.total();
    				var haveFlag = false;
    				var haveOldAmount = 0;
    				for(i=0; i<oldEqTotal; i++){
    					
    					var oldItem = eqCostListDataSourceOld.at(i);
    					var oldName = oldItem.eqcostProductName;
    					var oldPtype = oldItem.eqcostProductType;
    					var oldAmount = oldItem.eqcostRealAmount;
    					
    					if (itemProductType == oldPtype && itemProductName ==oldName){
    						haveFlag = true;
    						haveOldAmount = oldAmount;
    						break;
    					}
    					console.log("ptype:"+oldPtype + "**new:"+itemProductType);
    					console.log("pname:"+oldName + "**new:"+itemProductName);
    					console.log("haveFlag:"+haveFlag);
    					
    				}
    				
    				if (haveFlag){
						if (itemAmount + haveOldAmount < 0){
							alert(itemProductName + "原有清单数量不够抵消！");
							return;
						}
					}else{
						alert(itemProductName + "原有清单中无此设备，数量不能是负数！");
						return;
					}
    			}
    			//---end : add logic for check new record amount is negative number
    			
    			var savedCateTaxType = map.get(itemCate);
    			if(savedCateTaxType == null){
    				map.put(itemCate, itemTaxType);
    			}else if(savedCateTaxType != itemTaxType){
    				alert("成本设备清单：" + itemCate + "类别中税收类型不统一！");
    				return;
    			}
    		}
    	}//End 
    	
		var _id = scm.get("_id");
		var data = eqCostListDataSourceNew.data();
		scm.set("eqcostList", data);
		
		var newEqTotal = eqCostListDataSourceNew.total();
		
		var profit = $("#estimateGrossProfit").val();
		var profitRate = $("#estimateGrossProfitRate").val();
		var totalEstimate = $("#totalEstimateCost").val();
		scm.set("estimateGrossProfit", profit);
		scm.set("estimateGrossProfitRate", profitRate);
		scm.set("totalEstimateCost", totalEstimate);
		
		postAjaxRequest("/service/sc/add",  {models:kendo.stringify(scm)}, function(data){
			loadPage("salescontract_scList");
    	});

	}
};

function Map(){
	this.container = new Object();
}


Map.prototype.put = function(key, value){
	this.container[key] = value;
}


Map.prototype.get = function(key){
	return this.container[key];
}

function addInvoice(){
	im = new scInvoiceModel();
	kendo.bind($("#invoice-edit"), im);
	var options = {id:"invoice-edit", width:"450px", height: "300px", title:"新开票"};
	$("#scInvoiceMoney").kendoNumericTextBox({
		min:0
	});//发票类型
	var invoiceTypeItems = [{ text: "增值税专用", value: 1 }, { text: "增值税普通", value: 2 }, { text: "建筑业发票", value: 3 }, { text: "服务业发票", value: 4 }];
	$("#addInvoiceType").kendoDropDownList({
		dataTextField : "text",
		dataValueField : "value",
        optionLabel: "选择发票类型...",
		dataSource : invoiceTypeItems,
	});
	openWindow(options);
}

function saveInvoice(){
	im.set("scId", redirectParams._id);
	invoiceDataSource.add(im);
	invoiceDataSource.sync();
	var window = $("#invoice-edit");

	if (window.data("kendoWindow")) {
		window.data("kendoWindow").close();
	}
	
	var grid = $("#invoiceList");
	if (grid.data("kendoGrid")) {
		grid.data("kendoGrid").refresh();
	}
}

function addGotMoney(){
	gmm = new scGotMoneyModel();
	kendo.bind($("#got-money-edit"), gmm);
	var options = {id:"got-money-edit", width:"450px", height: "300px", title:"新收款"};
	openWindow(options);
}

function saveGotMoney(){
	gmm.set("scId", redirectParams._id);
	gotMoneyDataSource.add(gmm);
	gotMoneyDataSource.sync();
	var window = $("#got-money-edit");

	if (window.data("kendoWindow")) {
		window.data("kendoWindow").close();
	}
	
	var grid = $("#gotMoneyList");
	if (grid.data("kendoGrid")) {
		grid.data("kendoGrid").refresh();
	}
}

function addMonthShipments(){
	msm = new scMonthShipmentsModel();
	kendo.bind($("#month-shipments-edit"), msm);
	var options = {id:"month-shipments-edit", width:"450px", height: "300px", title:"新发货金额"};
	openWindow(options);
}

function saveMonthShipments(){
	msm.set("scId", redirectParams._id);
	monthShipmentsSource.add(msm);
	monthShipmentsSource.sync();
	var window = $("#month-shipments-edit");

	if (window.data("kendoWindow")) {
		window.data("kendoWindow").close();
	}
	
	var grid = $("#monthShipmentsGrid");
	if (grid.data("kendoGrid")) {
		grid.data("kendoGrid").refresh();
	}
}

function closeWindow(windowId){
	var window = $("#"+windowId);

	if (window.data("kendoWindow")) {
		window.data("kendoWindow").close();
	}
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
	
	
	