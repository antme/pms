var listUrl = "/service/purcontract/order/list";
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
			pageable : true, resizable: true,
			selectable : "row",
			sortable : true,
			width : "1000px",
			height: "400px",
			filterable : filterable,
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
				field : "contractCode",
				title : "销售合同编号",
				template : function(dataItem) {
					return '<a  onclick="openSCViewWindow(\'' + dataItem.scId + '\');">' + dataItem.contractCode + '</a>';
				}
			}, {
				field : "projectName",
				title : "项目名"
			}, {
				field : "purchaseContractCode",
				title : "采购合同编号",
				template : function(dataItem) {
					if(dataItem.purchaseContractCode){
						return '<a  onclick="openPurchaseContractViewWindow(\'' + dataItem.purchaseContractId + '\');">' + dataItem.purchaseContractCode + '</a>';
					}else{
						return "";
					}
				}
			},{
				field : "customerName",
				title : "客户名"
			}, {
				field : "projectManagerName",
				title : "PM"
			}, {
				field : "status",
				title : "订单状态"
			}, {
				field : "requestedTotalMoney",
				title : "金额",
				width:100,
				template: function(dataItem){
					return "<span style='float:right'>" + kendo.toString(dataItem.requestedTotalMoney, "c") + "</span>";
				}
					
			},{
				field : "eqcostDeliveryType",
				title : "货物递送方式"
			} ]

		});

	}

});


function add(){
	loadPage("purchasecontract_purchaseOrderEdit");
}

function editOr() {
	// 如果是从订单列表页点击edit过来的数据
	var row = getSelectedRowDataByGrid("grid");
	
	if (row) {
		if (row.status == "草稿" || row.status == "废除待审批" || row.status == "审批拒绝") {
			loadPage("purchasecontract_purchaseOrderEdit", {
				_id : row._id
			});
		} else {
			alert("只能编辑草稿数据");
	
		}

	}

}

function cancelOrder() {
	var row = getSelectedRowDataByGridWithMsg("grid");
	if (row) {
		if (row.status == "草稿" || (row.status == "已提交" && !row.purchaseContractId)) {
			if(confirm("此成本清单将退回到备货申请中，相关的采购申请也一并退回，是否退回？")){
				postAjaxRequest("/service/purcontract/order/cancel", {
					_id : row._id
				}, function(data) {
					listDataSource.read();
				});
			}
			
		} else {
			alert("只能回退未发采购合同的订单, 如果已发采购合同，请从采购合同退回");
		}
	}

}


function backOrderToSc() {

	
	var row = getSelectedRowDataByGridWithMsg("grid");
	if (row) {
		if (row.status == "草稿" || (row.status == "已提交" && !row.purchaseContractId)) {
			if(confirm("此成本清单将退回到成本清单中，相关的采购申请，备货申请也会一并退回，是否退回？")){

			
				postAjaxRequest("/service/purcontract/order/backtosc", {
					_id : row._id
				}, function(data) {
					listDataSource.read();
				});
			
			}
			
			
		} else {
			alert("只能回退未发采购合同的订单, 如果已发采购合同，请从采购合同退回");
		}
	}

}


function approveOrder(){
	var row = getSelectedRowDataByGridWithMsg("grid");
	if (row) {
		if(row.status == "废除待审批"){
			loadPage("purchasecontract_purchaseOrderEdit", {
				_id : row._id,
				pageId: "approve"
			});
		}else {
			alert("不需要审批,只有废除待审批的订单才可以审批");
		}
	}
}

// 生成到货通知
function openArrivalNoticePage() {
	loadPage("execution_addArrivalNotice");

}
