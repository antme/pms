var crudServiceBaseUrl = "../service";

var ship = kendo.data.Model.define( {
    id: "_id",
    fields: {
    	shipNo: {},
    	applicationDepartment: {},
    	salesContractId: {},
    	customerName: {},
    	eqcostList: {}
    }
});

$(document).ready(function() {
    var viewModel = kendo.observable({
    	data: {
        	shipNo: null,
        	applicationDepartment: null,
        	salesContract: { _id: null, contractCode: null, customer: null },
        	eqcostList: {}
        },
    	salesContractSource: new kendo.data.DataSource({
            transport: {
                read: {
                    url: crudServiceBaseUrl + "/sc/list",
                    dataType: "jsonp"
                }
            }
        }),
        change: function() {
            this.set("data.eqcostList", new kendo.data.DataSource({
                transport: {
                    read: {
                        url: crudServiceBaseUrl + "/ship/eqlist",
                        dataType: "jsonp",
                        data: {
                        	contractCode: this.data.salesContract.contractCode
                        }
                    }
                },
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
                        	eqcostMemo: { editable: false }
                        }
    				}
                }
            }));
        },
        listDataSource: new kendo.data.DataSource({
            transport: {
                update: {
                    url: "../service/ship/update",
                    dataType: "jsonp",
                    type: "POST"
                },
                create: {
                    url: "../service/ship/create",
                    dataType: "jsonp",
                    type: "POST"
                },
                parameterMap: function(options, operation) {
                    if (operation !== "read" && options.models) {
                        return {models: kendo.stringify(options.models)};
                    }
                }
            },
            schema: {
                model: {
                    id: "_id",
                    fields: {
                    	shipNo: {},
                    	applicationDepartment: {},
                    	salesContractId: {},
                    	customerName: {},
                    	eqcostList: {}
                    }
				}
            }
        }),
        save: function() {
        	listDataSource.add(data);
            this.listDataSource.sync();
        }
    });
    
    if (redirectParams) {//Edit
		postAjaxRequest("/service/ship/get", redirectParams, edit);
	}
    
    kendo.bind($("table"), viewModel);
});

function edit(data) {
	viewModel.data = data;
}
