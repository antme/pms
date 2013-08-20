//销售合同主要列表页 dataSource
var dataSource = new kendo.data.DataSource({
	transport : {
		read : {
			url : "../service/sc/list",
			dataType : "jsonp"
		},
		parameterMap : myTaskQueryParam	
	},
	schema : {
		total : "total", 
		data : "data",
		model : {
			fields : {
				contractAmount : {
					type : "number"
				},
				contractDate : {
					type : "date"
				}
			}
		}
	},

	pageSize: 10,
	serverPaging: true,
	serverSorting: true,
	serverFiltering : true,
	batch : true
});

$(document).ready(function() {
	checkRoles();
	$("#grid").kendoGrid({
		dataSource : dataSource,
		pageable : {
			buttonCount:5
		},
		editable : "popup",
		change : function(e) {
		    var selectedRows = this.select();
		    var len = selectedRows.length;
		    var guidangButton = $("#guidangButton").data("kendoDropDownList");
		    var runningStatusButton = $("#runningStatusButton").data("kendoDropDownList");
		    if (len == 1){
		    	guidangButton.enable(true);
		    	runningStatusButton.enable(true);
		    }else{
		    	guidangButton.enable(false);
		    	runningStatusButton.enable(false);
		    }
		},
		dataBound: function(e) {
			var guidangButton = $("#guidangButton").data("kendoDropDownList");
		    var runningStatusButton = $("#runningStatusButton").data("kendoDropDownList");
		    guidangButton.enable(false);
	    	runningStatusButton.enable(false);
		  },
		selectable: "row",
		height: "400px",
	    sortable : true,
		filterable : filterable,
		columns : [ {
			field : "contractCode",
			title : "合同编号",
			width : "160px"
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
			field : "runningStatus",
			title : "执行状态"
		}, {
			field : "archiveStatus",
			title : "归档状态"
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
		}, {
			field : "contractType",
			title : "合同类型"
		}]
	});
	
	$("#guidangButton").kendoDropDownList({
		dataTextField : "text",
		dataValueField : "value",
        optionLabel: "选择归档状态...",
		dataSource : archiveStatusItems,
		enable:false,
		select:function(e){
			var dataItem = this.dataItem(e.item.index());
			var rowData = getSelectedRowDataByGrid("grid");
			var rowStatus = rowData.archiveStatus;
			var selStatus = dataItem.value;
			if(rowStatus == selStatus){
				alert("选定记录当前状态已为"+selStatus);
				return;
			}else if (confirm("确认修改归档状态？")){
				var param = {_id : rowData._id,archiveStatus:selStatus};
				postAjaxRequest("../service/sc/setarchivestatus", param, setXxCallBack);
			}
		}
	});
	
	$("#runningStatusButton").kendoDropDownList({
		dataTextField : "text",
		dataValueField : "value",
        optionLabel: "选择执行状态...",
		dataSource : runningStatusItems,
		enable:false,
		select:function(e){
			var dataItem = this.dataItem(e.item.index());
			var rowData = getSelectedRowDataByGrid("grid");
			var rowStatus = rowData.runningStatus;
			var selStatus = dataItem.value;
			if(rowStatus == selStatus){
				alert("选定记录当前状态已为"+selStatus);
				return;
			}else if (confirm("确认修改执行状态？")){
				var param = {_id : rowData._id,runningStatus:selStatus};
				postAjaxRequest("../service/sc/setrunningstatus", param, setXxCallBack);
			}
			
		}
	});
});//end dom ready	


function setXxCallBack(data){
	if (data._id != null && data._id != ""){
		alert("操作成功！");
		dataSource.read();
	}else{
		alert("服务器出错，请重新操作！");
	}
	
}

function toolbar_deleteSalesContract() {
	var rowData = getSelectedRowDataByGrid("grid");
	alert("Delete the row _id: " + rowData._id);
  	return false;
};//end toolbar_delete
	
function toolbar_addSalesContract(){
	loadPage("salescontract_addsc");
}

function toolbar_modifySalesContract() {
	var rowData = getSelectedRowDataByGrid("grid");
	if (rowData == null){
		alert("请点击选择一条合同记录！");
		return;
	}
	loadPage("salescontract_editsc",{_id:rowData._id,status:rowData.status});
};

function toolbar_addPCForRuodianSC(){
	var rowData = getSelectedRowDataByGrid("grid");
	if (rowData == null){
		alert("请点击选择一条弱电工程类合同！");
		return;
	}
	if (rowData.contractType == "弱电工程"){
		var options = { width:"800px", height: "760px", title:"新建采购合同-弱电工程"};
		loadPage("purchasecontract_purchasecontractedit", {addInSCList:1, projectId:rowData.projectId, scId:rowData._id, contractCode:rowData.contractCode});
	}else{
		alert("请点击选择一条弱电工程类合同！");
		return;
	}
	
}

function toolbar_viewSalesContract() {
	var rowData = getSelectedRowDataByGrid("grid");
	if (rowData == null){
		alert("请点击选择一条合同记录！");
		return;
	}
	loadPage("salescontract_viewsc",{_id:rowData._id});
};

function toolbar_viewEqListHistory(){
	var rowData = getSelectedRowDataByGrid("grid");
	if (rowData == null){
		alert("请点击选择一条合同记录！");
		return;
	}
	
	var options = { width:"900px", height: "600px", title:"成本设备变更历史"};
	openRemotePageWindow(options, "salescontract_eqcostChangeHistory", {_id:rowData._id});
}

function openTraceWindow(param){
	var options = { width:"680px", height: "400px", title:"合同金额变更历史"};
	openRemotePageWindow(options, "salescontract_traceSCAmount", {_id : param});
}

function viewProject(param){
	var options = { width:"680px", height: "480px", title:"项目信息"};
	openRemotePageWindow(options, "project_addProject", {_id : param});
}


	
	
	
	
	