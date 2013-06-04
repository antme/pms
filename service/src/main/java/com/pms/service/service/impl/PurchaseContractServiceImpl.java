package com.pms.service.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.pms.service.mockbean.ApiConstants;
import com.pms.service.mockbean.DBBean;
import com.pms.service.service.AbstractService;
import com.pms.service.service.IPurchaseContractService;

public class PurchaseContractServiceImpl extends AbstractService implements IPurchaseContractService {

    @Override
    public String geValidatorFileName() {
        return null;
    }

    @Override
    public Map<String, Object> addPurchaseContract(Map<String, Object> contract) {
        return this.dao.add(contract, DBBean.PURCHASE_CONTRACT);
    }

    @Override
    public Map<String, Object> listPurchaseContracts() {
        return this.dao.list(null, DBBean.PURCHASE_CONTRACT);
    }

    @Override
    public void deletePurchaseContract(Map<String, Object> contract) {
        List<String> ids = new ArrayList<String>();
        ids.add(contract.get(ApiConstants.MONGO_ID).toString());
        dao.deleteByIds(ids, DBBean.PURCHASE_CONTRACT);

    }

    @Override
    public Map<String, Object> updatePurchaseContract(Map<String, Object> contract) {

        Map<String, Object> cc = dao.findOne(ApiConstants.MONGO_ID, contract.get(ApiConstants.MONGO_ID), DBBean.PURCHASE_CONTRACT);
        contract.put(ApiConstants.MONGO_ID, cc.get(ApiConstants.MONGO_ID));
        return dao.updateById(contract, DBBean.PURCHASE_CONTRACT);

    }

    @Override
    public Map<String, Object> addPurchaseOrder(Map<String, Object> contract) {
        return this.dao.add(contract, DBBean.PURCHASE_ORDER);
    }

    @Override
    public Map<String, Object> listPurchaseOrders() {
        return this.dao.list(null, DBBean.PURCHASE_ORDER);
    }

    @Override
    public void deletePurchaseOrder(Map<String, Object> contract) {
        List<String> ids = new ArrayList<String>();
        ids.add(contract.get(ApiConstants.MONGO_ID).toString());
        dao.deleteByIds(ids, DBBean.PURCHASE_ORDER);

    }

    @Override
    public Map<String, Object> updatePurchaseOrder(Map<String, Object> contract) {

        Map<String, Object> cc = dao.findOne(ApiConstants.MONGO_ID, contract.get(ApiConstants.MONGO_ID), DBBean.PURCHASE_ORDER);
        contract.put(ApiConstants.MONGO_ID, cc.get(ApiConstants.MONGO_ID));
        return dao.updateById(contract, DBBean.PURCHASE_ORDER);

    }

}
