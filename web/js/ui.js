var redirectParams = undefined;
var redirecPage = undefined;


$(document).ready(function() {
	
	document.onkeydown = function() {
		if (event.keyCode == 116) {
			event.keyCode = 0;
			event.returnValue = true;
			loadPage(redirecPage, null, redirectParams);
			return false;
		}
	};

	$(document).keydown(function(event) {

		if (event.keyCode == 116) {
			if (event && event.preventDefault) {
				event.preventDefault();
			}
			event.returnValue = false;
			event.keyCode = 0;

			loadPage(redirecPage, null, redirectParams);
			return false; // 屏蔽F5刷新键
		}

		if ((event.ctrlKey) && (event.keyCode == 82)) {
			loadPage(redirecPage, null, redirectParams);
			return false; // 屏蔽alt+R
		}
	});
	
	
	
	var page = getUrlParser().attr("anchor");

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
	// $('#error').show();
	// $("#error").html(result.msg);
	// $('#error').delay(2000).hide(0);
	alert(result.msg);

}

function getUrlParser(){
	var urlStr = window.document.location.href;
	return jQuery.url.setUrl(urlStr);	
}


function loadPage(page, divID, parameters) {
	
	redirecPage = page;
	if (parameters) {
		redirectParams = parameters;
	} else {
		redirectParams = undefined;
	}
	
	if (!divID) {
		divID = "#main_right";
	}

	var uid = kendo.guid();

	if (page == "userman") {
		page = "html/user/userman.html";
	} else if (page == "projectList") {
		page = "html/project/projectList.html";
	} else if (page == "scList") {
		page = "html/salescontract/scList.html";
	} else if (page == "group") {
		page = "html/user/group.html";
	} else if (page == "customer") {
		page = "html/customer/customer.html";
	} else if (page == "supplier") {
		page = "html/supplier/supplier.html";
	} else if (page == "allocate") {
		page = "html/execution/allocate.html";
	} else if (page == "purchasecontract") {
		page = "html/purchasecontract/purchasecontract.html";
	} else if (page == "purchaseRequest") {
		page = "html/purchasecontract/purchaseRequest.html";
	} else if (page == "purchaseorder") {
		page = "html/purchasecontract/purchaseOrder.html";
	} else if (page == "addsc") {
		page = "html/salescontract/addsc.html";
	}else if (page == "purchaseOrderEdit") {
		page = "html/purchasecontract/purchaseOrderEdit.html";
	}else if (page == "addProject") {
		page = "html/project/addProject.html";
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


function getSelectedRowDataByGrid(gridId) {
	var grid = $("#" + gridId).data("kendoGrid");
	var row = grid.select();
	return grid.dataItem(row);
}

function openWindow(options) {
	var window = $("#" + options.id);
	$("#" + options.id).show();
	var onActivate = onWindowDefaultActivate;
	if (options.activate) {
		onActivate = options.activate;
	}

	var onClose = onWindowDefaultClose;
	if (options.close) {
		onClose = options.close;
	}

	var kendoWindow = window.data("kendoWindow");
	if (!kendoWindow) {
		window.kendoWindow({
			width : options.width,
			height : options.height,
			title : options.title,
			modal : true,
			activate : onActivate,
			close : onClose,
			actions: ["Maximize", "Close"]
		});
		kendoWindow = window.data("kendoWindow");
		kendoWindow.setOptions({
			modal : true
		});
		kendoWindow.center();
	} else {
		kendoWindow.setOptions({
			modal : true
		});
		kendoWindow.open();
		kendoWindow.center();
	}
}


function postAjaxRequest(url, parameters, callback) {
	console.log(parameters);
	$.ajax({
		url : url,
		success : function(responsetxt) {
			var res;
			eval("res=" + responsetxt);
			if (res.status == "0") {
				alert(res.msg);
			} else {
				eval("callback(res)");
			}
		},

		error : function() {
			alert("连接Service失败");
		},

		data : parameters,
		method : "post"
	});

}

function onWindowDefaultActivate(e) {

}

function onWindowDefaultClose(e) {

}


