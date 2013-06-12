package com.pms.service.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.pms.service.mockbean.ApiConstants;
import com.pms.service.mockbean.DBBean;
import com.pms.service.mockbean.PurchaseBack;
import com.pms.service.mockbean.PurchaseOrder;
import com.pms.service.mockbean.SalesContractBean;
import com.pms.service.service.AbstractService;
import com.pms.service.service.IPurchaseContractService;
import com.pms.service.util.ApiUtil;

public class PurchaseContractServiceImpl extends AbstractService implements IPurchaseContractService {

    private static final String APPROVED = "approved";
    private static final Logger logger = LogManager.getLogger(PurchaseContractServiceImpl.class);
    
    @Override
    public String geValidatorFileName() {
        return null;
    }


    @Override
    public Map<String, Object> listPurchaseContracts() {
        return this.dao.list(null, DBBean.PURCHASE_CONTRACT);
    }
    
    
    public List<Map<String,Object>> listApprovedPurchaseContractCosts(String salesContractCode){
        Map<String, Object> query = new HashMap<String, Object>();
        query.put(ApiConstants.LIMIT_KEYS, new String[]{SalesContractBean.SC_EQ_LIST});
        query.put(PurchaseOrder.PROCESS_STATUS, APPROVED);

        Map<String, Object>  results = this.dao.findOneByQuery(query, DBBean.PURCHASE_CONTRACT);
        List<Map<String,Object>> list = (List<Map<String, Object>>) results.get("eqcostList");
        return list;
    }
    
    public Map<String, Object> getPurchaseContract(HashMap<String, Object> parameters){
        
        return this.dao.findOne(ApiConstants.MONGO_ID, parameters.get(ApiConstants.MONGO_ID), DBBean.PURCHASE_CONTRACT);
    }


    @Override
    public void deletePurchaseContract(Map<String, Object> contract) {
        List<String> ids = new ArrayList<String>();
        ids.add(contract.get(ApiConstants.MONGO_ID).toString());
        dao.deleteByIds(ids, DBBean.PURCHASE_CONTRACT);

    }

    @Override
    public Map<String, Object> updatePurchaseContract(Map<String, Object> contract) {

        if (ApiUtil.isEmpty(contract.get(ApiConstants.MONGO_ID))) {
            contract.put("purchaseContractCode","Contract_" + String.valueOf(new Date().getTime()));
            return this.dao.add(contract, DBBean.PURCHASE_CONTRACT);
        } else {
            Map<String, Object> cc = dao.findOne(ApiConstants.MONGO_ID, contract.get(ApiConstants.MONGO_ID), DBBean.PURCHASE_CONTRACT);
            contract.put(ApiConstants.MONGO_ID, cc.get(ApiConstants.MONGO_ID));
            return dao.updateById(contract, DBBean.PURCHASE_CONTRACT);
        }
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
        if (ApiUtil.isEmpty(order.get(ApiConstants.MONGO_ID))) {
            order.put(PurchaseOrder.PROCESS_STATUS, "New");
            order.put(PurchaseOrder.ORDER_CODE, "Order" + String.valueOf(new Date().getTime()));
            return this.dao.add(order, DBBean.PURCHASE_ORDER);
        } else {
            Map<String, Object> cc = dao.findOne(ApiConstants.MONGO_ID, order.get(ApiConstants.MONGO_ID), DBBean.PURCHASE_ORDER);
            order.put(ApiConstants.MONGO_ID, cc.get(ApiConstants.MONGO_ID));
            return dao.updateById(order, DBBean.PURCHASE_ORDER);
        }
    }
    
    public Map<String, Object> getPurchaseOrder(HashMap<String, Object> parameters){
        
        return this.dao.findOne(ApiConstants.MONGO_ID, parameters.get(ApiConstants.MONGO_ID), DBBean.PURCHASE_ORDER);
    }

    public Map<String, Object> approvePurchaseContract(HashMap<String, Object> order) {
        Map<String, Object> cc = dao.findOne(ApiConstants.MONGO_ID, order.get(ApiConstants.MONGO_ID), DBBean.PURCHASE_CONTRACT);
        order.put(ApiConstants.MONGO_ID, cc.get(ApiConstants.MONGO_ID));
        order.put(PurchaseOrder.PROCESS_STATUS, APPROVED);
        order.put(PurchaseOrder.APPROVED_DATE, ApiUtil.formateDate(new Date(), "yyy-MM-dd"));

        return dao.updateById(order, DBBean.PURCHASE_CONTRACT);
    }

    public Map<String, Object> rejectPurchaseContract(HashMap<String, Object> order) {
        Map<String, Object> cc = dao.findOne(ApiConstants.MONGO_ID, order.get(ApiConstants.MONGO_ID), DBBean.PURCHASE_CONTRACT);
        order.put(ApiConstants.MONGO_ID, cc.get(ApiConstants.MONGO_ID));
        order.put(PurchaseOrder.PROCESS_STATUS, "rejected");
        order.put(PurchaseOrder.APPROVED_DATE, ApiUtil.formateDate(new Date(), "yyy-MM-dd"));

        return dao.updateById(order, DBBean.PURCHASE_CONTRACT);
    }

    public Map<String, Object> approvePurchaseOrder(HashMap<String, Object> order) {
        Map<String, Object> cc = dao.findOne(ApiConstants.MONGO_ID, order.get(ApiConstants.MONGO_ID), DBBean.PURCHASE_ORDER);
        order.put(ApiConstants.MONGO_ID, cc.get(ApiConstants.MONGO_ID));
        order.put(PurchaseOrder.PROCESS_STATUS, APPROVED);
        order.put(PurchaseOrder.APPROVED_DATE, ApiUtil.formateDate(new Date(), "yyy-MM-dd"));

        return dao.updateById(order, DBBean.PURCHASE_ORDER);
    }

    public Map<String, Object> rejectPurchaseOrder(HashMap<String, Object> order) {
        Map<String, Object> cc = dao.findOne(ApiConstants.MONGO_ID, order.get(ApiConstants.MONGO_ID), DBBean.PURCHASE_ORDER);
        order.put(ApiConstants.MONGO_ID, cc.get(ApiConstants.MONGO_ID));
        order.put(PurchaseOrder.PROCESS_STATUS, "rejected");
        order.put(PurchaseOrder.APPROVED_DATE, ApiUtil.formateDate(new Date(), "yyy-MM-dd"));

        return dao.updateById(order, DBBean.PURCHASE_ORDER);
    }

    public Map<String, Object> listBackRequestForSelect() {
        Map<String, Object> query = new HashMap<String, Object>();
        query.put(PurchaseBack.status, PurchaseBack.status_approved);
        query.put(ApiConstants.LIMIT_KEYS, new String[] { PurchaseBack.code, PurchaseBack.salesContract_code });
        return dao.list(query, DBBean.PURCHASE_BACK);
    }
    
    
    public Map<String, Object> listPurchaseRequests(){
        return this.dao.list(null, DBBean.PURCHASE_REQUEST);
    }
    
    public Map<String, Object> listPurchaseRequestForSelect(){
        Map<String, Object> query = new HashMap<String, Object>();
        query.put(PurchaseBack.status, PurchaseBack.status_approved);
        query.put(ApiConstants.LIMIT_KEYS, new String[] { PurchaseBack.code, PurchaseBack.salesContract_code });
        return dao.list(query, DBBean.PURCHASE_REQUEST);
    }
    
    public Map<String, Object> updatePurchaseRequest(Map<String, Object> order){
        if (ApiUtil.isEmpty(order.get(ApiConstants.MONGO_ID))) {
            order.put(PurchaseOrder.PROCESS_STATUS, "New");
            order.put(PurchaseOrder.ORDER_CODE, "Order" + String.valueOf(new Date().getTime()));
            return this.dao.add(order, DBBean.PURCHASE_REQUEST);
        } else {
            Map<String, Object> cc = dao.findOne(ApiConstants.MONGO_ID, order.get(ApiConstants.MONGO_ID), DBBean.PURCHASE_REQUEST);
            order.put(ApiConstants.MONGO_ID, cc.get(ApiConstants.MONGO_ID));
            return dao.updateById(order, DBBean.PURCHASE_ORDER);
        }
    }


    public Map<String, Object> approvePurchaseRequest(HashMap<String, Object> order){
        Map<String, Object> cc = dao.findOne(ApiConstants.MONGO_ID, order.get(ApiConstants.MONGO_ID), DBBean.PURCHASE_REQUEST);
        order.put(ApiConstants.MONGO_ID, cc.get(ApiConstants.MONGO_ID));
        order.put(PurchaseOrder.PROCESS_STATUS, APPROVED);
        order.put(PurchaseOrder.APPROVED_DATE, ApiUtil.formateDate(new Date(), "yyy-MM-dd"));
        return dao.updateById(order, DBBean.PURCHASE_REQUEST);
    }
    
    public Map<String, Object> rejectPurchaseRequest(HashMap<String, Object> order){
        Map<String, Object> cc = dao.findOne(ApiConstants.MONGO_ID, order.get(ApiConstants.MONGO_ID), DBBean.PURCHASE_REQUEST);
        order.put(ApiConstants.MONGO_ID, cc.get(ApiConstants.MONGO_ID));
        order.put(PurchaseOrder.PROCESS_STATUS, "rejected");
        order.put(PurchaseOrder.APPROVED_DATE, ApiUtil.formateDate(new Date(), "yyy-MM-dd"));

        return dao.updateById(order, DBBean.PURCHASE_REQUEST);
    }
    
    public Map<String, Object> getPurchaseRequest(HashMap<String, Object> parameters){
        return this.dao.findOne(ApiConstants.MONGO_ID, parameters.get(ApiConstants.MONGO_ID), DBBean.PURCHASE_REQUEST);
    }
    
    public void deletePurchaseRequest(Map<String, Object> order){
        
    }
    
    

}
