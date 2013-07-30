var dataSource, crudServiceBaseUrl = "../service/return";

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
                dataType: "jsonp"
            },
            parameterMap: function(options, operation) {
                if (operation !== "read" && options.models) {
                    return {models: kendo.stringify(options.models)};
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
                	applicant: {},
                	applicationDate: {},
                	borrowId: {},
                	borrowCode: {},
                	status: {}
                }
            }
        }
    });

    $("#grid").kendoGrid({
        dataSource: dataSource,
        pageable : true,
		sortable : true,
		filterable : filterable,
        selectable: "row",
        height: "400px",
        columns: [
            { field:"applicant", title: "申请人" },
            { field: "applicationDate", title:"申请日期" },
            {
            	field: "borrowCode",
            	title:"借货申请编号",
				template : function(dataItem) {
					if (dataItem.borrowCode) {
						return '<a  onclick="openProjectViewWindow(\'' + dataItem.borrowId + '\');">' + dataItem.borrowCode + '</a>';
					} else {
						return '';
					}
				}
            },
            {
            	field: "status", title:"状态",
            	template:function(dataItem) {
					var name = "";
					if (dataItem.status == 0){
						name = "待还货";
					} else if (dataItem.status == 1){
						name = "还货申请中";
					} else if (dataItem.status == 2){
						name = "还货申请已批准";
					} else if (dataItem.status == -1){
						name = "还货申请被拒绝";
					} else {
						name = "未知";
					}
					return name;
				}
            }
        ],
        editable: "popup"
    });
});

function toolbar_submit() {
	var row = getSelectedRowDataByGridWithMsg("grid");
	if (row) {
		
		// 草稿或打回
		if (row.status == 0 || row.status == -1) {
			var param = {
					_id : row._id,
					"status" : "1"
				};
			postAjaxRequest(crudServiceBaseUrl + "/submit", param,
						callback);
		} else {
			alert("无法执行该操作");
		}
	}
}

function toolbar_option(op) {
	var row = getSelectedRowDataByGridWithMsg("grid");
	if (row) {
		
		var nextStatus = false;
		
		if (op == 1) { // 批准操作
			if (row.status == 1) {
				nextStatus = 2;
			}
		} else if (op == 2) { // 拒绝操作
			if (row.status == 1) { // 还货申请
				nextStatus = -1;
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

function openProjectViewWindow(param){
	var options = { width:"1080px", height: "600px", title:"借货信息"};
	openRemotePageWindow(options, "execution_addBorrowing", {_id : param});
}
