
var groupDataSource = new kendo.data.DataSource({
	transport : {
		read : {
			url : "/service/user/group/list",
			dataType : "jsonp"
		}
	},
	requestEnd: function(e) {
		init();
	},
	schema : {
		total: "total", // total is returned in the "total" field of the response
		data: "data"
	}
});
var dataSource = new kendo.data.DataSource({
	transport : {
		read : {
			url : "/service/user/list",
			dataType : "jsonp"
		}
	},
	pageSize : 20,
	batch : true,
	schema : {				
		total: "total", // total is returned in the "total" field of the response
		data: "data"
	}
});

$(document).ready(function() {	
	groupDataSource.read();
});

var selectedIds = undefined;
function init(){

	$("#grid").kendoGrid({
		dataSource : dataSource,
		pageable : true, resizable: true,
		resizable: true,
		selectable: "multiple, row",
		height : "550px",
		columns : [ {
			field : "userName",
			title : "用户名",
			width:"80px"
		}, {
			field : "phone",
			title : "手机",
			width:"120px"
		}, {
			field : "email",
			title : "Email",
			width:"200px"
		}, {
			field : "department",
			title : "部门",
			width:"100px"
		},{
			field : "status",
			title : "状态",
			width:"100px",
			template : function(dataItem) {
				if(dataItem.status && dataItem.status=="locked"){
					return "已禁用";
				}else{
					return "正常";
				}
			}
		}, {
			field : "groups",
			title : "角色",
			width:"200px",
			template : function(dataItem) {
				  if(dataItem.groups){
					  var groups = dataItem.groups;
					  var groupNames = "";
					  for(i=0; i<groups.length; i++){						  
						  for(j=0; j<groupDataSource.data().length; j++){
							  if(groupDataSource.data()[j]._id == groups[i]){
								  groupNames = groupNames + groupDataSource.data()[j].groupName + " ";
							  }
						  }
					  }
				      return "<strong>" + groupNames + "</strong>";
				 }else{
					 return "<strong>....</strong>";
				 }
		    }
			
		}],
		 pageable: {
			    pageSizes: [10, 20, 50]
			    
		 },
		 change: function(arg) {
             selectedIds = $.map(this.select(), function(item) {
            	var grid = $("#grid").data("kendoGrid");
            	var response = grid.dataItem(item);
                return response._id;
             });

         }
	});
}
function addUser(){
	loadPage("user_useredit");
}

function editUser(){
	var row = getSelectedRowDataByGridWithMsg("grid");	
	if(row){
		loadPage("user_useredit", {
			_id : row._id
		});
	}
}

function delUser() {
	
	var grid = $("#grid").data("kendoGrid");
	var row = grid.select()
	
	console.log(row);
	
	postAjaxRequest("/service/user/delete", {_id : row._id} , saveUserSuccess);	

}


function disableUser() {
	if(selectedIds){
		postAjaxRequest("/service/user/disable", {ids : selectedIds} , saveUserSuccess);	
	}else{
		alert("请选择要禁用的用户");
	}


}

function enableUser() {
	if(selectedIds){
		postAjaxRequest("/service/user/enable", {ids : selectedIds} , saveUserSuccess);	
	}else{
		alert("请选择要禁用的用户");
	}


}


function saveUserSuccess(){
	loadPage("user_userman");
}
