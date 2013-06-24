package com.pms.service.mockbean;

public class BorrowingBean {
	
    public static final String BORROW_CODE = "borrowCode"; // 编号
    
    public static final String BORROW_APPLICANT = "applicant"; // 申请人
    
    public static final String BORROW_DATE = "applicationDate"; // 申请日期
    
    public static final String BORROW_STATUS = "status"; // 申请状态
    
    public static final String BORROW_ALLOCATE_TYPE = "allocateType"; // 调拨类型
    
    public static final String BORROW_ADDITIONAL_DOCUMENTS  = "documents"; // 所附单据
    
    public static final String BORROW_DESCRIPTION = "description"; // 理由及说明

    public static final String BORROW_IN_PROJECT_ID = "inProjectId"; //调入项目_id-外键
	
    public static final String BORROW_IN_PROJECT_CODE = "inProjectCode"; //调入项目编号
	
    public static final String BORROW_IN_PROJECT_NAME = "inProjectName"; //调入项目名称
	
    public static final String BORROW_IN_PROJECT_MANAGER = "inProjectManager"; //调入项目负责人

    public static final String BORROW_IN_SALES_CONTRACT_ID = "inSalesContractId"; // 调入销售合同数据库_id-外键
    
    public static final String BORROW_IN_SALES_CONTRACT_CODE = "inSalesContractCode"; // 调入销售合同数据库_id-外键
    
    public static final String BORROW_IN_SALES_CONTRACT_TYPE = "inSalesContractType"; // 调入销售合同数据库_id-外键
    
    public static final String BORROW_IN_PROJECT_CUSTOMER = "inProjectCustomer"; // 调入项目客户名称
    
    public static final String BORROW_OUT_PROJECT_ID = "outProjectId"; //调出项目_id-外键
	
    public static final String BORROW_OUT_PROJECT_CODE = "outProjectCode"; //调出项目编号
	
    public static final String BORROW_OUT_PROJECT_NAME = "outProjectName"; //调出项目名称
	
    public static final String BORROW_OUT_PROJECT_MANAGER = "outProjectManager"; //调出项目负责人

    public static final String BORROW_OUT_SALES_CONTRACT_ID = "outSalesContractId"; // 调出销售合同数据库_id-外键
    
    public static final String SHIP_EQ_LIST = "eqcostList"; // 设备清单
    
}
