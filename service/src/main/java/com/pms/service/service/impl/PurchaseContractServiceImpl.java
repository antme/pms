package com.pms.service.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.pms.service.mockbean.ApiConstants;
import com.pms.service.mockbean.DBBean;
import com.pms.service.mockbean.PurchaseOrder;
import com.pms.service.service.AbstractService;
import com.pms.service.service.IPurchaseContractService;
import com.pms.service.util.ApiUtil;

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
    public Map<String, Object> updatePurchaseOrder(Map<String, Object> order) {

        Map<String, Object> cc = dao.findOne(ApiConstants.MONGO_ID, order.get(ApiConstants.MONGO_ID), DBBean.PURCHASE_ORDER);
        order.put(ApiConstants.MONGO_ID, cc.get(ApiConstants.MONGO_ID));
        return dao.updateById(order, DBBean.PURCHASE_ORDER);

    }
    
    public Map<String, Object> approvePurchaseContract(HashMap<String, Object> order){
        Map<String, Object> cc = dao.findOne(ApiConstants.MONGO_ID, order.get(ApiConstants.MONGO_ID), DBBean.PURCHASE_CONTRACT);
        order.put(ApiConstants.MONGO_ID, cc.get(ApiConstants.MONGO_ID));
        order.put(PurchaseOrder.STATUS, "approved");
        order.put(PurchaseOrder.APPROVED_DATE, ApiUtil.formateDate(new Date(), "yyy-MM-dd")); 
        
        return dao.updateById(order, DBBean.PURCHASE_CONTRACT);
    }
    
    public Map<String, Object> rejectPurchaseContract(HashMap<String, Object> order){
        Map<String, Object> cc = dao.findOne(ApiConstants.MONGO_ID, order.get(ApiConstants.MONGO_ID), DBBean.PURCHASE_CONTRACT);
        order.put(ApiConstants.MONGO_ID, cc.get(ApiConstants.MONGO_ID));
        order.put(PurchaseOrder.STATUS, "rejected");
        order.put(PurchaseOrder.APPROVED_DATE, ApiUtil.formateDate(new Date(), "yyy-MM-dd")); 
        
        return dao.updateById(order, DBBean.PURCHASE_CONTRACT);
    }
    
    public Map<String, Object> approvePurchaseOrder(HashMap<String, Object> order){
        Map<String, Object> cc = dao.findOne(ApiConstants.MONGO_ID, order.get(ApiConstants.MONGO_ID), DBBean.PURCHASE_ORDER);
        order.put(ApiConstants.MONGO_ID, cc.get(ApiConstants.MONGO_ID));
        order.put(PurchaseOrder.STATUS, "approved");
        order.put(PurchaseOrder.APPROVED_DATE, ApiUtil.formateDate(new Date(), "yyy-MM-dd")); 
        
        return dao.updateById(order, DBBean.PURCHASE_ORDER);
    }
    
    public Map<String, Object> rejectPurchaseOrder(HashMap<String, Object> order){
        Map<String, Object> cc = dao.findOne(ApiConstants.MONGO_ID, order.get(ApiConstants.MONGO_ID), DBBean.PURCHASE_ORDER);
        order.put(ApiConstants.MONGO_ID, cc.get(ApiConstants.MONGO_ID));
        order.put(PurchaseOrder.STATUS, "rejected");
        order.put(PurchaseOrder.APPROVED_DATE, ApiUtil.formateDate(new Date(), "yyy-MM-dd")); 
        
        return dao.updateById(order, DBBean.PURCHASE_ORDER);
    }
    
    
    public Map<String, Object> listPurchaseRequest(){     
        Map<String, Object> results = new HashMap<String, Object>();
        List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
        
        
        List<Map<String, Object>> requestList = new ArrayList<Map<String, Object>>();
        Map<String, Object> request = new HashMap<String, Object>();
        request.put("goodsCode", "g2013");
        request.put("goodsName", "g2013-phone");
        request.put("goodsType", "phone");
        request.put("_id", 111111111);
        
        requestList.add(request);
        
        request = new HashMap<String, Object>();
        request.put("goodsCode", "g2014");
        request.put("goodsName", "g2014-phone");
        request.put("goodsType", "phone");
        request.put("_id", 4111);
        
        requestList.add(request);
        
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("projectName", "QC2013");
        map.put("projectCode", "QC2013-12345");
        map.put("customerContractId", "QC2013-12345-1111");
        map.put("customerRequestContractId", "QC2013-12345-111-222");
        map.put("orderId", "QC2013-12345-111-222-111");
        map.put("_id", 111111111);
        map.put("orderList", requestList);
        list.add(map);
        
        map = new HashMap<String, Object>();
        map.put("projectName", "QC2014");
        map.put("projectCode", "QC2014-12345");
        map.put("customerContractId", "QC2014-12344-1111");
        map.put("customerRequestContractId", "QC2014-12345-111-222");
        map.put("orderId", "QC2014-12345-111-222-111");
        map.put("_id", 4111);
        map.put("orderList", requestList);
        
        list.add(map);
        results.put("data", list);

        
        
        results.put("data", list);
        
        
        
        return results;
    }


}
