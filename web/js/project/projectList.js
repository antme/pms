

var dataSource = new kendo.data.DataSource({
	transport : {
		read : {
			url : "/service/project/list",
			dataType : "jsonp"
		},
		update : {
			url : "/service/project/update",
			dataType : "jsonp",
			method : "post"
		},
		create : {
			url : "/service/project/add",
			dataType : "jsonp",
			method : "post"
		},

		parameterMap : function(options, operation) {
			if (operation !== "read" && options.models) {
				return {
					models : kendo.stringify(options.models)
				};
			}
		}
	},
	pageSize: 10,
	batch : true
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
			field : "projectCode",
			title : "项目编号"
		}, {
			field : "projectName",
			title : "项目名"
		}, {
			field : "projectAbbr",
			title : "项目缩写"
		}, {
			field : "projectStatus",
			title : "项目状态",
			template:function(dataItem) {
				var name = "";
				if (dataItem.projectStatus == 1){
					name = "正式立项";
				} else if (dataItem.projectStatus == 2){
					name = "预立项";
				} else {//projectStatus=3
					name = "内部立项";
				}
				return name;
			}
		}, {
			field : "projectType",
			title : "项目类型",
			template:function(dataItem) {
				var name = "";
				if (dataItem.projectType == 1){
					name = "产品";
				} else if (dataItem.projectType == 2){
					name = "工程";
				} else {
					name = "服务";
				}
				return name;
			}
		}, {
			field : "projectManager",
			title : "PM"
		}, {
			field : "customer",
			title : "客户名"
		}
//		, {
//			field : "totalAmount",
//			title : "项目总金额"
//		}, {
//			field : "invoiceAmount",
//			title : "开票金额"
//		}, {
//			field : "getAmount",
//			title : "到款金额"
//		}, {
//			field : "purchaseAmount",
//			title : "采购金额"
//		}
		]
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
	if (row.projectStatus == 1){
		alert("请选择一条非正式立项记录！");
		return;
	}
	
	var param = {_id : row._id};
	postAjaxRequest("../service/project/setup", param, setupProjectCallBack);

}

function setupProjectCallBack(){
	alert("正式立项成功");
	dataSource.read();
}
	
	
	
	
	