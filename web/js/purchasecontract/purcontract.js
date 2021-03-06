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
	model : {
		fields : {
			signDate : {
				type : "date"
			}
		}
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
		pageable : true, resizable: true,
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
			title : "供应商",
			template : function(dataItem) {
				
				if(dataItem.contractExecuteCate == "正常采购"){
					return dataItem.supplierName;
				}
					
				return "同方北京";
				
			}
			
		},{
			field : "status",
			title : "合同状态"
		}, {
			field : "signDate",
			title : "签署时间",
			template : function(dataItem) {
				if(dataItem.signDate){
					return dataItem.signDate.split("T")[0];
				}
					
				return "";
				
			}
		}, {
			field : "contractMoney",
			title : "合同金额",
			width:100,
			template: function(dataItem){
				return "<span style='float:right'>" + kendo.toString(dataItem.contractMoney, "c") + "</span>";
			}
		}, {
			field : "eqcostDeliveryType",
			title : "货物递送方式"
		}, {
			field : "purchaseContractType",
			title : "采购类型"
		}]

	});
});


function addCon() {
	loadPage("purchasecontract_purchasecontractedit");
}

function editCon() {
	// 如果是从订单列表页点击edit过来的数据
	var row = getSelectedRowDataByGrid("grid");

	if (row) {
		if (row.status == "草稿" || row.status == "审批拒绝") {
			loadPage("purchasecontract_purchasecontractedit", {
				_id : row._id
			});
		} else {
			alert("只允许编辑草稿和审批决绝的采购合同");
		} 

	}
}


function approveCon() {
	var row = getSelectedRowDataByGridWithMsg("grid");
	if (row) {
		if(row.status == "审批中"){
			loadPage("purchasecontract_purchasecontractedit", {
				_id : row._id,
				pageId : "approve"
			});
		}else{
			alert("只允许审核审批中的数据");
		}
	}
}

function backCon(){
	var row = getSelectedRowDataByGridWithMsg("grid");
	if (row) {
		if(row.status == "审批拒绝" || row.status == "草稿" || row.status == "审批中"){
			if(confirm("此成本清单将退回到备货申请中，相关的采购订单，采购申请也一并退回，是否退回？")){
				postAjaxRequest("/service/purcontract/backtoorder", {
					_id : row._id
				}, function(data) {
					listDataSource.read();
				});
			
			}
		}else{
			alert("只能退回草稿，审批中，审核拒绝的采购合同");
		}
	}
}

function backConToSc(){
	var row = getSelectedRowDataByGridWithMsg("grid");
	if (row) {
		if(row.status == "审批拒绝" || row.status == "草稿" || row.status == "审批中"){
			if(confirm("此成本清单将退回到成本清单中，相关的采购订单，采购申请，备货申请也会一并退回，是否退回？")){
				postAjaxRequest("/service/purcontract/backtosc", {
					_id : row._id
				}, function(data) {
					listDataSource.read();
				});
			}
		}else{
			alert("只能退回草稿，审批中，审核拒绝的采购合同");
		}
	}
}


var rowId = undefined;
function addPOBumber(){
	var row = getSelectedRowDataByGridWithMsg("grid");
	if (row) {
		if (row.purchaseContractType == "施耐德北京代采") {

			var options = {
				width : 600,
				height : 200,
				actions : [ "Maximize", "Close" ]
			};
			kendoWindow = $("#ponum").data("kendoWindow");

			if(!kendoWindow){
				$("#ponum").kendoWindow({
					width : options.width,
					height : options.height,
					title : options.title
				});
				kendoWindow = $("#ponum").data("kendoWindow");
			}

			kendoWindow.open();
			kendoWindow.center();
			rowId = row._id;
			if(row.poNumber){
				$("#poNumber").val(row.poNumber);
			}else{
				$("#poNumber").val("");
			}
		}else{
			alert("只能针对施耐德北京代采的采购合同补填PO号");
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
			$("#poNumber").val("");
			listDataSource.read();
		});

	}
}





