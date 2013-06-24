package com.pms.service.mockbean;

public class ReturnBean {
	
    public static final String BORROW_ID = "borrowId"; // id
    
    public static final String BORROW_CODE = "borrowCode"; // 借货申请编号
    
    public static final String RETURN_APPLICANT = "applicant"; // 申请人
    
    public static final String RETURN_DATE = "applicationDate"; // 申请日期
    
    public static final String RETURN_STATUS = "status"; // 申请状态
    
    public static final String RETURN_STATUS_TOBE = "0"; // 待还货
    public static final String RETURN_STATUS_SUBMIT = "1"; // 提交还货申请
    public static final String RETURN_STATUS_APPROVE = "2"; // 批准
    public static final String RETURN_STATUS_REJECT = "-1"; // 拒绝
    
}
