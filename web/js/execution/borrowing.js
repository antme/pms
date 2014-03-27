var dataSource, crudServiceBaseUrl = "../service/borrowing";

$(document).ready(function () {
	checkRoles();
    dataSource = new kendo.data.DataSource({
        transport: {
            read:  {
                url: crudServiceBaseUrl + "/list",
                dataType: "jsonp"
            },
            destroy: {
                url: crudServiceBaseUrl + "/destroy",
                dataType: "jsonp",
                type: "POST"
            },
            parameterMap: function(options, operation) {
                if (operation !== "read" && options.models) {
                    return {models: kendo.stringify(options.models)};
                }else if(operation == "read"){
        			//必须放在transport内，mytasks参数来至于点击我的任务
        			return myTaskQueryParam(options, operation);		
                }
            }
        },
        batch: true,
        pageSize: 10,
    	serverPaging: true,
    	serverSorting: true,
    	serverFiltering : true,
        schema: {
        	total: "total",
        	data: "data",
        	model: {
                id: "_id",
                fields: {
                	borrowCode: {},
                	applicant: {},
                	applicationDate: {},
                	inProjectName: {},
                	inProjectManager: {},
                	outProjectName: {},
                	outProjectManager: {},
                	status: {}
                }
            }
        }
    });

    $("#grid").kendoGrid({
        dataSource: dataSource,
        pageable : true, resizable: true,
		sortable : true,
		filterable : filterable,
        selectable: "row",
        height: "400px",
        columns: [
            { field:"borrowCode", title: "编号" },
            { field: "applicationDate", title:"申请日期" },
            {
            	field: "inProjectName",
            	title:"调入项目",
				template : function(dataItem) {
					if (dataItem.outProjectName) {
						return '<a  onclick="openProjectViewWindow(\'' + dataItem.inProjectId + '\');">' + dataItem.inProjectName + '</a>';
					} else {
						return '';
					}
				}
            },
            { field: "inProjectManager", title:"调入项目经理" },
            {
            	field: "outProjectName",
            	title:"调出项目",
				template : function(dataItem) {
					if (dataItem.outProjectName) {
						return '<a  onclick="openProjectViewWindow(\'' + dataItem.outProjectId + '\');">' + dataItem.outProjectName + '</a>';
					} else {
						return '';
					}
				}
            },
            { field: "outProjectManager", title:"调出项目经理" },
            {
            	field: "status", title:"借货状态"
            },
            {
            	field: "backStatus", title:"换货状态"
            },
        ],
        editable: "popup"
    });
});

function toolbar_addBorrwoing() {
	loadPage("execution_addBorrowing");
}

function toolbar_editBorrowing() {
	var rowData = getSelectedRowDataByGridWithMsg("grid");
	if (rowData) {
//		if (rowData.status == 0 || rowData.status == 1 || rowData.status == -1){
			loadPage("execution_addBorrowing",{_id:rowData._id});
//		} else {
//			alert("无法执行该操作");
//		}
	}
}

function toolbar_deleteBorrowing() {
	var rowData = getSelectedRowDataByGridWithMsg("grid");
	if (rowData) {
//		if (rowData.status == 0){
			if(confirm('确实要删除该内容吗?')) {
				dataSource.remove(rowData);
				dataSource.sync();
			}
//		} else {
//			alert("无法执行该操作");
//		}
	}
}

function toolbar_backborrowing() {
	var row = getSelectedRowDataByGridWithMsg("grid");
	if (row) {
		
		// 草稿或打回
		if (row.status == 0 || row.status == -1) {
			var param = {
					_id : row._id,
					"status" : "1"
				};
			postAjaxRequest(crudServiceBaseUrl + "/submit", param, callback);
		} else {
			alert("无法执行该操作");
		}
	}
}

function toolbar_approveborrowing() {
	var rowData = getSelectedRowDataByGridWithMsg("grid");
	if (rowData) {
//		if (rowData.status == 0 || rowData.status == 1 || rowData.status == -1){
			loadPage("execution_addBorrowing",{_id:rowData._id, page:"approve"});
//		} else {
//			alert("无法执行该操作");
//		}
	}
}

function callback(response) {
	alert("操作成功");
	dataSource.read();
}
