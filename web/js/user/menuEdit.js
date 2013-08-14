
var getUrl = "/service/user/menu/get";
var saveUrl = "/service/user/menu/save";
var dataSource = new kendo.data.DataSource({
	transport : {
		read : {
			dataType : "jsonp",
			url : "/service/user/group/list"
		}
	},
	requestEnd : function(e) {
		init();
	},
	schema : {
		total : "total",
		data : "data"
	}
});

$(document).ready(function() {
	$("#groups").kendoMultiSelect({
		dataTextField : "groupName",
		dataValueField : "_id",
		placeholder : "选择角色...",
		dataSource : dataSource
	});
});

function init() {
	var data = {
		menuId : popupParams._id
	};

	postAjaxRequest(getUrl, data, function(res) {
		var kms = $("#groups").data("kendoMultiSelect");
		kms.value(res.groups);
	});
}

function saveMenuGroup() {

	var kms = $("#groups").data("kendoMultiSelect");

	if (!kms.value() || kms.value().length == 0) {
		alert("角色选择不能为空");
	} else {
		var data = {
			menuId : popupParams._id,
			groups : kms.value()
		};

		postAjaxRequest(saveUrl, {
			models : kendo.stringify(data)
		}, function(data) {
			var window = $("#popup");
			var kendoWindow = window.data("kendoWindow");
			if (kendoWindow) {
				kendoWindow.close();
			}

		});

	}

}
