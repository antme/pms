var listUrl = "/service/purcontract/request/list";

if($("#requestApprove").length>0){
	listUrl = "/service/purcontract/request/list?approvePage=approve";
}
var approveUrl = "/service/purcontract/request/approve";
var rejectUrl = "/service/purcontract/request/reject";
var cancelUrl = "/service/purcontract/request/cancel";

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
		    sortable : true,
			filterable : filterable,
			height: "400px",
			selectable : "row",
			columns : [ {
				field : "purchaseRequestCode",
				title : "采购申请编号",
				template : function(dataItem) {
					return '<a  onclick="openPurchaseRequestViewWindow(\'' + dataItem._id + '\');">' + dataItem.purchaseRequestCode + '</a>';
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
			},  {
				field : "purchaseOrderCode",
				title : "订单编号"
			}, {
				field : "projectName",
				title : "项目名",
				template : function(dataItem) {
					return '<a  onclick="openProjectViewWindow(\'' + dataItem.projectId + '\');">' + dataItem.projectName + '</a>';
				}
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
				field : "numbersPercentOfContract",
				title : "合同下已申请采购货品%"
			}, {
				field : "moneyPercentOfContract",
				title : "合同下已申请采购金额%"
			} ]

		});

	}

});

function editRe() {
	console.log(".................");
	// 如果是从订单列表页点击edit过来的数据
	var row = getSelectedRowDataByGridWithMsg("grid");

	console.log(row);
	if (row) {
		if (row.status == "审批通过") {
			alert("已审批通过，不允许编辑, 请先废止再编辑!");
		} else {
			loadPage("html/purchasecontract/purchaseRequestEdit.html", {
				_id : row._id
			});
		}
	}
}

function add(){
	loadPage("html/purchasecontract/purchaseRequestEdit.html");
}


