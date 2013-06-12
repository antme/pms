package com.pms.service.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.pms.service.mockbean.ApiConstants;
import com.pms.service.mockbean.CustomerBean;
import com.pms.service.mockbean.DBBean;
import com.pms.service.mockbean.ProjectBean;
import com.pms.service.mockbean.PurchaseBack;
import com.pms.service.mockbean.PurchaseRequestOrder;
import com.pms.service.mockbean.SalesContractBean;
import com.pms.service.mockbean.UserBean;
import com.pms.service.service.AbstractService;
import com.pms.service.service.IBackService;
import com.pms.service.service.IPurchaseContractService;
import com.pms.service.service.ISalesContractService;
import com.pms.service.util.ApiUtil;

public class PurchaseContractServiceImpl extends AbstractService implements IPurchaseContractService {

    private static final String APPROVED = PurchaseRequestOrder.STATUS_APPROVED;
    private static final Logger logger = LogManager.getLogger(PurchaseContractServiceImpl.class);
    
    
    private IBackService backService;
    
    private ISalesContractService scs;
    
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
        query.put(PurchaseRequestOrder.PROCESS_STATUS, APPROVED);

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
        return updatePurchase(contract, DBBean.PURCHASE_CONTRACT, "contract_");
    }
 

    @Override
    public Map<String, Object> listPurchaseOrders() {
        
        Map<String, Object> results = dao.list(null, DBBean.PURCHASE_ORDER);
        List<Map<String, Object>> list = (List<Map<String, Object>>) results.get(ApiConstants.RESULTS_DATA);
        
        for(Map<String, Object> data: list){
            Map<String, Object> query = new HashMap<String, Object>();
            query.put(SalesContractBean.SC_ID, data.get("salesContractCode"));
            
            
            Map<String, Object> relatedProjectInfo = getRelatedProjectInfo(query);
            data.put("customerName", relatedProjectInfo.get(ProjectBean.PROJECT_CUSTOMER));
            data.put("projectName", relatedProjectInfo.get("projectName"));
            data.put("projectManager", relatedProjectInfo.get("projectManager"));
        }
        
        return results;
        
    }

    @Override
    public void deletePurchaseOrder(Map<String, Object> contract) {
        List<String> ids = new ArrayList<String>();
        ids.add(contract.get(ApiConstants.MONGO_ID).toString());
        dao.deleteByIds(ids, DBBean.PURCHASE_ORDER);

    }

    @Override
    public Map<String, Object> updatePurchaseOrder(Map<String, Object> order) {
        return updatePurchase(order, DBBean.PURCHASE_ORDER, "order_");
    }
    
    public Map<String, Object> getPurchaseOrder(HashMap<String, Object> parameters){
        
        return this.dao.findOne(ApiConstants.MONGO_ID, parameters.get(ApiConstants.MONGO_ID), DBBean.PURCHASE_ORDER);
    }

    public Map<String, Object> approvePurchaseContract(HashMap<String, Object> order) {
        return processRequest(order, DBBean.PURCHASE_CONTRACT, APPROVED);
    }
    
    
    public Map<String, Object> processRequest(HashMap<String, Object> request, String db, String status){
        
        Map<String, Object> cc = dao.findOne(ApiConstants.MONGO_ID, request.get(ApiConstants.MONGO_ID), db);
        request.put(ApiConstants.MONGO_ID, cc.get(ApiConstants.MONGO_ID));
        request.put(PurchaseRequestOrder.PROCESS_STATUS, status);
        request.put(PurchaseRequestOrder.APPROVED_DATE, ApiUtil.formateDate(new Date(), "yyy-MM-dd"));

        return dao.updateById(request, db);
        
    }

    public Map<String, Object> rejectPurchaseContract(HashMap<String, Object> order) {       
        return processRequest(order, DBBean.PURCHASE_CONTRACT, PurchaseRequestOrder.STATUS_REJECTED);
    }

    public Map<String, Object> approvePurchaseOrder(HashMap<String, Object> order) {
        return processRequest(order, DBBean.PURCHASE_ORDER, APPROVED);
    }

    public Map<String, Object> rejectPurchaseOrder(HashMap<String, Object> order) {
        return processRequest(order, DBBean.PURCHASE_ORDER, PurchaseRequestOrder.STATUS_REJECTED);
    }

    public Map<String, Object> listBackRequestForSelect() {
        Map<String, Object> query = new HashMap<String, Object>();
//        query.put(PurchaseBack.status, PurchaseBack.status_approved);
        query.put(ApiConstants.LIMIT_KEYS, new String[] { PurchaseBack.code, PurchaseBack.salesContract_code });
        return dao.list(query, DBBean.PURCHASE_BACK);
    }
    
    
    public Map<String, Object> listPurchaseRequests(){
        Map<String, Object> results = dao.list(null, DBBean.PURCHASE_REQUEST);
        List<Map<String, Object>> list = (List<Map<String, Object>>) results.get(ApiConstants.RESULTS_DATA);
        
        for(Map<String, Object> data: list){
            Map<String, Object> query = new HashMap<String, Object>();
            query.put(SalesContractBean.SC_ID, data.get("salesContractCode"));
            
            
            Map<String, Object> relatedProjectInfo = getRelatedProjectInfo(query);
            data.put("customerName", relatedProjectInfo.get(ProjectBean.PROJECT_CUSTOMER));
            data.put("projectName", relatedProjectInfo.get("projectName"));
            data.put("projectManager", relatedProjectInfo.get("projectManager"));
        }
        
        return results;
    }
    
    
    public Map<String, Object> getRelatedProjectInfo(Map<String, Object> params){
        String scId = (String) params.get(SalesContractBean.SC_ID);
        Map<String, Object> querySC = new HashMap<String, Object>();
        querySC.put(SalesContractBean.SC_CODE, scId);
        querySC.put(ApiConstants.LIMIT_KEYS, new String[] { SalesContractBean.SC_PROJECT_ID });
        Map<String, Object> sc = dao.findOneByQuery(querySC, DBBean.SALES_CONTRACT);

        String pId = (String) sc.get(SalesContractBean.SC_PROJECT_ID);
        Map<String, Object> project = dao.findOne(ApiConstants.MONGO_ID, pId, DBBean.PROJECT);

        Map<String, Object> pmQuery = new HashMap<String, Object>();
        pmQuery.put(ApiConstants.LIMIT_KEYS, new String[] { UserBean.USER_NAME });
        pmQuery.put(ApiConstants.MONGO_ID, project.get(ProjectBean.PROJECT_MANAGER));

        Map<String, Object> pmData = dao.findOneByQuery(pmQuery, DBBean.USER);
        project.put(ProjectBean.PROJECT_MANAGER, pmData.get(UserBean.USER_NAME));

        
        String cId = (String) project.get(ProjectBean.PROJECT_CUSTOMER);
        
        Map<String, Object> customerQuery = new HashMap<String, Object>();
        customerQuery.put(ApiConstants.LIMIT_KEYS, new String[] {CustomerBean.NAME});
        customerQuery.put(ApiConstants.MONGO_ID, cId);
        Map<String, Object> customerData = dao.findOneByQuery(customerQuery, DBBean.CUSTOMER);
        
        project.put(ProjectBean.PROJECT_CUSTOMER, customerData.get(CustomerBean.NAME));
        
        return project;
    }
    
    public Map<String, Object> listApprovedPurchaseRequestForSelect(){
        Map<String, Object> query = new HashMap<String, Object>();
        query.put(PurchaseBack.status, APPROVED);
        query.put(ApiConstants.LIMIT_KEYS, new String[] { "purchaseRequestCode" });
        return dao.list(query, DBBean.PURCHASE_REQUEST);
    }
    
    public Map<String, Object> updatePurchaseRequest(Map<String, Object> order) {
        return updatePurchase(order, DBBean.PURCHASE_REQUEST, "request_");
    }
    
    public Map<String, Object> updatePurchase(Map<String, Object> parameters, String db, String prefix) {

        PurchaseRequestOrder request = (PurchaseRequestOrder) new PurchaseRequestOrder().toEntity(parameters);

        if (ApiUtil.isEmpty(parameters.get(ApiConstants.MONGO_ID))) {
            
            if(request.getStatus() !=null){
                request.setStatus(PurchaseRequestOrder.STATUS_DRAFT);
            }

            if (db == DBBean.PURCHASE_REQUEST) {
                request.setPurchaseRequestCode(prefix + String.valueOf(new Date().getTime()));
            }

            if (db == DBBean.PURCHASE_ORDER) {
                request.setPurchaseOrderCode(prefix + String.valueOf(new Date().getTime()));
            }

            if (db == DBBean.PURCHASE_CONTRACT) {
                request.setPurchaseContractCode(prefix + String.valueOf(new Date().getTime()));
            }

            Map<String, Object> map = request.toMap();
            map.put(SalesContractBean.SC_EQ_LIST, parameters.get(SalesContractBean.SC_EQ_LIST));

            return this.dao.add(map, db);
        } else {

            Map<String, Object> map = request.toMap();
            map.put(SalesContractBean.SC_EQ_LIST, parameters.get(SalesContractBean.SC_EQ_LIST));
            return dao.updateById(map, db);
        }

    }


    public Map<String, Object> approvePurchaseRequest(HashMap<String, Object> order){
        return processRequest(order, DBBean.PURCHASE_REQUEST, APPROVED);
    }
    
    public Map<String, Object> rejectPurchaseRequest(HashMap<String, Object> order){
        return processRequest(order, DBBean.PURCHASE_REQUEST, PurchaseRequestOrder.STATUS_REJECTED);
    }
    
    public Map<String, Object> getPurchaseRequest(HashMap<String, Object> parameters){
        return this.dao.findOne(ApiConstants.MONGO_ID, parameters.get(ApiConstants.MONGO_ID), DBBean.PURCHASE_REQUEST);
    }

    
    public void deletePurchaseRequest(Map<String, Object> order){
        
    }
       
    
    public Map<String, Object> getBackRequestForSelect(HashMap<String, Object> parameters){
        
       return backService.loadRequest(parameters);
    }


    
    public ISalesContractService getScs() {
        return scs;
    }


    public void setScs(ISalesContractService scs) {
        this.scs = scs;
    }


    public IBackService getBackService() {
        return backService;
    }


    public void setBackService(IBackService backService) {
        this.backService = backService;
    }
    
    
    
    
    

}
