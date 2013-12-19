
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

function init(){

	$("#grid").kendoGrid({
		dataSource : dataSource,
		pageable : true, resizable: true,
		resizable: true,
		selectable : "row",
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
			    
		 }
	});
}
function add(){
	loadPage("user_useredit");
}

function edit(){
	var row = getSelectedRowDataByGridWithMsg("grid");	
	if(row){
		loadPage("user_useredit", {
			_id : row._id
		});
	}
}

function del() {
	var row = getSelectedRowDataByGridWithMsg("grid");
	postAjaxRequest("/service/user/delete", {_id : row._id} , saveSuccess);	

}

function saveSuccess(){
	loadPage("user_userman");
}
