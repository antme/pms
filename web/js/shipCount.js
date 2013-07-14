var dataSource, crudServiceBaseUrl = "../service/ship";

$(document).ready(function () {
	checkRoles();
    dataSource = new kendo.data.DataSource({
        transport: {
            read:  {
                url: crudServiceBaseUrl + "/count",
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
        columns: [
            { field: "_id", title:"id" },
            { field: "vcShipAmount", title:"数量" },
            { field: "vcShipMoney", title:"金额" }
        ],
        editable: "popup"
    });
});
