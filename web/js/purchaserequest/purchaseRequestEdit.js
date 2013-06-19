//添加采购申请的时候先选择备货申请
var selectBackUrl = "/service/purcontract/back/select/list";
var editUrl = "/service/purcontract/request/get";
var saveUrl =  "/service/purcontract/request/update";
var addUrl =  "/service/purcontract/request/add";
var getSelectUrl = "/service/purcontract/back/get";

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
		eqcostProductType: {
			editable : false
		},
		eqcostAvailableAmount: {
			editable : false
		},
		comment : {
			
		}
	}
});

// 声明一个总的对象用来传递数据
var requestDataItem = undefined;

//申明选择备货申请的id
var selectBackId = undefined;


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


//计算成本数据的datasouce
var sumDataSource = new kendo.data.DataSource({

});


$(document).ready(function() {

	console.log(popupParams);
	
	// 如果是编辑
	if (redirectParams || popupParams) {
		$("#purchase-back-select").hide();
		$("#purchase-request-edit-item").show();
		
		if(popupParams){
			postAjaxRequest(editUrl, popupParams, edit);
			disableAllInPoppup();
		}else{
			postAjaxRequest(editUrl, redirectParams, edit);
		}
	} else {
		$("#purchase-back-select").show();
		$("#purchase-request-edit-item").hide();
		//如果是新增
		$("#purchaseBackSelect").kendoDropDownList({
			dataTextField : "pbCode",
			dataValueField : "_id",
			dataSource : {
				transport : {
					read : {
						dataType : "jsonp",
						url : selectBackUrl
					}
				},
				schema : {
					total: "total", // total is returned in the "total" field of the response
					data: "data"
				}
			},
			dataBound : function(e) {
				if (this.dataSource.at(0)) {
					selectBackId = this.dataSource.at(0)._id;
				}
			},
			// 当用户选择不同的采购申请时候赋值给requestDataItem对象
			select : function(e) {
				selectBackId = this.dataSource.at(e.item.index())._id;
			}
		});
	}
});

function checkStatus(data) {
	loadPage("purchaseRequestByAssistant", null);
}


function save(status) {
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
	

	console.log(requestDataItem);
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

	var grid1 = $("#purchase-request-edit-grid").data("kendoGrid");
	// will trigger dataBound event
	e.model.set("eqcostContractTotalMoney", eqcostBasePrice * eqcostApplyAmount);
	e.model.set("requestedTotalMoney", eqcostProductUnitPrice * eqcostApplyAmount);

	grid1.refresh();

}


function selectBackRequest() {
	if (selectBackId) {
		// 服务器查询数据并回调loadBackRequest
		postAjaxRequest(getSelectUrl, { _id : selectBackId }, loadBackRequest);
	} else {
		alert("暂时没有可选的备货申请")
	}
}

function loadBackRequest(data) {
	
	$("#purchase-request-edit-item").show();
	// 把完整的采购申请赋值给requestDataItem
	requestDataItem = data;

	//新增时候初始化数据
	for (i in requestDataItem.eqcostList) {
		requestDataItem.eqcostList[i].eqcostRequestedAmount = requestDataItem.eqcostList[i].backTotalCount;
		requestDataItem.eqcostList[i].eqcostAvailableAmount = requestDataItem.eqcostList[i].eqcostLeftAmount;
		requestDataItem.eqcostList[i].eqcostApplyAmount  = requestDataItem.eqcostList[i].backTotalCount;
		requestDataItem.eqcostList[i].eqcostProductUnitPrice = requestDataItem.eqcostList[i].eqcostBasePrice;
		requestDataItem.eqcostList[i].eqcostApplyAmount = requestDataItem.eqcostList[i].pbTotalCount;
	}
	
	requestDataItem.backRequestId = requestDataItem._id;
	requestDataItem.backRequestCode = requestDataItem.pbCode;
	requestDataItem.salesContractId = requestDataItem.scId;
	requestDataItem.salesContractCode = requestDataItem.scCode;
	
	
	// // 新增，所以设置_id为空
	requestDataItem._id = "";	
	console.log(requestDataItem);
	edit();
}

function edit(data) {

	// 初始化空对象
	if (data) {
		requestDataItem = data;
	}

	requestDataItem = new model(requestDataItem);


	// 渲染成本编辑列表
	itemDataSource.data(requestDataItem.eqcostList);
	kendo.bind($("#purchase-request-edit-item"), requestDataItem);


	var editKendoGrid = $("#purchase-request-edit-grid").data("kendoGrid");
	if (!editKendoGrid) {
		$("#purchase-request-edit-grid")
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
								var kendoGrid = $("#purchase-request-sum-grid")
										.data("kendoGrid");
								if (!kendoGrid) {
									$("#purchase-request-sum-grid").kendoGrid({
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
									var grid1 = $("#purchase-request-edit-grid").data("kendoGrid");
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
								kendoGrid = $("#purchase-request-sum-grid").data(
										"kendoGrid");
								kendoGrid.setDataSource(sumDataSource);

							}

						});
	}

}
