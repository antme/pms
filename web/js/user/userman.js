
var groupDataSource = new kendo.data.DataSource({
	transport : {
		read : {
			url : "/service/user/group/list",
			dataType : "jsonp"
		}
	},
	requestEnd: function(e) {
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
	pageSize : 10,
	batch : true,
	schema : {				
		total: "total", // total is returned in the "total" field of the response
		data: "data"
	}
});

$(document).ready(function() {	
	groupDataSource.read();

	$("#grid").kendoGrid({
		dataSource : dataSource,
		pageable : true,
		selectable : "row",
		columns : [ {
			field : "userName",
			title : "用户名"
		}, {
			field : "phone",
			title : "手机"
		}, {
			field : "email",
			title : "Email"
		}, {
			field : "department",
			title : "部门"
		}, {
			field : "groups",
			title : "角色",
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
			
		}]
	});
});


function add(){
	loadPage("html/user/useredit.html");
}

function edit(){
	var row = getSelectedRowDataByGridWithMsg("grid");	
	if(row){
		loadPage("html/user/useredit.html", {
			_id : row._id
		});
	}
}

function del() {
	var row = getSelectedRowDataByGridWithMsg("grid");
	postAjaxRequest("/service/user/delete", {_id : row._id} , saveSuccess);	

}

function saveSuccess(){
	loadPage("userman");
}
