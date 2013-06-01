var page;

$(document).ready(function() {
	var urlStr = window.document.location.href;
	page = jQuery.url.setUrl(urlStr).attr("anchor");
	console.log(page);
	if (!page) {
		page = "html/local-data.html";
	}
	loadPage(page);

	$("#user-m").click(function() {
		loadPage("userman");
	});
	$("#user-info").click(function() {
		loadPage("default");
	});
});

function onAjaxFail(data) {

}

function displayMsg(result) {
	$('#error').show();
	$("#error").html(result.msg);
	$('#error').delay(2000).hide(0);

}

function loadPage(page, divID) {

	if (!divID) {
		divID = "#main_right";
	}

	var uid = kendo.guid();

	if (page == "userman") {
		page = "html/user/userman.html";
	} else if (page == "project") {
		page = "html/project/project.html";
	} else if (page == "group") {
		page = "html/user/group.html";
	} else if (page == "customer") {
		page = "html/customer/customer.html";
	} else if (page == "supplier") {
		page = "html/supplier/supplier.html";
	} else {
		page = "html/local-data.html";
	}

	var url = page + "?_uid=" + uid;

	if (page.indexOf("?") != -1) {
		url = page + "&_uid=" + uid;

	}
	$.ajax({
		url : url,
		success : function(data) {
			$(divID).html(data);

		},
		error : onAjaxFail
	});

}

function onLeftNavSelect(e) {
	console.log(e);
	var text = this.text(e.node);

	if (text == "权限管理" || text == "用户管理") {
		loadPage("userman");
	} else if (text == "项目管理") {
		loadPage("project");
	} else if (text == "角色管理") {
		loadPage("group");
	} else if (text == "客户管理") {
		loadPage("customer");
	} else if (text == "供应商") {
		loadPage("supplier");
	} else {
		loadPage("default");
	}

}

function getSelectedRowDataByGrid(gridId) {
	var grid = $("#" + gridId).data("kendoGrid");
	var row = grid.select();
	return grid.dataItem(row);
}
