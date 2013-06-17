package com.pms.service.mockbean;

import java.math.BigDecimal;

public class PurchaseRequest extends BaseEntity {

    private String approvedDate;

    private String backRequestCode;

    private String backRequestId;


    private String salesContract_id;

    private String purchaseOrderCode;
    
    private String purchaseRequestCode;

    private String purchaseOrderId;

    private BigDecimal requestedTotalMoney;

    private int requestedNumbers;

    private float moneyOfContract;

    private int requestTotalOfCountract;

    private float allRequestedNumbersOfCountract;

    private float totalRequestedMoneyOfContract;

    private float numbersPercentOfContract;

    private float moneyPercentOfContract;


    public String getBackRequestCode() {
        return backRequestCode;
    }

    public void setBackRequestCode(String backRequestCode) {
        this.backRequestCode = backRequestCode;
    }

    public String getBackRequestId() {
        return backRequestId;
    }

    public void setBackRequestId(String backRequestId) {
        this.backRequestId = backRequestId;
    }

    public String getSalesContract_id() {
        return salesContract_id;
    }

    public void setSalesContract_id(String salesContractId) {
        this.salesContract_id = salesContractId;
    }

    public String getPurchaseOrderId() {
        return purchaseOrderId;
    }

    public void setPurchaseOrderId(String purchaseOrderId) {
        this.purchaseOrderId = purchaseOrderId;
    }

    public String getApprovedDate() {
        return approvedDate;
    }

    public void setApprovedDate(String approvedDate) {
        this.approvedDate = approvedDate;
    }

    public String getPurchaseOrderCode() {
        return purchaseOrderCode;
    }

    public void setPurchaseOrderCode(String purchaseOrderCode) {
        this.purchaseOrderCode = purchaseOrderCode;
    }

    public BigDecimal getRequestedTotalMoney() {
        return requestedTotalMoney;
    }

    public void setRequestedTotalMoney(BigDecimal requestedTotalMoney) {
        this.requestedTotalMoney = requestedTotalMoney;
    }

    public int getRequestedNumbers() {
        return requestedNumbers;
    }

    public void setRequestedNumbers(int requestedNumbers) {
        this.requestedNumbers = requestedNumbers;
    }

    public float getMoneyOfContract() {
        return moneyOfContract;
    }

    public void setMoneyOfContract(float moneyOfContract) {
        this.moneyOfContract = moneyOfContract;
    }

    public int getRequestTotalOfCountract() {
        return requestTotalOfCountract;
    }

    public void setRequestTotalOfCountract(int requestTotalOfCountract) {
        this.requestTotalOfCountract = requestTotalOfCountract;
    }

    public float getAllRequestedNumbersOfCountract() {
        return allRequestedNumbersOfCountract;
    }

    public void setAllRequestedNumbersOfCountract(float allRequestedNumbersOfCountract) {
        this.allRequestedNumbersOfCountract = allRequestedNumbersOfCountract;
    }

    public float getTotalRequestedMoneyOfContract() {
        return totalRequestedMoneyOfContract;
    }

    public void setTotalRequestedMoneyOfContract(float totalRequestedMoneyOfContract) {
        this.totalRequestedMoneyOfContract = totalRequestedMoneyOfContract;
    }

    public float getNumbersPercentOfContract() {
        return numbersPercentOfContract;
    }

    public void setNumbersPercentOfContract(float numbersPercentOfContract) {
        this.numbersPercentOfContract = numbersPercentOfContract;
    }

    public float getMoneyPercentOfContract() {
        return moneyPercentOfContract;
    }

    public void setMoneyPercentOfContract(float moneyPercentOfContract) {
        this.moneyPercentOfContract = moneyPercentOfContract;
    }
    
    

    public String getPurchaseRequestCode() {
        return purchaseRequestCode;
    }

    public void setPurchaseRequestCode(String purchaseRequestCode) {
        this.purchaseRequestCode = purchaseRequestCode;
    }



    public static final String PROCESS_STATUS = "status";
    public static final String APPROVED_DATE = "approvedDate";
    public static final String SALES_CONTRACT_CODE = "salesContractCode";

    public static final String STATUS_DRAFT = "草稿";
    public static final String STATUS_NEW = "审批中";
    public static final String STATUS_APPROVED = "审批通过";
    public static final String STATUS_REJECTED = "审批拒绝";
    public static final String MANAGER_APPROVED = "经理审批通过";
    public static final String STATUS_CANCELLED = "已废止";

}
