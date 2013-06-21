var listUrl = "/service/purcontract/order/list";
var approveUrl = "/service/purcontract/order/approve";
var rejectUrl = "/service/purcontract/order/reject";

// 外面列表页的datasource对象
var dataSource = new kendo.data.DataSource({
	transport : {
		read : {
			url : listUrl,
			dataType : "jsonp"
		}
	},
	schema : {
		total: "total", // total is returned in the "total" field of the response
		data: "data"
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
			sortable : true,
			width : "1000px",
			columns : [ {
				field : "purchaseOrderCode",
				title : "订单编号"
			}, {
				field : "salesContractCode",
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
				field : "numbersPercentOfContract",
				title : "合同下已申请采购货品%"
			}, {
				field : "moneyPercentOfContract",
				title : "合同下已申请采购金额%"
			} ]

		});

	}

});


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
