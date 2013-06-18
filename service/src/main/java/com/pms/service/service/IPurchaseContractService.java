package com.pms.service.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface IPurchaseContractService {

    public Map<String, Object> getPurchaseContract(HashMap<String, Object> parameters);
    
    public Map<String, Object> listPurchaseContracts();
    
    public void deletePurchaseContract(Map<String, Object> contract);
    
    public Map<String, Object> updatePurchaseContract(Map<String, Object> contract);
    
    public Map<String, Object> listPurchaseOrders();
    
    public void deletePurchaseOrder(Map<String, Object> order);
    
    public Map<String, Object> updatePurchaseOrder(Map<String, Object> order);



    public Map<String, Object> approvePurchaseOrder(HashMap<String, Object> order);
    
    public Map<String, Object> rejectPurchaseOrder(HashMap<String, Object> order);
    
    public Map<String, Object> approvePurchaseContract(HashMap<String, Object> order);
    
    public Map<String, Object> rejectPurchaseContract(HashMap<String, Object> order);
    
    public Map<String, Object> listBackRequestForSelect();
    
    public Map<String, Object> listApprovedPurchaseRequestForSelect();

    public Map<String, Object> getPurchaseOrder(HashMap<String, Object> parameters);
    
    
    public List<Map<String,Object>> listApprovedPurchaseContractCosts(String salesContractCode);
    
    
    
    public Map<String, Object> listPurchaseRequests();
    
    public Map<String, Object> updatePurchaseRequest(Map<String, Object> request);


    public Map<String, Object> approvePurchaseRequest(HashMap<String, Object> request);
    
    public Map<String, Object> cancelPurchaseRequest(HashMap<String, Object> request);
    
    public Map<String, Object> rejectPurchaseRequest(HashMap<String, Object> request);
    
    public Map<String, Object> getPurchaseRequest(HashMap<String, Object> parameters);
    
    public void deletePurchaseRequest(Map<String, Object> order);

    public Map<String, Object> getBackRequestForSelect(HashMap<String, Object> parserJsonParameters);

    public Map<String, Object> listRepositoryRequests();

    public Map<String, Object> addRepositoryRequest(HashMap<String, Object> parserListJsonParameters);

    public Map<String, Object> getRepositoryRequest(HashMap<String, Object> parserListJsonParameters);

    public void deleteRepositoryRequest(HashMap<String, Object> parserJsonParameters);

    public Map<String, Object> updateRepositoryRequest(HashMap<String, Object> parserListJsonParameters);

    public Map<String, Object> approveRepositoryRequest(HashMap<String, Object> parserJsonParameters);

    public Map<String, Object> rejectRepositoryRequest(HashMap<String, Object> parserJsonParameters);
    
    public Map<String, Object> listSelectForPayment(HashMap<String, Object> params);
    
    public Map<String, Object> listPaymoney(HashMap<String, Object> params);

    public Map<String, Object> addPaymoney(HashMap<String, Object> params);
    
    public Map<String, Object> updatePaymoney(HashMap<String, Object> params);
}
