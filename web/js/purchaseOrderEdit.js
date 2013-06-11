//抽象model对象， datasource对象必须绑定一个model为了方便解析parameterMap中需要提交的参数
var model = kendo.data.Model.define({
	id : "_id",
	fields : {
		eqcostAvailableAmount : {
			type : "number"
		},

		eqcostRequestedAmount : {
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
		eqcostProductUnitPrice : {
			type : "number"
		},
		requestedTotalMoney : {
			editable : false
		},
		eqcostContractTotalMoney : {
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

// 声明一个总的对象用来传递数据
var requestDataItem;

$(document).ready(function() {
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

			if (redirectParams) {
				postAjaxRequest("/service/purcontract/order/get",
						redirectParams, edit);
			}
});

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
	batch : true,
	schema : {
		model : model
	}
});

function checkStatus(data) {
	loadPage("purchaseorder", null);
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

	if (!requestDataItem.purchaseOrderCode) {
		requestDataItem.purchaseOrderCode = "";
	}

	// // 新增，所以设置_id为空
	requestDataItem._id="";
	console.log(requestDataItem);
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
	var eqcostRequestedAmount = e.model.eqcostRequestedAmount;
	var eqcostProductUnitPrice = e.model.eqcostProductUnitPrice;

	if (e.values.eqcostBasePrice) {
		eqcostBasePrice = e.values.eqcostBasePrice
	}

	if (e.values.requestedTotalMoney) {
		eqcostProductUnitPrice = e.values.eqcostProductUnitPrice
	}

	if (e.values.eqcostRequestedAmount) {
		eqcostRequestedAmount = e.values.eqcostRequestedAmount
	}

	var grid1 = $("#purchaseorder-edit-grid").data("kendoGrid");
	// will trigger dataBound event
	e.model.set("eqcostContractTotalMoney", eqcostBasePrice * eqcostRequestedAmount);
	e.model.set("requestedTotalMoney", eqcostProductUnitPrice * eqcostRequestedAmount);

	grid1.refresh();

}

function edit(data) {

	// 初始化空对象
	var dataItem = new model();
	if (data) {
		$("#purchase-request-select").hide();
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

	$("#purchaseOrderCode").html(dataItem.purchaseOrderCode);
	$("#projectName").html(dataItem.projectName);
	$("#projectCode").html(dataItem.projectCode);
	$("#projectContractCode").html(dataItem.projectContractCode);
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
								field : "eqcostProductCategory",
								title : "货品类别"
							}, {
								field : "eqcostProductType",
								title : "货品型号"

							}, {
								field : "eqcostAmount",
								title : "合同中总数"
							}, {
								field : "eqcostAvailableAmount",
								title : "可申请数量"
							}, {
								field : "eqcostRequestedAmount",
								title : "本次申请数量"
							}, {
								field : "eqcostBasePrice",
								title : "参考单价"
							}, {
								field : "eqcostContractTotalMoney",
								title : "小计金额"
							}, {
								field : "orderEqcostCode",
								title : "订单货品编号"
							}, {
								field : "orderEqcostName",
								title : "订单货品名"
							}, {
								field : "orderEqcostModel",
								title : "订单货品型号"
							}, {
								field : "eqcostProductUnitPrice",
								title : "订单货品单价"
							}, {
								field : "requestedTotalMoney",
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
								var eqcostContractTotalMoney = 0;

								// 合同中总数
								var eqcostAmount = 0;
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
									
									if (!item.eqcostAmount) {
										item.eqcostAmount = 0;
									}

									if (!item.eqcostRequestedAmount) {
										item.eqcostRequestedAmount = 0;
									}

									if (!item.eqcostProductUnitPrice) {
										item.eqcostProductUnitPrice = 0;
									}

									if (!item.differenceAmount) {
										item.differenceAmount = 0;
									}

									if (!item.eqcostBasePrice) {
										item.eqcostBasePrice = 0;
									}
									
									var requestedTotalMoney = item.requestedTotalMoney;
									var itemDifferenceAmount = item.differenceAmount;

									// 计算总的申请数量
									total = total + item.eqcostRequestedAmount;
									eqcostAmount = eqcostAmount
											+ item.eqcostAmount;

									requestActureMoney = requestActureMoney
											+ item.eqcostRequestedAmount
											* item.eqcostProductUnitPrice;
									item.requestedTotalMoney = item.eqcostRequestedAmount
											* item.eqcostProductUnitPrice;

									eqcostContractTotalMoney = eqcostContractTotalMoney
											+ item.eqcostRequestedAmount
											* item.eqcostBasePrice;
									item.eqcostContractTotalMoney = item.eqcostRequestedAmount
											* item.eqcostBasePrice;

									item.differenceAmount = item.eqcostRequestedAmount
											* item.eqcostProductUnitPrice
											- item.eqcostRequestedAmount
											* item.eqcostBasePrice;

									if ( requestedTotalMoney != item.requestedTotalMoney
											|| itemDifferenceAmount != item.differenceAmount) {
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

								if (eqcostAmount != 0) {
									totalPercent = (total / eqcostAmount) * 100;
								}

								var requestActureMoneyPercent = 0;

								if (eqcostContractTotalMoney != 0) {
									requestActureMoneyPercent = (requestActureMoney / eqcostContractTotalMoney) * 100;
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
								kendoGrid = $("#purchaseorder-sum-grid").data(
										"kendoGrid");
								kendoGrid.setDataSource(sumDataSource);

							}

						});
	}

}
