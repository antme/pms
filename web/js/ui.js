var roles;
var page;
var isLogin = false;

$(document).ready(function() {
	var urlStr = window.document.location.href;
	console.log(urlStr);
	page = jQuery.url.setUrl(urlStr).attr("anchor");
	if (!page) {
		page = "local-data.html";
	}
	loadPage(page);
	
	$("#user-m").click(function(){
		loadPage("userman.html");
	});
});

function onAjaxFail(data) {

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


