package com.pms.service.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.ejb.EnterpriseBean;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import com.pms.service.mockbean.ApiConstants;
import com.pms.service.mockbean.CustomerBean;
import com.pms.service.mockbean.DBBean;
import com.pms.service.mockbean.ProjectBean;
import com.pms.service.mockbean.SalesContractBean;
import com.pms.service.mockbean.PurchaseRequestBean;
import com.pms.service.service.AbstractService;
import com.pms.service.service.IPurchaseService;
import com.pms.service.util.ApiUtil;

public class PurchaseServiceImpl extends AbstractService implements IPurchaseService {

    private static final Logger logger = LogManager.getLogger(PurchaseServiceImpl.class);
    
	@Override
	public String geValidatorFileName() {
		return "procure";
	}

	@Override
	public Map<String,Object> create(Map<String, Object> params) {
		params.put(PurchaseRequestBean.COST, 987);
		params.put(PurchaseRequestBean.COST_USED_GOODS, 123);
		params.put(PurchaseRequestBean.COUNT_USED_REQUET, 1);
		params.put(PurchaseRequestBean.PERCENT_USED_GOODS,11);
		params.put(PurchaseRequestBean.STATUS, PurchaseRequestBean.STATUS_SUBMIT);
		return dao.add(params, DBBean.PURCHASE_REQUEST);
	}

	@Override
	public Map<String,Object> update(Map<String, Object> params) {
		return dao.updateById(params, DBBean.PURCHASE_REQUEST);
	}
	
	@Override
	public void destroy(Map<String, Object> params) {
		List<String> ids = new ArrayList<String>();
		ids.add(String.valueOf(params.get(ApiConstants.MONGO_ID)));
		dao.deleteByIds(ids, DBBean.PURCHASE_REQUEST);
	}

	@Override
	public Map<String, Object> list(Map<String, Object> params) {
		return dao.list(params, DBBean.PURCHASE_REQUEST);
	}

	@Override
	public Map<String, Object> loadRequest(Map<String, Object> params) {
		if(params.get(ApiConstants.MONGO_ID) != null){
			return dao.findOne(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID), DBBean.PURCHASE_REQUEST);
		}
		return prepareRequest(params);
	}

	@Override
	public Map<String, Object> prepareRequest(Map<String, Object> params) {
		Map<String,Object> request = new LinkedHashMap<String,Object>();
		
		//sales contract
		String salesId = (String) params.get(PurchaseRequestBean.salesContract_id);
		//TODO: salesContract must exist and status must be approved
		Map<String, Object> salesContract = dao.loadById(salesId, DBBean.SALES_CONTRACT);
		if(salesContract != null){
			request.put(PurchaseRequestBean.salesContract_money, salesContract.get(SalesContractBean.SC_AMOUNT));
			request.put(PurchaseRequestBean.salesContract_code, salesContract.get(SalesContractBean.SC_CODE));
			request.put(PurchaseRequestBean.eqcostList, salesContract.get(SalesContractBean.SC_EQ_LIST));
			//project
			String project_id = (String) salesContract.get(SalesContractBean.SC_PROJECT_ID);
			Map<String,Object> project = dao.loadById(project_id, DBBean.PROJECT);
			if(project != null){
				request.put(PurchaseRequestBean.project_code, project.get(ProjectBean.PROJECT_CODE));
				request.put(PurchaseRequestBean.project_name, project.get(ProjectBean.PROJECT_NAME));
				request.put(PurchaseRequestBean.project_managerName, project.get(ProjectBean.PROJECT_MANAGER));
				request.put(PurchaseRequestBean.customer_name, project.get(ProjectBean.PROJECT_CUSTOMER));
			}
			
			//customer
			String customer_id = (String) salesContract.get(SalesContractBean.SC_CUSTOMER_ID);
			Map<String,Object> customer = dao.loadById(customer_id, DBBean.CUSTOMER);
			if(customer != null){
				request.put(PurchaseRequestBean.customer_name, customer.get(CustomerBean.NAME));
			}
			
			
			//get the used count of every good in one contract
			Map<Integer,Integer> countMap = getEqconstApplyCount((String)salesContract.get(SalesContractBean.SC_CODE));
			List<Map<String,Object>> eqList = (List<Map<String,Object>>) request.get(PurchaseRequestBean.eqcostList);
			
			for(Map<String,Object> eq : eqList){
				int num = ApiUtil.getInteger(eq, SalesContractBean.SC_EQ_LIST_NO, 0);
				int total = ApiUtil.getInteger(eq, SalesContractBean.SC_EQ_LIST_AMOUNT, 0);
				int hasApply =   countMap.containsKey(num) ? countMap.get(num) : 0;
				eq.put(PurchaseRequestBean.eqcost_hasApplyAmount, hasApply);
				eq.put(PurchaseRequestBean.eqcost_leftAmount, total-hasApply);
			}				
		}
		return request;
	}
	//合同下每样货物的已申请数量
	private Map<Integer,Integer> getEqconstApplyCount(String salesContract_code){
		Map<Integer,Integer> usedCountMap = new HashMap<Integer,Integer>();
		Map<String,Object> query = new HashMap<String,Object>();
		query.put(PurchaseRequestBean.salesContract_code, salesContract_code);
		query.put(ApiConstants.LIMIT_KEYS, new String[]{PurchaseRequestBean.eqcostList});
		List<Object> list = dao.listLimitKeyValues(query, DBBean.PURCHASE_REQUEST);
		List<Map<Integer,Integer>> eqList = null;
		int num = 0;
		int count = 0;
		for(Object obj : list){
			eqList = (List<Map<Integer,Integer>>) obj;
			for(Map<Integer,Integer> eq : eqList){
				num = eq.get(SalesContractBean.SC_EQ_LIST_NO) == null ? 0 : eq.get(SalesContractBean.SC_EQ_LIST_NO);
				count = eq.get(PurchaseRequestBean.eqcost_applyAmount) == null ? 0 : eq.get(PurchaseRequestBean.eqcost_applyAmount);
				if(usedCountMap.containsKey(num)){
					count += usedCountMap.get(num);
				}
				usedCountMap.put(num, count);
			}
		}
		return usedCountMap;
	}

	@Override
	public Map<String, Object> approveRequest(Map<String, Object> params) {
		Map<String,Object> obj = new HashMap<String,Object>();
		obj.put(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID));
		obj.put(PurchaseRequestBean.STATUS, PurchaseRequestBean.STATUS_APPROVED);
		obj.put(PurchaseRequestBean.APPROVED_DATE, new Date());
		return dao.updateById(obj, DBBean.PURCHASE_REQUEST);
	}

	@Override
	public Map<String, Object> rejectRequest(Map<String, Object> params) {
		Map<String,Object> obj = new HashMap<String,Object>();
		obj.put(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID));
		obj.put(PurchaseRequestBean.STATUS, PurchaseRequestBean.STATUS_REJECT);
		return dao.updateById(obj, DBBean.PURCHASE_REQUEST);
	}

	@Override
	public Map<String, Object> submitRequest(Map<String, Object> params) {
		Map<String,Object> obj = new HashMap<String,Object>();
		obj.put(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID));
		obj.put(PurchaseRequestBean.STATUS, PurchaseRequestBean.STATUS_SUBMIT);
		return dao.updateById(obj, DBBean.PURCHASE_REQUEST);
	}
	
	public Map<String, Object> saveRequest(Map<String, Object> params) {
		Map<String,Object> obj = new HashMap<String,Object>();
		obj.put(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID));
		obj.put(PurchaseRequestBean.STATUS, PurchaseRequestBean.STATUS_SAVED);
		return dao.updateById(obj, DBBean.PURCHASE_REQUEST);
	}	
}
