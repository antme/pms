//销售合同主要列表页 dataSource
var dataSource = new kendo.data.DataSource({
	transport : {
		read : {
			url : "../service/sc/list",
			dataType : "jsonp",
			type : "post"
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
	    resizable: true,
		filterable : filterable,
		columns : [ {
			field : "contractCode",
			title : "合同编号",
			width : "160px"
		},{
			field : "projectCode",
			title : "项目编号",
			width: 170
		}, {
			field : "projectName",
			title : "项目名",
			template : function(dataItem) {
				return '<a  onclick="openProjectViewWindow(\'' + dataItem.projectId + '\');">' + dataItem.projectName + '</a>';
			}
		}, {
			field : "contractPerson",
			title : "签订人",
			width: 80
		}, {
			field : "runningStatus",
			title : "执行状态",
			width: 90,
			filterable : {
				ui: function(e){
					e.kendoDropDownList({
						dataSource : runningStatusItems,
						optionLabel : "...",
						dataTextField : "text",
						dataValueField : "text"
					});
				}
			}
				
		}, {
			field : "archiveStatus",
			title : "归档状态",
			width: 90,
			filterable : {
				ui: function(e){
					e.kendoDropDownList({
						dataSource : archiveStatusItems,
						optionLabel : "...",
						dataTextField : "text",
						dataValueField : "text"
					});
				}
			}
		}, {
			field : "customerName",
			title : "客户名"
		}, {
			field : "contractAmount",
			title : "合同金额",
			template : function(dataItem) {
				return '<a  onclick="openTraceWindow(\'' + dataItem._id + '\');">' + dataItem.contractAmount + '</a>';
			}
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
				postAjaxRequest("../service/sc/setarchivestatus", param, setStatusCallBack);
			}
		}
	});
	
	$("#scStatusButton").kendoDropDownList({
		dataTextField : "text",
		dataValueField : "value",
        optionLabel: "选择立项状态",
		dataSource : proStatusItems,
		select:function(e){
			var dataItem = this.dataItem(e.item.index());
			var grid = $("#grid").data("kendoGrid");
			if(dataItem.text!="选择立项状态"){
				dataSource.read({projectStatus:dataItem.text});
			}else{
				dataSource.read();
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
				postAjaxRequest("../service/sc/setrunningstatus", param, setExecuteCallBack);
			}
			
		}
	});
	
	
	
	$("#draftGrid").kendoGrid({
		dataSource : dataSource,
		pageable : {
			buttonCount:5
		},
		
		selectable: "row",
		height: "400px",
	    sortable : true,
		filterable : filterable,
		columns : [ {
			field : "contractCode",
			title : "合同编号",
			width : "160px"
		}, {
			field : "projectName",
			title : "项目名"
		}, {
			field : "projectStatus",
			title : "项目状态"
		}, {
			field : "projectType",
			title : "项目类型"
		}, {
			field : "archiveStatus",
			title : "归档状态"
		}, {
			field : "customerName",
			title : "客户名"
		}, {
			field : "contractType",
			title : "合同类型"
		}]
	});
	
});//end dom ready	


function setStatusCallBack(data){
	if (data._id != null && data._id != ""){
		alert("修改归档状态成功!");
		dataSource.read();
	}else{
		alert("服务器出错，请重新操作！");
	}
	
}

function setExecuteCallBack(data){
	if (data._id != null && data._id != ""){
		alert("修改执行状态成功");
		dataSource.read();
	}else{
		alert("服务器出错，请重新操作！");
	}
	
}

function toolbar_addSalesContract(){
	loadPage("salescontract_addsc");
}

function toolbar_modifySalesContract() {
	var rowData = getSelectedRowDataByGrid("grid");
	if (rowData == null){
		alert("请点击选择一条合同记录！");
		return;
	}
	
	if(rowData.status == "草稿" && !rowData.projectId){
		loadPage("salescontract_addsc",{_id:rowData._id, pageId:"newProject"});
	}else{
		loadPage("salescontract_editsc",{_id:rowData._id,status:rowData.status});
	}
};

function toolbar_modifySalesDraftContract() {
	var rowData = getSelectedRowDataByGrid("draftGrid");
	if (rowData == null){
		alert("请点击选择一条合同记录！");
		return;
	}
	
	if(rowData.status == "草稿"){
		loadPage("salescontract_addsc",{_id:rowData._id, pageId:"newProject"});
	}else{
		loadPage("salescontract_editsc",{_id:rowData._id,status:rowData.status});
	}
};

function toolbar_addPCForRuodianSC(){
	var rowData = getSelectedRowDataByGrid("grid");
	if (rowData == null){
		alert("请点击选择一条弱电工程类合同！");
		return;
	}
	if (rowData.contractType == "弱电工程"){
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

function toolbar_viewCommerceInfoHistory(){
	var rowData = getSelectedRowDataByGrid("grid");
	if (rowData == null){
		alert("请点击选择一条合同记录！");
		return;
	}
	
	var options = { width:"900px", height: "600px", title:"商务信息变更历史"};
	openRemotePageWindow(options, "salescontract_commerceInfoChangeHistory", {_id:rowData._id});
}

function openTraceWindow(param){
	var options = { width:"680px", height: "400px", title:"合同金额变更历史"};
	openRemotePageWindow(options, "salescontract_traceSCAmount", {_id : param});
}


function toolbar_export(){
	postAjaxRequest("/service/sc/export", {}, function(data){
		
		$("#download-link").attr("href", "/upload/" + data.file);
		$("#download-link").show();
	});
}
	
	