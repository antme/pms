var listUrl = "/service/purcontract/repository/list";
var approveUrl = "/service/purcontract/repository/confirm";
var deleteUrl = "/service/purcontract/repository/delete";
var cancelUrl = "/service/purcontract/repository/cancel";

// 外面列表页的datasource对象
var dataSource = new kendo.data.DataSource({
	transport : {
		read : {
			url : listUrl,
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
			columns : [ {
				field : "repositoryRequestCode",
				title : "申请编号"
			}, {
				field : "purchaseContractCode",
				title : "采购合同编号"
			}, {
				field : "customerName",
				title : "供应商"
			}, {
				field : "status",
				title : "入库状态"
			}, {
				field : "approvedDate",
				title : "入库时间"
			}, {
				field : "repositoryTotalAmount",
				title : "入库总数"
			} ]

		});

	}

});


function add(){
	loadPage("html/repository/repositoryEdit.html");
}

function edit() {
	// 如果是从订单列表页点击edit过来的数据
	var row = getSelectedRowDataByGrid("grid");
	loadPage("html/repository/repositoryEdit.html", {
		_id : row._id
	});
}
