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
		referenceUnitPrice : {
			type : "number",
			editable : false
		},
		totalInContract : {
			editable : false,
			type : "number"
		},
		orderGoodsUnitPrice : {
			type : "number"
		},
		orderGoodsTotalMoney: {
			editable : false
		},
		totalMoney: {
			type : "number",
			editable : false
		},
		differenceAmount: {
			type : "number",
			editable : false
		},
		goodsName : {
			editable : false
		}
	}
});

// 外面列表页的datasource对象
var dataSource = new kendo.data.DataSource({
	transport : {
		read : {
			url : "/service/purcontract/order/list",
			dataType : "jsonp"
		},
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
		destroy : {
			url : "/service/purcontract/order/delete",
			dataType : "jsonp",
			type : "post"
		},
		parameterMap : function(options, operation) {
			if (operation !== "read" && options.models) {
				return {
					models : kendo.stringify(options.models)
				};
			}
		},
	},
	pageSize : 20,
	batch : true,

	// 必须绑定一个model为了方便解析parameterMap中需要提交的参数
	schema : {
		model : model
	}
});

$(document).ready(function() {

	// 初始化采购订单列表页
	$("#grid").kendoGrid({
		dataSource : dataSource,
		pageable : true,
		editable : "popup",
		selectable : "row",
		width : "1000px",
		// 自定义toolbar，参见html中模板代码
		toolbar : [ {
			template : kendo.template($("#template").html())
		} ],
		columns : [ {
			field : "orderCode",
			title : "订单编号"
		}, {
			field : "customerContractCode",
			title : "客户合同编号"
		}, {
			field : "purchaseRequestCode",
			title : "采购申请编号"
		}, {
			field : "purchaseContractCode",
			title : "采购合同编号"

		}, {
			field : "customerName",
			title : "客户名"
		}, {
			field : "projectManager",
			title : "PM"
		}, {
			field : "stauts",
			title : "订单状态"
		}, {
			field : "approvedDate",
			title : "批准时间"
		}, {
			field : "orderGoodsTotalMoney",
			title : "金额"
		}, {
			field : "requestedNumbers",
			title : "合同下采购申请单数量"
		}, {
			field : "numbersExists",
			title : "合同下已申请采购货品%"
		}, {
			field : "moneyOfContract",
			title : "合同下已申请采购金额%"
		},

		{
			command : [ {
				text : "Edit",
				// 自定义点击事件
				click : edit
			}, {
				name : "destroy",
				title : "删除",
				text : "删除"
			} ],
			title : "&nbsp;",
			width : "160px"
		} ]

	});
});

// 声明一个总的对象用来传递数据
var requestDataItem;

// 当window弹出的时候
function onRequestSelectWindowActive(e) {

	// 获取采购申请的数据，数据包含了成本清单
	$("#purchaseRequest").kendoDropDownList({
		dataTextField : "projectName",
		dataValueField : "_id",
		dataSource : {
			transport : {
				read : {
					dataType : "jsonp",
					url : "/service/purcontract/request/list",
				}
			}
		},

		// 当用户选择不同的采购申请时候赋值给requestDataItem对象
		select : function(e) {
			requestDataItem = this.dataSource.at(e.item.index());
		}
	});
}


function onWindowClose(){
	
	dataSource.read();
}

// 窗口属性设置
var reoptions = {
	id : "purchaseorder-edit",
	width : "1050px",
	height : "600px",
	title : "采购订单编辑",
	activate : onRequestSelectWindowActive,
	close: onWindowClose
};

function add() {
	$("#purchase-request-select").show();
	$("#purchaseorder-edit-item").hide();
	openWindow(reoptions);
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
				};
			}
		},
		requestEnd : function(e) {
			var response = e.response;
		}
	},
	schema : {
		model : model
	},
	batch : true
});

function checkStatus(data) {

	if (data._id !== "") {
		requestDataItem.set("_id", data._id);
	}
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

	// 新增，所以设置_id为空
	requestDataItem.set("_id", "");
	edit();
}

function submitOrder() {
	// 同步数据
	itemDataSource.sync();
}


function sumOrders(e) {

	var data = itemDataSource.data();
	requestDataItem.orderList = data;

	var referenceUnitPrice = e.model.referenceUnitPrice;
	var requestedAmount = e.model.requestedAmount;
	var orderGoodsUnitPrice = e.model.orderGoodsUnitPrice;

	if (e.values.referenceUnitPrice) {
		referenceUnitPrice = e.values.referenceUnitPrice
	}

	if (e.values.orderGoodsTotalMoney) {
		orderGoodsUnitPrice = e.values.orderGoodsUnitPrice
	}

	if (e.values.requestedAmount) {
		requestedAmount = e.values.requestedAmount
	}
	
	var grid1 = $("#purchaseorder-edit-grid").data("kendoGrid");
	// will trigger dataBound event
	e.model.set("totalMoney", referenceUnitPrice * requestedAmount);
	e.model.set("orderGoodsTotalMoney", orderGoodsUnitPrice * requestedAmount);

	grid1.refresh();

}

function approve() {
	var row = getSelectedRowDataByGrid("grid");
	if (!row) {
		alert("点击列表可以选中数据");
	} else {
		$.ajax({
			url : "/service/purcontract/order/approve",
			success : function(responsetxt) {
				var res;
				eval("res=" + responsetxt);
				if (res.status == "0") {
					alert(res.msg);
				} else {
					alert("审核成功");
					dataSource.read();
				}
			},

			error : function() {
				alert("连接Service失败");
			},

			data : {
				_id : row._id
			},
			method : "post"
		});
	}

}

function reject() {
	var row = getSelectedRowDataByGrid("grid");

	if (!row) {
		alert("点击列表可以选中数据");
	} else {
		$.ajax({
			url : "/service/purcontract/order/reject",
			success : function(responsetxt) {
				var res;
				eval("res=" + responsetxt);
				if (res.status == "0") {
					alert(res.msg);
				} else {
					alert("拒绝成功");
					dataSource.read();
				}
			},

			error : function() {
				alert("连接Service失败");
			},

			data : {
				_id : row._id
			},
			method : "post"
		});
	}
}

function edit(e) {

	// 初始化空对象
	var dataItem = new model();

	if (requestDataItem) {
		// 如果是从采购申请选择过来的
		dataItem = requestDataItem;
	}

	if (e) {
		// 如果是从订单列表页点击edit过来的数据
		e.preventDefault();
		openWindow(reoptions);
		dataItem = this.dataItem($(e.currentTarget).closest("tr"));
		requestDataItem = dataItem;

		// 隐藏选择采购申请
		$("#purchase-request-select").hide();
	}

	// 渲染成本编辑列表
	itemDataSource.data(dataItem.orderList);

	$("#orderCode").html(dataItem.orderCode);
	$("#projectName").html(dataItem.projectName);
	$("#projectCode").html(dataItem.projectCode);
	$("#customerContractCode").html(dataItem.customerContractCode);
	$("#customerRequestContractId").html(dataItem.customerRequestContractId);

	$("#purchaseorder-edit-item").show();

	var editKendoGrid = $("#purchaseorder-sum-grid").data("kendoGrid");

	if (!editKendoGrid) {
		$("#purchaseorder-edit-grid")
				.kendoGrid(
						{
							dataSource : itemDataSource,
							columns : [ {
								field : "goodsCode",
								title : "货品编号"
							}, {
								field : "goodsName",
								title : "货品名"
							}, {
								field : "goodsType",
								title : "货品类别"
							}, {
								field : "goodsModel",
								title : "货品型号"

							}, {
								field : "totalInContract",
								title : "合同中总数"
							}, {
								field : "availableAmount",
								title : "可申请数量"
							}, {
								field : "requestedAmount",
								title : "本次申请数量"
							}, {
								field : "referenceUnitPrice",
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
								var totalMoney = 0;
								var requestActureMoney = 0;
								var refresh = false;
								
								for (i = 0; i < data.length; i++) {
									var item = data[i];
									var itemTotalMoney = item.totalMoney;
									var orderGoodsTotalMoney = item.orderGoodsTotalMoney;
									var itemDifferenceAmount = 	item.differenceAmount;
;
									//计算总的申请数量
									if (item.requestedAmount) {
										total = total + item.requestedAmount;
									}

									if (item.orderGoodsUnitPrice && item.requestedAmount) {
										requestActureMoney = requestActureMoney
												+ item.requestedAmount
												* item.orderGoodsUnitPrice;
										item.orderGoodsTotalMoney = item.requestedAmount * item.orderGoodsUnitPrice;
										
									}

									if (item.referenceUnitPrice
											&& item.requestedAmount) {
										totalMoney = totalMoney
												+ item.requestedAmount
												* item.referenceUnitPrice;
										item.totalMoney = item.requestedAmount * item.referenceUnitPrice;
									}
									
									item.differenceAmount =  requestActureMoney - totalMoney;	
									
									if (requestActureMoney > 0) {
										totalMoney = requestActureMoney;
									}

																		
									if (itemTotalMoney != item.totalMoney
											|| orderGoodsTotalMoney != item.orderGoodsTotalMoney
											|| itemDifferenceAmount != item.differenceAmount) {
										refresh = true;
									}
									
								}
								
								if(refresh){
									var grid1 = $("#purchaseorder-edit-grid").data("kendoGrid");
									grid1.refresh();							
								}
								
								requestDataItem.requestedNumbers = total;
								requestDataItem.orderGoodsTotalMoney = totalMoney;

								
								sumDataSource.data({});
								sumDataSource.add({
									requestedNumbers : total,
									requestedMoney : totalMoney
								});
								kendoGrid = $("#purchaseorder-sum-grid").data("kendoGrid");
								kendoGrid.setDataSource(sumDataSource);

							}

						});
	}

}
