package com.pms.service.mockbean;


public class PurchaseCommonBean extends BaseEntity {
    
    private String projectId;
    
    private String customerId;
    
    private String approvedDate;

    private String backRequestCode;

    private String backRequestId;

    private String salesContractId;
    
    private String salesContractCode;

    private String purchaseOrderCode;
    
    private String purchaseOrderId;

    private String purchaseRequestCode;
    
    private String purchaseRequestId;
    
    private String comment;
    
    private String scContractType;


    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }
    
    

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

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

    public String getPurchaseRequestCode() {
        return purchaseRequestCode;
    }

    public void setPurchaseRequestCode(String purchaseRequestCode) {
        this.purchaseRequestCode = purchaseRequestCode;
    }

    public String getSalesContractId() {
        return salesContractId;
    }

    public void setSalesContractId(String salesContractId) {
        this.salesContractId = salesContractId;
    }

    public String getSalesContractCode() {
        return salesContractCode;
    }

    public void setSalesContractCode(String salesContractCode) {
        this.salesContractCode = salesContractCode;
    }


    public String getPurchaseRequestId() {
        return purchaseRequestId;
    }

    public void setPurchaseRequestId(String purchaseRequestId) {
        this.purchaseRequestId = purchaseRequestId;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
    
    

    public String getScContractType() {
        return scContractType;
    }

    public void setScContractType(String scContractType) {
        this.scContractType = scContractType;
    }



    public static final String PROCESS_STATUS = "status";
    public static final String APPROVED_DATE = "approvedDate";
    public static final String SALES_CONTRACT_CODE = "salesContractCode";

    public static final String STATUS_DRAFT = "草稿";
    public static final String STATUS_NEW = "审批中";
    public static final String STATUS_APPROVED = "审批通过";
    public static final String STATUS_REJECTED = "审批拒绝";
    public static final String MANAGER_APPROVED = "经理审批通过";
    public static final String STATUS_CANCELLED = "已中止";
    public static final String STATUS_IN_REPOSITORY = "已入库";
    public static final String STATUS_OUT_REPOSITORY = "已出库";
    public static final String STATUS_REPOSITORY_NEW = "入库中";
    public static final String STATUS_IN_OUT_REPOSITORY = "已入/出库";
    
    //物流类型
    public static final String LOGISTICS_TYPE_VALUE_DIRECTY = "直发"; 
    public static final String LOGISTICS_TYPE = "logisticsType";
    
    public static final String PURCHASE_REQUEST_CODE = "purchaseRequestCode";
    public static final String PURCHASE_REQUEST_ID = "purchaseRequestId";
    public static final String PURCHASE_ORDER_CODE = "purchaseOrderCode";
    public static final String PURCHASE_ORDER_ID = "purchaseOrderId";
    
    
    public static final String PROJECT_ID = "projectId";
    
    public static final String SALES_COUNTRACT_ID = "salesContractId";

}
