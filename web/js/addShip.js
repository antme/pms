var model, eqDataSource, crudServiceBaseUrl = "../service";

var ship = kendo.data.Model.define( {
    id: "_id",
    fields: {
    	type: {},
    	shipCode: {},
    	applicationDepartment: {},
    	warehouse: {},
    	salesContractId: {},
    	contractCode: {},
    	contractType: {},
    	projectId: {},
    	projectName: {},
    	customer: {},
    	deliveryContact: {},
    	deliveryContactWay: {},
    	deliveryUnit: {},
    	deliveryAddress: {},
    	issueTime: {},
    	deliveryTime: {},
    	deliveryRequirements: {},
    	otherDeliveryRequirements: {},
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
	
	var dropdownlist = $("#type").kendoDropDownList({
        dataTextField: "text",
        dataValueField: "value",
        optionLabel : "选择发货类型...",
        dataSource: shipTypeItems,
        change: function(e) {
        	salesContract.value(null);
        	salesContract.dataSource.fetch(function(){
        		var data = this.data();
        		if (data.length > 0) {
        			salesContract.readonly(false);
				}
        	});
        }
    }).data("kendoDropDownList");
	
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
	
	var salesContract = $("#salesContract").kendoComboBox({
		autoBind: false,
        placeholder: "销售合同编号",
        dataTextField: "contractCode",
        dataValueField: "_id",
        filter: "contains",
        suggest: true,
        dataSource: new kendo.data.DataSource({
            transport: {
                read: {
                    url: crudServiceBaseUrl + "/purcontract/repository/select_sc_forship",
                    dataType: "jsonp",
    	            data: {
    	            	type: function() {
                            return dropdownlist.value();
                        }
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
        		model.set("projectId", dataItem.projectId);
            	model.set("projectName", dataItem.projectName);
        		model.set("customer", dataItem.customerName);
            	model.set("contractCode", dataItem.contractCode);
            	model.set("contractType", dataItem.contractType);
            	
            	var salesContractId = this.value();
            	
            	eqDataSource = new kendo.data.DataSource({
            	    transport: {
            	        read: {
            	            url: crudServiceBaseUrl + "/ship/eqlist",
            	            dataType: "jsonp",
            	            data: {
            	            	salesContractId: salesContractId,
            	            	type: function() {
                                    return dropdownlist.value();
                                }
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
			} else {
				this.value("");
				this.text("");
			}
        }
    }).data("kendoComboBox");
	salesContract.readonly();
	
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
    
	if(popupParams){
		postAjaxRequest("/service/ship/get", popupParams, edit);
		disableAllInPoppup();
	} else if (redirectParams) {//Edit
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
    		if (data.length > 0) {
    			model.set("eqcostList", data);
    			
    			model.set("issueTime", kendo.toString(model.issueTime, 'd'));
    			model.set("deliveryTime", kendo.toString(model.deliveryTime, 'd'));
    			
    			listDataSource.add(model);
    	        
    	    	if(listDataSource.at(0)){
    	    		//force set haschanges = true
    	    		listDataSource.at(0).set("uid", kendo.guid());
    	    	}
    	    	
    	    	listDataSource.sync();
    	        loadPage("ship");
			}
		}
    }
}

function cancle() {
	loadPage("ship");
}