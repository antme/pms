var listUrl = "/service/purcontract/repository/list?type=in";
var approveUrl = "/service/purcontract/repository/approve?type=in";
var deleteUrl = "/service/purcontract/repository/delete?type=in";
var cancelUrl = "/service/purcontract/repository/cancel?type=in";

// 外面列表页的datasource对象
var dataSource = new kendo.data.DataSource({
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
			dataSource : dataSource,
			pageable : true,
			selectable : "row",
			width : "1000px",
			columns : [ {
				field : "code",
				title : "申请编号"
			}, {
				field : "customerName",
				title : "供应商"
			}, {
				field : "status",
				title : "入库状态"
			}, {
				field : "approvedDate",
				title : "入库时间"
			}, {
				field : "repositoryTotalAmount",
				title : "入库总数"
			} ]

		});

	}

});


function add(){
	loadPage("html/repository/repositoryEdit.html");
}

function edit() {
	// 如果是从订单列表页点击edit过来的数据
	var row = getSelectedRowDataByGrid("grid");
	loadPage("html/repository/repositoryEdit.html", {
		_id : row._id
	});
}

function confirm(){
	
	var row = getSelectedRowDataByGridWithMsg("grid");
	if (row) {
		if(row.status == "已入库"){
			alert("此申请已入库，不需要再次入库");
		}else{
			process(approveUrl);
		}
	}
}



