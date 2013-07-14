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

var user = undefined;

var listUrl;

var commonListOptions = {
		schema : {
			total: "total", // total is returned in the "total" field of the response
			data: "data"
		},
		pageSize: 10,
		serverPaging: true,
		serverSorting: true,
		serverFiltering : true
}

var baseUrl = "/service";

//定义菜单所需权限，目前写死在JS文件中, KEY对应menus变量中的菜单ID
var accessRoles = {
	user : "user_management"
};


var filterable = {
	extra : false,
	operators : {
		string : {
			like : "匹配",
			neq : "不等于"
		},
		number : {
			lt : "小于",
			gt : "大于",
			eq : "等于"
		},
		date : {
			eq : "等于"
		}
	},
	messages : {
		filter : "过滤",
		clear : "清除",
		info : "选择过滤条件"
	}
};

// 定义左边菜单
var menus = [
             {
                 text: "项目管理", id: "projectList", imageUrl: "/images/product.png"
             },

             {
                 text: "项目执行", id: "projectex", imageUrl: "/images/ccontract.png",
                 items: [
                         { text: "备货申请", id: "purchaseBack", imageUrl: "/images/order.png" },
                         { text: "采购申请", id: "purchaseRequestByAssistant", imageUrl: "/images/purchase.png"},
                         { text: "开票申请", id: "payInvoice", imageUrl: "/images/involce.png" },
                         { text: "发货申请", id: "ship", imageUrl: "/images/borrowing.png"},
                         { text: "发货合计", id: "shipCount", imageUrl: "/images/borrowing.png"},
                         { text: "借货申请", id: "borrowing", imageUrl: "/images/sign_in.png"},
                         { text: "还货申请", id: "return", imageUrl: "/images/sign_out.png"}
                     ]
             },
             {
                 text: "销售合同",  id: "scList", imageUrl: "/images/user.png"
             },
             

             {
	             text : "采购合同", id : "purchasecontract", expanded : false, imageUrl : "/images/contract.png",
                 items: [
                     { text: "备货申请", id: "purchaseAllot", imageUrl: "/images/order.png" },
                     { text: "调拨申请", id: "purchaseAllotManage", imageUrl: "/images/allocate.png" },
                     { text: "采购申请", id: "purchaseRequestApprove", imageUrl: "/images/purchase.png"},
                     { text: "采购订单", id: "purchaseorder",  imageUrl: "/images/porder.png"},
                     { text: "采购合同", id: "purchasecontract", imageUrl: "/images/order.png" },
                     { text: "入库申请单", id: "repository", imageUrl: "/images/repository.png" },
                     { text: "到货通知", id: "arrivalNotice", imageUrl: "/images/repository.png" },
                     { text: "直发出入库", id: "repositoryOut", imageUrl: "/images/rout.png"}
                 ]
             },                                               
             {
                 text: "财务",  id: "finance",  imageUrl: "/images/finance.png",
                 items: [
                         { text: "开票信息", id: "payInvoice", imageUrl: "/images/calender.png" },
                         { text: "收款信息", id: "getMoney", imageUrl: "/images/invoice.png"},
                         { text: "付款信息", id: "payMoney", imageUrl: "/images/license.png"},
                         { text: "收票信息", id: "getInvoice", imageUrl: "/images/milestone.png"}
                     ]
             },
                                 
             {
                 text: "基础信息",  id: "system", imageUrl: "/images/user.png",
                 	items: [
                             { text: "客户", id: "customer", imageUrl: "/images/toy.png" },
                             { text: "供应商", id: "supplier", imageUrl: "/images/ccontract.png" }
                         ]
             } , {
                 text: "权限管理", id: "user", expanded: false, imageUrl: "/images/friends_group.png",
                 items: [
                         { text: "用户管理", id: "userman", imageUrl: "/images/toy.png" },
                         { text: "角色管理", id: "group", imageUrl: "/images/ccontract.png" }
                     ]
             }
  ];



//销售合同相关的数据
//弱电工程、产品集成（灯控/布线，楼控，其他）、产品销售、维护及服务
var contractTypeItems = [{ text: "弱电工程", value: "弱电工程" }, { text: "产品集成（灯控/布线）", value: "产品集成（灯控/布线）" }, { text: "产品集成（楼控）", value: "产品集成（楼控）" }, { text: "产品集成（其他）", value: "产品集成（其他）" }, { text: "产品销售（灯控/布线）", value: "产品销售（灯控/布线）" }, { text: "产品销售（楼控）", value: "产品销售（楼控）" }, { text: "产品销售（其他）", value: "产品销售（其他）" }, { text: "维护及服务", value: "维护及服务" }];
var invoiceTypeItems = [{ text: "增值税专用", value: "增值税专用" }, { text: "增值税普通", value: "增值税普通" }, { text: "建筑业发票", value: "建筑业发票" }, { text: "服务业发票", value: "服务业发票" }];
var archiveStatusItems = [{ text: "已归档", value: "已归档" }, { text: "未归档", value: "未归档" }];
var runningStatusItems = [{ text: "执行中", value: "执行中" }, { text: "中止或暂停", value: "中止或暂停" }, { text: "收尾阶段", value: "收尾阶段" }, { text: "结束", value: "结束" }, { text: "质保期", value: "质保期" }, { text: "作废", value: "作废" }];

//采购合同相关数据
//合同类型
var purchaseContractType = [{text : "施工分包"}, {text : "代理产品"}, {text : "非代理产品"}, {text : "同方代采"}, {text : "同方采购"}];


//货物递送方式
var eqcostDeliveryType = [{text : "入公司库"}, {text : "直发现场"}];
var executeType1 = [{text : "内部流程中"}, {text : "备货中"}, {text : "备货待发"}, {text : "发货完毕"}, {text : "结束"}];
var executeType2 = [{text : "内部流程中"}, {text : "备货中"}, {text : "备货待发"}, {text : "入库完毕"}, {text : "结束"}];

var storeHouseType = [{text : "上海—上海泰德库"}, {text : "上海—北京泰德库"}];

//项目类型
var proCategoryItems = [{ text: "产品", value: "产品" }, { text: "工程", value: "工程" }, { text: "服务", value: "服务" }];
//项目状态
var proStatusItems = [{ text: "内部立项"}, { text: "销售预立项"}, { text: "销售正式立项"}];
var proStatusItemsForAdd = [{ text: "销售预立项"}, { text: "内部立项"}];


//备货申请 - 采购类别
var pbTypeItems = [{ text: "上海代理产品采购"}, { text: "同方自主产品采购"}, { text: "其它渠道采购"}];

var departmentItems =  [{ text: "销售部"}, { text: "工程部"}, { text: "产品部"} , { text: "服务部"}];

// 调拨类型
var allotTypeItems = [{ text: "借货调拨"}, { text: "还货调拨"}, { text: "备货调拨"}];

// 发货类型
var shipTypeItems = [{ text: "供应商直发", value: "0" }, { text: "非供应商直发", value: "1" }];

// 货运要求
var deliveryRequirementsItems = [{ text: "常规汽运或快递"}, { text: "加急空运"}];

//货架编号
var shelfCodeItems =  [{ text: "北京备货货架"}, { text: "上海备货货架"}];

var proManagerItems = new kendo.data.DataSource({
	transport : {
		read : {
			url : "/service/user/pm/list",
			dataType : "jsonp"
		}
	},
	schema: {
	    data: "data"
	}
});