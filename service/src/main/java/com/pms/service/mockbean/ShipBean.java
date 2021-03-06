package com.pms.service.mockbean;

public class ShipBean {
	
    public static final String SHIP_CODE = "shipCode"; // 编号
    
    public static final String SHIP_DEPARTMENT = "applicationDepartment"; // 申请部门
    
    public static final String SHIP_DATE = "applicationDate"; // 申请日期
    
    public static final String SHIP_STATUS = "status"; // 申请状态
    
    public static final String SHIP_STATUS_DRAFT = "草稿"; // 草稿
    public static final String SHIP_STATUS_SUBMIT = "申请中"; // 申请中
    public static final String SHIP_STATUS_FIRST_APPROVE = "已初审"; // 批准
    public static final String SHIP_STATUS_FINAL_APPROVE = "已终审"; // 批准
    public static final String SHIP_STATUS_CLOSE = "已结束"; // 关闭
    public static final String SHIP_STATUS_FIRST_REJECT = "初审拒绝"; // 拒绝
    public static final String SHIP_STATUS_FINAL_REJECT = "终审拒绝"; // 拒绝
    public static final String SHIP_TYPE = "shipType"; // 申请类型	- 直发 or 非直发
    
    public static final String SHIP_WAREHOUSE = "warehouse"; // 仓库
    
    public static final String SHIP_PROJECT_ID = "projectId"; // 项目数据库id-外键
    
    public static final String SHIP_PROJECT_NAME = "projectName"; // 项目名称

    public static final String SHIP_SALES_CONTRACT_ID = "scId"; // 销售合同数据库id-外键
    
    public static final String SHIP_SALES_CONTRACT_CODE = "contractCode"; // 销售合同编号
    
    public static final String SHIP_SALES_CONTRACT_TYPE = "contractType"; // 销售合同类型
    
    public static final String SHIP_CUSTOMER_NAME = "customer"; // 客户名称
    
    public static final String SHIP_DELIVERY_CONTACT = "deliveryContact"; // 收货联系人
    
    public static final String SHIP_DELIVERY_CONTACTWAY = "deliveryContactWay"; // 联系方式
    
    public static final String SHIP_DELIVERY_UNIT = "deliveryUnit"; // 收货单位
    
    public static final String SHIP_DELIVERY_ADDRESS = "deliveryAddress"; // 交货地点
    
    public static final String SHIP_DELIVERY_START_DATE = "deliveryStartDate"; // 发出时间
    
    public static final String SHIP_DELIVERY_TIME = "deliveryEndDate"; // 送达时间
    
    public static final String SHIP_DELIVERY_REQUIREMENTS = "deliveryRequirements"; // 货运要求
    
    public static final String SHIP_OTHER_DELIVERY_REQUIREMENTS = "otherDeliveryRequirements"; // 其他货运要求
    
    public static final String SHIP_EQ_LIST = "eqcostList"; // 设备清单
    
    public static final String SHIP_EQ_ACTURE_AMOUNT = "actureAmount"; // 实际发货数
    
    public static final String SHIP_EQ_GIVE_UP = "giveUp"; // 是否放弃未到货物
    
    public static final String SHIP_EQ_GIVE_UP_TRUE = "是"; // 是
    
    public static final String SHIP_EQ_GIVE_UP_FAULSE = "否"; // 否
    
    public static final String EQCOST_SHIP_AMOUNT = "eqcostShipAmount"; // 发货数量

    public static final String SHIP_LEFT_AMOUNT = "leftAmount"; // 可发货数量
    
    public static final String REPOSITORY_NAME = "repositoryName"; //仓库名字
    
}
