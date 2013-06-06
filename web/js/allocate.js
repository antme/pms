$(document).ready(function () {
    var dataSource = new kendo.data.DataSource({
            transport: {
                read:  {
                    url: "../service/allocate/list",
                    dataType: "jsonp"
                },
                update: {
                    url: + "../service/allocate/update",
                    dataType: "jsonp"
                },
                destroy: {
                    url: "../service/allocate/destroy",
                    dataType: "jsonp"
                },
                create: {
                    url: "../service/allocate/create",
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
	aaaaaa();
	$("#allocate-edit").show();
	var window = $("#allocate-edit");
	if (!window.data("kendoWindow")) {
		window.kendoWindow({
			width : "900px",
			height : "500px",
			title : "调拨申请",
			modal : true,
		});
		window.data("kendoWindow").center();
	} else {
		window.data("kendoWindow").open();
		window.data("kendoWindow").center();
	}
};

function aaaaaa() {
	$("#projects").kendoComboBox({
        placeholder: "Select project",
        dataTextField: "projectName",
        dataValueField: "_id",
        filter: "contains",
        suggest: true,
        dataSource: {
            transport: {
	            read: {
	                url: "../service/project/listforselect",
	                dataType: "jsonp"
	            }
	        }
        },
        change: function(e) {
        	var value = this.value();
        	var dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: "../service/project/listequipments",
                        dataType: "jsonp",
                        data: {
                        	projectId: value
                        }
                    }
                },
                batch: true,
                schema: {
                    model: {
                        id: "eqcostNo",
                        fields: {
                        	eqcostNo: { editable: false },
                        	eqcostMaterialCode: { editable: false },
                        	eqcostProductName: { editable: false },
                        	eqcostProductType: { editable: false },
                        	eqcostAmount: { type: "number", validation: { required: true, min: 1} },
                        	eqcostUnit: { editable: false },
                        	eqcostBrand: { editable: false },
                        	eqcostBasePrice: { editable: false }
                        }
                    }
                }
            });
        	var grid = $("#equipments-grid").data("kendoGrid");
        	grid.setDataSource(dataSource);
        }
    });
	
	$("#equipments-grid").kendoGrid({
	    toolbar: ["cancel"],
	    columns: [
	        { field: "eqcostNo", title: "序号" },
	        { field: "eqcostMaterialCode", title: "物料代码" },
	        { field: "eqcostProductName", title: "产品名称" },
	        { field: "eqcostProductType", title: "规格型号" },
	        { field: "eqcostAmount", title: "数量" },
	        { field: "eqcostUnit", title: "单位" },
	        { field: "eqcostBrand", title: "品牌" },
	        { field: "eqcostBasePrice", title: "成本价" },
	        { command: "destroy", title: "&nbsp;", width: 90 }],
	    editable: true
	});
}

function simulate() {
	var equipmentsSource;
	var viewModel = kendo.observable({
	    productsSource: new kendo.data.DataSource({
	        transport: {
	            read: {
	                url: "../service/project/listforselect",
	                dataType: "jsonp"
	            }
	        },
	        batch: true,
	        schema: {
	            model: {
	                id: "_id"
	            }
	        }
	    }),
	    equipmentsSource: new kendo.data.DataSource({
	        transport: {
	            read: {
	                url: "../service/project/listequipments",
	                dataType: "jsonp",
	                data: {
	                	projectId: "51af47322b60fdf09fe22bfb"
	                }
	            }
	        },
	        batch: true,
	        schema: {
	            model: {
	                id: "_id"
	            }
	        }
	    }),
	    selectedProduct: null,
	    hasChanges: true,
	    save: function() {
	    	console.log(this.get("selectedProduct"));
	    },
	    remove: function() {
	        if (confirm("Are you sure you want to delete this product?")) {
	            this.productsSource.remove(this.selectedProduct);
	            this.set("selectedProduct", this.productsSource.view()[0]);
	            this.change();
	        }
	    },
	    showForm: function() {
	       return this.get("selectedProduct") !== null;
	    },
	    change: function() {
	    	equipmentsSource = new kendo.data.DataSource({
		        transport: {
		            read: {
		                url: "../service/project/listequipments",
		                dataType: "jsonp",
		                data: {
		                	projectId: "51af47322b60fdf09fe22bfb"
		                }
		            }
		        },
		        batch: true,
		        schema: {
		            model: {
		                id: "_id"
		            }
		        }
		    });
	    	equipmentsSource.read();
	    }
	});

	kendo.bind($("#form-container"), viewModel);
}

function sonofbitch() {
	var crudServiceBaseUrl = "http://demos.kendoui.com/service";
	var viewModel = kendo.observable({
	    productsSource: new kendo.data.DataSource({
	        transport: {
	            read: {
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
	            parameterMap: function(options, operation) {
	                if (operation !== "read" && options.models) {
	                    return {
	                        models: kendo.stringify(options.models)
	                    };
	                }
	                return options;
	            }
	        },
	        batch: true,
	        schema: {
	            model: {
	                id: "ProductID"
	            }
	        }
	    }),
	    selectedProduct: null,
	    hasChanges: false,
	    save: function() {
	        this.productsSource.sync();
	        this.set("hasChanges", false);
	    },
	    remove: function() {
	        if (confirm("Are you sure you want to delete this product?")) {
	            this.productsSource.remove(this.selectedProduct);
	            this.set("selectedProduct", this.productsSource.view()[0]);
	            this.change();
	        }
	    },
	    showForm: function() {
	       return this.get("selectedProduct") !== null;
	    },
	    change: function() {
	        this.set("hasChanges", true);
	    }
	});

	kendo.bind($("#form-container"), viewModel);
}

function show_edit_grid() {
	grid = $("#popup-grid").kendoGrid({
        dataSource: {
        	type: "odata",
            transport: {
            	read: {
                    url: "../service/project/listequipments",
                    dataType: "jsonp",
                    data: {
                    	projectId: function() {
                            return dropDown.value();
                        }
                    }
                }
            },
            pageSize: 20,
            serverPaging: true,
            serverFiltering: true,
            schema: {
                model: {
                    id: "_id",
                    fields: {
                    	eqcostMemo: { editable: false, nullable: true },
                        eqcostProductName: { editable: false, validation: { required: true } },
                        eqcostBasePrice: { editable: true, type: "number", validation: { required: true, min: 1} },
                        eqcostTotalAmount: { editable: false }
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
            { field: "eqcostMemo", title: "Product ID", width: 100 },
            { field: "eqcostProductName", title: "Product Name" },
            { field: "eqcostBasePrice", title: "Unit Price", width: 100 },
            { field: "eqcostTotalAmount", title: "Quantity Per Unit" }
        ],
        editable: true
    });
    var dropDown = grid.find("#category").kendoDropDownList({
        dataTextField: "projectName",
        dataValueField: "_id",
        autoBind: false,
        optionLabel: "All",
        dataSource: {
            transport: {
                read: {
                    dataType: "jsonp",
                    url: "../service/project/listforselect",
                }
            }
        },
        change: function() {
            var value = this.value();
            if (value) {
                grid.data("kendoGrid").dataSource.read();
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