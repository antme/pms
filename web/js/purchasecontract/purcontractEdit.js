var requestDataItem;
var approveUrl = "/service/purcontract/approve";
var rejectUrl = "/service/purcontract/reject";
var supplierNameContact ="";
var contractModel = kendo.data.Model.define({
	id : "_id",
	fields : {
		contractCode : {
			editable : false
		},
		
		supplierName : {
			validation : {
				required : true
			}
		},

		contractProperty: {
			defaultValue: "闭口合同"
		},
		
		invoiceType: {
			defaultValue: "增值税专用"
		},
		supplierNameContact : {

		},
		
		signDate:{
			type:"date"
		},
		firstPay : {

		},
		eqcostApplyAmount : {
			editable : false
		},
		eqcostProductUnitPrice : {
			editable : false
		},
		eqcostBrand : {
			editable : false
		},
		purchaseOrderCode : {
			editable : false
		},
		eqcostList: {},
		eqcostNo : {
			editable : false
		},
		eqcostMaterialCode : {
			editable : false
		},
		eqcostProductType : {
			editable : false
		},
		eqcostAvailableAmount : {
			editable : false
		},
		eqcostUnit : {
			editable : false
		},
		eqcostProductName : {
			editable : false
		},
		contractExecuteCate : {
			
		},
		contractPaymentType : {
			
		}
	}
});
requestDataItem = new contractModel({});
//成本设备清单数据源
var eqCostListDataSource = new kendo.data.DataSource({
	group: {
		field:"eqcostCategory",
		aggregates: [
                     { field: "eqcostCategory", aggregate: "count" },
                     { field: "requestedTotalMoney", aggregate: "sum" },
                     { field: "eqcostTotalMoney", aggregate: "sum" }
                  ]
	},
	
	aggregate: [ 	          
	          { field: "eqcostCategory", aggregate: "count" },
	          { field: "requestedTotalMoney", aggregate: "sum" },
	          { field: "eqcostTotalMoney", aggregate: "sum" }
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
	$("#tabstrip").kendoTabStrip({
		animation : {
			open : {
				effects : "fadeIn"
			}
		},
		activate : function(e){
			if(e.item.id =="merged-select"){			
				initMergedGrid();

			}
		}
		
	});	

	
	$("#eqcostDeliveryType").kendoDropDownList({
		dataTextField : "text",
		dataValueField : "text",
		dataSource : eqcostDeliveryType
	});
	
	$("#purchaseContractType").kendoDropDownList({
		dataTextField : "text",
		dataValueField : "text",
		dataSource : purchaseContractTypeNormal,
		change: function(e) {
        	selectCType(this.dataItem());
        } 
		
	});
	
	$("#supplier").kendoDropDownList({
		dataTextField : "supplierName",
		dataValueField : "_id",
		optionLabel: "选择供应商...",
		dataSource : {
			transport : {
				read : {
					dataType : "jsonp",
					url : "/service/suppliers/list"
				}
			},
			schema : {
				total: "total", // total is returned in the "total" field of the response
				data: "data"
			}
		}
	});
	

	
	$("#executeStatus").kendoDropDownList({
		dataTextField : "text",
		dataValueField : "text",
		dataSource : executeType1
	});
		
	$("#signDate").kendoDatePicker({
	    format: "yyyy/MM/dd",
	    parseFormats: ["yyyy/MM/dd"]
	});

	if(popupParams){	
		$("#purchasecontract-edit-item").show();
		postAjaxRequest("/service/purcontract/get", popupParams, edit);
		$("#purchasecontractselect").hide();
		disableAllInPoppup();	
	}else if (redirectParams) {
		
		if (redirectParams && redirectParams.addInSCList && redirectParams.addInSCList == 1){//销售合同列表中直接为 弱电工程 类添加
			addOrderInSCListForRuodian();
			disableTable();
		}else{
			$("#purchasecontract-edit-item").show();
			postAjaxRequest("/service/purcontract/get", redirectParams, edit);
		}
	} else{

		$("#purchasecontractin").kendoMultiSelect({
			dataTextField : "purchaseOrderCode",
			dataValueField : "_id",
			placeholder : "选择采购订单...",
			itemTemplate:  '${ data.purchaseOrderCode }:<strong>${ data.purchaseContractType}</strong>:<strong> - 【项目名称】${ data.projectName}</strong>',
			dataSource : new kendo.data.DataSource({
				transport : {
					read : {
						url : "/service/purcontract/order/select",
						dataType : "jsonp"
					}
				},
				schema : {
					total : "total",
					data : "data"
				}
			})
		});
		

		$("#purchasecontract-edit-header").show();
		$("#purchasecontract-edit-item").hide();
	}
	
});


function changeCType(index){
	if(index==0){
		$("#purchaseContractType").kendoDropDownList({
			dataTextField : "text",
			dataValueField : "text",
			dataSource : purchaseContractTypeNormal,
			change: function(e) {
	        	selectCType(this.dataItem());
	        } 
		});
		
		if(!requestDataItem.purchaseContractType || requestDataItem.purchaseContractType=="施耐德北京代采" || requestDataItem.purchaseContractType=="泰康北京生产" ||
				requestDataItem.purchaseContractType=="施耐德北京库存" || requestDataItem.purchaseContractType=="泰康北京库存"){
			requestDataItem.purchaseContractType = "上海代理产品"
		}
		requestDataItem.set("contractExecuteCate","正常采购");
		$("input[name=contractExecuteCate]:eq(0)").attr("checked",true);
		$("#supplierNameContact").val(supplierNameContact);
		$("#supplierNameContact").attr("disabled", false);
		$("#contractProperty").attr("disabled", false);
		
		
		$("#contractPaymentType").attr("disabled", false);
		$("#firstPay").attr("disabled", false);
		$("#moneyProgress").attr("disabled", false);
		$("#deposit").attr("disabled", false);
		$("#invoiceType").attr("disabled", false);
		$("#invoiceType").show();
		$(".virt").show();
		var kendoSupp = $("#supplier").data("kendoDropDownList");
		kendoSupp.enable(true);
	}else{
		$("#purchaseContractType").kendoDropDownList({
			dataTextField : "text",
			dataValueField : "text",
			dataSource : purchaseContractTypeVirtual,
			change: function(e) {
	        	selectCType(this.dataItem());
	        } 
		});
		requestDataItem.set("contractExecuteCate","虚拟合同");
		if(!requestDataItem.purchaseContractType || requestDataItem.purchaseContractType=="上海代理产品" || requestDataItem.purchaseContractType=="上海其他"){
			requestDataItem.purchaseContractType = "施耐德北京代采";
		}	
		$("input[name=contractExecuteCate]:eq(1)").attr("checked",true);
	
		var kendoSupp = $("#supplier").data("kendoDropDownList");
		var spData = kendoSupp.dataSource.data();
		for(i=0; i<spData.length; i++){
			if(spData[i].supplierName =="同方北京"){
				requestDataItem.set("supplierId", spData[i]._id);
				break;
			}
		}
		
		kendoSupp.enable(false);
		$("#supplierNameContact").val("同方北京");
		$("#supplierNameContact").attr("disabled", true);
		$("#contractProperty").val("闭口合同");
		
		$("#contractPaymentType").attr("disabled", true);
		$("#contractProperty").attr("disabled", true);
		$("#firstPay").attr("disabled", true);
		$("#moneyProgress").attr("disabled", true);
		$("#deposit").attr("disabled", true);
		$("#invoiceType").attr("disabled", true);
		
		$(".virt").hide();

		
	}
	

	
}

function selectCType(e){	
	if(e.text=="施耐德北京代采"){
		requestDataItem.set("eqcostDeliveryType", "入公司库");
	}
	
	if(e.text=="泰康北京生产" || e.text=="施耐德北京库存" || e.text=="泰康北京库存"){
		requestDataItem.set("eqcostDeliveryType", "直发现场");
	}
	
	

	
}
function disableTable(){
	
	var tabStrip = $("#tabstrip").data("kendoTabStrip");
	if(!tabStrip){
		$("#tabstrip").kendoTabStrip();				
		tabStrip = $("#tabstrip").data("kendoTabStrip");
	}
	var tab0 = tabStrip.tabGroup.children("li").eq(0);
	var tab1 = tabStrip.tabGroup.children("li").eq(1);
	var tab2 = tabStrip.tabGroup.children("li").eq(2);
	tabStrip.enable(tab1, false);
	tabStrip.enable(tab2, false);
	
}
function addOrderInSCListForRuodian(){
	kendo.bind($("#purchasecontract-edit"), requestDataItem);

	$("#purchasecontractselect").hide();
	$("#purchasecontract-edit-item").show();
	
	var tabStrip = $("#tabstrip").data("kendoTabStrip");
	if(!tabStrip){
		$("#tabstrip").kendoTabStrip();
		
		tabStrip = $("#tabstrip").data("kendoTabStrip");
	}
	tabStrip.append({
        text: "成本设备清单",
        content: "<div><div><a href=\"/template/cbqd.xlsx\">数据模版下载</a> <input name=\"files\" id=\"files\" type=\"file\" /></div><div><div id=\"scEqCostList\"></div></div></div>"//kendo.template($("#roleTemplate").html()),
    });
	
	//成本设备清单
	if (!$("#scEqCostList").data("kendoGrid")){
		$("#scEqCostList").kendoGrid({
			dataSource : eqCostListDataSource,
			columns : [ 
			            
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
				title : "标准成本价",
				template : function(dataItem){
					return percentToFixed(dataItem.eqcostBasePrice);
				}
			}, {
				field : "eqcostLastBasePrice",
				title : "最终成本价",
				template : function(dataItem){
					return percentToFixed(dataItem.eqcostLastBasePrice);
				}
			}, {
				field : "eqcostTotalAmount",
				title : "小计",
				template : function(dataItem){
					return percentToFixed(dataItem.eqcostTotalAmount);
				}
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
			sortable : true,
			resizable: true,
			scrollable : true
		});
	};//成本设备清单
	
	$("#files").kendoUpload({
        async: {
            saveUrl: "/service/sc/upload/eqlist",
            autoUpload: true
        },
        success:function(e){
  
        	requestDataItem.eqcostList = e.response.data;
        	
        	for (listIndex in requestDataItem.eqcostList) {
				requestDataItem.eqcostList[listIndex].projectId = redirectParams.projectId;
				requestDataItem.eqcostList[listIndex].scId = redirectParams.scId;
				requestDataItem.eqcostList[listIndex].contractCode = redirectParams.contractCode;				
			}
        	eqCostListDataSource.data(requestDataItem.eqcostList);			
			requestDataItem.eqcostDeliveryType = "直发现场";
			requestDataItem.fromRuodian = "弱电工程";
			requestDataItem.projectId = redirectParams.projectId;
			requestDataItem.scId = redirectParams.scId;
			

			edit();
        }
    });
}


var itemDataSource = new kendo.data.DataSource({
	transport : {
		update : {
			url : "/service/purcontract/update",
			dataType : "jsonp",
			type : "post"
		},
		create : {
			url : "/service/purcontract/add",
			dataType : "jsonp",
			type : "post"
		},
		parameterMap : function(options, operation) {
			if (operation !== "read" && options.models) {
				return {

					// 解析成json_p模式
					models: kendo.stringify(requestDataItem),
					mycallback : "checkStatus"
				};
			}
		}
	},
	schema : {
		model : contractModel
	},
	batch : true,

	
	group: {
		field:"purchaseOrderCode",
		aggregates: [
                     { field: "eqcostCategory", aggregate: "count" },
                     { field: "requestedTotalMoney", aggregate: "sum" },
                     { field: "eqcostTotalMoney", aggregate: "sum" }
                  ]
	},
	
	aggregate: [ 	          
	          { field: "eqcostCategory", aggregate: "count" },
	          { field: "requestedTotalMoney", aggregate: "sum" },
	          { field: "eqcostTotalMoney", aggregate: "sum" }
	]
});


var itemListDataSource = new kendo.data.DataSource({
	data: []
});

function savePurchaseContract(status) {

	if(requestDataItem.eqcostList　&& requestDataItem.eqcostList.length==0){
		alert("此申请无任何货品");
		return;
	}
	var validator = $("#purchasecontract-edit-item").kendoValidator().data("kendoValidator");
	if (validator.validate()) {

		if (!itemDataSource.at(0) && !eqCostListDataSource.at(0)) {
			alert("没有任何设备清单数据");
		} else {
			if (!requestDataItem.status) {
				requestDataItem.status = "草稿";
			}
			if (status) {
				requestDataItem.status = status;
			}
			requestDataItem.contractMoney = $("#contractMoney").val();
			
			
			
			if (eqCostListDataSource.at(0)) {
				// force set haschanges = true
				itemDataSource.data(requestDataItem.eqcostList);
			}

			if (itemDataSource.at(0)) {
				// force set haschanges = true
				itemDataSource.at(0).set("uid", kendo.guid());
			}

			if(requestDataItem.supplier && requestDataItem.supplier._id){
				requestDataItem.supplierId = requestDataItem.supplier._id;
			}
			
			if(!requestDataItem.contractExecuteCate){
				requestDataItem.contractExecuteCate = "正常采购";
			}
			
			if(requestDataItem.executeStatus && requestDataItem.executeStatus.text){
				requestDataItem.executeStatus = requestDataItem.executeStatus.text;
			}
			

			if(requestDataItem.eqcostDeliveryType && requestDataItem.eqcostDeliveryType.text){
				requestDataItem.eqcostDeliveryType = requestDataItem.eqcostDeliveryType.text;
			}
			
			if(!requestDataItem.eqcostDeliveryType){
				var eqcostDeliveryType = $("#eqcostDeliveryType").data("kendoDropDownList");
				requestDataItem.eqcostDeliveryType = eqcostDeliveryType.value();
			}
			
			
			// 同步数据
			itemDataSource.sync();
		}
	}else{
		alert("数据校验不通过，请检查不同的tab");
	}

}

function checkStatus() {
	loadPage("purchasecontract_purchasecontract", null);
}
// 计算成

function showOrderWindow() {
	// 如果用户用默认的采购申请，select event不会触发， 需要初始化数据
	var kendoGrid = $("#purchasecontractin").data("kendoMultiSelect");
	var dataItems = kendoGrid.dataSource.data();
	var eqdelType = undefined;
	var valid = true;
	itemListDataSource.data([]);
	itemDataSource.data([]);
	if(dataItems.length==0){
		alert("没有相关订单");
	}else{
		var selectedValues = kendoGrid.value();
		for(id in selectedValues){	
			if(!valid){
				break;
			}
			for(index in dataItems){	
				if(dataItems[index]._id == selectedValues[id]){
					var eqcostList = dataItems[index].eqcostList;
					
					if(!eqdelType){
						eqdelType = dataItems[index].purchaseContractType;
					}
					
					if(eqdelType != dataItems[index].purchaseContractType){
						alert("只能选择同一种采购类别的订单");
						eqdelType = undefined;
						valid = false;
						break;
					}
					for (listIndex in eqcostList) {
						if(eqcostList[listIndex].uid){
							eqcostList[listIndex].projectId = dataItems[index].projectId;
							eqcostList[listIndex].scId = dataItems[index].scId;
							eqcostList[listIndex].contractCode = dataItems[index].contractCode;
							eqcostList[listIndex].purchaseOrderId = dataItems[index]._id;
							eqcostList[listIndex].purchaseOrderCode = dataItems[index].purchaseOrderCode;
							eqcostList[listIndex].purchaseRequestId = dataItems[index].purchaseRequestId;
							eqcostList[listIndex].purchaseRequestCode = dataItems[index].purchaseRequestCode;
							itemListDataSource.add(eqcostList[listIndex]);
						}
					}
					break;
				}
			}
			
		}
		
		if(valid){
			requestDataItem = new contractModel({});
			requestDataItem.eqcostList = itemListDataSource.data();
			
			requestDataItem.purchaseContractType = eqdelType;
			edit();
		}
	}
}


function edit(data) {

	if(data){
		$("#purchasecontractselect").hide();
		requestDataItem = new contractModel(data);
	}else{
		$("#purchasecontractselect").show();
	}
	supplierNameContact = requestDataItem.supplierNameContact;
	if(!popupParams){
		if(redirectParams && redirectParams.pageId){
			$(".save").hide();
			$(".approve").show();
			$("#approve-comment").show();
		}else{
			$("#approve-comment").hide();
			$(".approve").hide();
			$(".save").show();
		}
	}
	if(!requestDataItem.signBy){
		requestDataItem.signBy = user.userName;

	}
	if(requestDataItem.executeStatus && requestDataItem.executeStatus.text){
		requestDataItem.executeStatus = requestDataItem.executeStatus.text;
	}
	
	if(requestDataItem.fromRuodian){
		if(redirectParams && !redirectParams.addInSCList){
			addOrderInSCListForRuodian();
		}
		disableTable();
		eqCostListDataSource.data(requestDataItem.eqcostList);
	}

	setDate(requestDataItem, "signDate", requestDataItem.signDate);
	kendo.bind($("#purchasecontract-edit"), requestDataItem);
	
	if(requestDataItem.purchaseContractType =="上海代理产品" || requestDataItem.purchaseContractType =="上海其他" || requestDataItem.contractExecuteCate=="正常采购"){
		requestDataItem.contractExecuteCate =="正常采购";
		changeCType(0);
	}else{
		requestDataItem.contractExecuteCate =="虚拟合同";
		changeCType(1);
	}

	var eqcostList = requestDataItem.eqcostList;
	
	
	if (redirectParams && redirectParams.addInSCList){
		
	}else{
		
		
	for (i in requestDataItem.eqcostList) {
		requestDataItem.eqcostList[i].eqcostTotalMoney = requestDataItem.eqcostList[i].eqcostApplyAmount *  requestDataItem.eqcostList[i].eqcostLastBasePrice;
	}
		
	// 渲染成本编辑列表
	itemDataSource.data(requestDataItem.eqcostList);
	



	$("#purchasecontract-edit-item").show();
	$("#purchasecontract-select").hide();


	if (!$("#purchasecontract-edit-grid").data("kendoGrid")) {
		$("#purchasecontract-edit-grid").kendoGrid({
			dataSource : itemDataSource,
			 groupable: {
				    messages: {
				      empty: "拖动订单编号到此可以分组操作"
				    }
			 },
			columns : [ {
				field : "eqcostMaterialCode",
				title : "物料代码"
			}, {
				field : "eqcostProductName",
				title : "名称"
			}, {
				field : "eqcostProductType",
				title : "型号"
			}, {
				field : "eqcostUnit",
				title : "单位"
			}, 					
			
			{
				field : "eqcostApplyAmount",
				title : "订单数量"
			}, 
			{ field: "eqcostLastBasePrice",title : "最终成本价"},
			{
				field : "eqcostProductUnitPrice",
				title : "采购单价",
				template : function(dataItem){
					return percentToFixed(dataItem.eqcostProductUnitPrice);
				}
			},{
				field : "eqcostTotalMoney",
				title : "最终成本总价",
				template : function(dataItem){
					return percentToFixed(dataItem.eqcostTotalMoney);
				},
				footerTemplate: function(dataItem){
					return percentToFixed(dataItem.eqcostTotalMoney.sum);
				}
			}, {
				field : "requestedTotalMoney",
				title : "采购总价",
				template : function(dataItem){
					return percentToFixed(dataItem.requestedTotalMoney);
				},
				footerTemplate: function(dataItem){
					return percentToFixed(dataItem.requestedTotalMoney.sum);
				}
			},{
				field : "eqcostBrand",
				title : "品牌"
			}, {
				field : "remark",
				title : "备注"
			}, {
				field : "contractCode",
				title : "销售合同编号"
			},{
				field : "purchaseOrderCode",
				title : "订单编号"
			}],
			scrollable : true,
			sortable : true,
			editable : true,
			resizable: true,
			width : "800px",
			save : sumOrders,
			dataBound : function(e) {
				var data = itemDataSource.data();			
				// 订单实际总价格
				var requestActureMoney = 0;
				var refresh = false;

				for (i = 0; i < data.length; i++) {
					var item = data[i];
					
					if (!item.eqcostProductUnitPrice) {
						item.eqcostProductUnitPrice = 0;
					}
					
					if (!item.eqcostApplyAmount) {
						item.eqcostApplyAmount = 0;
					}
					
					if (!item.requestedTotalMoney) {
						item.requestedTotalMoney = 0;
					}
					
					if (!item.eqcostTotalMoney) {
						item.eqcostTotalMoney = 0;
					}
					
					if (!item.eqcostLastBasePrice) {
						item.eqcostLastBasePrice = 0;
					}
					
					
					var eqcostTotalMoney = item.eqcostTotalMoney;
					
					item.eqcostTotalMoney =  item.eqcostApplyAmount * item.eqcostLastBasePrice;

					
					var requestedTotalMoney = item.requestedTotalMoney;
					requestActureMoney = requestActureMoney
							+ item.eqcostApplyAmount
							* item.eqcostProductUnitPrice;
					
					item.requestedTotalMoney = item.eqcostApplyAmount
							* item.eqcostProductUnitPrice;

					if ( requestedTotalMoney != item.requestedTotalMoney) {
						refresh = true;
					}
					
					if ( eqcostTotalMoney != item.eqcostTotalMoney) {
						refresh = true;
					}
				}

				if (refresh) {
					var grid1 = $("#purchasecontract-edit-grid").data("kendoGrid");
					
					grid1.refresh();
				}else{

				}

				$("#contractMoney").val(percentToFixed(requestActureMoney));
				
			}

		});
	}
	}
}


var mergedDataSource = new kendo.data.DataSource({
	   data : [],
	   aggregate: [ 	          
		          { field: "eqcostCategory", aggregate: "count" },
		          { field: "requestedTotalMoney", aggregate: "sum" },
		          { field: "eqcostTotalMoney", aggregate: "sum" }
		]
});

function initMergedGrid(){
	mergedDataSource.data([]);
	if(requestDataItem && requestDataItem.eqcostList){
	var itemData = requestDataItem.eqcostList;
	var data = eval(kendo.stringify(itemData));
	while(mergedDataSource.at(0)){
		mergedDataSource.remove(mergedDataSource.at(0));
	}
	
	for(i=0; i<data.length; i++){
		
		var find = false;
		var mdata = mergedDataSource.data();
		var eqcostApplyAmount = 0;
		var requestedTotalMoney = 0;
		for(j=0; j<mdata.length; j++){	
			if(mdata[j].eqcostProductName == data[i].eqcostProductName
					&& mdata[j].eqcostMaterialCode == data[i].eqcostMaterialCode
					&& mdata[j].eqcostProductType == data[i].eqcostProductType
					&& mdata[j].eqcostUnit == data[i].eqcostUnit && mdata[j].eqcostProductUnitPrice == data[i].eqcostProductUnitPrice
					&& mdata[j].eqcostBrand == data[i].eqcostBrand)
			{				
				find =true;
				break;
			}
		}
		
		if(!find){
			data[i].eqcostApplyAmount=0;
			data[i].requestedTotalMoney=0;
			data[i].eqcostTotalMoney=0;
			mergedDataSource.add(data[i]);
		}
	}

	var sumData = eval(kendo.stringify(itemData));
	var mdata = mergedDataSource.data();
	for(j=0; j<mdata.length; j++){	
		for(i=0; i<sumData.length; i++){
				
			if(mdata[j].eqcostProductName == sumData[i].eqcostProductName
					&& mdata[j].eqcostMaterialCode == sumData[i].eqcostMaterialCode
					&& mdata[j].eqcostProductType == sumData[i].eqcostProductType
					&& mdata[j].eqcostUnit == sumData[i].eqcostUnit && mdata[j].eqcostProductUnitPrice == sumData[i].eqcostProductUnitPrice
					&& mdata[j].eqcostBrand == sumData[i].eqcostBrand)
			{			
				mdata[j].eqcostApplyAmount = mdata[j].eqcostApplyAmount + sumData[i].eqcostApplyAmount;
				mdata[j].requestedTotalMoney = mdata[j].requestedTotalMoney + sumData[i].requestedTotalMoney;
				mdata[j].eqcostTotalMoney = mdata[j].eqcostTotalMoney + sumData[i].eqcostTotalMoney;
			}
		}

	}
	
	if($("#merged-grid").data("kendoGrid")){
		var mgrid = $("#merged-grid").data("kendoGrid");
		mgrid.refresh();
	}

	
//	if (!$("#merged-grid").data("kendoGrid")) {
		$("#merged-grid").kendoGrid({
			dataSource : mergedDataSource,
			columns : [ {
				field : "eqcostMaterialCode",
				title : "物料代码"
			}, {
				field : "eqcostProductName",
				title : "名称"
			}, {
				field : "eqcostProductType",
				title : "型号"
			}, {
				field : "eqcostUnit",
				title : "单位"
			}, {
				field : "eqcostProductUnitPrice",
				title : "采购单价",
				template : function(dataItem){
					return percentToFixed(dataItem.eqcostProductUnitPrice);
				}
			}, {
				field : "eqcostApplyAmount",
				title : "申请总数"
			},{
				field : "requestedTotalMoney",
				title : "总价",
				template : function(dataItem){
					return percentToFixed(dataItem.requestedTotalMoney);
				},
				footerTemplate: function(dataItem){
					return percentToFixed(dataItem.requestedTotalMoney.sum);
				}
			},{
				field : "eqcostBrand",
				title : "品牌"
			}],
			sortable: true
			
		});
//	}
	}
}



function sumOrders(e) {

	var data = itemDataSource.data();
	requestDataItem.eqcostList = data;

	var eqcostApplyAmount = e.model.eqcostApplyAmount;
	var eqcostProductUnitPrice = e.model.eqcostProductUnitPrice;


	if (e.values.eqcostProductUnitPrice) {
		eqcostProductUnitPrice = e.values.eqcostProductUnitPrice
	}

	if (e.values.eqcostApplyAmount) {
		eqcostApplyAmount = e.values.eqcostApplyAmount
	}

	var grid1 = $("#purchasecontract-edit-grid").data("kendoGrid");
	// will trigger dataBound event
	e.model.set("requestedTotalMoney", eqcostProductUnitPrice * eqcostApplyAmount);
	
	
	var eqcostLastBasePrice = e.model.eqcostLastBasePrice;
	e.model.set("eqcostTotalMoney", eqcostLastBasePrice * eqcostApplyAmount);

	console.log(e.model);
	grid1.refresh();

}

function categoryDropDownEditor(container, options) {
	var data = [ {
		name : "直发现场"
	}, {
		name : "上海仓库"
	} ];

	$('<input required data-text-field="name" data-value-field="name" data-bind="value:'
					+ options.field + '"/>').appendTo(container)
			.kendoDropDownList({
				autoBind : true,
				dataSource : data
			});
}

function cancel(){
	loadPage("purchasecontract_purchasecontract");
}



function approvePurCon(){
	var param = {
			"_id" : requestDataItem._id,
			"approveComment" : $("#approve-comment").val()
		};
	postAjaxRequest(approveUrl, param, function(data){
		loadPage("purchasecontract_purchasecontract");
	});
}

function rejectPurCon(){
	var param = {
			"_id" : requestDataItem._id,
			"approveComment" : $("#approve-comment").val()
		};
	postAjaxRequest(rejectUrl, param, function(data){
		loadPage("purchasecontract_purchasecontract");
	});
}

