var redirectParams = undefined;
var redirecPage = undefined;


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

function init(data){
	
	console.log(data);
	
	$("#tree-nav").kendoTreeView({
    	template: kendo.template($("#treeview-template").html()),
        dataSource: [
            {
                text: "项目管理", id: "projectList", imageUrl: "/images/product.png"
            },

            {
                text: "项目执行", id: "projectex", imageUrl: "/images/ccontract.png",
                items: [
                        { text: "备货申请", id: "purchaseRequest", imageUrl: "/images/order.png" },
                        { text: "采购申请", id: "purchaseRequestByAssistant", imageUrl: "/images/ccontract.png"},
                        { text: "开票申请", id: "purchaseorder", imageUrl: "/images/ccontract.png" },
                        { text: "发货申请", id: "ship", imageUrl: "/images/ccontract.png"},
                        { text: "借货申请", id: "contract", imageUrl: "/images/ccontract.png"},
                        { text: "还货申请", id: "contract", imageUrl: "/images/ccontract.png"}
                    ]
            },
            {
                text: "销售合同",  id: "scList", imageUrl: "/images/user.png"
            },
            

            {
                text: "采购合同", id: "purchasecontract", expanded: false, imageUrl: "/images/contract.png",
                items: [
                    { text: "备货申请", id: "purchaseRequest", imageUrl: "/images/order.png" },
                    { text: "调拨申请", id: "contract", imageUrl: "/images/ccontract.png" },
                    { text: "采购申请", id: "purchaseorder", imageUrl: "/images/ccontract.png"},
                    { text: "采购合同", id: "purchasecontract", imageUrl: "/images/order.png" },
                    { text: "入库申请单", id: "contract", imageUrl: "/images/ccontract.png" },
                    { text: "直发入库申请单", id: "contract", imageUrl: "/images/ccontract.png"}
                ]
            },                                               
            {
                text: "财务",  id: "finance", imageUrl: "/images/finance.png",
                items: [
                        { text: "财务资料", id: "contract", imageUrl: "/images/order.png" },
                        { text: "开票信息", id: "contract", imageUrl: "/images/ccontract.png" },
                        { text: "收款信息", id: "contract", imageUrl: "/images/ccontract.png"},
                        { text: "付款信息", id: "contract", imageUrl: "/images/ccontract.png"}
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
        ]

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
	} else if (page == "purchaseRequest") {
		page = "html/purchasecontract/purchaseRequest.html";
	} else if (page == "purchasecontractedit") {
		page = "html/purchasecontract/purchasecontractedit.html";
	} else if (page == "purchaseorder" || page == "purchaseRequestByAssistant") {
		page = "html/purchasecontract/purchaseOrder.html";
	}else if (page == "purchaseOrderEdit") {
		page = "html/purchasecontract/purchaseOrderEdit.html";
	}else if (page == "addProject") {
		page = "html/project/addProject.html";
	} else if (page == "purchaseRequestAdd") {
		page = "html/purchasecontract/purchaseRequestAdd.html";
	} else if (page == "ship") {
		page = "html/execution/ship.html";
	} else if (page == "addShip") {
		page = "html/execution/addShip.html";
	} else {
		page = "html/supplier/supplier.html";
	}

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
	
	for(i in buttons){
		console.log(i);
	}

}



