
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
		contractDownPayment : { type : "number"},
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


//成本设备清单数据源
var eqCostListDataSource = new kendo.data.DataSource({
	group: {
		field:"eqcostCategory",
		aggregates: [
                     { field: "eqcostCategory", aggregate: "count" },
                     { field: "eqcostAmount", aggregate: "sum" },
                     { field: "eqcostTotalAmount", aggregate: "sum" }
                  ]
	},
	
	aggregate: [ 
	             { field: "eqcostCategory", aggregate: "count" },
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

var tabs;
$(document).ready(function() {
	
	scm = new scModel();
	//选项卡
	
	if (!tabs){
		tabs = $("#tabstrip").kendoTabStrip({
	        animation:  {
	            open: {
	                effects: "fadeIn"
	            }
	        }
	    });
	};
	//弱电工程、产品集成（灯控/布线，楼控，其他）、产品销售、维护及服务
	$("#contractType").kendoDropDownList({
		dataTextField : "text",
		dataValueField : "value",
        optionLabel: "选择合同类型...",
		dataSource : contractTypeItems,
		select:function(e){
			var dataItem = this.dataItem(e.item.index());
            scTypeShowTabs(dataItem.value);
		}
	});
	
	//表单中的各种控件
	
	$("#invoiceType").kendoDropDownList({
		dataTextField : "text",
		dataValueField : "value",
        optionLabel: "选择发票类型...",
		dataSource : invoiceTypeItems
	});
	


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
		dataSource : customerItems
	});
	

	
	//已归档，未归档
	
	$("#archiveStatus").kendoDropDownList({
		dataTextField : "text",
		dataValueField : "value",
        optionLabel: "选择归档状态...",
		dataSource : archiveStatusItems
	});
	
	//执行中、收尾阶段、质保期、结束、中止或暂停、作废
	
	$("#runningStatus").kendoDropDownList({
		dataTextField : "text",
		dataValueField : "value",
        optionLabel: "选择执行状态...",
		dataSource : runningStatusItems
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
            
          var relatedScType = dataItem.contractType;
          var sctypelist = $("#contractType").data("kendoDropDownList");
                    
          if (relatedScType != null && sctypelist!=null){
          	sctypelist.value(relatedScType);
          	sctypelist.enable(false);
          	scm.set("contractType",relatedScType)
          }
          
          //start: add for customer info
          var haveCustomer = dataItem.cId;
          var cusList = $("#customer").data("kendoDropDownList");
          console.log("********"+haveCustomer);
          if (haveCustomer != null){
	    	  cusList.value(haveCustomer);
	    	  cusList.enable(false);
	    	  scm.set("customer",haveCustomer)
         }
          //end: add for customer info 
		}
	});
	
	//合同签订日期控件
	var ddd = $("#contractDate").kendoDatePicker({
		format: "yyyy/MM/dd",
		max: new Date(),
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
	/*if (!$("#progressPayment").data("kendoGrid")){
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
*/	
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

			toolbar : [ {name:"create",text:"新增成本项"} ],
			editable : true,
			scrollable : true,
			sortable : true
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
	
	kendo.bind($("#addSalesContract"), scm);
	
	if(redirectParams && redirectParams.pageId && redirectParams.pageId=="newProject"){
		
		var tabStrip = $("#tabstrip").data("kendoTabStrip");
		if(!tabStrip){
			$("#tabstrip").kendoTabStrip();		
			tabStrip = $("#tabstrip").data("kendoTabStrip");
		}
		tabStrip.append({
	        text: "项目信息"
	    });
	}
	
});//end dom ready	

function saveSC(){
	
	var validator = $("#addSalesContract").kendoValidator().data("kendoValidator");
	var validatestatus = $("#validate-status");
	var eqCostData = eqCostListDataSource.data();
//	var progressPaymentData = scProgressPaymentDatasource.data();
	var projectId = scm.get("projectId");
	var projectStatus = projectItems.get(projectId).get("projectStatus");
	var scType = scm.get("contractType");
	if (scType == null || scType == ""){
		alert("请选择合同类型！");
		return;
	}else if (scType != "弱电工程"){//弱点工程 类型 无设备清单数据
		var eqTotal = eqCostListDataSource.total();
		if (eqTotal == 0){
			alert("成本设备清单为空！");
			return;
		}
		var map = new Map();
		for(i=0; i<eqTotal; i++){
			var item = eqCostListDataSource.at(i);
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
			
			if (itemAmount != null && itemAmount < 0){
				alert("第一次添加设备清单数量不能为负数！");
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
			
			var savedCateTaxType = map.get(itemCate);
			if(savedCateTaxType == null){
				map.put(itemCate, itemTaxType);
			}else if(savedCateTaxType != itemTaxType){
				alert("成本设备清单：" + itemCate + "类别中税收类型不统一！");
				return;
			}
		}
	}
	
	if(!validator.validate() && projectStatus == "销售正式立项") {
		validatestatus.text("表单验证不通过！")
        .removeClass("valid")
        .addClass("invalid");
		alert("表单验证不通过！");
		return;
    } else {
		scm.set("eqcostList", eqCostData);
//		scm.set("progressPayment", progressPaymentData);

		var profit = $("#estimateGrossProfit").val();
		var profitRate = $("#estimateGrossProfitRate").val();
		var totalEstimate = $("#totalEstimateCost").val();
		scm.set("estimateGrossProfit", profit);
		scm.set("estimateGrossProfitRate", profitRate);
		scm.set("totalEstimateCost", totalEstimate);
		postAjaxRequest("/service/sc/add", {models:kendo.stringify(scm)}, function(data){
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

function addAProject(){
	var options = { width:"680px", height: "520px", title:"新建一个项目"};
	openRemotePageWindow(options, "project_addProject", {scAddProject:1});
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
	var tabStrip = $("#tabstrip").data("kendoTabStrip");
	if(!tabStrip){
		$("#tabstrip").kendoTabStrip();
		
		tabStrip = $("#tabstrip").data("kendoTabStrip");
	}
	var tab0 = tabStrip.tabGroup.children("li").eq(0);
	var tab1 = tabStrip.tabGroup.children("li").eq(1);
	var tab2 = tabStrip.tabGroup.children("li").eq(2);
	var scType = $("#contractType").val();
	if (projectStatus == "销售正式立项"){
		$("#tabDiv").show();
		tabStrip.enable(tab0, true);
		tabStrip.enable(tab1, true);
	}else{//虚拟合同，只显示 设备清单Tab	
		$("#tabDiv").show();
		tabStrip.enable(tab0, false);
		tabStrip.enable(tab1, false);
		if(scType != "弱电工程"){
			tabStrip.select(2);
//			tabStrip.deactivateTab(tab2);
		}else{
			tabStrip.deactivateTab(tab0);
			tabStrip.deactivateTab(tab1);
			tabStrip.deactivateTab(tab2);
		}
	}
}

function scTypeShowTabs(scType){
	var tabStrip = $("#tabstrip").data("kendoTabStrip");
	if(!tabStrip){
		$("#tabstrip").kendoTabStrip();
		
		tabStrip = $("#tabstrip").data("kendoTabStrip");
	}
	var tab2 = tabStrip.tabGroup.children("li").eq(2);
//	console.log("***"+scType);
	if (scType == "弱电工程"){
		tabStrip.enable(tab2, false);
		tabStrip.deactivateTab(tab2);
	}else{
		tabStrip.enable(tab2, true);
		tabStrip.select(2);
	}
}