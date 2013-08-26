var editUrl = "/service/arrivalNotice/order/eqlist";
var saveUrl =  "/service/arrivalNotice/create/byorder";

// 声明一个总的对象用来传递数据
var requestDataItem = undefined;

$(document).ready(function() {
	
	postAjaxRequest(editUrl, popupParams, edit);
	
});

var model = kendo.data.Model.define({
	id : "_id",
	fields : {
		eqcostAvailableAmount : {
			type : "number"
		},
		pbPlanDate:{type:"date"},
		pbDepartment:{
			
		},
		eqcostArrivalAmount : {
			validation : {
				min : 0
			},
			type : "number"
		},
		eqcostApplyAmount : {
			editable : false,
			type : "number"
		},
		eqcostBasePrice : {
			type : "number",
			editable : false
		},
		eqcostRealAmount : {
			editable : false,
			type : "number"
		},
		eqcostProductUnitPrice : {
			editable : false,
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
		pbTotalCount :{
			editable : false
		},
		pbLeftCount : {
			editable : false
		},
		orderEqcostName : {

		},
		eqcostDeliveryType: {
			defaultValue : "入公司库"
		},
		
		orderEqcostModel : {

		},
		comment : {

		},
		eqcostList: {}
	}
});

//编辑页面数据同步对象
var itemDataSource = new kendo.data.DataSource({
	transport : {
		update : {
			url : saveUrl,
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

// 计算成本数据的datasouce
var sumDataSource = new kendo.data.DataSource({

});

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
	if (e.values.eqcostArrivalAmount) {
		
		if(e.values.eqcostArrivalAmount > e.model.eqcostArrivalAmount){
			alert("最多可以到货" + e.model.eqcostArrivalAmount);
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
		requestDataItem = data;
	}

	requestDataItem = new model(requestDataItem);

	// 渲染成本编辑列表
	itemDataSource.data(requestDataItem.eqcostList);

	requestDataItem.set("pbPlanDate", kendo.toString(requestDataItem.pbPlanDate, 'd'));
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
								title : "序号"
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
								field : "eqcostRealAmount",
								title : "合同中总数"
							}, {
								field : "eqcostBasePrice",
								title : "成本单价"
							}, {
								field : "eqcostContractTotalMoney",
								title : "合同总价"
							}, {
								field : "eqcostApplyAmount",
								title : "本次采购数量"
							}, {
								field : "arrivedRequestCount",
								title : "已到货"
							},{
								field : "eqcostProductUnitPrice",
								title : "采购单价"
							}, {
								field : "requestedTotalMoney",
								title : "采购总价"
							}, {
								field : "eqcostArrivalAmount",
								title : "本次到货",
								template : function(dataItem){
									return '<span class="edit-tip">' + dataItem.eqcostArrivalAmount + '</span>';
								}
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

									if (!item.eqcostArrivalAmount) {
										item.eqcostArrivalAmount = 0;
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

									item.differenceAmount = item.eqcostApplyAmount
											* item.eqcostProductUnitPrice
											- item.eqcostRealAmount
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

								if (eqcostRealAmount != 0) {
									totalPercent = (total / eqcostRealAmount) * 100;
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

function closeWindow() {
	var window = $("#popup");
	window.data("kendoWindow").close();
}

function submitNotice() {
	if(itemDataSource.at(0)){		
		//force set haschanges = true
		itemDataSource.at(0).set("uid", kendo.guid());
	}
	// 同步数据
	itemDataSource.sync();
	alert("到货通知已生产");
	closeWindow();
}
