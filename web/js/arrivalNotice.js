var dataSource, crudServiceBaseUrl = "../service/arrivalNotice";

$(document).ready(function () {
	checkRoles();
    dataSource = new kendo.data.DataSource({
        transport: {
            read:  {
                url: crudServiceBaseUrl + "/list",
                dataType: "jsonp"
            },
            destroy: {
                url: crudServiceBaseUrl + "/destroy",
                dataType: "jsonp"
            },
            parameterMap: function(options, operation) {
                if (operation !== "read" && options.models) {
                    return {models: kendo.stringify(options.models)};
                }
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

    $("#grid").kendoGrid({
        dataSource: dataSource,
        pageable : true,
		sortable : true,
		filterable : filterable,
        selectable: "multiple",
        columns: [
            {
            	field: "shipType", title:"发货类型",
            	template:function(dataItem) {
					var name = "未知";
					if (dataItem.shipType == 0){
						name = "供应商直发";
					} else if (dataItem.shipType == 1){
						name = "调拨非直发";
					} else if (dataItem.shipType == 2){
						name = "采购非直发";
					}
					return name;
				}
            },
            { field: "arrivalDate", title:"到货日期" },
            {
            	field: "foreignCode",
            	title:"相关编号",
				template : function(dataItem) {
					if (dataItem.foreignCode) {
						return '<a  onclick="openPurchaseOrderViewWindow(\'' + dataItem.foreignKey + '\');">' + dataItem.foreignCode + '</a>';
					} else {
						return '';
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
	console.log(kendo.toString(row[0]));return;
	var rowData = getSelectedRowDataByGridWithMsg("grid");
	if (rowData) {
		if (rowData.status == 0 || rowData.status == -1){
			loadPage("addShip",{_id:rowData._id});
		} else {
			alert("无法执行该操作");
		}
	}
}
