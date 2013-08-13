
var dataSource = new kendo.data.DataSource({
		transport : {
			read : {
				dataType : "jsonp",
				url : "/service/user/group/list"
			}
		},
		schema : {
			total : "total", // total is returned in the "total" field of the
								// response
			data : "data"
		}
	});

$(document).ready(function() {	
	
	$("#roles").kendoMultiSelect({
		dataTextField : "groupName",
		dataValueField : "_id",
		placeholder : "选择角色...",
		dataSource : dataSource
	});
	
});

function saveMenuGroup(){
	
	loadPage("user_menu");
	
}


