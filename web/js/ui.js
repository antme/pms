
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
	
	postAjaxRequest("/service/user/home", null, init)

});


function init(u){
	
	userRoles = u.data;
	user = u;
	console.log(user);
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
		loadPage("myinfo");
	});
	
}

function removeTreeItems(items) {
	
	//拷贝数据
	var newItems = items.slice(0);

	for (i in newItems) {
		var id = newItems[i].id;
		var accRoles = "";
		eval("accRoles = accessRoles."+id);	
		if(accRoles){
			var hasAccess = false;
			for (j in userRoles) {
				if (accRoles.indexOf(userRoles[j].roleID) >= 0) {
					hasAccess = true;
					break;
				}
			}
			if (!hasAccess) {
				var node = items.indexOf(newItems[i]);
				items.splice(node, 1);
			}
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

function loadTreePage(page){
	$("#myTask").hide();
	loadPage(page);
}

function loadPage(page, parameters, popupDiv) {
	
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

	if (page == "userman") {
		page = "html/user/userman.html";
	} else if (page == "projectList") {
		page = "html/project/projectList.html";
	} else if (page == "scList") {
		page = "html/salescontract/scList.html";
	} else if (page == "addsc") {
		page = "html/salescontract/addsc.html";
	} else if (page == "editsc") {
		page = "html/salescontract/editsc.html";
	} else if (page == "viewsc") {
		page = "html/salescontract/viewsc.html";
	} else if (page == "invoiceList") {
		page = "html/finance/payInvoice.html";
	} else if(page == "payInvoiceEdit"){
		page = "html/finance/payInvoiceEdit.html";
	} else if (page == "gotMoneyList") {
		page = "html/finance/gotMoneyList.html";
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
	} else if (page == "purchaseorder" ) {
		page = "html/purchasecontract/purchaseOrder.html";
	} else if (page == "purchaseRequestByAssistant") {
		page = "html/purchasecontract/purchaseRequest.html";
	} else if (page == "purchaseRequestApprove") {
		page = "html/purchasecontract/purchaseRequestApprove.html";
	} else if (page == "addProject") {
		page = "html/project/addProject.html";
	}  else if (page == "ship") {
		page = "html/execution/ship.html";
	} else if (page == "addShip") {
		page = "html/execution/addShip.html";
	} else if (page == "purchaseBack") {
		page = "html/purchasecontract/purchaseBack.html";
	} else if (page == "purchaseBackEdit") {
		page = "html/purchasecontract/purchaseBackEdit.html";
	} else if(page == "purchaseAllot"){
		page = "html/purchasecontract/purchaseAllot.html";		
	} else if(page == "purchaseAllotEdit"){
		page = "html/purchasecontract/purchaseAllotEdit.html";		
	} else if(page == "purchaseAllotManage"){
		page = "html/purchasecontract/purchaseAllotManage.html";		
	} else if(page == "purchaseAllotManageEdit"){
		page = "html/purchasecontract/purchaseAllotManageEdit.html";
	} else if(page == "borrowing"){
		page = "html/execution/borrowing.html";
	} else if (page == "addBorrowing") {
		page = "html/execution/addBorrowing.html";
	}else if (page == "repository") {
		page = "html/repository/repository.html";
	}else if (page == "directRepository") {
		page = "html/repository/directRepository.html";
	}else if(page == "payMoney"){
		page = "html/finance/payMoney.html";
	}else if(page == "getInvoice"){
		page = "html/finance/getInvoice.html";
	}else if (page == "repositoryOut") {
		page = "html/repository/repositoryout.html";
	}
	

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
		
	}else if(!page.endWith(".html")){
		alert("暂未开放");
	}else{
		var url = page + "?_uid=" + uid;
	
		if (page.indexOf("?") != -1) {
			url = page + "&_uid=" + uid;	
		}
		$.ajax({
			url : url,
			success : function(data) {
				if(popupDiv){
					$("#"+popupDiv).html(data);
				}else{
					$("#main_right").html(data);

				}
			},
			error : function(){
				alert("连接Service失败");
			}
		});
	}
}

function initMyDraftTasks(id, data){
	console.log(data);

	if(!data || data.length==0){
		$("#" +id).html("无数据");
	}else{
		$("#" +id).kendoGrid({
			dataSource : data,
			pageable : false,
			selectable : "row",
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
	
				}
			}, {
				field : "count",
				title : "任务",
				template : function(dataItem){

					if(dataItem.db == "purchaseRequest"){
						return '<a onclick="loadTreePage(' + "'purchaseRequestByAssistant'" +')">' + dataItem.count + '</a>';
					}
					
					if(dataItem.db == "purchaseBack"){
						return '<a onclick="loadTreePage(' + "'purchaseBack'" +')">' + dataItem.count + '</a>';
					}
					if(dataItem.db == "purchaseContract"){
						return '<a onclick="loadTreePage(' + "'purchasecontract'" +')">' + dataItem.count + '</a>';
					}
					if(dataItem.db == "purchaseOrder"){
						return '<a onclick="loadTreePage(' + "'purchaseorder'" +')">'+ dataItem.count + '</a>';
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
			node.show();
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
}



function openPMViewWindow(param){
	var options = { width:"680px", height: "400px", title:"项目经理信息"};
	openRemotePageWindow(options, "html/user/userview.html", {_id : param});
}

function openCustomerViewWindow(param){
	var options = { width:"680px", height: "400px", title:"客户信息"};
	openRemotePageWindow(options, "html/customer/view.html", {_id : param});
}
	


function openProjectViewWindow(param){
	var options = { width:"1080px", height: "600px", title:"项目信息"};
	openRemotePageWindow(options, "html/project/addProject.html", {_id : param});
}


function openPurchaseRequestViewWindow(param){
	var options = { width:"1080px", height: "600px", title:"采购申请信息"};
	openRemotePageWindow(options, "html/purchasecontract/purchaseRequestEdit.html", {_id : param});
}

function openBackRequestViewWindow(param){
	var options = { width:"1080px", height: "600px", title:"备货申请信息"};
	openRemotePageWindow(options, "purchaseBackEdit", {_id : param});
}

function openSCViewWindow(param){
	var options = { width:"1080px", height: "600px", title:"销售合同信息"};
	openRemotePageWindow(options, "html/salescontract/editsc.html", {_id : param});
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



