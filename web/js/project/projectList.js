

var projectDataSource = new kendo.data.DataSource({
	transport : {
		read : {
			url : "/service/project/list",
			dataType : "jsonp",
			type : "post"
		}
	},
	
	schema: {
	    total: "total", // total is returned in the "total" field of the response
	    data: "data"
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
		dataSource : projectDataSource,
		pageable : true,
		sortable : true,
		resizable: true,
		filterable : filterable,
// pageable : {
// buttonCount:5,
//			//input:true,
//			//pageSizes:true
//		},
		editable : "popup",
		selectable: "row",
		height: "400px",
//        sortable: {
//            mode: "multiple",
//            allowUnsort: true
//        },
		columns : [ {
			field : "projectCode",
			title : "项目编号",
			width: 170,
			template : function(dataItem) {
				if(dataItem.projectCode){
					return '<a  onclick="openProjectViewWindow(\'' + dataItem._id + '\');">' + dataItem.projectCode + '</a>';
				}else{
					return '';
				}
			}
		}, {
			field : "projectName",
			title : "项目名",
			width: 250,
			template : function(dataItem) {
				if(dataItem.projectName){
					return '<a  onclick="openProjectViewWindow(\'' + dataItem._id + '\');">' + dataItem.projectName + '</a>';
				}else{
					return '';
				}
			}
		}, {
			field : "projectAbbr",
			title : "缩写",
			width: 80,
				
		}, {
			field : "projectStatus",
			title : "项目状态",
			width: 100,
			filterable : {
				ui: function(e){
					e.kendoDropDownList({
						dataSource : proStatusItems,
						optionLabel : "...",
						dataTextField : "text",
						dataValueField : "text"
					});
				}
			}
		}, {
			field : "projectType",
			title : "立项类别",
			filterable : {
				ui: function(e){
					e.kendoDropDownList({
						dataSource : proCategoryItems,
						optionLabel : "...",
						dataTextField : "text",
						dataValueField : "text"
					});
				}
			}
		}, {
			field : "projectManagerId",
			title : "PM",
			template : function(dataItem) {
				if(dataItem.projectManagerName){
					return '<a  onclick="openPMViewWindow(\'' + dataItem.projectManagerId + '\');">' + dataItem.projectManagerName + '</a>';
				}else{
					return "N/A";
				}
			}
		},{
			field : "customerName",
			title : "客户名"
		},{
			field : "signBy",
			title : "立项人"
		},{
			field : "isSetuped",
			title : "立项状态",
			template : function(dataItem) {
				if(dataItem.isSetuped){
					return '已立项';
				}else{
					return "未立项";
				}
			}
		}]
	});
});//end dom ready	
	
function toolbar_addProject() {
	loadPage("project_addProject");
	
}


function toolbar_editProject(){
	var rowData = getSelectedRowDataByGrid("grid");
	if (rowData == null){
		alert("请点击列表选择一条项目记录！");
		return;
	}
	
	if(rowData.isSetuped){
		loadPage("project_editProject",{_id:rowData._id});
	}else{
		loadPage("project_addProject",{_id:rowData._id});
	}
	
}
	
function toolbar_setupProject() {//1:正式立项；2：预立项；3：内部立项
	var row = getSelectedRowDataByGrid("grid");
	if (!row){
		alert("请点击选择一条项目记录！");
		return;
	}
	
	
	if(row.isSetuped){
		alert("此项目已经立项过，如果需要变更和增补，请在销售合同里操作");
	}else{
		loadPage("salescontract_addsc",{pageId:"newProject", projectId: row._id});
	}

}



function toolbar_setupProjectForOfficial() {//1:正式立项；2：预立项；3：内部立项
	var row = getSelectedRowDataByGrid("grid");
	if (!row){
		alert("请点击选择一条项目记录！");
		return;
	}

	if(row.projectManagerName){

		if(confirm("确认正式立项此项目？")){
			var param = {_id : row._id};
			postAjaxRequest("../service/project/setup", param, setupProjectCallBack);
		}
		
	}else{
		
		if (row.projectStatus != "销售预立项"){
			alert("请选择一条销售预立项项目！");
			return;
		}
		
		loadPage("salescontract_addsc",{pageId:"newProject", projectId: row._id});
	}
	

}

function setupProjectCallBack(){
	alert("正式立项成功");
	projectDataSource.read();
}


function toolbar_add_projectSalesContract(){
	var row = getSelectedRowDataByGrid("grid");
	if (!row){
		alert("请选择项目！");
		return;
	}

	if(row.projectStatus == "销售正式立项"){
		loadPage("salescontract_addsc",{projectId: row._id});
	}else{
		alert("请选择一条销售正式立项项目！");
	}
	
}


	
	
	
	