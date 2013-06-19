var model, eqDataSource, crudServiceBaseUrl = "../service";

var ship = kendo.data.Model.define( {
    id: "_id",
    fields: {
    	shipNo: {},
    	applicationDepartment: {},
    	salesContractId: {},
    	contractCode: {},
    	customer: {},
    	deliveryContact: {},
    	deliveryContactWay: {},
    	deliveryUnit: {},
    	deliveryAddress: {},
    	deliveryTime: {},
    	deliveryRequirements: {},
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
    batch: true,
    schema: {
        model: ship
    }
});

$(document).ready(function() {
	
	$("#salesContract").kendoComboBox({
        placeholder: "销售合同编号",
        dataTextField: "contractCode",
        dataValueField: "_id",
        filter: "contains",
        suggest: true,
        dataSource: new kendo.data.DataSource({
            transport: {
                read: {
                    url: crudServiceBaseUrl + "/sc/list",
                    dataType: "jsonp",
    	            data: {
    	            	limit: 0
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
        	model.set("customer", dataItem.customer);
        	model.set("contractCode", dataItem.contractCode);
        	
        	var salesContractId = this.value();
        	
        	eqDataSource = new kendo.data.DataSource({
        	    transport: {
        	        read: {
        	            url: crudServiceBaseUrl + "/ship/eqlist",
        	            dataType: "jsonp",
        	            data: {
        	            	salesContractId: salesContractId
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
    });
	
	$("#equipments-grid").kendoGrid({
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
	});
	grid = $("#equipments-grid").data("kendoGrid");
    
    if (redirectParams) {//Edit
		postAjaxRequest("/service/ship/get", redirectParams, edit);
	} else {//Add
		//添加表单绑定一个空的 Model
		model = new ship();
		kendo.bind($("#addShip"), model);
	}
});

function edit(data) {
	model = new ship(data);
	kendo.bind($("#addShip"), model);
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
	
	var validator = $("#addShip").kendoValidator().data("kendoValidator");
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
        loadPage("ship");
    }
}

function cancle() {
	loadPage("ship");
}