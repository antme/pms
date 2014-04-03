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
            { field:"borrowCode", title: "编号" ,
				template : function(dataItem) {
					return '<a  onclick="openBorrowingViewWindow(\'' + dataItem._id + '\');">' + dataItem.borrowCode + '</a>';
				
				}
            	
            },
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


function toolbar_deleteBorrowing() {
	var rowData = getSelectedRowDataByGridWithMsg("grid");
	if (rowData) {
		if (rowData.status == "已提交" || rowData.status == "审批拒绝"){
			if(confirm('确实要删除该内容吗?')) {
				dataSource.remove(rowData);
				dataSource.sync();
			}
		} else {
			alert("只允许删除已提交或者审批拒绝的数据");
		}
	}
}

function toolbar_approveBorrowing() {
	var row = getSelectedRowDataByGridWithMsg("grid");
	if (row) {
		
		// 
		if (row.status == "已提交") {
			loadPage("execution_addBorrowing",{_id:row._id, page:"approve"});
		} else {
			alert("只允许审核已提交的数据");
		}
	}
}


function toolbar_backborrowing() {
	var row = getSelectedRowDataByGridWithMsg("grid");
	if (row) {
		
		// 
		if (row.status == "已借货" && !row.backStatus) {
			loadPage("execution_addBorrowing",{_id:row._id, page:"returnborrowing"});
		} else {
			alert("只允许提交已借货未还货的数据");
		}
	}
}

function toolbar_confirmborrowing() {
	var rowData = getSelectedRowDataByGridWithMsg("grid");
	if (rowData) {
		if (rowData.status == "审批通过"){
			loadPage("execution_addBorrowing",{_id:rowData._id, page:"confirmborrowing"});
		} else {
			alert("只允许确认审批通过的数据");
		}
	}
}


function toolbar_accept_borrowing_return(){
	var row = getSelectedRowDataByGridWithMsg("grid");
	if (row) {		
		// 
		if (row.backStatus == "待确认") {
			loadPage("execution_addBorrowing",{_id:row._id, page:"confirmreturnborrowing"});
		} else {
			alert("只允许确认待还货确认的数据");
		}
	}
}

function callback(response) {
	alert("操作成功");
	dataSource.read();
}
