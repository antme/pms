var listUrl = "/service/purcontract/request/list";

if($("#requestApprove").length>0){
	listUrl = "/service/purcontract/request/list?approvePage=approve";
}
var approveUrl = "/service/purcontract/request/approve";
var rejectUrl = "/service/purcontract/request/reject";
var cancelUrl = "/service/purcontract/request/abrogate";

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
				field : "requestedTotalMoney",
				title : "金额"
			}, {
				field : "numbersPercentOfContract",
				title : "货品占合同%"
			}, {
				field : "moneyPercentOfContract",
				title : "金额占合同%"
			}]

		});

	}

});

function editRe() {
	// 如果是从订单列表页点击edit过来的数据
	var row = getSelectedRowDataByGridWithMsg("grid");

	if (row) {
		if (row.purchaseOrderId) {
			alert("不允许编辑!");
		}else if(row.status == "已废除"){
			alert("此采购申请已废除，不允许编辑!");
		} else if(row.status == "已提交"){
			alert("此采购申请已提交，不允许编辑!");
		}else {
			loadPage("purchasecontract_purchaseRequestEdit", {
				_id : row._id
			});
		}
	}
}

function abrogatePurchaseRequest() {
	var row = getSelectedRowDataByGridWithMsg("grid");
	if (row) {
		if(row.status == "已提交" || row.status == "草稿" || row.status == "审批拒绝" || row.status == "审批中"){
			postAjaxRequest(cancelUrl, {
				_id : row._id
			}, function(data) {
				listDataSource.read();
			});
		}else {
			alert("只能废除未发采购订单的数据或则已提交的数据");
		}
	}
}

function approveRe() {
	var row = getSelectedRowDataByGridWithMsg("grid");
	if (row) {
		if(row.status == "废除待审批"){
			loadPage("purchasecontract_purchaseRequestEdit", {
				_id : row._id,
				pageId: "approve"
			});
		}else{
			alert('只能审批 "废除待审批" 的状态');
		}
	}
}


function add(){
	loadPage("purchasecontract_purchaseRequestEdit");
}


