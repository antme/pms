var listUrl = "/service/purcontract/repository/list?type=out";


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
			pageable : true, resizable: true,
			sortable : true,
			selectable : "row",
			width : "1000px",
			columns : [ {
				field : "repositoryCode",
				title : "申请编号",
				template : function(dataItem) {
					return '<a  onclick="openRepositoryOutViewWindow(\'' + dataItem._id + '\');">' + dataItem.repositoryCode + '</a>';
				}
			}, {
				field : "recustomer",
				title : "需方名称"
			}, {
				field : "status",
				title : "出库状态"
			}, {
				field : "outDate",
				title : "发货时间"
			}, {
				field : "approvedDate",
				title : "签收时间"
			}, {
				field : "totalIn",
				title : "出库总数"
			}]

		});

	}
	


});






