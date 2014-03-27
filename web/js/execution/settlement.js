var  dataSource = new kendo.data.DataSource({
    transport: {
        read:  {
            url: "/service/ship/settlement/list",
            dataType: "jsonp"
        },
        destroy: {
            url: "/service/ship/settlement/destroy",
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
            	customerName: {},
            	status: {}
            }
        }
    }
});


        
$(document).ready(function () {
//	checkRoles();
    
    $("#grid").kendoGrid({
        dataSource: dataSource,
        pageable : true, resizable: true,
		sortable : true,
		filterable : filterable,
        selectable: "row",
        height: "400px",
        columns: [
               {
            	   field: "settlementCode",
            	   title: "编号",
            	   template : function(dataItem) {
       					return '<a  onclick="openSettlmentWindow(\'' + dataItem._id + '\');">' + dataItem.settlementCode + '</a>';      				
       				}
               },
              
            { field:"applicationDepartment", title: "申请部门" },
            { field: "applicationDate", title:"申请日期" },
            {
            	field: "projectName",
            	title:"项目"
            },
            {
            	field: "projectManagerName",
            	title:"PM"
            },
            { field: "customerName", title:"客户名称" },
            {
            	field: "status", title:"状态"
            }
        ],
        editable: "popup"
    });
});

function toolbar_addSettlement() {
	loadPage("execution_addSettlement");
}

function toolbar_editSettlement() {
	var rowData = getSelectedRowDataByGridWithMsg("grid");
	if (rowData) {
		if (rowData.status == "草稿" || rowData.status == "已拒绝" || rowData.status == "申请中"){
			loadPage("execution_addSettlement",{_id:rowData._id});
		} else {
			alert("只允许编辑已拒绝,草稿或者申请中的数据");
		}
	}
}

function toolbar_deleteSettlement() {
	var rowData = getSelectedRowDataByGridWithMsg("grid");
	if (rowData) {

//		if (rowData.status == "草稿" || rowData.status == "已拒绝" || rowData.status == "申请中") {
			if (confirm('确实要删除该内容吗?')) {
				dataSource.remove(rowData);
				dataSource.sync();
			}
//		} else {
//			alert("不允许删除");
//		}
	}
}


function toolbar_approve_settlement() {
	var row = getSelectedRowDataByGridWithMsg("grid");
	if (row) {
		if (row.status == "申请中") {

			loadPage("execution_addSettlement",{_id:row._id, type: "approve"});
		} else {
			alert("非申请中状态，不允许审核");
		}
	}
}



