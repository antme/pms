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
                    	createdOn: {},
                    	contractCode: {},
                    	customer: {}
                    }
                }
            }
        });

    $("#grid").kendoGrid({
        dataSource: dataSource,
        pageable: true,
        selectable: "row",
        toolbar: [ { template: kendo.template($("#template").html()) } ],
        columns: [
            { field:"applicationDepartment", title: "申请部门" },
            { field: "createdOn", title:"申请日期", format: "{0:MM/dd/yyyy HH:mm tt}" },
            { field: "contractCode", title:"销售合同编号" },
            { field: "customer", title:"客户名称" },
            { command: ["destroy"], title: "&nbsp;", width: "160px" }],
        editable: "popup"
    });
});

function toolbar_add() {
	loadPage("addShip");
}

function toolbar_edit() {
	var rowData = getSelectedRowDataByGrid("grid");
	if (rowData == null){
		alert("请点击选择一条记录！");
		return;
	}
	
	loadPage("addShip",{_id:rowData._id});
}