var dataSource, eqDataSource, inProjectId, outProjectId, model;

var allocate = kendo.data.Model.define( {
    id: "_id",
    fields: {
    	inProjectId: {},
    	outProjectId: {},
    	allocateType: {}
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
    	eqcostBasePrice: { editable: false }
    }
});

$(document).ready(function () {

    dataSource = new kendo.data.DataSource({
            transport: {
                read:  {
                    url: "../service/allocate/list",
                    dataType: "jsonp"
                },
                update: {
                    url: "../service/allocate/update",
                    dataType: "jsonp",
                    type: "POST"
                },
                destroy: {
                    url: "../service/allocate/destroy",
                    dataType: "jsonp",
                    type: "POST"
                },
                create: {
                    url: "../service/allocate/create",
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
            pageSize: 20,
            schema: {
                model: allocate
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
            { field:"inProjectCode", title: "调入项目编号" },
            { field:"inProjectName", title: "调入项目名称" },
            { field:"inProjectManager", title: "调入项目负责人" },
            { field:"outProjectCode", title: "调出项目编号" },
            { field:"outProjectName", title: "调出项目名称" },
            { field:"outProjectManager", title: "调出项目负责人" },
            { field:"allocateType", title: "调拨类型" },
            { field:"allocateStatus", title: "申请状态" },
            { command: ["destroy"], title: "&nbsp;", width: "160px" }],
        selectable: true,
        editable: "popup"
    });
    
});

function toolbar_add() {
	
	var rowData = getSelectedRowDataByGrid("grid");
	
	if (rowData == null) {
		model = new allocate();
	} else {
		model = rowData;
	}
	
	kendo.bind($("#allocate-edit"), model);
	
	init_popup();
	
	var eqDataSource = new kendo.data.DataSource({
        batch: true,
        schema: {
            model: eqModel
        }
    });
	eqDataSource.data(model.eqcostList);
	var grid = $("#equipments-grid").data("kendoGrid");
	grid.setDataSource(eqDataSource);
	
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

function init_popup() {
	var projectDataSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "../service/project/listforselect",
                dataType: "jsonp"
            }
        }
    });
	
	$("#in-projects").kendoComboBox({
        placeholder: "Select project",
        dataTextField: "projectName",
        dataValueField: "_id",
        filter: "contains",
        suggest: true,
        dataSource: projectDataSource,
        change: function(e) {
        	inProjectId = this.value();
        	
        	eqDataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: "../service/project/listequipments",
                        dataType: "jsonp",
                        data: {
                        	projectId: inProjectId
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
	
	$("#out-projects").kendoComboBox({
        placeholder: "Select project",
        dataTextField: "projectName",
        dataValueField: "_id",
        filter: "contains",
        suggest: true,
        dataSource: projectDataSource,
        change: function(e) {
        	outProjectId = this.value();
        }
    });
	
	$("#equipments-grid").kendoGrid({
	    toolbar: [
            { template: kendo.template($("#submit-template").html()) },
            { name: "cancel", text: "撤销编辑" }
	    ],
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
};

function toolbar_submit() {
	var data = eqDataSource.data();
	model.set("eqcostList", data);
	dataSource.add(model);
	dataSource.sync();
	dataSource.read();
	
	var window = $("#allocate-edit");
	if (window.data("kendoWindow")) {
		window.data("kendoWindow").close();
	}
};