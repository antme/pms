package com.pms.service.mockbean;

public class PurchaseContract extends PurchaseCommonBean {
       
    private String eqcostDeliveryType;

    public String getEqcostDeliveryType() {
        return eqcostDeliveryType;
    }

    public void setEqcostDeliveryType(String eqcostDeliveryType) {
        this.eqcostDeliveryType = eqcostDeliveryType;
    }
    public static final String EQCOST_DELIVERY_TYPE =  "eqcostDeliveryType";

    public static final String SUPPLIER_ID = "supplierId";
    public static final String SUPPLIER_NAME = "supplierName";

        
    public static final String PURCHASE_CONTRACT_TYPE = "purchaseContractType";

    public static final String PURCHASE_CONTRACT_PROPERTY = "contractProperty";

    public static final String PURCHASE_CONTRACT_MONEY = "contractMoney";

    public static final String PURCHASE_CONTRACT_PAYMENT_TYPE = "contractPaymentType";

    public static final String PURCHASE_CONTRACT_PROPERTY_CLOSE = "闭口合同";
    public static final String PURCHASE_CONTRACT_PROPERTY_OPEN = "开口合同";

}
