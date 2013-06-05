var model = kendo.data.Model.define({
	id : "_id",
	fields : {
		orderId : {
			editable : true
		}
	}
});
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
				console.log(options.models);
				return {
					models : kendo.stringify(options.models)
				};
			}
		},
	},
	pageSize : 20,
	batch : true,
	schema : {
		model : model
	}
});

$(document).ready(function() {

	$("#grid").kendoGrid({
		dataSource : dataSource,
		pageable : true,
		editable : "popup",
		toolbar : [ {
			template : kendo.template($("#template").html())
		} ],
		columns : [ {
			field : "orderId",
			title : "采购订单编号"
		}, {
			field : "customerContractId",
			title : "客户合同编号"
		}, {
			field : "contractRequestId",
			title : "采购申请编号"
		}, {
			field : "purchaseConractId",
			title : "采购合同编号"

		}, {
			field : "customerName",
			title : "客户名"
		}, {
			field : "projectManager",
			title : "PM"
		}, {
			field : "status",
			title : "采购订单状态"
		}, {
			field : "approveDate",
			title : "订单批准时间"
		}, {
			field : "money",
			title : "金额"
		}, {
			field : "number",
			title : "合同下采购申请单数量",
			width : 150
		}, {
			field : "numberExists",
			title : "合同下已申请采购货品%",
			width : 150
		}, {
			field : "numberExistsRequest",
			title : "合同下已申请采购金额%",
			width : 150
		},

		{
			command : [ {
				text : "Edit",
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

var requestDataItem;

function onRequestSelectWindowActive(e) {
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
		select : function(e) {
			requestDataItem = this.dataSource.at(e.item.index());
			console.log(requestDataItem.orderList);
		}
	});

}

var reoptions = {
	id : "purchaseorder-edit",
	width : "1050px",
	height : "600px",
	title : "添加采购申请",
	activate : onRequestSelectWindowActive
};

function add() {
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
					models : kendo.stringify(options.models)
				};
			}
		},
	},
	batch : true

});

var sumDataSource = new kendo.data.DataSource({

});

function showOrderWindow() {
	var kendoGrid = $("#purchaseRequest").data("kendoDropDownList");
	if (!requestDataItem) {
		requestDataItem = kendoGrid.dataSource.at(0);
	}
	itemDataSource.data(requestDataItem.orderList);
	console.log(requestDataItem.orderList);
	edit(null);

}

function submitOrder() {
	var kendoGrid = $("#purchaseRequest").data("kendoDropDownList");
	itemDataSource.sync();

}
function sumOrders(e) {
	var data = itemDataSource.data();
	requestDataItem.orderList = data;
	var kendoGrid = $("#purchaseorder-sum-grid").data("kendoGrid");
	kendoGrid.setDataSource(sumDataSource);
}

function edit(e) {
	var dataItem = new model();
	if (e) {
		e.preventDefault();
		openWindow(reoptions);
		dataItem = this.dataItem($(e.currentTarget).closest("tr"));
	}

	if (requestDataItem) {
		dataItem = requestDataItem;
	}
	kendo.bind($("#purchaseorder-edit"), dataItem);

	$("#orderId").html(dataItem.orderId);
	$("#projectName").html(dataItem.projectName);
	$("#projectCode").html(dataItem.projectCode);
	$("#customerContractId").html(dataItem.customerContractId);
	$("#customerRequestContractId").html(dataItem.customerRequestContractId);

	$("#purchaseorder-edit-item").show();

	$("#purchaseorder-edit-grid").kendoGrid({
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
			field : "purchaseConractId",
			title : "货品型号"

		}, {
			field : "customerName",
			title : "合同中总数"
		}, {
			field : "projectManager",
			title : "可申请数量"
		}, {
			field : "status",
			title : "本次申请数量"
		}, {
			field : "approveDate",
			title : "参考单价"
		}, {
			field : "money",
			title : "申请小计金额"
		}, {
			field : "number",
			title : "订单货品编号"
		}, {
			field : "numberExists",
			title : "订单货品名%"
		}, {
			field : "numberExistsRequest",
			title : "订单货品型号%"
		}, {
			field : "numberExistsRequest1",
			title : "订单货品单价"
		}, {
			field : "numberExistsRequest2",
			title : "订单实际小计金额"
		}, {
			field : "numberExistsRequest3",
			title : "金额差值"
		} ],

		toolbar : [ "create" ],
		editable : true,
		scrollable : true,
		width : "850px",
		edit : sumOrders

	});

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

	var kendoGrid = $("#purchaseorder-sum-grid").data("kendoGrid");
	sumDataSource.data({});
	sumDataSource.add({
		requestedMoney : "0"
	});
	kendoGrid.setDataSource(sumDataSource);

}
