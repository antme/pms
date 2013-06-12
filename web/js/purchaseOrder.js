var url = "/service/purcontract/order/list";
var approveUrl = "/service/purcontract/order/approve";
var rejectUrl = "/service/purcontract/order/reject";

// 外面列表页的datasource对象
var dataSource = new kendo.data.DataSource({
	transport : {
		read : {
			url : url,
			dataType : "jsonp"
		}
	},
	pageSize : 20
});

$(document).ready(function() {
	checkRoles();
	
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

			columns : [ {
				field : "purchaseOrderCode",
				title : "订单编号"
			}, {
				field : "projectContractCode",
				title : "客户合同编号"
			}, {
				field : "purchaseRequestCode",
				title : "采购申请编号"
			}, {
				field : "backRequestCode",
				title : "备货申请编号"
			}, {
				field : "salesContractCode",
				title : "销售合同编号"
			}, {
				field : "customerName",
				title : "客户名"
			}, {
				field : "projectManager",
				title : "PM"
			}, {
				field : "status",
				title : "订单状态"
			}, {
				field : "approvedDate",
				title : "批准时间"
			}, {
				field : "requestedTotalMoney",
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

	var row = getSelectedRowDataByGridWithMsg("grid");
	if (row) {
		var param = {
			_id : row._id
		};
		postAjaxRequest(approveUrl, param,
				approveStatusCheck);

	}

}

function reject() {

	var row = getSelectedRowDataByGridWithMsg("grid");
	if (row) {
		var param = {
			"_id" : row._id
		};
		postAjaxRequest(rejectUrl, param,
				approveStatusCheck);

	}
}

function add(){
	loadPage("html/purchasecontract/purchaseOrderEdit.html");
}

function edit() {
	// 如果是从订单列表页点击edit过来的数据
	var row = getSelectedRowDataByGrid("grid");
	loadPage("html/purchasecontract/purchaseOrderEdit.html", {
		_id : row._id
	});
}
