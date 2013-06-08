//抽象model对象， datasource对象必须绑定一个model为了方便解析parameterMap中需要提交的参数
var model = kendo.data.Model.define({
	id : "_id",
	fields : {
		availableAmount : {
			type : "number"
		},

		requestedAmount : {
			type : "number"
		},
		eqcostBasePrice : {
			type : "number",
			editable : false
		},
		eqcostAmount : {
			editable : false,
			type : "number"
		},
		orderGoodsUnitPrice : {
			type : "number"
		},
		orderGoodsTotalMoney : {
			editable : false
		},
		totalMoney : {
			type : "number",
			editable : false
		},
		differenceAmount : {
			type : "number",
			editable : false
		},
		eqcostProductName : {
			editable : false
		}
	}
});

$(document).ready(function() {
			if (redirectParams) {
				postAjaxRequest("/service/purcontract/order/get", redirectParams, edit);
			} else {
				add();
			}
});

// 声明一个总的对象用来传递数据
var requestDataItem;

function add() {

	// 获取采购申请的数据，数据包含了成本清单
	if (!$("#purchaseRequest").data("kendoDropDownList")) {
		$("#purchaseRequest").kendoDropDownList({
			dataTextField : "projectName",
			dataValueField : "_id",
			dataSource : {
				transport : {
					read : {
						dataType : "jsonp",
						url : "/service/purcontract/request/list"
					}
				}
			},

			// 当用户选择不同的采购申请时候赋值给requestDataItem对象
			select : function(e) {
				requestDataItem = this.dataSource.at(e.item.index());
			}
		});
	}

}

var itemDataSource = new kendo.data.DataSource({
	transport : {
		update : {
			url : "/service/purcontract/order/update",
			dataType : "jsonp",
			type : "post"
		},
		create : {
			url : "/service/purcontract/order/add",
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
	schema : {
		model : model
	},
	batch : true
});

function checkStatus(data) {
	console.log(requestDataItem);
	requestDataItem.set("_id", data._id);
}
// 计算成本数据的datasouce
var sumDataSource = new kendo.data.DataSource({

});

function showOrderWindow() {

	// 如果用户用默认的采购申请，select event不会触发， 需要初始化数据
	var kendoGrid = $("#purchaseRequest").data("kendoDropDownList");
	if (!requestDataItem) {
		requestDataItem = kendoGrid.dataSource.at(0);
	}

	if (!requestDataItem.orderCode) {
		requestDataItem.orderCode = "";
	}

	// // 新增，所以设置_id为空
	// requestDataItem.set("_id", "");

	edit();
}

function submitOrder() {
	// 同步数据
	itemDataSource.sync();
}

function sumOrders(e) {

	var data = itemDataSource.data();
	requestDataItem.eqcostList = data;

	var eqcostBasePrice = e.model.eqcostBasePrice;
	var requestedAmount = e.model.requestedAmount;
	var orderGoodsUnitPrice = e.model.orderGoodsUnitPrice;

	if (e.values.eqcostBasePrice) {
		eqcostBasePrice = e.values.eqcostBasePrice
	}

	if (e.values.orderGoodsTotalMoney) {
		orderGoodsUnitPrice = e.values.orderGoodsUnitPrice
	}

	if (e.values.requestedAmount) {
		requestedAmount = e.values.requestedAmount
	}

	var grid1 = $("#purchaseorder-edit-grid").data("kendoGrid");
	// will trigger dataBound event
	e.model.set("totalMoney", eqcostBasePrice * requestedAmount);
	e.model.set("orderGoodsTotalMoney", orderGoodsUnitPrice * requestedAmount);

	grid1.refresh();

}

function edit(data) {

	// 初始化空对象
	var dataItem = new model();
	if (data) {
		requestDataItem = data;
	}
	if (requestDataItem) {
		// 如果是从采购申请选择过来的
		dataItem = requestDataItem;
	}

	// 隐藏选择采购申请
	// $("#purchase-request-select").hide();

	// 渲染成本编辑列表
	itemDataSource.data(dataItem.eqcostList);

	$("#orderCode").html(dataItem.orderCode);
	$("#projectName").html(dataItem.projectName);
	$("#projectCode").html(dataItem.projectCode);
	$("#customerContractCode").html(dataItem.customerContractCode);
	$("#customerRequestContractId").html(dataItem.customerRequestContractId);
	$("#purchaseorder-edit-item").show();

	var editKendoGrid = $("#purchaseorder-edit-grid").data("kendoGrid");
	if (!editKendoGrid) {
		$("#purchaseorder-edit-grid")
				.kendoGrid(
						{
							dataSource : itemDataSource,
							columns : [ {
								field : "eqcostNo",
								title : "货品编号"
							}, {
								field : "eqcostProductName",
								title : "货品名"
							}, {
								field : "goodsType",
								title : "货品类别"
							}, {
								field : "eqcostProductType",
								title : "货品型号"

							}, {
								field : "eqcostAmount",
								title : "合同中总数"
							}, {
								field : "availableAmount",
								title : "可申请数量"
							}, {
								field : "requestedAmount",
								title : "本次申请数量"
							}, {
								field : "eqcostBasePrice",
								title : "参考单价"
							}, {
								field : "totalMoney",
								title : "小计金额"
							}, {
								field : "orderGoodsCode",
								title : "订单货品编号"
							}, {
								field : "orderGoodsName",
								title : "订单货品名"
							}, {
								field : "orderGoodsModel",
								title : "订单货品型号"
							}, {
								field : "orderGoodsUnitPrice",
								title : "订单货品单价"
							}, {
								field : "orderGoodsTotalMoney",
								title : "订单实际小计金额"
							}, {
								field : "differenceAmount",
								title : "金额差值"
							} ],

							editable : true,
							scrollable : true,
							width : "950px",
							save : sumOrders,
							dataBound : function(e) {
								var kendoGrid = $("#purchaseorder-sum-grid")
										.data("kendoGrid");
								if (!kendoGrid) {
									$("#purchaseorder-sum-grid").kendoGrid({
										columns : [ {
											field : "requestedMoney",
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
								var totalMoney = 0;

								// 合同中总数
								var eqcostAmount = 0;
								// 订单实际总价格
								var requestActureMoney = 0;
								var refresh = false;

								for (i = 0; i < data.length; i++) {
									var item = data[i];
									var itemTotalMoney = item.totalMoney;
									var orderGoodsTotalMoney = item.orderGoodsTotalMoney;
									var itemDifferenceAmount = item.differenceAmount;

									if (!item.eqcostAmount) {
										item.eqcostAmount = 0;
									}

									if (!item.requestedAmount) {
										item.requestedAmount = 0;
									}

									if (!item.orderGoodsUnitPrice) {
										item.orderGoodsUnitPrice = 0;
									}

									if (!item.differenceAmount) {
										item.differenceAmount = 0;
									}

									if (!item.eqcostBasePrice) {
										item.eqcostBasePrice = 0;
									}
									// 计算总的申请数量
									total = total + item.requestedAmount;
									eqcostAmount = eqcostAmount
											+ item.eqcostAmount;

									requestActureMoney = requestActureMoney
											+ item.requestedAmount
											* item.orderGoodsUnitPrice;
									item.orderGoodsTotalMoney = item.requestedAmount
											* item.orderGoodsUnitPrice;

									totalMoney = totalMoney
											+ item.requestedAmount
											* item.eqcostBasePrice;
									item.totalMoney = item.requestedAmount
											* item.eqcostBasePrice;

									item.differenceAmount = item.requestedAmount
											* item.orderGoodsUnitPrice
											- item.requestedAmount
											* item.eqcostBasePrice;

									if (itemTotalMoney != item.totalMoney
											|| orderGoodsTotalMoney != item.orderGoodsTotalMoney
											|| itemDifferenceAmount != item.differenceAmount) {
										refresh = true;
									}

								}

								if (refresh) {
									var grid1 = $("#purchaseorder-edit-grid")
											.data("kendoGrid");
									grid1.refresh();
								}

								requestDataItem.requestedNumbers = total;
								requestDataItem.orderGoodsTotalMoney = requestActureMoney;

								var totalPercent = 0;

								if (eqcostAmount != 0) {
									totalPercent = (total / eqcostAmount) * 100;
								}

								var requestActureMoneyPercent = 0;

								if (totalMoney != 0) {
									requestActureMoneyPercent = (requestActureMoney / totalMoney) * 100;
								}

								requestDataItem.numbersExists = totalPercent;
								requestDataItem.moneyOfContract = requestActureMoneyPercent;

								sumDataSource.data({});
								sumDataSource
										.add({
											requestedNumbers : total,
											requestedMoney : requestActureMoney,
											numbersPercentOfContract : totalPercent,
											moneyPercentOfContract : requestActureMoneyPercent
										});
								kendoGrid = $("#purchaseorder-sum-grid").data("kendoGrid");
								kendoGrid.setDataSource(sumDataSource);

							}

			});
	}

}
