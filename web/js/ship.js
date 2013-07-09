var dataSource, crudServiceBaseUrl = "../service/ship";
        
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
                	type: {},
                	applicationDepartment: {},
                	applicationDate: {},
                	contractCode: {},
                	customer: {},
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
        columns: [
            {
            	field:"type",
            	title: "类型",
            	template:function(dataItem) {
					var name = "";
					if (dataItem.type == 0){
						name = "供应商直发";
					} else if (dataItem.type == 1){
						name = "非供应商直发";
					} else {
						name = dataItem.type;
					}
					return name;
				},
				filterable : {
					ui: function(e){
						e.kendoDropDownList({
							dataTextField: "text",
					        dataValueField: "value",
					        optionLabel : "选择发货类型...",
					        dataSource: shipTypeItems
						});
					}
				}
            },
            { field:"applicationDepartment", title: "申请部门" },
            { field: "applicationDate", title:"申请日期" },
            {
            	field: "contractCode",
            	title:"销售合同编号",
				template : function(dataItem) {
					if (dataItem.contractCode) {
						return '<a  onclick="openScViewWindow(\'' + dataItem.salesContractId + '\');">' + dataItem.contractCode + '</a>';
					} else {
						return '';
					}
				}
            },
            { field: "customer", title:"客户名称" },
            {
            	field: "status", title:"状态",
            	template:function(dataItem) {
					var name = "";
					if (dataItem.status == 0){
						name = "草稿";
					} else if (dataItem.status == 1){
						name = "申请中";
					} else if (dataItem.status == 2){
						name = "批准";
					} else if (dataItem.status == -1){
						name = "拒绝";
					} else if (dataItem.status == -2){
						name = "终止";
					} else if (dataItem.status == 3){
						name = "关闭";
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

function toolbar_add() {
	loadPage("addShip");
}

function toolbar_edit() {
	var rowData = getSelectedRowDataByGridWithMsg("grid");
	if (rowData) {
		if (rowData.status == 0 || rowData.status == -1){
			loadPage("addShip",{_id:rowData._id});
		} else {
			alert("无法执行该操作");
		}
	}
}

function toolbar_record() {
	var rowData = getSelectedRowDataByGridWithMsg("grid");
	if (rowData) {
		if (rowData.status == 2 && rowData.type == 0){
			loadPage("shipRecord",{_id:rowData._id});
		} else {
			alert("无法执行该操作");
		}
	}
}

function toolbar_confirm() {
	var rowData = getSelectedRowDataByGridWithMsg("grid");
	if (rowData) {
		if (rowData.status == 2 && rowData.type == 1){
			loadPage("shipRecord",{_id:rowData._id});
		} else {
			alert("无法执行该操作");
		}
	}
}

function toolbar_delete() {
	var rowData = getSelectedRowDataByGridWithMsg("grid");
	if (rowData) {

		if (rowData.status == 0){
			if(confirm('确实要删除该内容吗?')) {
				dataSource.remove(rowData);
				dataSource.sync();
			}
		} else {
			alert("无法执行该操作");
		}
	}
}

function toolbar_submit(op) {
	var row = getSelectedRowDataByGridWithMsg("grid");
	if (row) {
		
		var nextStatus = false;
		
		if (op == 1) { // 提交申请
			// 草稿或打回
			if (row.status == 0 || row.status == -1) {
				nextStatus = 1;
			}
		} else if (op == 2) { // 终止
			if (row.status == 2) {
				nextStatus = -2;
			}
		}
		
		if (nextStatus) {
			var param = {
					_id : row._id,
					"status" : nextStatus
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
		
		if (op == 1) { // 批准
			if (row.status == 1 || row.status == -1) {
				nextStatus = 2;
			}
		} else if (op == 2) { // 拒绝
			if (row.status == 1) {
				nextStatus = -1;
			}
		}
		
		if (nextStatus) {
			var param = {
					_id : row._id,
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

function toolbar_view(){
	var rowData = getSelectedRowDataByGridWithMsg("grid");
	if (rowData) {
		var options = { width:"1080px", height: "500px", title:"发货信息"};
		openRemotePageWindow(options, "html/execution/addShip.html", {_id : rowData._id});
	}
}

function openScViewWindow(param){
	var options = { width:"1080px", height: "600px", title:"销售合同信息"};
	openRemotePageWindow(options, "html/salescontract/viewsc.html", {_id : param});
}
