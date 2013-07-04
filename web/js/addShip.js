var model, eqDataSource, crudServiceBaseUrl = "../service";

var ship = kendo.data.Model.define( {
    id: "_id",
    fields: {
    	shipCode: {},
    	applicationDepartment: {},
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
    	eqcostUnit: { editable: false },
    	eqcostBrand: { editable: false },
    	eqcostAmount: { type: "number", validation: { required: true, min: 1} },
    	arrivalAmount: { type: "number", validation: { required: true, min: 0}, editable: false },
    	giveUp: { editable: false },
    	eqcostMemo: {}
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
	
	var project = $("#project").kendoComboBox({
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
        		model.set("projectName", dataItem.projectName);
        		model.set("customer", dataItem.customer);
        		model.set("applicationDepartment", dataItem.customer);
        		
        		salesContract.value(null);
	        	inProjectId = this.value();
	        	salesContract.dataSource.read();
	        	salesContract.readonly(false);
        	}
        }
    }).data("kendoComboBox");

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
                    url: crudServiceBaseUrl + "/sc/listbyproject",
                    dataType: "jsonp",
    	            data: {
    	            	projectId: function() {
                            return project.value();
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
            	model.set("contractCode", dataItem.contractCode);
            	model.set("contractType", dataItem.contractType);
            	
            	eqDataSource = new kendo.data.DataSource({
            	    transport: {
            	        read: {
            	            url: crudServiceBaseUrl + "/ship/eqlist",
            	            dataType: "jsonp",
            	            data: {
            	            	salesContractId: function() {
                                    return salesContract.value();
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
	
	$("#deliveryRequirements").kendoDropDownList({
        dataTextField: "text",
        dataValueField: "text",
        optionLabel : "选择货运要求...",
        dataSource: deliveryRequirementsItems
    });
	
	$("#equipments-grid").kendoGrid({
	    toolbar: [ { name: "cancel", text: "撤销编辑" } ],
	    columns: [
	        { field: "eqcostNo", title: "序号" },
	        { field: "eqcostMaterialCode", title: "物料代码" },
	        { field: "eqcostProductName", title: "产品名称" },
	        { field: "eqcostProductType", title: "规格型号" },
	        { field: "eqcostBrand", title: "品牌" },
	        { field: "eqcostUnit", title: "单位" },
	        { field: "eqcostAmount", title: "数量" },
	        { field: "arrivalAmount", title: "实际发货数" },
	        {
	        	field: "giveUp",
	        	title: "放弃未发",
	        	editor: giveUpDropDownEditor
	        },
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

function giveUpDropDownEditor(container, options) {
	var giveUpItems = [ "是", "否" ];
	$('<input data-bind="value:' + options.field + '"/>')
    .appendTo(container)
    .kendoDropDownList({
        dataSource: giveUpItems
    });
}

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