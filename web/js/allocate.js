$(document).ready(function () {
    var crudServiceBaseUrl = "http://demos.kendoui.com/service",
        dataSource = new kendo.data.DataSource({
            transport: {
                read:  {
                    url: crudServiceBaseUrl + "/Products",
                    dataType: "jsonp"
                },
                update: {
                    url: crudServiceBaseUrl + "/Products/Update",
                    dataType: "jsonp"
                },
                destroy: {
                    url: crudServiceBaseUrl + "/Products/Destroy",
                    dataType: "jsonp"
                },
                create: {
                    url: crudServiceBaseUrl + "/Products/Create",
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
                    id: "ProductID",
                    fields: {
                        ProductID: { editable: false, nullable: true },
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
        pageable: true,
        height: 430,
        toolbar: [ {
			template : kendo.template($("#template").html())
		} ],
        columns: [
            { field:"ProductName", title: "Product Name" },
            { field: "UnitPrice", title:"Unit Price", format: "{0:c}", width: "100px" },
            { field: "UnitsInStock", title:"Units In Stock", width: "100px" },
            { field: "Discontinued", width: "100px" },
            { command: ["edit", "destroy"], title: "&nbsp;", width: "160px" }],
        editable: "popup"
    });
});

function toolbar_add() {
	show_edit_grid();
	$("#allocate-edit").show();
	var window = $("#allocate-edit");
	if (!window.data("kendoWindow")) {
		window.kendoWindow({
			width : "900px",
			height : "500px",
			title : "shit",
			modal : true,
		});
		window.data("kendoWindow").center();
	} else {
		window.data("kendoWindow").open();
		window.data("kendoWindow").center();
	}
};

function show_edit_grid() {
	var crudServiceBaseUrl = "http://demos.kendoui.com/service",
	grid = $("#popup-grid").kendoGrid({
        dataSource: {
        	type: "odata",
            transport: {
                read: "http://demos.kendoui.com/service/Northwind.svc/Products"
            },
            pageSize: 20,
            serverPaging: true,
            serverFiltering: true,
            schema: {
                model: {
                    id: "ProductID",
                    fields: {
                        ProductID: { editable: false, nullable: true },
                        ProductName: { editable: false, validation: { required: true } },
                        UnitPrice: { editable: true, type: "number", validation: { required: true, min: 1} },
                        QuantityPerUnit: { editable: false }
                    }
                }
            }
        },
        selectable: "multiple",
        toolbar: [
			{ name: "save", text: "提交" },
			{ name: "cancel", text: "还原" },
			{ template: kendo.template($("#popup-template").html()) }
        ],
        height: 430,
        pageable: true,
        columns: [
            { field: "ProductID", title: "Product ID", width: 100 },
            { field: "ProductName", title: "Product Name" },
            { field: "UnitPrice", title: "Unit Price", width: 100 },
            { field: "QuantityPerUnit", title: "Quantity Per Unit" }
        ],
        editable: true
    });
    var dropDown = grid.find("#category").kendoDropDownList({
        dataTextField: "ProductName",
        dataValueField: "ProductID",
        autoBind: false,
        optionLabel: "All",
        dataSource: {
            transport: {
                read: {
                    dataType: "jsonp",
                    url: "http://demos.kendoui.com/service/Products",
                }
            }
        },
        change: function() {
            var value = this.value();
            if (value) {
                grid.data("kendoGrid").dataSource.filter({ field: "ProductID", operator: "eq", value: parseInt(value) });
            }
        }
    });
}

function toolbar_delete() {
	var rowData = getSelectedRowDataByGrid("grid");
	alert("Delete the row _id: " + rowData._id);
  	console.log("Toolbar command is clicked!");
  	return false;
};