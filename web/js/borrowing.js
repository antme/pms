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
						name = "借货申请中";
					} else if (dataItem.status == 1){
						name = "借货申请已批准";
					} else if (dataItem.status == 2){
						name = "还货申请中";
					} else if (dataItem.status == 3){
						name = "还货申请已批准";
					} else if (dataItem.status == -1){
						name = "借货申请被拒绝";
					} else if (dataItem.status == -3){
						name = "还货申请被拒绝";
					} else {
						name = "未知";
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

function toolbar_option(op) {
	var row = getSelectedRowDataByGridWithMsg("grid");
	if (row) {
		
		var nextStatus = false;
		
		if (op == 1) { // 批准操作
			if (row.status == 0) { // 借货申请
				nextStatus = 1;
			} else if (row.status == 2) { // 还货申请
				nextStatus = 3;
			}
		} else if (op == 2) { // 拒绝操作
			if (row.status == 0) { // 借货申请
				nextStatus = -1;
			} else if (row.status == 2) { // 还货申请
				nextStatus = -3;
			}
		} else if (op == 3) { // 还货操作
			if (row.status == 1) {
				nextStatus = 2;
			}
		}
		
		if (nextStatus) {
			var param = {
					"_id" : row._id,
					"status" : nextStatus
				};
			postAjaxRequest(crudServiceBaseUrl + "/option", param,
						callback);
		} else {
			alert("无法执行该操作");
		}
	}
}

function callback(response) {
	alert("操作成功");
	dataSource.read();
}
