
//添加采购申请的时候先选择备货申请
var selectUrl = "/service/purcontract/request/select/list";
var editUrl = "/service/purcontract/order/get";
var saveUrl =  "/service/purcontract/order/update";
var addUrl =  "/service/purcontract/order/add";
var getSelectUrl = "/service/purcontract/request/get";



//抽象model对象， datasource对象必须绑定一个model为了方便解析parameterMap中需要提交的参数
var model = kendo.data.Model.define({
	id : "_id",
	fields : {
		eqcostAvailableAmount : {
			type : "number"
		},

		eqcostApplyAmount : {
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
		},
		eqcostNo : {
			editable : false
		},
		eqcostMaterialCode :{
			editable : false
		},
		
		eqcostProductType :{
			editable : false
		}
	}
});

// 声明一个总的对象用来传递数据
var requestDataItem = undefined;

//申明选择采购申请的id
var selectedRequestId = undefined;

$(document).ready(function() {

	if (redirectParams) {
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
				}
			},
			// 当用户选择不同的采购申请时候赋值给requestDataItem对象
			select : function(e) {
				selectedRequestId = this.dataSource.at(e.item.index())._id;
			}
		});

	}
});

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
	// // 新增，所以设置_id为空
	requestDataItem._id="";
	edit();
}

function submitOrder(status) {
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
	// 同步数据
	itemDataSource.sync();

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

	if (e.values.requestedTotalMoney) {
		eqcostProductUnitPrice = e.values.eqcostProductUnitPrice
	}

	if (e.values.eqcostApplyAmount) {
		eqcostApplyAmount = e.values.eqcostApplyAmount
	}

	var grid1 = $("#purchaseorder-edit-grid").data("kendoGrid");
	// will trigger dataBound event
	e.model.set("eqcostContractTotalMoney", eqcostBasePrice * eqcostApplyAmount);
	e.model.set("requestedTotalMoney", eqcostProductUnitPrice * eqcostApplyAmount);

	grid1.refresh();

}

function edit(data) {

	// 初始化空对象
	if (data) {
		$("#purchase-request-select").hide();
		requestDataItem = data;
	}

	requestDataItem = new model(requestDataItem);

	// 渲染成本编辑列表
	itemDataSource.data(requestDataItem.eqcostList);

	
	kendo.bind($("#purchaseorder-edit-item"), requestDataItem);
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
								field : "eqcostMaterialCode",
								title : "物料代码"
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
								field : "eqcostApplyAmount",
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

									if (!item.eqcostApplyAmount) {
										item.eqcostApplyAmount = 0;
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
									total = total + item.eqcostApplyAmount;
									eqcostAmount = eqcostAmount
											+ item.eqcostAmount;

									requestActureMoney = requestActureMoney
											+ item.eqcostApplyAmount
											* item.eqcostProductUnitPrice;
									item.requestedTotalMoney = item.eqcostApplyAmount
											* item.eqcostProductUnitPrice;

									eqcostContractTotalMoney = eqcostContractTotalMoney
											+ item.eqcostApplyAmount
											* item.eqcostBasePrice;
									item.eqcostContractTotalMoney = item.eqcostApplyAmount
											* item.eqcostBasePrice;

									item.differenceAmount = item.eqcostApplyAmount
											* item.eqcostProductUnitPrice
											- item.eqcostApplyAmount
											* item.eqcostBasePrice;

									if ( requestedTotalMoney != item.requestedTotalMoney
											|| itemDifferenceAmount != item.differenceAmount) {
										refresh = true;
									}

								}

								if (refresh) {
									var grid1 = $("#purchaseorder-edit-grid").data("kendoGrid");
									console.log("========= refresh");
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
