$(document).ready(function () {
    var crudServiceBaseUrl = "../service/ship",
        dataSource = new kendo.data.DataSource({
            transport: {
                read:  {
                    url: crudServiceBaseUrl + "/list",
                    dataType: "jsonp"
                },
                update: {
                    url: crudServiceBaseUrl + "/update",
                    dataType: "jsonp"
                },
                destroy: {
                    url: crudServiceBaseUrl + "/destroy",
                    dataType: "jsonp"
                },
                create: {
                    url: crudServiceBaseUrl + "/create",
                    dataType: "jsonp"
                },
                parameterMap: function(options, operation) {
                    if (operation !== "read" && options.models) {
                        return {models: kendo.stringify(options.models)};
                    }
                }
            },
            batch: true,
            pageSize: 15,
            schema: {
                model: {
                    id: "_id",
                    fields: {
                    	applicationDepartment: {},
                    	applicationDate: {},
                    	salesContractNo: {},
                    	customerName: {}
                    }
                }
            }
        });

    $("#grid").kendoGrid({
        dataSource: dataSource,
        pageable: true,
        toolbar: [ { template: kendo.template($("#template").html()) } ],
        columns: [
            { field:"applicationDepartment", title: "申请部门" },
            { field: "applicationDate", title:"申请日期", format: "{0:MM/dd/yyyy HH:mm tt}" },
            { field: "salesContractNo", title:"销售合同编号" },
            { field: "customerName", title:"客户名称" },
            { command: ["edit", "destroy"], title: "&nbsp;", width: "160px" }],
        editable: "popup"
    });
});

function toolbar_add() {
	loadPage("addShip");
}