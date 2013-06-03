package com.pms.service.service;

import java.util.Map;

public interface IPurchaseContractService {

    
    public Map<String, Object> addPurchaseContract(Map<String, Object> contract);
    
    public Map<String, Object> listPurchaseContracts();
    
    public void deletePurchaseContract(Map<String, Object> contract);
    
    public Map<String, Object> updatePurchaseContract(Map<String, Object> contract);
}
