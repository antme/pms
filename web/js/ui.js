//记录页面跳转参数
var redirectParams = undefined;

//记录弹出窗口（远程页面）参数
var popupParams = undefined;

//记录跳转的页面
var redirecPage = undefined;

//记录跳转前的页面
var fromPage = undefined;

//用户的权限，用来显示隐藏按钮，菜单等
var userRoles = undefined;

//定义菜单所需权限，目前写死在JS文件中, KEY对应menus变量中的菜单ID
var accessRoles = {
	projectList : "project_management",
	projectex : "project_management, purchase_request_management",
	purchaseBack : "project_management",
	purchaseRequestByAssistant : "purchase_request_management",
	purchaseorder : "user_management",
	ship : "user_management",
	contract : "user_management",
	scList : "project_management",
	purchasecontract : "purchase_allocate_process, purchase_request_management, purchase_request_process, purchase_order_management, purchase_order_process, user_management",
	purchaseAllot : "purchase_request_management, purchase_allocate_management",
	purchaseAllotManage : "purchase_allocate_process, purchase_allocate_management",
	purchaseRequestApprove : "purchase_request_process",
	purchaseorder : "purchase_order_management, purchase_order_process",
	purchasecontract : "purchase_contract_management, purchase_contract_process",
	finance : "user_management",
	customer : "user_management",
	userman : "user_management"
};

//定义左边菜单
var menus = [
             {
                 text: "项目管理", id: "projectList", imageUrl: "/images/product.png"
             },

             {
                 text: "项目执行", id: "projectex", imageUrl: "/images/ccontract.png",
                 items: [
                         { text: "备货申请", id: "purchaseBack", imageUrl: "/images/order.png" },
                         { text: "采购申请", id: "purchaseRequestByAssistant", imageUrl: "/images/ccontract.png"},
                         { text: "开票申请", id: "purchaseorder", imageUrl: "/images/ccontract.png" },
                         { text: "发货申请", id: "ship", imageUrl: "/images/ccontract.png"},
                         { text: "借货申请", id: "borrowing", imageUrl: "/images/ccontract.png"},
                         { text: "还货申请", id: "borrowing", imageUrl: "/images/ccontract.png"}
                     ]
             },
             {
                 text: "销售合同",  id: "scList", imageUrl: "/images/user.png"
             },
             

             {
	             text : "采购合同", id : "purchasecontract", expanded : false, imageUrl : "/images/contract.png",
                 items: [
                     { text: "备货申请", id: "purchaseAllot", imageUrl: "/images/order.png" },
                     { text: "调拨申请", id: "purchaseAllotManage", imageUrl: "/images/ccontract.png" },
                     { text: "采购申请", id: "purchaseRequestApprove", imageUrl: "/images/ccontract.png"},
                     { text: "采购订单", id: "purchaseorder",  imageUrl: "/images/ccontract.png"},
                     { text: "采购合同", id: "purchasecontract", imageUrl: "/images/order.png" },
                     { text: "入库申请单", id: "repository", imageUrl: "/images/ccontract.png" },
                     { text: "直发入库申请单", id: "directRepository", imageUrl: "/images/ccontract.png"}
                 ]
             },                                               
             {
                 text: "财务",  id: "finance",  imageUrl: "/images/finance.png",
                 items: [
                         { text: "财务资料", id: "contract",  imageUrl: "/images/order.png" },
                         { text: "开票信息", id: "invoiceList", imageUrl: "/images/ccontract.png" },
                         { text: "收款信息", id: "gotMoneyList", imageUrl: "/images/ccontract.png"},
                         { text: "付款信息", id: "payMoney", imageUrl: "/images/ccontract.png"}
                     ]
             },
                                 
             {
                 text: "基础信息",  id: "customer", imageUrl: "/images/user.png",
                 	items: [
                             { text: "客户", id: "customer", imageUrl: "/images/toy.png" },
                             { text: "供应商", id: "supplier", imageUrl: "/images/ccontract.png" }
                         ]
             } , {
                 text: "权限管理", id: "userman", expanded: false, imageUrl: "/images/friends_group.png",
                 items: [
                         { text: "用户管理", id: "userman", imageUrl: "/images/toy.png" },
                         { text: "角色管理", id: "group", imageUrl: "/images/ccontract.png" }
                     ]
             }
  ];



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
	
	postAjaxRequest("/service/user/role/mine/list", null, init)

	
});


var userMenus = [];
function init(user){
	
	userRoles = user.data;

	//一级菜单权限验证
	if(menus){
		removeTreeItems(menus);
		
		for(i in menus){
			if(menus[i].items){
				//二级菜单权限验证
				removeTreeItems(menus[i].items);
			}
		}
	}
	
	
	$("#user_info").html(user.userName);
	$("#tree-nav").kendoTreeView({
    	template: kendo.template($("#treeview-template").html()),
        dataSource: menus
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
		page = "html/finance/invoiceList.html";
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
	}
	
	
	if(!page.endWith(".html")){
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
			error : onAjaxFail
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
	$("#popup").show();

	var kendoWindow = window.data("kendoWindow");
	if (!kendoWindow) {
		window.kendoWindow({
			width : options.width,
			height : options.height,
			title : options.title,
			activate : function(e){
				popupParams = parameter;
				loadPage(page, null, "popup");
			},
			close : function(e){
				$("#popup").html("")
				popupParams = undefined;
			},
			actions: ["Maximize", "Close"]
		});
		kendoWindow = window.data("kendoWindow");
		kendoWindow.center();
	} else {
		kendoWindow.open();
		kendoWindow.center();
	}
}

function disableAllInPoppup(){
	$("#popup button").hide();
	$("#popup textarea").attr("disabled",true); 
	$("#popup input").attr("disabled",true);
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



