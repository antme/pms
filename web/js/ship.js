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
        columns: [
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
						name = "已发货";
					} else if (dataItem.status == -1){
						name = "拒绝";
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

function toolbar_option(op) {
	var row = getSelectedRowDataByGridWithMsg("grid");
	if (row) {
		
		var nextStatus = false;
		
		if (op == 1) { // 提交申请
			if (row.status == 0) {
				nextStatus = 1;
			}
		} else if (op == 2) { // 批准
			if (row.status == 1 || row.status == -1) {
				nextStatus = 2;
			}
		} else if (op == 3) { // 拒绝
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

function openScViewWindow(param){
	var options = { width:"1080px", height: "600px", title:"销售合同信息"};
	openRemotePageWindow(options, "html/salescontract/viewsc.html", {_id : param});
}
