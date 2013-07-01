

var dataSource = new kendo.data.DataSource({
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
	batch : true,
	
	
	parameterMap : function(options, operation) {
		if (operation !== "read" && options.models) {
			return {
				models : kendo.stringify(options.models)
//				json_p : kendo.stringify(options.models)
			};
		}
	}

});

$(document).ready(function() {
	checkRoles();
	$("#grid").kendoGrid({
		dataSource : dataSource,
		pageable : true,
		sortable : true,
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
			template : function(dataItem) {
				if(dataItem.projectName){
					return '<a  onclick="openProjectViewWindow(\'' + dataItem._id + '\');">' + dataItem.projectName + '</a>';
				}else{
					return '';
				}
			}
		}, {
			field : "projectAbbr",
			title : "项目缩写"
		}, {
			field : "projectStatus",
			title : "项目状态",
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
						dataValueField : "value"
					});
				}
			}
		}, {
			field : "projectManager",
			title : "PM",
			filterable : false,
			template : function(dataItem) {
				return '<a  onclick="openPMViewWindow(\'' + dataItem.pmId + '\');">' + dataItem.projectManager + '</a>';
			}
		}, {
			field : "customer",
			title : "客户名",
			filterable : false,
			template : function(dataItem) {
				return '<a  onclick="openCustomerViewWindow(\'' + dataItem.cId + '\');">' + dataItem.customer + '</a>';
			}
		}]
	});
});//end dom ready	
	
function toolbar_addProject() {
	loadPage("addProject");
}

function toolbar_deleteProject() {
	var rowData = getSelectedRowDataByGrid("grid");
	alert("Delete the row _id: " + rowData._id);
  	return false;
}

function toolbar_editProject(){
	var rowData = getSelectedRowDataByGrid("grid");
	if (rowData == null){
		alert("请点击选择一条项目记录！");
		return;
	}
	
	loadPage("addProject",{_id:rowData._id});
}
	
function toolbar_setupProject() {//1:正式立项；2：预立项；3：内部立项
	var row = getSelectedRowDataByGrid("grid");
	if (!row){
		alert("请点击选择一条项目记录！");
		return;
	}
	if (row.projectStatus != "销售预立项"){
		alert("请选择一条销售预立项记录！");
		return;
	}
	
	var param = {_id : row._id};
	postAjaxRequest("../service/project/setup", param, setupProjectCallBack);

}

function setupProjectCallBack(){
	alert("正式立项成功");
	dataSource.read();
}


	
	
	
	