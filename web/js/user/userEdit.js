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
    $("#groups").data("kendoMultiSelect").value(editUser.groups);
	kendo.bind($("#user-form"), editUser);
}

function save(){
	editUser.groups = $("#groups").data("kendoMultiSelect").value();
	editUser.department = $("#department").data("kendoDropDownList").value();
	editUser.password = $("#password").val();
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

