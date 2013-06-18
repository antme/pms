var dataSource, crudServiceBaseUrl = "../service/borrowing";

$(document).ready(function () {
    dataSource = new kendo.data.DataSource({
        transport: {
            read:  {
                url: crudServiceBaseUrl + "/list",
                dataType: "jsonp"
            },
            destroy: {
                url: crudServiceBaseUrl + "/destroy",
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
        	total: "total",
        	data: "data"
        }
    });

    $("#grid").kendoGrid({
        dataSource: dataSource,
        pageable: true,
        selectable: "row",
        toolbar: [ { template: kendo.template($("#template").html()) } ],
        columns: [
            { field:"applicant", title: "申请人" },
            { field: "applicationDate", title:"申请日期" },
            { field: "inProjectName", title:"调入项目名称" },
            { field: "inProjectManager", title:"调入项目负责人" },
            { field: "outProjectName", title:"调出项目名称" },
            { field: "outProjectManager", title:"调出项目负责人" },
            {
            	field: "status", title:"状态",
            	template:function(dataItem) {
					var name = "";
					if (dataItem.status == 0){
						name = "申请中";
					} else if (dataItem.status == 1){
						name = "已发货";
					} else { // status=2
						name = "打回";
					}
					return name;
				}
            },
            { command: ["destroy"], title: "&nbsp;", width: "160px" }],
        editable: "popup"
    });
});

function toolbar_add() {
	loadPage("addBorrowing");
}

function toolbar_edit() {
	var rowData = getSelectedRowDataByGrid("grid");
	if (rowData == null){
		alert("请点击选择一条记录！");
		return;
	}
	
	loadPage("addBorrowing",{_id:rowData._id});
}

function toolbar_approve() {
	var row = getSelectedRowDataByGridWithMsg("grid");
	if (row) {
		var param = {
			_id : row._id
		};
		postAjaxRequest(crudServiceBaseUrl + "/approve", param,
				callback);

	}

}

function toolbar_reject() {
	var row = getSelectedRowDataByGridWithMsg("grid");
	if (row) {
		var param = {
			"_id" : row._id
		};
		postAjaxRequest(crudServiceBaseUrl + "/reject", param,
				callback);
	}
}

function callback(response) {
	alert("操作成功");
	dataSource.read();
}
