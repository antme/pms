var roles;
var page;
var isLogin = false;

$(document).ready(function() {
	var urlStr = window.document.location.href;
	console.log(urlStr);
	page = jQuery.url.setUrl(urlStr).attr("anchor");
	if (!page) {
		page = "html/local-data.html";
	}
	loadPage(page);

	$("#user-m").click(function() {
		loadPage("html/project/project.html");
	});
	$("#user-info").click(function() {
		loadPage("local-data.html");
	});
});

function onAjaxFail(data) {

}

function displayMsg(result) {
	$('#error').show();
	$("#error").html(result.msg);
	$('#error').delay(2000).hide(0);

}

function loadPage(page) {
	var uid = kendo.guid();
	$.ajax({
		url : page + "?_uid=" + uid,
		success : function(data) {
			$("#main_right").html(data);
		},
		error : onAjaxFail
	});

}

function onLeftNavSelect(e) {
	var text = this.text(e.node);

	if (text == "权限管理" || text =="用户管理") {
		loadPage("html/user/userman.html");
	}else if (text == "项目管理"){
		loadPage("html/project/project.html");
	}else if (text == "角色管理") {
		loadPage("html/user/group.html");
	}else{
		loadPage("html/local-data.html");
	}
}

function getSelectedRowDataByGrid(gridId){
	var grid = $("#"+gridId).data("kendoGrid");
	var row = grid.select();
	return grid.dataItem(row);
}

