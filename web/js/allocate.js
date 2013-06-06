var dataSource;
var eqDataSource;
var projectName;
$(document).ready(function () {
    dataSource = new kendo.data.DataSource({
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
                        ProductName: {},
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
            { field:"projectName", title: "项目名称" },
            { command: ["edit", "destroy"], title: "&nbsp;", width: "160px" }],
        editable: "popup"
    });
});

function toolbar_add() {
	init_popup();
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
        	projectName = this.text();
        	eqDataSource = new kendo.data.DataSource({
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
        	grid.setDataSource(eqDataSource);
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
	dataSource.add({ projectName: projectName, eqcostList: kendo.stringify(data) });
	dataSource.sync();
};