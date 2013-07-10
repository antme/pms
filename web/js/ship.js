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
            	   field: "shipCode",
            	   title: "编号",
            	   template : function(dataItem) {
            		   console.log(dataItem);
       					return '<a  onclick="openShipViewWindow(\'' + dataItem._id + '\');">' + dataItem.shipCode + '</a>';      				
       				}
               },
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
	loadPage("addShip");
}

function toolbar_edit() {
	var rowData = getSelectedRowDataByGridWithMsg("grid");
	if (rowData) {
		if (rowData.status == "已批准" || rowData.status == "已关闭"){
			alert("不允许编辑");
		} else {
			loadPage("addShip",{_id:rowData._id});
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



