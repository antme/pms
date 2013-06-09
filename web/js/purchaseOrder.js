// 外面列表页的datasource对象
var dataSource = new kendo.data.DataSource({
	transport : {
		read : {
			url : "/service/purcontract/order/list",
			dataType : "jsonp"
		}
	},
	pageSize : 20
});

$(document).ready(function() {

	if ($("#grid").length > 0) {
		// 初始化采购订单列表页
		$("#grid").kendoGrid({
			dataSource : dataSource,
			pageable : true,
			selectable : "row",
			width : "1000px",
			dataBound : function(e) {
				kendo.ui.progress($("#grid"), false);
			},
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
				field : "processStauts",
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
			} ]

		});

	}

});

function checkStatus(data) {
	if (data._id !== "") {
		requestDataItem.set("_id", data._id);
	}
}

function approveStatusCheck(response) {
	alert("审核成功");
	dataSource.read();
}
function approve() {
	var row = getSelectedRowDataByGrid("grid");
	if (!row) {
		alert("点击列表可以选中数据");
	} else {
		var param = {
			_id : row._id
		};
		postAjaxRequest("/service/purcontract/order/approve", param,
				approveStatusCheck);

	}

}

function reject() {
	var row = getSelectedRowDataByGrid("grid");

	if (!row) {
		alert("点击列表可以选中数据");
	} else {
		var param = {
			"_id" : row._id
		};
		postAjaxRequest("/service/purcontract/order/reject", param,
				approveStatusCheck);

	}
}

function edit() {
	// 如果是从订单列表页点击edit过来的数据
	var row = getSelectedRowDataByGrid("grid");
	loadPage("purchaseOrderEdit", {
		_id : row._id
	});
}
