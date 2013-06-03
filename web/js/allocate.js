$(document).ready(function () {
    var crudServiceBaseUrl = "../service",
        dataSource = new kendo.data.DataSource({
            transport: {
                read:  {
                    url: crudServiceBaseUrl + "/suppliers/list",
                    dataType: "jsonp"
                },
                update: {
                    url: crudServiceBaseUrl + "/suppliers/update",
                    dataType: "jsonp"
                },
                destroy: {
                    url: crudServiceBaseUrl + "/suppliers/destroy",
                    dataType: "jsonp"
                },
                create: {
                    url: crudServiceBaseUrl + "/suppliers/create",
                    dataType: "jsonp"
                },
                parameterMap: function(options, operation) {
                    if (operation !== "read" && options.models) {
                        return {models: kendo.stringify(options.models)};
                    }
                }
            },
            batch: true,
            pageSize: 20,
            schema: {
                model: {
                    id: "_id",
                    fields: {
                        _id: { editable: false, nullable: true },
                        ProductName: { validation: { required: true } },
                        UnitPrice: { type: "number", validation: { required: true, min: 1} },
                        Discontinued: { type: "boolean" },
                        UnitsInStock: { type: "number", validation: { min: 0, required: true } }
                    }
                }
            }
        });

    $("#grid").kendoGrid({
        dataSource: dataSource,
        selectable: "multiple",
        pageable: true,
        height: 430,
        toolbar: [{name: "create", text: "添加"}, {template: kendo.template($("#template").html())}],
        columns: [
            { field:"ProductName", title: "Product Name" },
            { field: "UnitPrice", title:"Unit Price", format: "{0:c}", width: "100px" },
            { field: "UnitsInStock", title:"Units In Stock", width: "100px" },
            { field: "Discontinued", width: "100px" }],
        editable: "popup"
    });
});

function toolbar_delete() {
	var rowData = getSelectedRowDataByGrid("grid");
	alert("Delete the row _id: " + rowData._id);
  	console.log("Toolbar command is clicked!");
  	return false;
};