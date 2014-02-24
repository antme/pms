
//添加采购申请的时候先选择备货申请
var selectUrl = "/service/purcontract/request/select/list";
editUrl = "/service/purcontract/order/get";
saveUrl =  "/service/purcontract/order/update";
addUrl =  "/service/purcontract/order/add";
var getSelectUrl = "/service/purcontract/request/get";
var approveUrl = "/service/purcontract/order/approve";
var rejectUrl = "/service/purcontract/order/reject";

// 声明一个总的对象用来传递数据
var requestDataItem = undefined;

//申明选择采购申请的id
var selectedRequestId = undefined;

$(document).ready(function() {
	

	if(popupParams){
		$("#purchase-request-select").hide();
		$("#purchaseorder-edit-item").show();
		postAjaxRequest(editUrl, popupParams, edit);
		disableAllInPoppup();
	}else if (redirectParams) {
		$("#purchase-request-select").hide();
		$("#purchaseorder-edit-item").show();

		postAjaxRequest(editUrl, redirectParams, edit);
	} else {
		$("#purchase-request-select").show();
		$("#purchaseorder-edit-item").hide();
		$("#purchaseRequest").kendoDropDownList({
			dataTextField : "purchaseRequestCode",
			dataValueField : "_id",
			dataSource : {
				transport : {
					read : {
						dataType : "jsonp",
						url : selectUrl
					}
				},
				schema : {
					total: "total", // total is returned in the "total" field of the response
					data: "data"
				}
			},

			dataBound : function(e) {
				if (this.dataSource.at(0)) {
					selectedRequestId = this.dataSource.at(0)._id;
				}else{
					alert("暂时没有需要发采购订单的采购申请可选");
				}
			},
			// 当用户选择不同的采购申请时候赋值给requestDataItem对象
			select : function(e) {
				selectedRequestId = this.dataSource.at(e.item.index())._id;
			}
		});

	}
});



function checkStatus(data) {
	loadPage("purchasecontract_purchaseOrder", null);
}



var orderFields = {
	eqcostApplyAmount : {
		editable : false,
		type : "number"
	}

}
orderFields =  $.extend( commonFileds, orderFields);


//编辑页面的model对象
//抽象model对象， datasource对象必须绑定一个model为了方便解析parameterMap中需要提交的参数
var orderModel = kendo.data.Model.define({
	id : "_id",
	fields : orderFields
});

//编辑页面数据同步对象
var itemDataSource = new kendo.data.DataSource({
	transport : {
		update : {
			url : saveUrl,
			dataType : "jsonp",
			type : "post"
		},
		create : {
			url : addUrl,
			dataType : "jsonp",
			type : "post"
		},
		parameterMap : function(options, operation) {
			if (operation !== "read" && options.models) {
				return {
					// 解析成json_p模式
					json_p : kendo.stringify(requestDataItem),
					mycallback : "checkStatus"
				}
			}
		}
	},
	group: { field: "总数", aggregates: [{ field: "总数", aggregate: "count" }]},
	batch : true,
	schema : {
		model : orderModel
	}
});

// 计算成本数据的datasouce
var sumDataSource = new kendo.data.DataSource({

});

function selectRequest() {
	if (selectedRequestId) {
		// 服务器查询数据并回调loadBackRequest
		postAjaxRequest(getSelectUrl, { _id : selectedRequestId }, loadRequest);
	} else {
		alert("暂时没有可选的采购申请")
	}
}

function loadRequest(data){
	requestDataItem = data;
	
	requestDataItem.status = "草稿";
	requestDataItem.purchaseRequestId = requestDataItem._id;
	requestDataItem.comment = "";
	requestDataItem.approveComment = "";
	requestDataItem.approveComment = "";
	requestDataItem.requestedDate = "";
	
	// // 新增，所以设置_id为空
	requestDataItem._id="";
	var eqcostList = requestDataItem.eqcostList;
	for (listIndex in eqcostList) {
		eqcostList[listIndex].eqcostProductUnitPrice = eqcostList[listIndex].eqcostBasePrice;
	}
	
	edit();
}


function sumOrders(e) {

	var data = itemDataSource.data();
	requestDataItem.eqcostList = data;

	var eqcostBasePrice = e.model.eqcostBasePrice;
	var eqcostApplyAmount = e.model.eqcostApplyAmount;
	var eqcostProductUnitPrice = e.model.eqcostProductUnitPrice;

	if (e.values.eqcostBasePrice) {
		eqcostBasePrice = e.values.eqcostBasePrice
	}

	if (e.values.eqcostProductUnitPrice) {
		eqcostProductUnitPrice = e.values.eqcostProductUnitPrice
	}


    var flag = true;
	if (e.values.eqcostApplyAmount) {
		
		if(e.values.eqcostApplyAmount > e.model.orderRequestCount){
			alert("最多可以申请" + e.model.orderRequestCount);
			flag = false;
			e.preventDefault();
		}

	}

	if(flag){

		var grid1 = $("#purchaseorder-edit-grid").data("kendoGrid");
		// will trigger dataBound event
		e.model.set("eqcostContractTotalMoney", eqcostBasePrice * eqcostApplyAmount);
		e.model.set("requestedTotalMoney", eqcostProductUnitPrice * eqcostApplyAmount);
	
		grid1.refresh();
	}

}

function edit(data) {

	// 初始化空对象
	if (data) {
		$("#purchase-request-select").hide();
		requestDataItem = data;
	}
	
	if(!popupParams){
		if(redirectParams && redirectParams.pageId){
			$(".save").hide();
			$(".approve").show();
			$("#approve-comment").show();
		}else{
			$(".approve").hide();
			$(".save").show();
		}
	}
	
	requestDataItem = new model(requestDataItem);

	// 渲染成本编辑列表
	itemDataSource.data(requestDataItem.eqcostList);

	requestDataItem.set("pbPlanDate", kendo.toString(requestDataItem.pbPlanDate, 'd'));
	setDate(requestDataItem, "requestedDate", requestDataItem.requestedDate);

	kendo.bind($("#purchaseorder-edit-item"), requestDataItem);
	$("#purchaseorder-edit-item").show();

	var editKendoGrid = $("#purchaseorder-edit-grid").data("kendoGrid");
	if (!editKendoGrid) {
		$("#purchaseorder-edit-grid")
				.kendoGrid(
						{
							dataSource : itemDataSource,
							columns : [  {
								field : "总数",
								title : "总数",
								hidden: true,
								groupHeaderTemplate: "(总数: #= count#)", 
							}, {
								field : "eqcostMaterialCode",
								title : "物料代码"
							}, {
								field : "eqcostProductName",
								title : "产品名"
							}, {
								field : "eqcostProductType",
								title : "规格型号"
							}, {
								field : "eqcostUnit",
								title : "单位"
							}, {
								field : "eqcostBasePrice",
								title : "成本单价",	
								template : function(dataItem){
									return percentToFixed(dataItem.eqcostBasePrice);
								}
							}, 					
							{ field: "eqcostDiscountRate",title : "折扣率"},
							{ field: "eqcostLastBasePrice",title : "最终成本价",	
								template : function(dataItem){
									return percentToFixed(dataItem.eqcostLastBasePrice);
								}
							},
							{
								field : "eqcostContractTotalMoney",
								title : "合同总价",	
								template : function(dataItem){
									return percentToFixed(dataItem.eqcostContractTotalMoney);
								}
							}, {
								field : "eqcostApplyAmount",
								title : "采购数量",
								template : function(dataItem){
									return '<span class="edit-tip">' + dataItem.eqcostApplyAmount + '</span>';
								}
							},{
								field : "eqcostProductUnitPrice",
								title : "采购单价",
								template : function(dataItem){
									return '<span class="edit-tip">' + percentToFixed(dataItem.eqcostProductUnitPrice) + '</span>';
								}
							},{
								field : "eqcostBrand",
								title : "品牌"
							}, {
								field : "remark",
								title : "备注"
							}, {
								field : "requestedTotalMoney",
								title : "采购总价",	
								template : function(dataItem){
									return percentToFixed(dataItem.requestedTotalMoney);
								}
							}],

							editable : true,
							scrollable : true,
							sortable : true,
							resizable: true,
							width : "950px",
							save : sumOrders,
							dataBound : function(e) {
								var kendoGrid = $("#purchaseorder-sum-grid")
										.data("kendoGrid");
								if (!kendoGrid) {
									$("#purchaseorder-sum-grid").kendoGrid({
										columns : [ {
											field : "requestedTotalMoney",
											title : "申请金额"
										}, {
											field : "requestedNumbers",
											title : "货品数量"
										}, {
											field : "numbersPercentOfContract",
											title : "货品占合同%"
										}, {
											field : "moneyPercentOfContract",
											title : "货品金额占合同%"

										} ],
										width : "200px"

									});
								}
								var data = itemDataSource.data();
								var total = 0;
								// 采购申请总价格
								var eqcostContractTotalMoney = 0;

								// 合同中总数
								var eqcostRealAmount = 0;
								// 订单实际总价格
								var requestActureMoney = 0;
								var refresh = false;

								for (i = 0; i < data.length; i++) {
									var item = data[i];
									if (!item.eqcostContractTotalMoney) {
										item.eqcostContractTotalMoney = 0;
									}
									if (!item.requestedTotalMoney) {
										item.requestedTotalMoney = 0;
									}
									
									if (!item.eqcostRealAmount) {
										item.eqcostRealAmount = 0;
									}

									if (!item.eqcostApplyAmount) {
										item.eqcostApplyAmount = 0;
									}

									if (!item.eqcostProductUnitPrice) {
										item.eqcostProductUnitPrice = 0;
									}


									if (!item.eqcostBasePrice) {
										item.eqcostBasePrice = 0;
									}
									
									var requestedTotalMoney = item.requestedTotalMoney;

									// 计算总的申请数量
									total = total + item.eqcostApplyAmount;
									eqcostRealAmount = eqcostRealAmount
											+ item.eqcostRealAmount;

									requestActureMoney = requestActureMoney
											+ item.eqcostApplyAmount
											* item.eqcostProductUnitPrice;
									item.requestedTotalMoney = item.eqcostApplyAmount
											* item.eqcostProductUnitPrice;

									eqcostContractTotalMoney = eqcostContractTotalMoney
											+ item.eqcostRealAmount
											* item.eqcostBasePrice;
									item.eqcostContractTotalMoney = item.eqcostRealAmount
											* item.eqcostBasePrice;


									if ( requestedTotalMoney != item.requestedTotalMoney) {
										refresh = true;
									}

								}

								if (refresh) {
									var grid1 = $("#purchaseorder-edit-grid").data("kendoGrid");
									grid1.refresh();
								}

								requestDataItem.requestedNumbers = total;
								requestDataItem.requestedTotalMoney = requestActureMoney;

								var totalPercent = 0;

								if (eqcostRealAmount != 0) {
									totalPercent = (total / eqcostRealAmount) * 100;
								}

								var requestActureMoneyPercent = 0;

								if (eqcostContractTotalMoney != 0) {
									requestActureMoneyPercent = (requestActureMoney / eqcostContractTotalMoney) * 100;
								}
								totalPercent = percentToFixed(totalPercent);
								requestActureMoneyPercent = percentToFixed(requestActureMoneyPercent);
								requestDataItem.numbersPercentOfContract = totalPercent;
								requestDataItem.moneyPercentOfContract = requestActureMoneyPercent;
								
								sumDataSource.data({});
								sumDataSource
										.add({
											requestedNumbers : total,
											requestedTotalMoney : requestActureMoney,
											numbersPercentOfContract : totalPercent,
											moneyPercentOfContract : requestActureMoneyPercent
										});
								kendoGrid = $("#purchaseorder-sum-grid").data(
										"kendoGrid");
								kendoGrid.setDataSource(sumDataSource);

							}

						});
	}

}



//保存操作
function saveOrder(status) {
	
	if(requestDataItem.eqcostList　&& requestDataItem.eqcostList.length==0){
		alert("此申请无任何货品");
		return;
	}
	
	if(!requestDataItem.status){
		requestDataItem.status = "草稿";
	}
	
	if(status){
		requestDataItem.status = status;
	}
	
	if(itemDataSource.at(0)){		
		//force set haschanges = true
		itemDataSource.at(0).set("uid", kendo.guid());
	}
	
	if(requestDataItem.applicationDepartment && requestDataItem.applicationDepartment instanceof Object){
		requestDataItem.applicationDepartment = requestDataItem.applicationDepartment.join(",");
	}
	
	
	// 同步数据
	itemDataSource.sync();
}

function cancel(){
	loadPage("purchasecontract_purchaseOrder");
}



function approvePurOrder(){
	var param = {
			"_id" : requestDataItem._id,
			"approveComment" : $("#approve-comment").val()
		};
	postAjaxRequest(approveUrl, param, function(data){
		loadPage("purchasecontract_purchaseOrder");
	});
}

function rejectPurOrder(){
	var param = {
			"_id" : requestDataItem._id,
			"approveComment" : $("#approve-comment").val()
		};
	postAjaxRequest(rejectUrl, param, function(data){
		loadPage("purchasecontract_purchaseOrder");
	});
}
