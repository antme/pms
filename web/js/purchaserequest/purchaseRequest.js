var listUrl = "/service/purcontract/request/list";
var approveUrl = "/service/purcontract/request/approve";
var rejectUrl = "/service/purcontract/request/reject";
var cancelUrl = "/service/purcontract/request/cancel";

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
			columns : [ {
				field : "purchaseRequestCode",
				title : "采购申请编号",
				template : function(dataItem) {
					return '<a  class="k-in" onclick="opRequestViewWindow(\'' + dataItem._id + '\');">' + dataItem.purchaseRequestCode + '</a>';
				}
			}, {
				field : "backRequestCode",
				title : "备货申请编号"
			}, {
				field : "salesContractCode",
				title : "销售合同编号"
			},  {
				field : "purchaseOrderCode",
				title : "订单编号"
			}, {
				field : "projectName",
				title : "项目名"
			}, {
				field : "customerName",
				title : "客户名"
			}, {
				field : "projectManager",
				title : "PM"
			}, {
				field : "status",
				title : "状态"
			}, {
				field : "approvedDate",
				title : "审批时间"
			}, {
				field : "requestedTotalMoney",
				title : "金额"
			}, {
				field : "requestTotalOfCountract",
				title : "合同下采购申请单数量"
			}, {
				field : "allRequestedNumbersOfCountract",
				title : "合同下已申请采购货品%"
			}, {
				field : "totalRequestedMoneyOfContract",
				title : "合同下已申请采购金额%"
			} ]

		});

	}

});

function edit() {
	// 如果是从订单列表页点击edit过来的数据
	var row = getSelectedRowDataByGrid("grid");	
	if(row.status=="审批通过"){
		alert("已审批通过，不允许编辑, 请先废止再编辑!");
	}else{
		loadPage("html/purchasecontract/purchaseRequestEdit.html", {
			_id : row._id
		});
	}
}

function add(){
	loadPage("html/purchasecontract/purchaseRequestEdit.html");
}

function opRequestViewWindow(param){
	var options = { width:"1080px", height: "600px", title:"采购申请信息"};
	openRemotePageWindow(options, "html/purchasecontract/purchaseRequestEdit.html", {_id : param});
}

