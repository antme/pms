var page;

$(document).ready(function() {
	var urlStr = window.document.location.href;
	page = jQuery.url.setUrl(urlStr).attr("anchor");
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
	} else if (page == "allocate") {
		page = "html/execution/allocate.html";
	} else if (page == "purchasecontract") {
		page = "html/purchasecontract/purchasecontract.html";
	} else if (page == "purchaseRequest") {
		page = "html/purchasecontract/purchaseRequest.html";
	} else if (page == "purchaseorder") {
		page = "html/purchasecontract/purchaseOrder.html";
	}else {
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
	var text = this.text(e.node);

	if (text == "权限管理" || text == "用户管理") {
		loadPage("userman");
	} else if (text == "项目管理") {
		loadPage("project");
	} else if (text == "角色管理") {
		loadPage("group");
	} else if (text == "客户") {
		loadPage("customer");
	} else if (text == "供应商") {
		loadPage("supplier");
	} else if (text == "调拨申请") {
		loadPage("allocate");
	} else if (text == "采购申请") {
		loadPage("purchaseRequest");
	} else if (text == "采购合同" || text == "采购合同列表") {
		loadPage("purchasecontract");
	}else if (text == "采购订单申请" || text == "采购订单") {
		loadPage("purchaseorder");
	} else {
		loadPage("default");
	}

}

function getSelectedRowDataByGrid(gridId) {
	var grid = $("#" + gridId).data("kendoGrid");
	var row = grid.select();
	return grid.dataItem(row);
}


function openWindow(options){
	var window = $("#"+options.id);
	$("#"+options.id).show();
	var onActivate = onDefaultActivate;
	if(options.activate){
		onActivate = options.activate;
	}
	
	var kendoWindow = window.data("kendoWindow");
	if (!kendoWindow) {		
		window.kendoWindow({
			width : options.width,
			height : options.height,
			title : options.title,
			modal : true,
			activate : onActivate
		});
		kendoWindow = window.data("kendoWindow");
		kendoWindow.setOptions({modal : true});
		kendoWindow.center();
	} else {
		kendoWindow.setOptions({modal : true});
		kendoWindow.open();
		kendoWindow.center();
	}	
}

function onDefaultActivate(e){
	
}
