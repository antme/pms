var grid, inSalesContract, outSalesContract, model;
var inProjectId, outProjectId;
var eqDataSource, crudServiceBaseUrl = "../service";

var borrowing = kendo.data.Model.define( {
    id: "_id",
    fields: {
    	borrowNo: {},
    	applicant: {},
    	inProjectId: {},
    	inSalesContractId: {},
    	outProjectId: {},
    	outSalesContractId: {},
    	eqcostList: {},
    	// 发货信息
    	type: {},
    	shipNo: {},
    	applicationDepartment: {},
    	warehouse: {},
    	deliveryContact: {},
    	deliveryContactWay: {},
    	deliveryUnit: {},
    	deliveryAddress: {},
    	issueTime: {},
    	deliveryTime: {},
    	deliveryRequirements: {},
    	otherDeliveryRequirements: {}
    }
});

var eqModel = kendo.data.Model.define( {
    id: "_id",
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
});

var listDataSource = new kendo.data.DataSource({
    transport: {
        update: {
            url: "../service/borrowing/update",
            dataType: "jsonp",
            type: "POST"
        },
        create: {
            url: "../service/borrowing/create",
            dataType: "jsonp",
            type: "POST"
        },
        parameterMap: function(options, operation) {
            if (operation !== "read" && options.models) {
                return {models: kendo.stringify(options.models)};
            }
        }
    },
    batch: true,
    schema: {
        model: borrowing
    }
});

$(document).ready(function() {
	
	// 选项卡
    $("#tabstrip").kendoTabStrip({
        animation:  {
            open: {
                effects: "fadeIn"
            }
        }
    });
    
    $("#type").kendoDropDownList({
        dataTextField: "text",
        dataValueField: "value",
        optionLabel : "选择发货类型...",
        dataSource: shipTypeItems
    });
	
	$("#applicationDepartment").kendoDropDownList({
        dataTextField: "text",
        dataValueField: "text",
        optionLabel : "选择申请部门...",
        dataSource: departmentItems
    });
	
	$("#deliveryRequirements").kendoDropDownList({
        dataTextField: "text",
        dataValueField: "text",
        optionLabel : "选择货运要求...",
        dataSource: deliveryRequirementsItems
    });
	
	var inprojects = $("#in-projects").kendoComboBox({
        placeholder: "Select project",
        dataTextField: "projectName",
        dataValueField: "_id",
        filter: "contains",
        suggest: true,
        dataSource: new kendo.data.DataSource({
            transport: {
                read: {
                    url: "../service/project/listforselect",
                    dataType: "jsonp",
    	            data: {
    	            	pageSize: 0
    	            }
                }
            },
            schema: {
            	total: "total",
            	data: "data"
            }
        }),
        change: function(e) {
        	var dataItem = this.dataItem();
        	if (dataItem) {
	        	inSalesContract.value(null);
	        	inProjectId = this.value();
	        	inSalesContract.dataSource.read();
	        	inSalesContract.readonly(false);
        	}
        }
    }).data("kendoComboBox");
	
	inSalesContract = $("#inSalesContract").kendoComboBox({
		autoBind: false,
		dataSource: new kendo.data.DataSource({
            transport: {
                read: {
                    url: crudServiceBaseUrl + "/sc/listbyproject",
                    dataType: "jsonp",
    	            data: {
    	            	projectId: function() {
                            return inProjectId;
                        }
    	            }
                }
            },
            schema: {
            	total: "total",
            	data: "data"
            }
        }),
        placeholder: "销售合同编号",
        dataTextField: "contractCode",
        dataValueField: "_id",
        filter: "contains",
        suggest: true,
    }).data("kendoComboBox");
	
	inSalesContract.readonly();
	
	var outprojects = $("#out-projects").kendoComboBox({
        placeholder: "Select project",
        dataTextField: "projectName",
        dataValueField: "_id",
        filter: "contains",
        suggest: true,
        dataSource: new kendo.data.DataSource({
            transport: {
                read: {
                    url: "../service/project/listforselect",
                    dataType: "jsonp",
    	            data: {
    	            	pageSize: 0
    	            }
                }
            },
            schema: {
            	total: "total",
            	data: "data"
            }
        }),
        change: function(e) {
        	var dataItem = this.dataItem();
        	if (dataItem) {
	        	outSalesContract.value(null);
	        	outProjectId = this.value();
	        	outSalesContract.dataSource.read();
	        	outSalesContract.readonly(false);
        	}
        }
    }).data("kendoComboBox");
	
	outSalesContract = $("#outSalesContract").kendoComboBox({
		autoBind: false,
		dataSource: new kendo.data.DataSource({
            transport: {
                read: {
                    url: crudServiceBaseUrl + "/sc/listbyproject",
                    dataType: "jsonp",
    	            data: {
    	            	projectId: function() {
                            return outProjectId;
                        }
    	            }
                }
            },
            schema: {
            	total: "total",
            	data: "data"
            }
        }),
        placeholder: "销售合同编号",
        dataTextField: "contractCode",
        dataValueField: "_id",
        filter: "contains",
        suggest: true,
        change: function(e) {
        	var dataItem = this.dataItem();
        	if (dataItem) {
	//        	model.set("customer", dataItem.customer);
	//        	model.set("contractCode", dataItem.contractCode);
	        	
	        	var salesContractId = this.value();
	        	
	        	eqDataSource = new kendo.data.DataSource({
	        	    transport: {
	        	        read: {
	        	            url: crudServiceBaseUrl + "/borrowing/eqlist",
	        	            dataType: "jsonp",
	        	            data: {
	        	            	outSalesContractId: salesContractId
	        	            }
	        	        }
	        	    },
	        	    batch: true,
	        	    schema: {
	        	        model: eqModel,
	        	        total: "total",
	                	data: "data"
	        	    }
	        	});
	        	
	        	grid.setDataSource(eqDataSource);
        	}
        }
    }).data("kendoComboBox");
	
	outSalesContract.readonly();
	
	grid = $("#equipments-grid").kendoGrid({
	    toolbar: [ { name: "cancel", text: "撤销编辑" } ],
	    columns: [
	        { field: "eqcostNo", title: "序号" },
	        { field: "eqcostMaterialCode", title: "物料代码" },
	        { field: "eqcostProductName", title: "产品名称" },
	        { field: "eqcostProductType", title: "规格型号" },
	        { field: "eqcostUnit", title: "单位" },
	        { field: "eqcostAmount", title: "数量" },
	        { field: "eqcostBrand", title: "品牌" },
	        { field: "eqcostMemo", title: "备注" },
	        { command: "destroy", title: "&nbsp;", width: 90 }],
	    editable: true
	}).data("kendoGrid");
    
    if (redirectParams) {//Edit
		postAjaxRequest("/service/borrowing/get", redirectParams, edit);
	} else {//Add
		//添加表单绑定一个空的 Model
		model = new borrowing();
		kendo.bind($("#addBorrowing"), model);
	}
});

function edit(data) {
	model = new borrowing(data);

	if (model.inProjectId) {
		inProjectId = model.inProjectId;
    	inSalesContract.readonly(false);
	}
	
	if (model.outProjectId) {
		outProjectId = model.outProjectId;
    	outSalesContract.readonly(false);
	}
	
	kendo.bind($("#addBorrowing"), model);
	
	eqDataSource = new kendo.data.DataSource({
	    data: model.eqcostList,
	    batch: true,
	    schema: {
	        model: eqModel
	    }
	});
	
	grid.setDataSource(eqDataSource);
}

function save() {
	
	var validator = $("#addBorrowing").kendoValidator().data("kendoValidator");
	if (!validator.validate()) {
		return;
    } else {
    	if (eqDataSource) {
    		var data = eqDataSource.data();
            model.set("eqcostList", data);
		}
        
        listDataSource.add(model);
        
    	if(listDataSource.at(0)){
    		//force set haschanges = true
    		listDataSource.at(0).set("uid", kendo.guid());
    	}
    	
    	listDataSource.sync();
        loadPage("borrowing");
    }
}

function cancle() {
	loadPage("borrowing");
}