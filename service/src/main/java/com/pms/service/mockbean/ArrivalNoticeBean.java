package com.pms.service.mockbean;

public class ArrivalNoticeBean {
    public static final String ARRIVAL_DATE = "arrivalDate";
    
    public static final String FOREIGN_KEY = "foreignKey"; // 采购订单id or 调拨申请id
    
    public static final String FOREIGN_CODE = "foreignCode"; // 采购订单code or 调拨申请code
    
    public static final String SHIP_TYPE = "shipType"; // 发货类型 - 0:供应商直发 1:调拨非直发 2:采购非直发
    
    public static final String SHIP_TYPE_0 = "0"; // 供应商直发
    
    public static final String SHIP_TYPE_1 = "1"; // 调拨非直发
    
    public static final String SHIP_TYPE_2 = "2"; // 采购非直发
}
