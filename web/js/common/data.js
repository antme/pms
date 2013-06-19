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



//销售合同相关的数据
//弱电工程、产品集成（灯控/布线，楼控，其他）、产品销售、维护及服务
var contractTypeItems = [{ text: "弱电工程", value: "弱电工程" }, { text: "产品集成（灯控/布线）", value: "产品集成（灯控/布线）" }, { text: "产品集成（楼控）", value: "产品集成（楼控）" }, { text: "产品集成（其他）", value: "产品集成（其他）" }, { text: "产品销售（灯控/布线）", value: "产品销售（灯控/布线）" }, { text: "产品销售（楼控）", value: "产品销售（楼控）" }, { text: "产品销售（其他）", value: "产品销售（其他）" }, { text: "维护及服务", value: "维护及服务" }];


//采购合同相关数据
//合同类型
var purchaseContractType = [{text : "代理产品"}, {text : "非代理产品"}, {text : "同方采购"}];

//货物递送方式
var eqcostDeliveryType = [{text : "直发现场"}, {text : "直发入库"}];
var executeType1 = [{text : "内部流程中"}, {text : "备货中"}, {text : "备货待发"}, {text : "发货完毕"}, {text : "结束"}];
var executeType2 = [{text : "内部流程中"}, {text : "备货中"}, {text : "备货待发"}, {text : "入库完毕"}, {text : "结束"}];



