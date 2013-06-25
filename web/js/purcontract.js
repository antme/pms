var approveUrl = "/service/purcontract/approve";
var rejectUrl = "/service/purcontract/reject";

var listDataSource = new kendo.data.DataSource({
	transport : {
		read : {
			url : "/service/purcontract/list",
			dataType : "jsonp"
		},
		//必须放在transport内，mytasks参数来至于点击我的任务
		parameterMap : myTaskQueryParam

	},
	schema : {
		total: "total", // total is returned in the "total" field of the response
		data: "data"
	},
    pageSize: 10,
	serverPaging: true,
	serverSorting: true,
	serverFiltering : true,
});

$(document).ready(function() {
	checkRoles();
	$("#grid").kendoGrid({
		dataSource : listDataSource,
		pageable : true,
		selectable : "row",
	    sortable : true,
		filterable : filterable,
		height: "400px",
		columns : [ {
			field : "purchaseContractCode",
			title : "采购合同编号"
		},  {
			field : "approvedDate",
			title : "批准时间"
		}, {
			field : "supplierName",
			title : "供应商"
		},{
			field : "status",
			title : "合同状态"
		}, {
			field : "signDate",
			title : "签署时间"
		}, {
			field : "requestedTotalMoney",
			title : "金额"
		}, {
			field : "logisticsType",
			title : "物流类型"
		}]

	});
});


function add() {
	loadPage("html/purchasecontract/purchasecontractedit.html");
}

function editCon(){
	// 如果是从订单列表页点击edit过来的数据
	var row = getSelectedRowDataByGrid("grid");

	loadPage("html/purchasecontract/purchasecontractedit.html",  {
		_id : row._id
	});
}






