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
	serverFiltering : true
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
			title : "采购合同编号",
			template : function(dataItem) {
				return '<a  onclick="openPurchaseContractViewWindow(\'' + dataItem._id + '\');">' + dataItem.purchaseContractCode + '</a>';
			}
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
			field : "contractMoney",
			title : "合同金额"
		}, {
			field : "eqcostDeliveryType",
			title : "货物递送方式"
		}, {
			field : "purchaseContractType",
			title : "采购类型"
		}]

	});
});


function add() {
	loadPage("purchasecontract_purchasecontractedit");
}

function editCon() {
	// 如果是从订单列表页点击edit过来的数据
	var row = getSelectedRowDataByGrid("grid");

	if (row) {
		if (row.status == "审批通过") {
			alert("申请已审批通过，不能编辑");
		} else if (row.status == "已锁定") {
			alert("数据已锁定，不能编辑");
		} else {
			loadPage("purchasecontract_purchasecontractedit", {
				_id : row._id
			});
		}

	}
}


function approveCon() {
	var row = getSelectedRowDataByGridWithMsg("grid");
	if (row) {
		if(row.status == "审批中"){
			process(approveUrl);
		}else{
			alert("此数据状态不需要审批");
		}
	}
}

function rejectCon() {
	
	var row = getSelectedRowDataByGridWithMsg("grid");
	if (row) {
		if(row.status == "审批中"){
			process(rejectUrl);
		}else{
			alert("此数据状态不能拒绝");
		}
	}
	
}

var rowId = undefined;
function addPOBumber(){
	var row = getSelectedRowDataByGridWithMsg("grid");
	if (row) {
		if (row.purchaseContractType == "北京代采") {

			var options = {
				width : 500,
				height : 200,
				actions : [ "Maximize", "Close" ]
			};
			$("#ponum").kendoWindow({
				width : options.width,
				height : options.height,
				title : options.title
			});

			kendoWindow = $("#ponum").data("kendoWindow");
			kendoWindow.open();
			kendoWindow.center();
			rowId = row._id;
			if(row.poNumber){
				$("#poNumber").val(row.poNumber);
			}else{
				$("#poNumber").val("");
			}
		}else{
			alert("只能针对北京代采的采购合同补填PO号");
		}
	}
	
}

function submitPo() {
	if (rowId) {
		var poNumer = $("#poNumber").val();
		postAjaxRequest("/service/purcontract/po", {
			_id : rowId,
			poNumber : poNumer
		}, function(data) {

			var kendoWindow = $("#ponum").data("kendoWindow");
			kendoWindow.close();
		});

	}
}





