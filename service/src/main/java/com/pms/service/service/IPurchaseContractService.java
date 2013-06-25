package com.pms.service.service;

import java.util.List;
import java.util.Map;

public interface IPurchaseContractService {

    public Map<String, Object> getPurchaseContract(Map<String, Object> parameters);
    
    public Map<String, Object> listPurchaseContracts(Map<String, Object> parameters);
    
    public Map<String, Object> listContractsForRepositorySelect();
    
    public Map<String, Object> listContractsByProjectId(Map<String, Object> contract);
    
    public Map<String, Object> listContractsSuppliersByProjectId(Map<String, Object> contract);
    
    public Map<String, Object> listContractsByProjectAndSupplier(Map<String, Object> params);
    
    public Map<String, Object> listSalesContractsForShipSelect(Map<String, Object> params);  
    
    public Map<String, Object> listEqcostListForShipByScIDAndType(Map<String, Object> params);  
    
    public void deletePurchaseContract(Map<String, Object> contract);
    
    public Map<String, Object> updatePurchaseContract(Map<String, Object> contract);
    
    public Map<String, Object> listPurchaseOrders(Map<String, Object> parameters);
    
    public void deletePurchaseOrder(Map<String, Object> order);
    
    public Map<String, Object> updatePurchaseOrder(Map<String, Object> order);



    public Map<String, Object> approvePurchaseOrder(Map<String, Object> order);
    
    public Map<String, Object> rejectPurchaseOrder(Map<String, Object> order);
    
    public Map<String, Object> approvePurchaseContract(Map<String, Object> order);
    
    public Map<String, Object> rejectPurchaseContract(Map<String, Object> order);
    
    public Map<String, Object> listBackRequestForSelect();
    
    public Map<String, Object> listApprovedPurchaseRequestForSelect();

    public Map<String, Object> getPurchaseOrder(Map<String, Object> parameters);
    
    
    public List<Map<String,Object>> listApprovedPurchaseContractCosts(String salesContractId);
    
    public Map<String, Object> listApprovedPurchaseOrderForSelect();
    
    public Map<String, Object> listPurchaseRequests(Map<String, Object> parameters);
    
    public Map<String, Object> updatePurchaseRequest(Map<String, Object> request);


    public Map<String, Object> approvePurchaseRequest(Map<String, Object> request);
    
    public Map<String, Object> cancelPurchaseRequest(Map<String, Object> request);
    
    public Map<String, Object> rejectPurchaseRequest(Map<String, Object> request);
    
    public Map<String, Object> getPurchaseRequest(Map<String, Object> parameters);
    
    public void deletePurchaseRequest(Map<String, Object> order);

    public Map<String, Object> getBackRequestForSelect(Map<String, Object> parserJsonParameters);

    public Map<String, Object> listRepositoryRequests(Map<String, Object> parameters);
    
    public Map<String, Object> listRepositoryByProjectId(Map<String, Object> params);

    public Map<String, Object> addRepositoryRequest(Map<String, Object> parserListJsonParameters);

    public Map<String, Object> getRepositoryRequest(Map<String, Object> parserListJsonParameters);

    public void deleteRepositoryRequest(Map<String, Object> parserJsonParameters);

    public Map<String, Object> updateRepositoryRequest(Map<String, Object> parserListJsonParameters);

    public Map<String, Object> approveRepositoryRequest(Map<String, Object> parserJsonParameters);

    public Map<String, Object> rejectRepositoryRequest(Map<String, Object> parserJsonParameters);
    
    public Map<String, Object> cancelRepositoryRequest(Map<String, Object> params);
    
    public Map<String, Object> listSelectForPayment(Map<String, Object> params);
    
    public Map<String, Object> listPaymoney(Map<String, Object> params);

    public Map<String, Object> addPaymoney(Map<String, Object> params);
    
    public Map<String, Object> updatePaymoney(Map<String, Object> params);
    
    public Map<String, Object> listGetInvoice(Map<String, Object> params);

    public Map<String, Object> saveGetInvoice(Map<String, Object> params);
    
    public Map<String, Object> loadGetInvoice(Map<String, Object> params);
    
    public Map<String, Object> prepareGetInvoice(Map<String, Object> params);
    
    public Map<String, Object> updateGetInvoice(Map<String, Object> params);
    
    public void destroyGetInvoice(Map<String, Object> params);

    public Map<String, Object> listProjectsFromRepositoryIn(Map<String, Object> parserJsonParameters);


}
