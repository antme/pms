package com.pms.service.mockbean;

public class ArrivalNoticeBean {
	
	public static final String NOTICE_ID = "noticeId";
	
    public static final String ARRIVAL_DATE = "arrivalDate";
    
    public static final String FOREIGN_KEY = "foreignKey"; // 采购订单id or 调拨申请id
    
    public static final String FOREIGN_CODE = "foreignCode"; // 采购订单code or 调拨申请code
    
    public static final String SHIP_TYPE = "shipType"; // 发货类型 - 0:供应商直发 1:调拨非直发 2:采购非直发
    
    public static final String SHIP_TYPE_0 = "调拨到货"; // 调拨到货
    
    public static final String SHIP_TYPE_1 = "直发现场"; // 供应商直发
    
    public static final String SHIP_TYPE_2 = "同方采购"; // 同方采购
    
    public static final String SHIP_TYPE_3 = "其他采购"; // 其他采购
    
    public static final String PROJECT_ID = "projectId";
    
    public static final String SALES_COUNTRACT_ID = "salesContractId";
    
    public static final String EQ_LIST = "eqcostList";
    
    public static final String NOTICE_STATUS = "noticeStatus";
    
    public static final String NOTICE_STATUS_NORMAL = "正常";
    
    public static final String NOTICE_STATUS_CLOSE = "关闭";
}
