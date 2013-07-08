package com.pms.service.mockbean;

public class InvoiceBean {

	public static final String payInvoiceComment = "payInvoiceComment";
	public static final String payInvoiceStatus = "payInvoiceStatus";
	public static final String payInvoiceDepartment = "payInvoiceDepartment";
	public static final String payInvoiceProposerId = "payInvoiceProposerId";//申请人id
	public static final String payInvoiceProposerName = "payInvoiceProposerName";//申请人name
	public static final String payInvoicePlanDate = "payInvoicePlanDate";//建议开票日期
	public static final String payInvoiceReceivedMoneyStatus = "payInvoiceReceivedMoneyStatus";//收款情况
	//public static final String payInvoiceType = "payInvoiceType"; //开票类型，源于销售合同
	public static final String payInvoiceMoney = "payInvoiceMoney";//合计金额
	public static final String payInvoiceSubmitDate = "payInvoiceSubmitDate";
	public static final String payInvoiceApproveDate = "payInvoiceApproveDate";//部门经理批准日期
	public static final String payInvoiceCheckDate = "payInvoiceCheckDate";//财务审核日期
	public static final String payInvoiceSignDate = "payInvoiceSignDate"; //发票签收日期
	public static final String payInvoiceManagerId = "payInvoiceManagerId"; //部门经理
	
	public static final String payInvoiceItemList = "payInvoiceItemList";//
	public static final String itemNo = "itemNo";//票编号
	public static final String itemMonth = "itemMonth";//票月份
	public static final String itemContent = "itemContent";//票内容
	public static final String itemComment ="itemComment";//票备注
	public static final String itemMoney = "itemMoney";//票金额

	public static final String payInvoiceActualMoney = "payInvoiceActualMoney"; //实际金额
	public static final String payInvoiceActualDate = "payInvoiceActualDate"; //实际开票日期
	public static final String payInvoiceActualSheetCount = "payInvoiceActualSheetCount"; //实际开票张数
	public static final String payInvoiceActualInvoiceNum = "payInvoiceActualInvoiceNum"; //登记的发票号码
	
	public static final String salesContractId = "salesContractId";
	public static final String purchaseContractId = "purchaseContractId";
	public static final String purchaseContractCode = "purchaseContractCode";
	//unsubmit -- submit -- manager approve -- finance manager approve -- doing -- done
	public static final String statusUnSubmit = "草稿";//
	public static final String statusSubmit = "待部门经理审核";//
	public static final String statusManagerApprove = "待财务经理审核";//
	public static final String statusFinanceManagerApprojve = "开票中";//
	public static final String statusDone = "开票完毕";//
	public static final String statusReject = "拒绝";//
	
	
///////////////////////	收票///////////////
	public static final String getInvoiceComment = "getInvoiceComment";
	public static final String getInvoiceDepartment = "getInvoiceDepartment";
	public static final String getInvoiceProposerId = "getInvoiceProposerId";//申请人id
	public static final String getInvoiceReceivedMoneyStatus = "getInvoiceReceivedMoneyStatus";//收款情况
	public static final String getInvoiceItemList = "getInvoiceItemList";//	
	public static final String getInvoiceActualMoney = "getInvoiceActualMoney"; //实际金额
	public static final String getInvoiceActualDate = "getInvoiceActualDate"; //实际开票日期
	public static final String getInvoiceActualSheetCount = "getInvoiceActualSheetCount"; //实际开票张数
	public static final String getInvoiceActualInvoiceNum = "getInvoiceActualInvoiceNum"; //登记的发票号码	
	public static final String invoiceType = "invoiceType"; //票类型
	public static final String getInvoiceSupplierId = "getInvoiceSupplierId";//供应商
}
