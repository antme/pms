package com.pms.service.mockbean;

public class SalesContractBean {
	public static final String SC_PROJECT_ID = "projectId"; //项目id外键
	public static final String SC_CUSTOMER_ID = "customerId";
	   
	//销售合同基础信息字段
	public static final String SC_MODIFY_TIMES = "scModifyTimes"; //增补次数
	public static final String SC_CODE = "contractCode"; //销售合同编号
	public static final String SC_PERSON = "contractPerson"; //签订人
	public static final String SC_TYPE = "contractType"; //合同类型*********
	public static final String SC_DATE = "contractDate"; //合同签订日期
	public static final String SC_DOWN_PAYMENT = "contractDownPayment"; //首付
	public static final String SC_DOWN_PAYMENT_MEMO = "contractDownPaymentMemo"; //首付 备注
	public static final String SC_PROGRESS_PAYMENT = "progressPayment"; //进度款
	public static final String SC_QUALITY_MONEY = "qualityMoney"; //质保金
	public static final String SC_QUALITY_MONEY_MEMO = "qualityMoneyMemo"; //质保金 备注
	public static final String SC_ARCHIVE_STATUS = "archiveStatus"; // 归档状态*********
	public static final String SC_RUNNING_STATUS = "runningStatus"; //执行状态*********
	public static final String SC_MEMO = "contractMemo"; //备注
	
	
	public static final String APPLICATION_DEPARTMENT = "applicationDepartment"; //申请部门
	
	//商务信息字段
	public static final String SC_AMOUNT = "contractAmount"; //合同金额
	public static final String SC_EQUIPMENT_AMOUNT = "equipmentAmount"; //设备金额
	public static final String SC_SERVICE_AMOUNT = "serviceAmount"; //服务金额
	public static final String SC_INVOICE_TYPE = "invoiceType"; //发票类型*********
	public static final String SC_EXTIMATE_GROSS_PROFIT_RATE = "estimateGrossProfitRate";//==预计毛利率
	public static final String SC_EXTIMATE_GROSS_PROFIT ="estimateGrossProfit";//==预计毛利
	public static final String SC_ESTIMATE_EQ_COST0 = "estimateEqCostAddedTax"; //预估设备成本（增值税）
	public static final String SC_ESTIMATE_EQ_COST1 = "estimateEqCostTax"; //预估设备成本（非增值税）
	public static final String SC_ESTIMATE_SUB_COST = "estimateSubCost"; //预估分包成本
	public static final String SC_ESTIMATE_PM_COST = "estimatePMCost"; //预估项目管理成本
	public static final String SC_ESTIMATE_DEEP_DESIGN_COST = "estimateDeepDesignCost"; //预估深化设计成本
	public static final String SC_ESTIMATE_DEBUG_COST = "estimateDebugCost"; //预估调试费用
	public static final String SC_DEBUG_COST_TYPE = "debugCostType"; //调试费用类型*********
	public static final String SC_ESTIMATE_TAX = "estimateTax"; //==预估税收
	public static final String SC_TAX_TYPE = "taxType"; //税收类型*********
	public static final String SC_ESTIMATE_OTHER_COST = "estimateOtherCost"; //预估其他成本
	public static final String SC_TOTAL_ESTIMATE_COST = "totalEstimateCost"; //==项目总预估成本
	
	
	//设备成本清单字段
	public static final String SC_EQ_LIST = "eqcostList";
	
	public static final String SC_EQ_LIST_NO = "eqcostNo";//序号
	public static final String SC_EQ_LIST_MATERIAL_CODE = "eqcostMaterialCode";//物料代码
	public static final String SC_EQ_LIST_PRODUCT_NAME = "eqcostProductName";//产品名称
	public static final String SC_EQ_LIST_PRODUCT_TYPE = "eqcostProductType";  //规格型号
	public static final String SC_EQ_LIST_AMOUNT = "eqcostAmount";//数量
	public static final String SC_EQ_LIST_UNIT = "eqcostUnit";//单位
	public static final String SC_EQ_LIST_BRAND = "eqcostBrand";//品牌
	public static final String SC_EQ_LIST_BASE_PRICE = "eqcostBasePrice"; //成本价
	public static final String SC_EQ_LIST_TOTAL_AMOUNT = "eqcostTotalAmount";//小计
	public static final String SC_EQ_LIST_MEMO = "eqcostMemo";//备注
	public static final String SC_EQ_LIST_DISCOUNT_RATE = "eqcostDiscountRate"; //折扣率
	
	//执行信息-财务数据
	//包装字段
	public static final String SC_EXECUTION_INFO = "scExecutionInfo";
	public static final String SC_INVOICE_INFO = "scInvoiceInfo";
	public static final String SC_GOT_MONEY_INFO = "scGotMoneyInfo";
	public static final String SC_MONTH_SHIPMENTS_INFO = "scMonthShipmentsInfo";
	public static final String SC_YEAR_SHIPMENTS_INFO = "scYearShipmentsInfo"; 
	
	public static final String SC_SHIPMENTS_MONEY = "scShipmentsMoney"; //==发货金额
	public static final String SC_INVOICE_MONEY = "scInvoiceMoney";  //==开票金额
	public static final String SC_GOT_MONEY = "scGotMoney";  //==收款金额
	public static final String SC_GOT_MONEY_DATE = "scGotMoneyDate";  //==收款日期
	public static final String SC_RECEIVABLE_MONEY = "scReceivableMoney";  //==应收账款
	public static final String SC_NO_EXECUTION_MONEY = "scNoExecutionMoney";  //==未执行款

	public static final String SC_INVOICE_DATE = "scInvoiceDate"; //==开票日期

	public static final String SC_MONTH_SHIPMENTS_MONTH = "month";
	public static final String SC_YEAR_SHIPMENTS_YEAR = "year";
	
	public static final String SC_ID = "scId"; // 其他表外键引用SC 时用此字段名 （eg. 开票表，收款表）
	
	//工程数据
	
	//**********下拉列表基础数据
	
	//合同类型
	public static final String SC_TYPE_RD = "弱电工程";
	public static final String SC_TYPE_FW = "维护及服务";
	public static final String SC_TYPE_SC_WIRING = "产品销售（灯控/布线）";
	public static final String SC_TYPE_INTEGRATION_WIRING = "产品集成（灯控/布线）";

    
	
	//归档状态
	public static final String SC_ARCHIVE_STATUS_ARCHIVED = "已归档";  //已归档
	public static final String SC_ARCHIVE_STATUS_UN_ARCHIVED = "未归档";  //未归档
	
	//执行状态
	public static final String SC_RUNNING_STATUS_RUNNING = "执行中"; //执行中
//	public static final int SC_RUNNING_STATUS_PAUSE = 2; //中止或暂停
//	public static final int SC_RUNNING_STATUS_END_PHASE = 3; //收尾阶段
//	public static final int SC_RUNNING_STATUS_OVER = 4; //结束
//	public static final int SC_RUNNING_STATUS_WARRANTY = 5; //质保期
//	public static final int SC_RUNNING_STATUS_CANCEL = 6; //作废
	
	//发票类型
//	增值税专用，增值税普通，建筑业发票，服务业发票
	public static final String SC_INVOICE_TYPE_1 = "增值税专用"; //增值税专用
	public static final String SC_INVOICE_TYPE_2 = "增值税普通"; //增值税普通
	public static final String SC_INVOICE_TYPE_3 = "建筑业发票"; //建筑业发票
	public static final String SC_INVOICE_TYPE_4 = "服务业发票"; //服务业发票
	
	//税收类型
//	public static final int SC_TAX_TYPE_ = 1; //
//	public static final int SC_TAX_TYPE_ = 1; //
//	public static final int SC_TAX_TYPE_ = 1; //
	
	//进度款
	public static final String SC_PROGRESS_PAYMENT_NO = "progressPaymentNo"; //进度款 序号
	public static final String SC_PROGRESS_PAYMENT_AMOUNT = "progressPaymentAmount"; //进度款 金额
	public static final String SC_PROGRESS_PAYMENT_MEMO = "progressPaymentMemo"; //进度款 备注
	
	public static final String SC_BACK_REQUEST_COUNT = "backRequestCount";//合同下申请单数量
	public static final String SC_LAST_TOTAL_AMOUNT = "scLastTotalAmount";//合同 最终总金额
	public static final String SC_MODIFY_HISTORY = "scModifyHistory";//合同  增补历史 (成本设备的勘误或增补修改)

	public static final String SC_MODIFY_MONEY = "addNewEqCostMoney";//合同  增补额
	public static final String SC_MODIFY_TIME = "addNewEqCostTime";//合同  增补时间
	public static final String SC_MODIFY_PERSON = "addNewEqCostPerson";//合同  增补操作人
	public static final String SC_MODIFY_REASON = "addNewEqCostReason";//合同  增补原因 (成本设备的勘误或增补修改)
	public static final String SC_MODIFY_MEMO = "addNewEqCostMemo";//合同  增补备注
	
	
	public static final String SC_CODE_PREFIX = "TDSH-XS-";
	
	public static final String SC_CODE_PREFIX_DRAFT = "TDSH-XS-DRAFT";
	
	public static final String SC_STATUS_DRAFT = "草稿";
	public static final String SC_STATUS_CLOSED = "已结束";
	public static final String SC_STATUS_SUBMITED = "已提交";
	
	// 第一次提交的值
	public static final String SC_FIRST_AMOUNT = "firstContractAmount"; //合同金额
	public static final String SC_FIRST_EQUIPMENT_AMOUNT = "firstEquipmentAmount"; //设备金额
	public static final String SC_FIRST_SERVICE_AMOUNT = "firstServiceAmount"; //服务金额
	public static final String SC_FIRST_EXTIMATE_GROSS_PROFIT ="firstEstimateGrossProfit";//==预计毛利
}
