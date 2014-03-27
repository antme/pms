var arrivalListDataSource, crudServiceBaseUrl = "../service/arrivalNotice";

arrivalListDataSource = new kendo.data.DataSource({
    transport: {
        read:  {
            url: crudServiceBaseUrl + "/list",
            dataType: "jsonp"
        }
    },
    batch: true,
    pageSize: 10,
	serverPaging: true,
	serverSorting: true,
	serverFiltering : true,
    schema: {
    	total: "total",
    	data: "data"
    }
});

$(document).ready(function () {
	checkRoles();
   

    $("#grid").kendoGrid({
        dataSource: arrivalListDataSource,
        pageable : true, 
        resizable: true,
		sortable : true,
		selectable : "row",
		filterable : filterable,
        columns: [
            { field: "shipType", title:"到货类型",
            	template : function(dataItem) {
					if (dataItem.shipType == "上海备货货架") {
						return '上海—上海泰德库';
					} else if ( dataItem.shipType == "北京备货货架")	{
						return '上海—北京泰德库';
					}
					return dataItem.shipType;
				}
            
            },
            { field: "arrivalDate", title:"到货日期" }, {
				field : "projectName",
				title : "项目名"
			}, {
				field : "contractCode",
				title : "销售合同编号"
			},
            
            {
            	field: "foreignCode",
            	title:"来源",
				template : function(dataItem) {
					if (dataItem.shipType == "上海备货货架" || dataItem.shipType == "北京备货货架") {
						return '<a onclick="openPurchaseAllotViewWindow(\'' + dataItem.foreignKey + '\');">' + dataItem.foreignCode + '</a>&nbsp&nbsp&nbsp&nbsp[调拨]';
					} else if (dataItem.shipType == "直发现场")	
					{
						return '<a onclick="openPurchaseOrderViewWindow(\'' + dataItem.foreignKey + '\');">' + dataItem.foreignCode + '</a>&nbsp&nbsp&nbsp&nbsp[采购直发]';
					}else{
						return '<a onclick="openPurchaseOrderViewWindow(\'' + dataItem.foreignKey + '\');">' + dataItem.foreignCode + '</a>&nbsp&nbsp&nbsp&nbsp[采购入库]';
					}
				}
            }
        ],
        editable: "popup"
    });
});

function toolbar_createShip() {
	var grid = $("#grid").data("kendoGrid");
	var row = grid.select();
	var data = grid.dataItem(row);
	var rowData = getSelectedRowDataByGridWithMsg("grid");
	if (rowData) {
		if (rowData.status == 0 || rowData.status == -1){
			loadPage("execution_addShip",{_id:rowData._id});
		} else {
			alert("无法执行该操作");
		}
	}
}

function viewArrivalNotice(){
	var row = getSelectedRowDataByGridWithMsg("grid");

	if (row) {

			var options = { width:"1080px", height: "600px", title:"编辑到货数量"};
			openRemotePageWindow(options, "execution_addArrivalNotice", {_id : row._id, type: "view"});
		
	}
}
