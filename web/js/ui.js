
$(document).ready(function() {

	if (navigator.userAgent.indexOf("MSIE")>0) {
		document.onkeydown = function() {
			if (event.keyCode == 116) {
				event.keyCode = 0;
				event.returnValue = true;
				loadPage(redirecPage, redirectParams);
				return false;
			}
		};
	} else {
		$(document).keydown(function(event) {

			if (event.keyCode == 116) {
				if (event && event.preventDefault) {
					event.preventDefault();
				}
				event.returnValue = false;
				event.keyCode = 0;

				loadPage(redirecPage, redirectParams);
				return false; // 屏蔽F5刷新键
			}

			if ((event.ctrlKey) && (event.keyCode == 82)) {
				loadPage(redirecPage, redirectParams);
				return false; // 屏蔽alt+R
			}
		});
	}
	
	kendo.ui.progress($("#main"), true);
	
	
	postAjaxRequest("/service/user/home", null, init)

});


function init(u){
	kendo.ui.progress($("#main"), false);
	userRoles = u.data;
	userMenus = u.menus;
	user = u;
	$("#user_info").html(user.userName);
	
	//一级菜单权限验证
	removeTreeItems(menus);
	for (i in menus) {
		if (menus[i].items) {
			// 二级菜单权限验证
			removeTreeItems(menus[i].items);
		}
	}

	
	$("#tree-nav").kendoTreeView({
    	template: kendo.template($("#treeview-template").html()),
        dataSource: menus
    });
	
	
	var page = getUrlParser().attr("anchor");
	if(page){
		loadPage(page);
	}else{
		loadPage("mytask");
	}
	
	$("#user-m").click(function() {
		loadPage("mytask");
	});
	
	$("#user-info").click(function() {
		var options = { width:"600px", height: "420px", title:"修改密码"};
		openRemotePageWindow(options, "user_changePassword", {_id:user._id});
	});
	
}

function removeTreeItems(items) {
	// 拷贝数据
	var newItems = items.slice(0);
	console.log(newItems);
	for (i in newItems) {
		var id = newItems[i].id;
		var hasAccess = false;
		for (j in userMenus) {
			if (id.indexOf(userMenus[j].menuId) >= 0) {
				hasAccess = true;
				break;
			}
		}
		if (!hasAccess) {
			//FIXME IE7不支持此方法
//			var node = items.indexOf(newItems[i]);
			//菜单权限，先注释掉
//			items.splice(node, 1);
		}

	}
}

function displayMsg(result) {
	alert(result.msg);

}

function getUrlParser(){
	var urlStr = window.document.location.href;
	return jQuery.url.setUrl(urlStr);	
}

function loadTreePage(page, parameters){
	$("#myTask").hide();
	if(!parameters){
		redirectParams = undefined;
	}
	loadPage(page, parameters);
}

function loadPage(page, parameters, popupDiv) {
	kendo.ui.progress($("#right"), true);
	if($(".k-window").length>0 && $(".k-overlay").length>0){
		$(".k-window").hide();
		$(".k-overlay").hide();
	}
	
	if(!popupDiv){
		fromPage = redirecPage;
		redirecPage = page;
		redirectParams = parameters;
	}

	var uid = kendo.guid();

	if (page == "mytask") {
		$("#myTask").show();
		var tabMyTask = $("#tabMyTask").data("kendoTabStrip");

		if (!tabMyTask) {
			$("#tabMyTask").kendoTabStrip({
	
			});
			
			tabMyTask = $("#tabMyTask").data("kendoTabStrip");			
			tabMyTask.select(0);
			initMyDraftTasks("draft", user.mytasks.draft);
			initMyDraftTasks("inprogress", user.mytasks.inprogress);
			initMyDraftTasks("rejected", user.mytasks.rejected);
			initMyDraftTasks("approved", user.mytasks.approved);
			initMyDraftTasks("tip", user.mytasks.tip);
		
		}
		var tabMyTask = $("#tabMyTask").data("kendoTabStrip");

		$("#draft-length").html("(" + user.mytasks.draftLength + ")");
		$("#inprogress-length").html("(" + user.mytasks.inprogressLength + ")");
		$("#rejected-length").html("(" + user.mytasks.rejectedLength + ")");
		$("#approved-length").html("(" + user.mytasks.approvedLength + ")");
		$("#tip-length").html("(0)");
		
	}else{
		
		var url = page;
		if (!page.endWith(".html")) {
			var pages = page.split("_");
			if (pages.length == 2) {
				url = "html/" + pages[0] + "/" + pages[1] + ".html";
			}
		}

		if (url.indexOf("?") != -1) {
			url = url + "&_uid=" + uid;
		}else{
			url = url + "?uid=" + uid;
		}

		$.ajax({
			url : url,
			success : function(data) {
				kendo.ui.progress($("#right"), false);
				if(popupDiv){
					$("#"+popupDiv).html(data);
				}else{
					$("#main_right").html(data);

				}
			},
			error : function(){
				alert("连接Service失败");
				kendo.ui.progress($("#right"), false);
			}
		});
	}
}

function initMyDraftTasks(id, data){

	if(!data || data.length==0){
		$("#" +id).html("无数据");
	}else{
		$("#" +id).kendoGrid({
			dataSource : data,
			pageable : false,
			selectable : "row",
			height: "400px",
			columns : [ {
				field : "db",
				title : "我的模块",
				template : function(dataItem){
					
					if(dataItem.db == "purchaseRequest"){
						return "采购申请";
					}
					
					if(dataItem.db == "purchaseBack"){
						return "备货申请";
					}
					if(dataItem.db == "purchaseContract"){
						return "采购合同";
					}
					if(dataItem.db == "purchaseOrder"){
						return "采购订单";
					}
					
					if(dataItem.db == "purchaseAllocate"){
						return "调拨申请";
					}
					if(dataItem.db == "repository"){
						return "入库申请";
					}
					if(dataItem.db == "ship"){
						return "发货申请";
					}
					
					if(dataItem.db == "borrowing"){
						return "借货申请";
					}
					
					if(dataItem.db == "return"){
						return "还货申请";
					}
	
				}
			}, {
				field : "count",
				title : "任务",
				template : function(dataItem){

					var param = "'" +id + "'";
					if(dataItem.db == "purchaseRequest"){
						if(id=="inprogress"){
							return '<a onclick="loadTreePage(' + "'purchasecontract_purchaseRequestApprove'," + param + ')">' + dataItem.count + '</a>';
						}
						return '<a onclick="loadTreePage(' + "'purchasecontract_purchaseRequest'," + param + ')">' + dataItem.count + '</a>';
					}
					
					if(dataItem.db == "purchaseBack"){
						return '<a onclick="loadTreePage(' + "'purchaseBack'," + param + ')">' + dataItem.count + '</a>';
					}
					if(dataItem.db == "purchaseContract"){
						return '<a onclick="loadTreePage(' + "'purchasecontract'," + param + ')">' + dataItem.count + '</a>';
					}
					if(dataItem.db == "purchaseOrder"){
						return '<a onclick="loadTreePage(' + "'purchaseorder'," + param + ')">'+ dataItem.count + '</a>';
					}
					
					if(dataItem.db == "purchaseAllocate"){
						return '<a onclick="loadTreePage(' + "'purchaseAllotManage'," + param + ')">'+ dataItem.count + '</a>';
					}
					
					if(dataItem.db == "repository"){
						return '<a onclick="loadTreePage(' + "'repository'," + param + ')">'+ dataItem.count + '</a>';
					}
					
					if(dataItem.db == "ship"){
						return '<a onclick="loadTreePage(' + "'ship'," + param + ')">'+ dataItem.count + '</a>';
					}
					
					if(dataItem.db == "borrowing"){
						return '<a onclick="loadTreePage(' + "'borrowing'," + param + ')">'+ dataItem.count + '</a>';
					}
					
					if(dataItem.db == "return"){
						return '<a onclick="loadTreePage(' + "'return'," + param + ')">'+ dataItem.count + '</a>';
					}
				
				}
			}
			]
	
		});
	}
}

function getSelectedRowDataByGrid(gridId) {
	var grid = $("#" + gridId).data("kendoGrid");
	var row = grid.select();
	return grid.dataItem(row);
}

function getSelectedRowDataByGridWithMsg(gridId) {
	var grid = $("#" + gridId).data("kendoGrid");
	var row = grid.select();
	var response =  grid.dataItem(row);

	if (!response) {
		alert("点击列表可以选中数据");
	}
	return response;
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
	$.ajax({
		url : url,
		success : function(responsetxt) {
			var res;
			eval("res=" + responsetxt);
			if (res.status && res.status == "0" && res.msg) {
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

function checkRoles(){
	var buttons = $('button[access]');
	buttons.each(function(index){
		var node = jQuery(buttons[index]);
		var roleId = node.attr("access");
		var hasAccess = false;
		for(i in userRoles){	
			if(userRoles[i].roleID == roleId){
				hasAccess = true;
				break;
			}
		}
		
		if(!hasAccess){
			node.hide();
		}else{
			if(user.userName == "admin111"){
				node.hide();
			}else{
				node.show();
			}
		}
		
	});
}

function back() {

	if (fromPage) {
		loadPage(fromPage);
	} else {
		loadPage(redirectPage);
	}
}



function openRemotePageWindow(options, page, parameter) {
	var window = $("#popup");
	$("#popup").html("")
	$("#popup").show();

	var kendoWindow = window.data("kendoWindow");
	if (!kendoWindow) {
		window.kendoWindow({
			width : options.width,
			height : options.height,
			title : options.title,
			close : function(e) {
				popupParams = undefined;
			},
			actions : [ "Maximize", "Close" ]
		});
		kendoWindow = window.data("kendoWindow");
		kendoWindow.center();
	} else {
		kendoWindow.setOptions(options);
		kendoWindow.open();
		kendoWindow.center();
	}

	popupParams = parameter;
	loadPage(page, null, "popup");

}

function disableAllInPoppup(){
	$("#popup button").hide();
	$("#popup textarea").attr("disabled",true); 
	$("#popup input").attr("disabled",true);
	if($("#form-container .tempCommentdiv"))$("#form-container .tempCommentdiv").hide();
}



function openPMViewWindow(param){
	var options = { width:"680px", height: "400px", title:"项目经理信息"};
	openRemotePageWindow(options, "user_userview", {_id : param});
}

function openCustomerViewWindow(param){
	var options = { width:"680px", height: "400px", title:"客户信息"};
	openRemotePageWindow(options, "customer_view", {_id : param});
}
	


function openProjectViewWindow(param){
	var options = { width:"1080px", height: "600px", title:"项目信息"};
	openRemotePageWindow(options, "project_addProject", {_id : param});
}


function openPurchaseRequestViewWindow(param){
	var options = { width:"1080px", height: "600px", title:"采购申请信息"};
	openRemotePageWindow(options, "purchasecontract_purchaseRequestEdit", {_id : param});
}


function openPurchaseOrderViewWindow(param){
	var options = { width:"1080px", height: "600px", title:"采购订单信息"};
	openRemotePageWindow(options, "purchasecontract_purchaseOrderEdit", {_id : param});
}

function openBackRequestViewWindow(param){
	var options = { width:"1080px", height: "600px", title:"备货申请信息"};
	openRemotePageWindow(options, "purchaseback_purchaseBackEdit", {_id : param});
}

function openPayInvoiceViewWindow(param){
	var options = { width:"1080px", height: "600px", title:"开票信息"};
	openRemotePageWindow(options, "finance_payInvoiceEdit", {_id : param});
}

function openGetInvoiceViewWindow(param){
	var options = { width:"1080px", height: "600px", title:"收票信息"};
	openRemotePageWindow(options, "finance_getInvoiceEdit", {_id : param});
}

function openPurchaseAllotViewWindow(param){
	var options = { width:"1080px", height: "600px", title:"调拨申请信息"};
	openRemotePageWindow(options, "purchaseback_purchaseAllotManageEdit", {_id : param});
}

function openSCViewWindow(param){
	var options = { width:"1080px", height: "600px", title:"销售合同信息"};
	openRemotePageWindow(options, "salescontract_editsc", {_id : param});
}

function openPurchaseContractViewWindow(param){
	var options = { width:"1080px", height: "800px", title:"采购合同信息"};
	openRemotePageWindow(options, "purchasecontract_purchasecontractedit", {_id : param});
}

function openShipViewWindow(param){
	var options = { width:"1080px", height: "500px", title:"发货信息"};
	openRemotePageWindow(options, "execution_addShip", {_id : param});	
}

function openMenuEditWindow(param){
	var options = { width:"1080px", height: "500px", title:"权限配置"};
	openRemotePageWindow(options, "user_menuEdit", {_id : param});	
}

function myTaskQueryParam(options, operation){
		if(redirectParams){
			options.mytasks = redirectParams;
		}
		return options;		
}


String.prototype.endWith = function(s) {
	if (s == null || s == "" || this.length == 0 || s.length > this.length)
		return false;
	if (this.substring(this.length - s.length) == s)
		return true;
	else
		return false;
	return true;
}

function percentToFixed(number){
	return  parseInt(  parseFloat(number)   *  Math.pow(  10 , 2)  +   0.5 )/Math.pow(10,2);
}

function intSelectInput(){
	var html;
	if(document.getElementById("departmentItems")){
		html = "";
		for (var i=0;i < departmentItems.length; i++){
			html += "<option value='"+departmentItems[i].text+"'>"+departmentItems[i].text+"</option>";
		}
		document.getElementById("departmentItems").innerHTML=html;
	}
	if(document.getElementById("pbTypeItems")){
		html = "";
		for (var i=0;i < pbTypeItems.length; i++){
			html += "<option value='"+pbTypeItems[i].text+"'>"+pbTypeItems[i].text+"</option>";
		}
		document.getElementById("pbTypeItems").innerHTML=html;
	}
	if(document.getElementById("shelfCodeItems")){
		html = "";
		for (var i=0;i < shelfCodeItems.length; i++){
			html += "<option value='"+shelfCodeItems[i].text+"'>"+shelfCodeItems[i].text+"</option>";
		}
		document.getElementById("shelfCodeItems").innerHTML=html;
	}
	if(document.getElementById("invoiceTypeItems")){
		html = "";
		for (var i=0;i < invoiceTypeItems.length; i++){
			html += "<option value='"+invoiceTypeItems[i].text+"'>"+invoiceTypeItems[i].text+"</option>";
		}
		document.getElementById("invoiceTypeItems").innerHTML=html;
	}
}

function setDate(obj, key, value) {

	if (kendo.parseDate(kendo.toString(value, 'd'), "yyyy-MM-dd")
			&& kendo.parseDate(kendo.toString(value, 'd'), "yyyy-MM-dd") != "null") {
		obj.set(key, kendo.parseDate(kendo.toString(value, 'd'), "yyyy-MM-dd"));
	} else if (kendo.parseDate(kendo.toString(value, 'd'), "yyyy/MM/dd")
			&& kendo.parseDate(kendo.toString(value, 'd'), "yyyy/MM/dd") != "null") {
		obj.set(key, kendo.parseDate(kendo.toString(value, 'd'), "yyyy/MM/dd"));
	}
}
