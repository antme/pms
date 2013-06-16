var approveUrl = "/service/purcontract/approve";
var rejectUrl = "/service/purcontract/reject";

var dataSource = new kendo.data.DataSource({
	transport : {
		read : {
			url : "/service/purcontract/list",
			dataType : "jsonp"
		}		
	},
	pageSize : 20
});

$(document).ready(function() {
	checkRoles();
	$("#grid").kendoGrid({
		dataSource : dataSource,
		pageable : true,
		selectable : "row",
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

function edit(){
	// 如果是从订单列表页点击edit过来的数据
	var row = getSelectedRowDataByGrid("grid");

	loadPage("html/purchasecontract/purchasecontractedit.html",  {
		_id : row._id
	});
}






