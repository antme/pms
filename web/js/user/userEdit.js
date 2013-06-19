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
			validation : {
				required : true
			}
		}
	}

});


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
		
$(document).ready(function() {
	
	$("#groups").kendoMultiSelect({
		dataTextField : "groupName",
		dataValueField : "_id",
		placeholder : "选择角色...",
		dataSource : groupDataSource
	
	});
	$("#purchaseContractProcessType").kendoMultiSelect({
		dataTextField : "text",
		dataValueField : "value",
		placeholder : "审批类型...",
		dataSource : purchaseContractType
	});
	
	$("#salesContractProcessType").kendoMultiSelect({
		dataTextField : "text",
		dataValueField : "value",
		placeholder : "审批类型...",
		dataSource : contractTypeItems
	});
	
	kendo.bind($("#user-form"), editUser);
	
});


function save(){
	var multiselect = $("#groups").data("kendoMultiSelect");
	// get the value of the multiselect.
	editUser.salesContractProcessType = $("#salesContractProcessType").data("kendoMultiSelect").value();
	editUser.groups = $("#groups").data("kendoMultiSelect").value();
	editUser.purchaseContractProcessType = $("#purchaseContractProcessType").data("kendoMultiSelect").value();
	
	postAjaxRequest("/service/user/update", {models:kendo.stringify(editUser)} , saveSuccess);	
}

function saveSuccess(data){
	console.log(data);
	loadPage("userman");
}

function cancel(){
	loadPage("userman");
}

function del(){
	
}