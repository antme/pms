var listUrl = "/service/purcontract/repository/list?type=out&isVirtualRequest=true";


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
			columns : [ 
			            
			{
				field : "virtualCode",
				title : "虚拟单编号",
				template : function(dataItem) {
					return '<a  onclick="openVirtualRepositoryOutViewWindow(\'' + dataItem._id + '\');">' + dataItem.virtualCode + '</a>';
				}
			},
			 { field: "projectName", title:"项目名字" },
			{
				field : "repositoryCode",
				title : "签收单编号",
				template : function(dataItem) {
					return '<a  onclick="openRepositoryOutViewWindow(\'' + dataItem.repositoryOutId + '\');">' + dataItem.repositoryCode + '</a>';
				}
			}, {
				field : "recustomer",
				title : "需方名称"
			}, {
				field : "approvedDate",
				title : "签收时间"
			}, {
				field : "totalConfirmedAmount",
				title : "签收总数"
			}]

		});

	}
	


});






