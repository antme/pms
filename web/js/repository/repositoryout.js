var listUrl = "/service/purcontract/repository/list?type=out";
var approveUrl = "/service/purcontract/repository/confirm?type=out";
var deleteUrl = "/service/purcontract/repository/delete?type=out";
var cancelUrl = "/service/purcontract/repository/cancel?type=out";

var confirmModel = kendo.data.Model.define({
	
	fields : {
		outDate:{type:"date"}
	}
});

var confirmEntity = new confirmModel();
// 外面列表页的datasource对象
var listDataSource = new kendo.data.DataSource({
	transport : {
		read : {
			url : listUrl,
			dataType : "jsonp"
		}
	},
	pageSize : 20,
	schema : {
		total: "total",
		data: "data"
	}
});

$(document).ready(function() {
	checkRoles();

	if ($("#grid").length > 0) {
		// 初始化采购订单列表页
		$("#grid").kendoGrid({
			dataSource : listDataSource,
			pageable : true,
			selectable : "row",
			width : "1000px",
			columns : [ {
				field : "repositoryCode",
				title : "申请编号"
			}, {
				field : "recustomer",
				title : "需方名称"
			}, {
				field : "status",
				title : "入库状态"
			}, {
				field : "inDate",
				title : "入库时间"
			}, {
				field : "approvedDate",
				title : "出库时间"
			}, {
				field : "totalIn",
				title : "入库总数"
			}, {
				field : "totalIn",
				title : "出库总数"
			}  ]

		});

	}
	
	
	kendo.bind($("#confirm-form"), confirmEntity);
	

});


function add(){
	loadPage("repository_repositoryOutEdit", {
		type : "out"
	});
}

function editRepo() {
	// 如果是从订单列表页点击edit过来的数据
	var row = getSelectedRowDataByGrid("grid");
	loadPage("repository_repositoryOutEdit", {
		_id : row._id,
		type : "out"
	});
}

function confirmRepository(){
	
	
	var row = getSelectedRowDataByGridWithMsg("grid");
	if (row) {
		if(row.status == "已入库"){
			alert("此申请已入库，不需要再次入库");
		}else{
			confirmEntity = new confirmModel(row);
			kendo.bind($("#confirm-form"), confirmEntity);
			setDate(confirmEntity, "outDate", confirmEntity.outDate);
			var options = {
				width : 500,
				height : 300,
				actions : [ "Maximize", "Close" ]
			};
			$("#confirm-form").kendoWindow({
				width : options.width,
				height : options.height,
				title : options.title
			});

			var kendoWindow = $("#confirm-form").data("kendoWindow");
			kendoWindow.open();
			kendoWindow.center();	
		}
	}
}


function submitConfirm(){
	 postAjaxRequest(approveUrl, {models:kendo.stringify(confirmEntity)}, approveStatusCheck);
	
}

function approveStatusCheck(){
	var kendoWindow = $("#confirm-form").data("kendoWindow");
	kendoWindow.close();
	listDataSource.read();
}





