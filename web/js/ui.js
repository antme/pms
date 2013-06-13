var redirectParams = undefined;
var redirecPage = undefined;
var roles = undefined;

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
function init(data){
	
	roles = data.data;
	var menus = [
	             {
	                 text: "项目管理", id: "projectList", access:"project_management", imageUrl: "/images/product.png"
	             },

	             {
	                 text: "项目执行", id: "projectex", access:"project_management_purchase_request_management", imageUrl: "/images/ccontract.png",
	                 items: [
	                         { text: "备货申请", id: "purchaseBack",  access:"project_management", imageUrl: "/images/order.png" },
	                         { text: "采购申请", id: "purchaseRequestByAssistant", access:"purchase_request_management", imageUrl: "/images/ccontract.png"},
	                         { text: "开票申请", id: "purchaseorder", access:"user_management", imageUrl: "/images/ccontract.png" },
	                         { text: "发货申请", id: "ship", access:"user_management", imageUrl: "/images/ccontract.png"},
	                         { text: "借货申请", id: "contract", access:"user_management", imageUrl: "/images/ccontract.png"},
	                         { text: "还货申请", id: "contract", access:"user_management", imageUrl: "/images/ccontract.png"}
	                     ]
	             },
	             {
	                 text: "销售合同",  id: "scList", access:"project_management", imageUrl: "/images/user.png"
	             },
	             

	             {
		                text : "采购合同",
						id : "purchasecontract",
						access : "purchase_allocate_process_purchase_request_management_purchase_request_process_purchase_order_management_purchase_order_process_user_management",
						expanded : false,
						imageUrl : "/images/contract.png",
	                 items: [
	                     { text: "备货申请", id: "purchaseAllot",  access:"purchase_request_management_purchase_allocate_management", imageUrl: "/images/order.png" },
	                     { text: "调拨申请", id: "purchaseAllotManage",  access:"purchase_allocate_process, purchase_allocate_management", imageUrl: "/images/ccontract.png" },
	                     { text: "采购申请", id: "purchaseRequestApprove", access: "purchase_request_process", imageUrl: "/images/ccontract.png"},
	                     { text: "采购订单", id: "purchaseorder", access: "purchase_order_management, purchase_order_process", imageUrl: "/images/ccontract.png"},
	                     { text: "采购合同", id: "purchasecontract", access: "purchase_contract_management, purchase_contract_process", imageUrl: "/images/order.png" },
	                     { text: "入库申请单", id: "contract", access:"user_management", imageUrl: "/images/ccontract.png" },
	                     { text: "直发入库申请单", id: "contract", access:"user_management", imageUrl: "/images/ccontract.png"}
	                 ]
	             },                                               
	             {
	                 text: "财务",  id: "finance", access:"user_management", imageUrl: "/images/finance.png",
	                 items: [
	                         { text: "财务资料", id: "contract",  imageUrl: "/images/order.png" },
	                         { text: "开票信息", id: "contract", imageUrl: "/images/ccontract.png" },
	                         { text: "收款信息", id: "contract", imageUrl: "/images/ccontract.png"},
	                         { text: "付款信息", id: "contract", imageUrl: "/images/ccontract.png"}
	                     ]
	             },
	                                 
	             {
	                 text: "基础信息",  id: "customer", access:"user_management", imageUrl: "/images/user.png",
	                 	items: [
	                             { text: "客户", id: "customer", imageUrl: "/images/toy.png" },
	                             { text: "供应商", id: "supplier", imageUrl: "/images/ccontract.png" }
	                         ]
	             } , {
	                 text: "权限管理", id: "userman", access:"user_management", expanded: false, imageUrl: "/images/friends_group.png",
	                 items: [
	                         { text: "用户管理", id: "userman", imageUrl: "/images/toy.png" },
	                         { text: "角色管理", id: "group", imageUrl: "/images/ccontract.png" }
	                     ]
	             }
	         ];
	
	
	removeTreeItems(menus);
	
	for(i in menus){
		if(menus[i].items){
			removeTreeItems(menus[i].items);
		}
	}
	$("#user_info").html(data.userName);
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
	var newItems = items.slice(0);

	for (i in newItems) {

		if (newItems[i].access) {
			var hasAccess = false;
			var roleId = newItems[i].access;
			for (j in roles) {
				if (roleId.indexOf(roles[j].roleID) >= 0) {
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


function loadPage(page, parameters) {
	
	if($(".k-window").length>0 && $(".k-overlay").length>0){
		$(".k-window").hide();
		$(".k-overlay").hide();
	}
	redirecPage = page;
	redirectParams = parameters;
	

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
	} else if (page == "invoiceList") {
		page = "html/finance/invoiceList.html";
	} else if (page == "gotMoneyList") {
		page = "html/finance/gotMoneyList.html";
	}else if (page == "group") {
		page = "html/user/group.html";
	} else if (page == "customer") {
		page = "html/customer/customer.html";
	} else if (page == "supplier") {
		page = "html/supplier/supplier.html";
	} else if (page == "allocate") {
		page = "html/execution/allocate.html";
	} else if (page == "purchasecontract") {
		page = "html/purchasecontract/purchasecontract.html";
	}else if (page == "purchaseorder" ) {
		page = "html/purchasecontract/purchaseOrder.html";
	}else if (page == "purchaseRequestByAssistant") {
		page = "html/purchasecontract/purchaseRequest.html";
	}else if (page == "purchaseRequestApprove") {
		page = "html/purchasecontract/purchaseRequestApprove.html";
	}else if (page == "addProject") {
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
	}else if(page == "purchaseAllotManageEdit"){
		page = "html/purchasecontract/purchaseAllotManageEdit.html";		
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
				$("#main_right").html(data);
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

function checkRoles(){
	var buttons = $('button[access]');
	buttons.each(function(index){
		var node = jQuery(buttons[index]);
		var roleId = node.attr("access");
		var hasAccess = false;
		for(i in roles){	
			console.log(roles[i].roleID + "====" + roleId);
			if(roles[i].roleID == roleId){
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

String.prototype.endWith = function(s) {
	if (s == null || s == "" || this.length == 0 || s.length > this.length)
		return false;
	if (this.substring(this.length - s.length) == s)
		return true;
	else
		return false;
	return true;
}



