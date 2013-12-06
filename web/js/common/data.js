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

var userMenus = undefined;

var user = {};


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
			lt_n : "小于",
			gt_n : "大于",
			eq_n : "等于"
		},
		date : {
			lt_d : "小于",
			gt_d : "大于",
			eq_d : "等于"
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
                 text: "项目管理", id: "project_projectList", imageUrl: "/images/product.png"
             },

             {
                 text: "项目执行", id: "projectex", expanded : true, imageUrl: "/images/ccontract.png",
                 items: [
                         { text: "备货申请", id: "purchaseback_purchaseBack", imageUrl: "/images/order.png" },
                         { text: "备货拆分", id: "purchaseback_purchaseAllot",imageUrl: "/images/screw-driver.png" },
                         { text: "调拨申请", id: "purchaseback_purchaseAllotManage", imageUrl: "/images/shop.png" },
                         { text: "采购申请", id: "purchasecontract_purchaseRequest", imageUrl: "/images/shopping_cart.png"},
                         { text: "开票申请", id: "finance_payInvoice", imageUrl: "/images/ticket.png" },
                         { text: "发货申请", id: "execution_ship", imageUrl: "/images/shipping.png"},
                         { text: "发货合计", id: "execution_shipCount", imageUrl: "/images/borrowing.png"},
                         { text: "借货申请", id: "execution_borrowing", imageUrl: "/images/sign_in.png"},
                         { text: "还货申请", id: "execution_return", imageUrl: "/images/sign_out.png"}
                     ]
             },
             {
                 text: "销售合同",  id: "salescontract_scList", imageUrl: "/images/target.png"
             },
             

             {
	             text : "采购合同", id : "purchasecontract", expanded : true, imageUrl : "/images/contract.png",
                 items: [
                     { text: "采购申请", id: "purchasecontract_purchaseRequestApprove", imageUrl: "/images/shopping_cart.png"},
                     { text: "采购订单", id: "purchasecontract_purchaseOrder",  imageUrl: "/images/porder.png"},
                     { text: "采购合同", id: "purchasecontract_purchasecontract", imageUrl: "/images/order.png" },
                     { text: "入库申请单", id: "repository_repository", imageUrl: "/images/heineken.png" },
                     { text: "到货通知", id: "execution_arrivalNotice", imageUrl: "/images/repository.png" },
                     { text: "直发出库单", id: "repository_repositoryout", imageUrl: "/images/rout.png"}
                 ]
             },                                               
             {
                 text: "财务",  id: "finance",  expanded : true, imageUrl: "/images/finance.png",
                 items: [
                         { text: "开票信息", id: "finance_payInvoice", imageUrl: "/images/ticket.png" },
                         { text: "收款信息", id: "finance_gotMoneyList", imageUrl: "/images/invoice.png"},
                         { text: "付款信息", id: "finance_payMoney", imageUrl: "/images/license.png"},
                         { text: "收票信息", id: "finance_getInvoice", imageUrl: "/images/milestone.png"}
                     ]
             },
                                 
             {
                 text: "基础信息",  id: "system", expanded : true, imageUrl: "/images/address.png",
                 	items: [
                             { text: "客户", id: "customer_customer", imageUrl: "/images/toy.png" },
                             { text: "供应商", id: "supplier_supplier", imageUrl: "/images/ccontract.png" },
                             { text: "数据导入", id: "import_historyDataImport", imageUrl: "/images/drive-32.png" }
                         ]
             } , {
                 text: "权限管理", id: "user", expanded: true, imageUrl: "/images/friends_group.png",
                 items: [
                         { text: "用户管理", id: "user_userman", imageUrl: "/images/user.png" },
                         { text: "角色管理", id: "user_group", imageUrl: "/images/12xingzuo_11.png" },
                         { text: "菜单管理", id: "user_menu", imageUrl: "/images/designs.png" }
                     ]
             }
  ];



//销售合同相关的数据
//弱电工程、产品集成（灯控/布线，楼控，其他）、产品销售、维护及服务
var contractTypeItems = [{ text: "弱电工程", value: "弱电工程" }, { text: "产品集成（灯控/布线）", value: "产品集成（灯控/布线）" }, { text: "产品集成（楼控）", value: "产品集成（楼控）" }, { text: "产品集成（其他）", value: "产品集成（其他）" }, { text: "产品销售（灯控/布线）", value: "产品销售（灯控/布线）" }, { text: "产品销售（楼控）", value: "产品销售（楼控）" }, { text: "产品销售（其他）", value: "产品销售（其他）" }, { text: "维护及服务", value: "维护及服务" }, { text: "N/A", value: "N/A" }];
var invoiceTypeItems = [{ text: "增值税专用", value: "增值税专用" }, { text: "增值税普通", value: "增值税普通" }, { text: "建筑业发票", value: "建筑业发票" }, { text: "服务业发票", value: "服务业发票" }];
var archiveStatusItems = [{ text: "已归档", value: "已归档" }, { text: "未归档", value: "未归档" }];
var runningStatusItems = [{ text: "执行中", value: "执行中" }, { text: "中止或暂停", value: "中止或暂停" }, { text: "收尾阶段", value: "收尾阶段" }, { text: "结束", value: "结束" }, { text: "质保期", value: "质保期" }, { text: "作废", value: "作废" }];

//采购合同相关数据
//合同类型
var purchaseContractTypeNormal = [ {text : "上海代理产品"}, {text : "上海其他"}];
var purchaseContractTypeVirtual = [{text : "施耐德北京代采"}, {text : "泰康北京生产"}, {text : "施耐德北京库存"}, {text : "泰康北京库存"}];
var purchaseRequestTypeItems = [{text : "上海代理产品"}, {text : "上海其他"}, {text : "施耐德北京代采"}, {text : "泰康北京生产"}, {text : "施耐德北京库存"}, {text : "泰康北京库存"}];


//货物递送方式
var eqcostDeliveryType = [{text : "入公司库"}, {text : "直发现场"}];
var executeType1 = [{text : "内部流程中"}, {text : "备货中"}, {text : "备货待发"}, {text : "发货完毕"}, {text : "结束"}];
var executeType2 = [{text : "内部流程中"}, {text : "备货中"}, {text : "备货待发"}, {text : "入库完毕"}, {text : "结束"}];

var storeHouseType = [{text : "上海—上海泰德库"}, {text : "上海—北京泰德库"}];

//项目类型
var proCategoryItems = [{ text: "产品"}, { text: "工程"}, { text: "服务"}];
//项目状态
var proStatusItems = [{ text: "内部立项"}, { text: "销售预立项"}, { text: "销售正式立项"}];
var proStatusItemsForAdd = [{ text: "销售预立项"}, { text: "内部立项"}];


var departmentItems =  [{ text: "工程部"}, { text: "产品部"} , { text: "服务部"}];

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


var pbStatus = [{ text: "草稿"}, { text: "已提交"}, { text: "已批准"}, {text:"已拒绝"}]
var paStatus = [ { text: "已批准"}, {text:"已拒绝"},{text:"已结束"},{text:"已终审"}]
