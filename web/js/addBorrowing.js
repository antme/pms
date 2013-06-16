var model, eqDataSource, crudServiceBaseUrl = "../service";

var borrowing = kendo.data.Model.define( {
    id: "_id",
    fields: {
    	borrowNo: {},
    	applicant: {},
    	inProjectId: {},
    	inSalesContractId: {},
    	outProjectId: {},
    	outSalesContractId: {},
    	eqcostList: {}
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

var grid;

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
	
	var projectDataSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "../service/project/listforselect",
                dataType: "jsonp"
            }
        }
    });
	
	var inprojects = $("#in-projects").kendoComboBox({
        placeholder: "Select project",
        dataTextField: "projectName",
        dataValueField: "_id",
        filter: "contains",
        suggest: true,
        dataSource: projectDataSource,
        change: function(e) {
        	inSalesContract.value(null);
        	var dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: crudServiceBaseUrl + "/sc/listbyproject",
                        dataType: "jsonp",
        	            data: {
        	            	projectId: inprojects.value()
        	            }
                    }
                }
            });
        	inSalesContract.setDataSource(dataSource);
        	inSalesContract.readonly(false);
        }
    }).data("kendoComboBox");
	
	var inSalesContract = $("#inSalesContract").kendoComboBox({
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
        dataSource: projectDataSource,
        change: function(e) {
        	outSalesContract.value(null);
        	var dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: crudServiceBaseUrl + "/sc/listbyproject",
                        dataType: "jsonp",
        	            data: {
        	            	projectId: outprojects.value()
        	            }
                    }
                }
            });
        	outSalesContract.setDataSource(dataSource);
        	outSalesContract.readonly(false);
        }
    }).data("kendoComboBox");
	
	var outSalesContract = $("#outSalesContract").kendoComboBox({
        placeholder: "销售合同编号",
        dataTextField: "contractCode",
        dataValueField: "_id",
        filter: "contains",
        suggest: true,
        change: function(e) {
        	var dataItem = this.dataItem();
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
        	        model: eqModel
        	    }
        	});
        	
        	grid.setDataSource(eqDataSource);
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
        var data = eqDataSource.data();
        model.set("eqcostList", data);
        
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