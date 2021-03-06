
$(document).ready(function() {
	initKeyDownEvent();
	
	kendo.ui.progress($("#pms_content"), true);
	
	kendo.cultures["zh-CN"] = {
		    //<language code>-<country/region code>
		    name: "zh-CN",
		    // "numberFormat" defines general number formatting rules
		    numberFormat: {
		        //numberFormat has only negative pattern unline the percent and currency
		        //negative pattern: one of (n)|-n|- n|n-|n -
		        pattern: ["-n"],
		        //number of decimal places
		        decimals: 2,
		        //string that separates the number groups (1,000,000)
		        ",": ",",
		        //string that separates a number from the fractional point
		        ".": ".",
		        //the length of each number group
		        groupSize: [3],
		        //formatting rules for percent number
		        percent: {
		            //[negative pattern, positive pattern]
		            //negativePattern: one of -n %|-n%|-%n|%-n|%n-|n-%|n%-|-% n|n %-|% n-|% -n|n- %
		            //positivePattern: one of n %|n%|%n|% n
		            pattern: ["-n %", "n %"],
		            //number of decimal places
		            decimals: 2,
		            //string that separates the number groups (1,000,000 %)
		            ",": ",",
		            //string that separates a number from the fractional point
		            ".": ".",
		            //the length of each number group
		            groupSize: [3],
		            //percent symbol
		            symbol: "%"
		        },
		        currency: {
		            //[negative pattern, positive pattern]
		            //negativePattern: one of "($n)|-$n|$-n|$n-|(n$)|-n$|n-$|n$-|-n $|-$ n|n $-|$ n-|$ -n|n- $|($ n)|(n $)"
		            //positivePattern: one of "$n|n$|$ n|n $"
		            pattern: ["(n)", "n"],
		            //number of decimal places
		            decimals: 2,
		            //string that separates the number groups (1,000,000 $)
		            ",": ",",
		            //string that separates a number from the fractional point
		            ".": ".",
		            //the length of each number group
		            groupSize: [3],
		            //currency symbol
		            symbol: "$"
		        }
		    },
		    calendars: {
		        standard: {
		            days: {
		                // full day names
		                names: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		                // abbreviated day names
		                namesAbbr: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
		                // shortest day names
		                namesShort: [ "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa" ]
		            },
		            months: {
		                // full month names
		                names: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
		                // abbreviated month names
		                namesAbbr: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
		            },
		            // AM and PM designators
		            // [standard,lowercase,uppercase]
		            AM: [ "AM", "am", "AM" ],
		            PM: [ "PM", "pm", "PM" ],
		            // set of predefined date and time patterns used by the culture.
		            patterns: {
		                d: "M/d/yyyy",
		                D: "dddd, MMMM dd, yyyy",
		                F: "dddd, MMMM dd, yyyy h:mm:ss tt",
		                g: "M/d/yyyy h:mm tt",
		                G: "M/d/yyyy h:mm:ss tt",
		                m: "MMMM dd",
		                M: "MMMM dd",
		                s: "yyyy'-'MM'-'ddTHH':'mm':'ss",
		                t: "h:mm tt",
		                T: "h:mm:ss tt",
		                u: "yyyy'-'MM'-'dd HH':'mm':'ss'Z'",
		                y: "MMMM, yyyy",
		                Y: "MMMM, yyyy"
		            },
		            // the first day of the week (0 = Sunday, 1 = Monday, etc)
		            firstDay: 0
		        }
		    }
		};
	kendo.culture("zh-CN"); 

	postAjaxRequest("/service/user/home", null, init)

});

function initKeyDownEvent(){
	if (navigator.userAgent.indexOf("MSIE")>0 || navigator.userAgent.indexOf("msie")>0) {
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
	
}


function init(u){
	kendo.ui.progress($("#pms_content"), false);
	userRoles = u.data;
	userMenus = u.menus;
	user = u;
	$("#user_info").html(user.userName);
	
	if(!user.isAdmin){
	
		for (i in menus) {
			if (menus[i].items) {
				// 二级菜单权限验证
				removeTreeItems(menus[i].items);
			}
		}
		
		//一级菜单权限验证
		removeTreeItems(menus, true);
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
	
	//连接点击区域扩大
	$(".k-in").click(function(e){
		if(e.target && e.target.className && e.target.className =="k-image"){
			if(e.target.nextElementSibling){
				e.target.nextElementSibling.click();
			}
		}

	});
	
}

function removeTreeItems(items, parent) {

	// 拷贝数据
	var newItems = items.slice(0);
	for (i in newItems) {
		var id = newItems[i].id;
		var childItems = newItems[i].items;

		if(parent && childItems && childItems.length>0){
			//如果一级菜单下面还有二级菜单，显示一级菜单
		}else{
			var hasAccess = false;
			for (j in userMenus) {
				if (id.indexOf(userMenus[j].menuId) >= 0) {
					hasAccess = true;
					break;
				}
			}
			if (!hasAccess) {
				for (j in items) {
					if(items[j].id==newItems[i].id){
						//菜单权限，先注释掉
						items.splice(j, 1);
					}
				}
		
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

function loadTreePage(page, parameters){
	$("#myTask").hide();
	if(!parameters){
		redirectParams = undefined;
	}
	loadPage(page, parameters);
}

function loadPage(page, parameters, popupDiv) {
	kendo.ui.progress($("#pms_content"), true);
	if(!popupDiv){
		if($(".k-window").length>0 && $(".k-overlay").length>0){
			$(".k-window").hide();
			$(".k-overlay").hide();
		}
	}
	if(!popupDiv){
		fromPage = redirecPage;
		redirecPage = page;
		redirectParams = parameters;
	}
	
	if(parameters == null && !popupDiv){
		popupParams = undefined;
	}

	var uid = kendo.guid();

	if (page == "mytask") {
		$("#myTask").show();
		var tabMyTask = $("#tabMyTask").data("kendoTabStrip");
		kendo.ui.progress($("#pms_content"), false);
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
			url = url + "&uid=" + uid;
		}else{
			url = url + "?uid=" + uid;
		}
		
		if(popupDiv){
			$("#"+popupDiv).html("");
		}else{
			$("#main_right").html("");
		}
		$.ajax({
			url : url,
			success : function(data) {
				if(popupDiv){
					kendo.ui.progress($("#pms_content"), false);
					$("#"+popupDiv).html(data);
					
					var window = $("#popup");
					var kendoWindow = window.data("kendoWindow");
					if(kendoWindow){
						kendoWindow.center();
						$(".k-window").css("top","10px");
					}

				}else{
					kendo.ui.progress($("#pms_content"), false);
					initKeyDownEvent();
					$("#main_right").html(data);
				}
				

			},
			error : function(){
				alert("连接Service失败");
				kendo.ui.progress($("#pms_content"), false);
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
					if(dataItem.db == "salesContract"){
						return "销售合同";
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
						return '<a onclick="loadTreePage(' + "'purchaseback_purchaseBack'," + param + ')">' + dataItem.count + '</a>';
					}
					if(dataItem.db == "purchaseContract"){
						return '<a onclick="loadTreePage(' + "'purchasecontract_purchasecontract'," + param + ')">' + dataItem.count + '</a>';
					}
					if(dataItem.db == "purchaseOrder"){
						return '<a onclick="loadTreePage(' + "'purchasecontract_purchaseOrder'," + param + ')">'+ dataItem.count + '</a>';
					}
					
					if(dataItem.db == "purchaseAllocate"){
						return '<a onclick="loadTreePage(' + "'purchaseback_purchaseAllotManage'," + param + ')">'+ dataItem.count + '</a>';
					}
					
					if(dataItem.db == "repository"){
						return '<a onclick="loadTreePage(' + "'repository_repository'," + param + ')">'+ dataItem.count + '</a>';
					}
					
					if(dataItem.db == "ship"){
						return '<a onclick="loadTreePage(' + "'execution_ship'," + param + ')">'+ dataItem.count + '</a>';
					}
					
					if(dataItem.db == "borrowing"){
						return '<a onclick="loadTreePage(' + "'execution_borrowing'," + param + ')">'+ dataItem.count + '</a>';
					}
					
					if(dataItem.db == "return"){
						return '<a onclick="loadTreePage(' + "'execution_return'," + param + ')">'+ dataItem.count + '</a>';
					}
					
					if(dataItem.db == "salesContract"){
						return '<a onclick="loadTreePage(' + "'salescontract_draftlist'," + param + ')">'+ dataItem.count + '</a>';
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
    var pdiv= $("#pms_content");
    kendo.ui.progress(pdiv, false);
    kendo.ui.progress(pdiv, true);
	$.ajax({
		url : url,
		success : function(responsetxt) {
			kendo.ui.progress(pdiv, false);
			var res;
			eval("res=" + responsetxt);
			if (res.status && res.status == "0" && res.msg) {
				alert(res.msg);
			} else {
				eval("callback(res)");
			}
		},

		error : function() {
			kendo.ui.progress(pdiv, false);
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
	var buttons = $('.access');
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



function openRemotePageWindow(options, targetPage, parameter) {
	var window = $("#popup");
	$("#popup").html("")
	$("#popup").show();

	var kendoWindow = window.data("kendoWindow");
	if (!kendoWindow) {
		window.kendoWindow({
			width : options.width,
			height : options.height,
			title : options.title,
			modal: true,			
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
	loadPage(targetPage, null, "popup");

}

function disableAllInPoppup(){
	$("#popup button").hide();
	$("#popup textarea").attr("disabled",true); 
	$("#popup input").attr("disabled",true);
	$(".pro-dropdownlist").attr("readonly",true);	
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

function openBorrowingViewWindow(param){
	var options = { width:"680px", height: "600px", title:"借还货信息"};
	openRemotePageWindow(options, "execution_addBorrowing", {_id : param});
}
		

function openProjectViewWindow(param){
	if(param && param!=""){
		var options = { width:"1080px", height: "600px", title:"项目信息"};
		openRemotePageWindow(options, "project_editProject", {_id : param});
	}else{
		alert("此项目还没保存");
	}
}


function openSettlmentWindow(param){
	if(param && param!=""){
		var options = { width:"1080px", height: "600px", title:"结算信息"};
		openRemotePageWindow(options, "execution_addSettlement", {_id : param});
	}else{
		alert("此项目还没保存");
	}
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



function openBorrowingViewWindow(param){

	var options = { width:"1080px", height: "600px", title:"借货信息"};
	openRemotePageWindow(options, "execution_addBorrowing", {_id : param});
	
}


function openRepositoryViewWindow(param){
	var options = { width:"1080px", height: "500px", title:"入库信息"};
	openRemotePageWindow(options, "repository_repositoryEdit", {_id : param});	
}


function openRepositoryOutViewWindow(param){
	var options = { width:"1080px", height: "500px", title:"直发签收单信息"};
	openRemotePageWindow(options, "repository_repositoryOutEdit", {_id : param, type : "out"});	
}

function openVirtualRepositoryOutViewWindow(param){
	var options = { width:"1080px", height: "500px", title:"虚拟出入库签收信息"};
	openRemotePageWindow(options, "repository_repositoryOutEdit", {_id : param, type : "out", isVirtualRequest: true});	
}

openVirtualRepositoryOutViewWindow

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
