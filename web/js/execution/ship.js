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
            { field: "shipType", title: "发货类型"},
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
		if (rowData.status == "草稿" || rowData.status == "已拒绝"){
			loadPage("execution_addShip",{_id:rowData._id});
		} else {
			alert("只允许编辑已拒绝或则草稿数据");
		}
	}
}


function toolbar_confirm() {
	var rowData = getSelectedRowDataByGridWithMsg("grid");
	if (rowData) {
		if (rowData.status == "已批准"){
			if(rowData.shipType == "直发"){
				if(user.isPurchase){
					loadPage("execution_addShip",{_id:rowData._id, type: "confirm"});
				}else{
					alert("直发类发货确认只能由采购确认");
				}
			}else{
				if(user.isDepotManager){
					loadPage("execution_addShip",{_id:rowData._id, type: "confirm"});
				}else{
					alert("非直发类发货确认只能由库管确认");
				}
			}
		} else {
			alert("只能确认已批准后的发货申请");
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


function toolbar_approve_ship(op) {
	var row = getSelectedRowDataByGridWithMsg("grid");
	var url =crudServiceBaseUrl + "/approve";
	if (row) {
		if (row.status == "申请中") {
			var param = {
				_id : row._id
			};
			postAjaxRequest(url, param, function(response){
				alert("批准成功");
				dataSource.read();
			});
		} else {
			alert("非申请中状态，不允许审核");
		}
	}
}

function toolbar_reject_ship(op) {
	var row = getSelectedRowDataByGridWithMsg("grid");
	var url =crudServiceBaseUrl + "/reject";
	if (row) {
		if (row.status == "申请中") {
			var param = {
				_id : row._id
			};
			postAjaxRequest(url, param, function(response){
				alert("拒绝成功");
				dataSource.read();
			});
		} else {
			alert("非申请中状态，不允许审核");
		}
	}
}




