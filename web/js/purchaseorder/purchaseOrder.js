listUrl = "/service/purcontract/order/list";
var approveUrl = "/service/purcontract/order/approve";
var rejectUrl = "/service/purcontract/order/reject";
var cancelUrl = "/service/purcontract/order/cancel";

var gridOptions = {
		transport : {
			read : {
				url : listUrl,
				dataType : "jsonp",
				type : "post"
			},
			//必须放在transport内，mytasks参数来至于点击我的任务
			parameterMap : myTaskQueryParam		
		}
}
gridOptions =  $.extend( gridOptions, commonListOptions);

//外面列表页的datasource对象
var listDataSource = new kendo.data.DataSource(gridOptions);


$(document).ready(function() {
	checkRoles();
	
	if ($("#grid").length > 0) {
		// 初始化采购订单列表页
		$("#grid").kendoGrid({
			dataSource : listDataSource,
			pageable : true,
			selectable : "row",
			sortable : true,
			width : "1000px",
			height: "400px",
			columns : [ {
				field : "purchaseOrderCode",
				title : "订单编号",
				template : function(dataItem) {
					return '<a  onclick="openPurchaseOrderViewWindow(\'' + dataItem._id + '\');">' + dataItem.purchaseOrderCode + '</a>';
				}
					
			}, {
				field : "purchaseRequestCode",
				title : "采购申请编号",
				template : function(dataItem) {
					return '<a  onclick="openPurchaseRequestViewWindow(\'' + dataItem.purchaseRequestId + '\');">' + dataItem.purchaseRequestCode + '</a>';
				}
					
			}, {
				field : "backRequestCode",
				title : "备货申请编号",
				template : function(dataItem) {
					return '<a  onclick="openBackRequestViewWindow(\'' + dataItem.backRequestId + '\');">' + dataItem.backRequestCode + '</a>';
				}
			}, {
				field : "salesContractCode",
				title : "销售合同编号",
				template : function(dataItem) {
					return '<a  onclick="openSCViewWindow(\'' + dataItem.salesContractId + '\');">' + dataItem.salesContractCode + '</a>';
				}
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
				title : "货品占合同%"
			}, {
				field : "moneyPercentOfContract",
				title : "金额占合同%"
			},{
				field : "eqcostDeliveryType",
				title : "货物递送方式"
			} ]

		});

	}

});


function add(){
	loadPage("html/purchasecontract/purchaseOrderEdit.html");
}

function editOr() {
	// 如果是从订单列表页点击edit过来的数据
	var row = getSelectedRowDataByGrid("grid");
	
	if (row) {
		if (row.status == "采购完毕") {
			alert("申请采购完毕，不能编辑");
		} else if (row.status == "已锁定") {
			alert("申请已锁定，不能编辑");
		}else if (row.status == "已中止") {
			alert("申请已中止，不能编辑");
		} else {
			
			loadPage("html/purchasecontract/purchaseOrderEdit.html", {
				_id : row._id
			});
		}

	}

}

function cancelOrder() {
	var row = getSelectedRowDataByGridWithMsg("grid");
	if (row) {
		if(row.status == "草稿" || row.status == "已提交"){
			process(cancelUrl);
		}else {
			alert("不能中止");
		}
	}
}

function approveOrder(){
	var row = getSelectedRowDataByGridWithMsg("grid");
	if (row) {
		if(row.status == "中止申请中"){
			process(approveUrl);
		}else {
			alert("不需要审批");
		}
	}
}

// 生成到货通知
function arrivalNotice() {
	var row = getSelectedRowDataByGridWithMsg("grid");
	if (row) {
		if (row.status == "采购完毕") {
			var param = {
					"foreignKey" : row._id,
					"foreignCode" : row.purchaseOrderCode,
					"shipType" : "直发现场" // 供应商直发
				};
			postAjaxRequest("/service/arrivalNotice/create", param,
						callback);
		} else {
			alert("未采购完毕，不能生成到货通知");
		}
	}
}

function callback(response) {
	alert("到货通知已生成");
	loadPage("html/execution/arrivalNotice.html");
}
