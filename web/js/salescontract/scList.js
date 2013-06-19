//销售合同主要列表页 dataSource
var dataSource = new kendo.data.DataSource({
	transport : {
		read : {
			url : "../service/sc/list",
			dataType : "jsonp"
		},
		update : {
			url : "../service/sc/update",
			dataType : "jsonp",
			method : "post"
		},
		create : {
			url : "../service/sc/add",
			dataType : "jsonp",
			method : "post"
		},
	},
	schema: {
	    total: "total", // total is returned in the "total" field of the response
	    data: "data"
	},

	pageSize: 5,
    serverPaging: true,
	batch : true,
	
	parameterMap : function(options, operation) {
		if (operation !== "read" && options.models) {
			return {
				models : kendo.stringify(options.models)
			};
		}
	}
});

$(document).ready(function() {
	
	$("#grid").kendoGrid({
		dataSource : dataSource,
		pageable : {
			buttonCount:5,
			//input:true,
			//pageSizes:true
		},
		editable : "popup",
		toolbar : [ { template: kendo.template($("#template").html()) } ],
		selectable: "row",
        sortable: {
            mode: "multiple",
            allowUnsort: true
        },
		columns : [ {
			field : "contractCode",
			title : "合同编号"
		},{
			field : "projectCode",
			title : "项目编号"
		}, {
			field : "projectName",
			title : "项目名",
			template : function(dataItem) {
				return '<a  onclick="viewProject(\'' + dataItem.projectId + '\');">' + dataItem.projectName + '</a>';
			}
		}, {
			field : "projectManager",
			title : "PM"
		}, {
			field : "customer",
			title : "客户名"
		}, {
			field : "contractAmount",
			title : "合同金额",
			template : function(dataItem) {
				return '<a  onclick="openTraceWindow(\'' + dataItem._id + '\');">' + dataItem.contractAmount + '</a>';
			}
		}, {
			field : "contractDate",
			title : "签订日期",
			format: "{0:yyyy/MM/dd}"
		}]
	});
});//end dom ready	

function toolbar_deleteSalesContract() {
	var rowData = getSelectedRowDataByGrid("grid");
	alert("Delete the row _id: " + rowData._id);
  	return false;
};//end toolbar_delete
	
function toolbar_addSalesContract(){
	loadPage("addsc");
}

function toolbar_modifySalesContract() {
	var rowData = getSelectedRowDataByGrid("grid");
	if (rowData == null){
		alert("请点击选择一条合同记录！");
		return;
	}
	loadPage("editsc",{_id:rowData._id});
};

function toolbar_viewSalesContract() {
	var rowData = getSelectedRowDataByGrid("grid");
	if (rowData == null){
		alert("请点击选择一条合同记录！");
		return;
	}
	loadPage("viewsc",{_id:rowData._id});
};

function openTraceWindow(param){
	var options = { width:"680px", height: "400px", title:"合同金额变更历史"};
	openRemotePageWindow(options, "html/salescontract/traceSCAmount.html", {_id : param});
}

function viewProject(param){
	var options = { width:"680px", height: "480px", title:"项目信息"};
	openRemotePageWindow(options, "html/project/addProject.html", {_id : param});
}


	
	
	
	
	