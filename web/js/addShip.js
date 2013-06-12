var contractCode, model, crudServiceBaseUrl = "../service";

var ship = kendo.data.Model.define( {
    id: "_id",
    fields: {
    	shipNo: {},
    	applicationDepartment: {},
    	salesContractId: {},
    	customer: {},
    	eqcostList: {}
    }
});

var eqModel = kendo.data.Model.define( {
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
});

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
                    dataType: "jsonp"
                }
            }
        }),
        change: function(e) {
        	contractCode = this.value();
        	
        	var eqDataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: crudServiceBaseUrl + "/ship/eqlist",
                        dataType: "jsonp",
                        data: {
                        	contractCode: contractCode
                        }
                    }
                },
                batch: true,
                schema: {
                    model: eqModel
                }
            });
        	var grid = $("#equipments-grid").data("kendoGrid");
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
}

function save() {
	
	var validator = $("#addShip").kendoValidator().data("kendoValidator");
	if (!validator.validate()) {
		return;
    } else {
    	console.log(kendo.stringify(model));
        var _id = model.get("_id");
        listDataSource.add(model);
    	listDataSource.sync();
        loadPage("ship");
    }
}

function cancle() {
	loadPage("ship");
}