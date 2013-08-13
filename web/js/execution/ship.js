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
        height: "400px",
        columns: [
               {
            	   field: "shipCode",
            	   title: "编号",
            	   template : function(dataItem) {
       					return '<a  onclick="openShipViewWindow(\'' + dataItem._id + '\');">' + dataItem.shipCode + '</a>';      				
       				}
               },
              
            { field:"applicationDepartment", title: "申请部门" },
            { field: "applicationDate", title:"申请日期" },
            {
            	field: "contractCode",
            	title:"销售合同编号",
				template : function(dataItem) {
					if (dataItem.contractCode) {
						return '<a  onclick="openSCViewWindow(\'' + dataItem.salesContractId + '\');">' + dataItem.contractCode + '</a>';
					} else {
						return '';
					}
				}
            },
            { field: "customer", title:"客户名称" },
            {
            	field: "status", title:"状态"
            }
        ],
        editable: "popup"
    });
});

function toolbar_add() {
	loadPage("execution_addShip");
}

function toolbar_edit() {
	var rowData = getSelectedRowDataByGridWithMsg("grid");
	if (rowData) {
		if (rowData.status == "已批准" || rowData.status == "已关闭"){
			alert("不允许编辑");
		} else {
			loadPage("execution_addShip",{_id:rowData._id});
		}
	}
}


function toolbar_confirm() {
	var rowData = getSelectedRowDataByGridWithMsg("grid");
	if (rowData) {
		if (rowData.status == "已批准"){
			loadPage("execution_addShip",{_id:rowData._id, type: "confirm"});
		} else {
			alert("申请还未审批");
		}
	}
}

function toolbar_delete() {
	var rowData = getSelectedRowDataByGridWithMsg("grid");
	if (rowData) {

		if (rowData.status == "草稿" || rowData.status == "已拒绝" || rowData.status == "申请中") {
			if (confirm('确实要删除该内容吗?')) {
				dataSource.remove(rowData);
				dataSource.sync();
			}
		} else {
			alert("不允许删除");
		}
	}
}


function toolbar_option(op) {
	var row = getSelectedRowDataByGridWithMsg("grid");
	var url =crudServiceBaseUrl + "/approve";
	if(op == 2){
		url = crudServiceBaseUrl + "/approve";
	}
	if (row) {
		if (row.status == "申请中") {
			var param = {
				_id : row._id
			};
			postAjaxRequest(url, param, callback);
		} else {
			alert("非申请中状态，不允许审核");
		}
	}
}

function callback(response) {
	alert("操作成功");
	dataSource.read();
}



