package com.pms.service.mockbean;

public class ProjectBean {
	//线框图列表字段，但excel里没有，暂存
	public static final String PROJECT_TOTAL_AMOUNT = "totalAmount";  //项目总金额
	public static final String PROJECT_INVOICE_AMOUNT = "invoiceAmount";//开票金额
	public static final String PROJECT_GET_AMOUNT = "getAmount"; //到款金额
	public static final String PROJECT_PURCHASE_AMOUNT = "purchaseAmount"; //采购金额
	
	//项目字段
	public static final String PROJECT_ID = "projectId";  //项目编号
	public static final String PROJECT_CODE = "projectCode";  //项目编号
	public static final String PROJECT_NAME = "projectName";  //项目名称
	public static final String PROJECT_MANAGER = "projectManager";  //项目经理
	public static final String PROJECT_STATUS = "projectStatus";  //项目状态
	public static final String PROJECT_TYPE = "projectType";  //项目类型
	public static final String PROJECT_ADDRESS = "projectAddress";  //项目实施地址
	public static final String PROJECT_MEMO = "projectMemo";  //备注
	
	public static final String PROJECT_CUSTOMER_NAME = "customerName"; // 和 销售合同 都存放了该字段
	public static final String PROJECT_MODIFY_TIMES = "projectModifyTimes"; //增补次数
}
