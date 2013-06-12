
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
		dataBound : function(e) {
			kendo.ui.progress($("#grid"), false);
		},
		columns : [ {
			field : "purchaseContractCode",
			title : "采购合同编号"
		}, {
			field : "projectContractCode",
			title : "客户合同编号"
		}, {
			field : "purchaseRequestCode",
			title : "采购申请编号"
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



function approve() {
	var row = getSelectedRowDataByGridWithMsg("grid");
	if (row) {
		var param = {
			_id : row._id
		};
		postAjaxRequest("/service/purcontract/approve", param,
				approveStatusCheck);

	}

}

function approveStatusCheck(response) {
	alert("审核成功");
	dataSource.read();
}

function reject() {
	var row = getSelectedRowDataByGridWithMsg("grid");
	if (row) {
		var param = {
			"_id" : row._id
		};
		postAjaxRequest("/service/purcontract/reject", param,
				approveStatusCheck);
	}
}


