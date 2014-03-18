var userModel = kendo.data.Model.define({
	fields : {
		userName : {
			validation : {
				required : true
			}
		},
		password : {
			validation : {
				required : true
			}
		},
		phone : {
			validation : {
				required : true
			}
		},
		email : {
			
		}
	}

});

var editUrl = "/service/user/load";
var editUser = new userModel({});
var groupDataSource = new kendo.data.DataSource({
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
var validator;

$(document).ready(function() {
	groupDataSource.read();
	$("#groups").kendoMultiSelect({
		dataTextField : "groupName",
		dataValueField : "_id",
		placeholder : "选择角色...",
		dataSource : groupDataSource
	
	});
	
	$("#department").kendoDropDownList({
		dataTextField : "text",
		dataValueField : "text",
		dataSource : departmentItems
	
	});

	validator = $("#user-form").kendoValidator().data("kendoValidator");
	
	// 如果是编辑
	if (redirectParams || popupParams) {
		if(popupParams){
			postAjaxRequest(editUrl, popupParams, edit);
		}else{
			postAjaxRequest(editUrl, redirectParams, edit);
		}
	}else{
		edit();
	}

	
	
});


function edit(user){
	if(user){
		user.oldPassword = user.password;
		user.password = "";
	}
	editUser = new userModel(user);
	var groups = new Array();

	if(editUser.groups){
		var length = editUser.groups.length;
		for (i = 0; i < length; i++) {
			groups.push(editUser.groups[i]);
		}
	}
	editUser.groups="";
	kendo.bind($("#user-form"), editUser);
	kendo.bind($("#user-view-form"), editUser);
	if($("#groups").length > 0){
		$("#groups").data("kendoMultiSelect").value(groups);
    }

}

function save(){
	editUser.groups = $("#groups").data("kendoMultiSelect").value();
	editUser.department = $("#department").data("kendoDropDownList").value();
	editUser.password = $("#password").val();
	editUser.email = $("#email").val();
	editUser.phone = $("#phone").val();
	editUser.userName = $("#userName").val();
	if(validator.validate()){
		postAjaxRequest("/service/user/update", {models:kendo.stringify(editUser)} , saveSuccess);
	}
}

function saveSuccess(data){
	loadPage("user_userman");
}

function cancel(){
	loadPage("user_userman");
}

