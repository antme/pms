var changePasswordModel = kendo.data.Model.define({
	fields : {
		_id : {
			validation : {
				required : true
			}
		},
		passwordOld : {
			validation : {
				required : true
			}
		},
		passwordNew : {
			validation : {
				required : true
			}
		},
		passwordNew2 : {
			validation : {
				required : true
			}
		}
	}

});
var cpModel;

$(document).ready(function() {

	validator = $("#changePasswordForm").kendoValidator().data("kendoValidator");
	
	if (popupParams) {
		var userId = popupParams._id;
		postAjaxRequest("/service/user/mine/load", {_id:popupParams._id}, loadUserInfo);
	
	}	
});


function loadUserInfo(data){
	cpModel = new changePasswordModel(data);
	kendo.bind($("#changePasswordForm"), cpModel);
}
function changePasswordSave(){
	var validator = $("#changePasswordForm").kendoValidator().data("kendoValidator");
	var new1 = $("#passwordNew").val().trim();
	var new2 = $("#passwordNew2").val().trim();
	console.log(cpModel.toJSON());
	if (!validator.validate()){
		return;
	}else if(new1 != new2){
		alert("两次输入的新密码不一致！");
		return;
	}else{
		postAjaxRequest("/service/user/changepassword", cpModel.toJSON(), saveChangeCallback);
	}
}

function saveChangeCallback(data){
	$("#popup").data("kendoWindow").close();
}

function changePasswordCancel(){
	$("#popup").data("kendoWindow").close();
}