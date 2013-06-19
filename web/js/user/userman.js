
var groupDataSource = new kendo.data.DataSource({
	transport : {
		read : {
			url : "/service/user/group/list",
			dataType : "jsonp"
		}
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

	$("#grid").kendoGrid({
		dataSource : dataSource,
		pageable : true,
		selectable : "row",
		height: "500px",
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
			field : "salesContractProcessType",
			title : "销售合同审批类型"
		}, {
			field : "purchaseContractProcessType",
			title : "销售合同审批类型"
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
	loadPage("html/user/useredit.html");
}

function del() {
	var row = getSelectedRowDataByGridWithMsg("grid");
	postAjaxRequest("/service/user/delete", {_id : row._id} , saveSuccess);	

}

function saveSuccess(){
	loadPage("userman");
}
