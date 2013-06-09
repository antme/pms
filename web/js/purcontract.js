
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

	$("#grid").kendoGrid({
		dataSource : dataSource,
		pageable : true,
		selectable : "row",
		dataBound : function(e) {
			kendo.ui.progress($("#grid"), false);
		},
		toolbar : [ {
			template : kendo.template($("#template").html())
		} ],
		columns : [ {
			field : "purchaseContractCode",
			title : "采购合同编号"
		}, {
			field : "customerContractCode",
			title : "客户合同编号"
		}, {
			field : "purchaseRequestCode",
			title : "采购申请编号"
		}, {
			field : "orderCode",
			title : "采购订单编号"

		}, {
			field : "customerName",
			title : "客户名"
		}, {
			field : "projectManager",
			title : "PM"
		}, {
			field : "processStauts",
			title : "采购合同状态"
		}, {
			field : "signDate",
			title : "合同签署时间"
		}, {
			field : "contractMoney",
			title : "金额"
		}, {
			field : "type",
			title : "物流类型"
		}, {
			field : "supplierName",
			title : "供应商名"
		}, {
			field : "supplierId",
			title : "供应商编号"
		}]

	});
});

function add() {
	loadPage("purchasecontractedit");

}

function edit(){
	// 如果是从订单列表页点击edit过来的数据
	var row = getSelectedRowDataByGrid("grid");

	loadPage("purchasecontractedit",  {
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


