package com.pms.service.service.impl;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.ejb.EnterpriseBean;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.google.gson.Gson;
import com.pms.service.mockbean.ApiConstants;
import com.pms.service.mockbean.CustomerBean;
import com.pms.service.mockbean.DBBean;
import com.pms.service.mockbean.EqCostListBean;
import com.pms.service.mockbean.ProjectBean;
import com.pms.service.mockbean.SalesContractBean;
import com.pms.service.mockbean.PurchaseBack;
import com.pms.service.service.AbstractService;
import com.pms.service.service.IBackService;
import com.pms.service.util.ApiUtil;

public class BackServiceImpl extends AbstractService implements IBackService {

    private static final Logger logger = LogManager.getLogger(BackServiceImpl.class);
    
	@Override
	public String geValidatorFileName() {
		return "back";
	}

	@Override
	public Map<String,Object> create(Map<String, Object> params) {
		Map<String,Object> newObj = new HashMap<String,Object>();
		newObj.put(PurchaseBack.department, params.get(PurchaseBack.department));
		newObj.put(PurchaseBack.type, params.get(PurchaseBack.type));
		newObj.put(PurchaseBack.comment, params.get(PurchaseBack.comment));
		newObj.put(PurchaseBack.planDate, params.get(PurchaseBack.planDate));
		newObj.put(PurchaseBack.salesContract_id, params.get(PurchaseBack.salesContract_id));
		newObj.put(PurchaseBack.status, PurchaseBack.status_submited);
		newObj.put(PurchaseBack.submitDate, new Date());
		
		newObj.putAll(countEqcostList(params.get(PurchaseBack.eqcostList)));
		return dao.add(newObj, DBBean.PURCHASE_BACK);
	}

	//验证并记录申请货物清单列表，计算申请总额
	public Map<String,Object> countEqcostList(Object eqList) {
		Map<String,Object> result = new HashMap<String,Object>();
		List<Map<String,Object>> newList = new ArrayList<Map<String,Object>>();
		Double totalMoney = 0.00;
		List list = new Gson().fromJson(eqList.toString(), List.class);
		for(Object obj : list){
			Map<String,Object> map = (Map<String,Object>)obj;
			Map<String,Object> newMap = new HashMap<String,Object>();
			Double applyCount = ApiUtil.getDouble(map, PurchaseBack.eqcost_applyAmount,0);
			Double price = ApiUtil.getDouble(map, SalesContractBean.SC_EQ_LIST_BASE_PRICE,0);
			
			newMap.put(ApiConstants.MONGO_ID, map.get(ApiConstants.MONGO_ID));
			newMap.put(SalesContractBean.SC_EQ_LIST_NO, map.get(SalesContractBean.SC_EQ_LIST_NO));
			newMap.put(PurchaseBack.eqcost_applyAmount, applyCount);
			newList.add(newMap);
			
			totalMoney += applyCount*price;
		}
		result.put(PurchaseBack.eqcostList, newList);
		result.put(PurchaseBack.money, totalMoney);
		return result;
	}
	
	@Override
	public Map<String,Object> update(Map<String, Object> params) {
		return dao.updateById(params, DBBean.PURCHASE_BACK);
	}
	
	@Override
	public void destroy(Map<String, Object> params) {
		List<String> ids = new ArrayList<String>();
		ids.add(String.valueOf(params.get(ApiConstants.MONGO_ID)));
		dao.deleteByIds(ids, DBBean.PURCHASE_BACK);
	}

	@Override
	public Map<String, Object> list(Map<String, Object> params) {
		Map<String,Object> map = dao.list(params, DBBean.PURCHASE_BACK);
		List<Map<String,Object>> list = (List<Map<String,Object>>)map.get(ApiConstants.RESULTS_DATA);
		for(Map<String,Object> re : list){
			mergeSalesContract(re);
		}
		return map;
	}

	private Map<String,Object> mergeSalesContract(Map<String,Object> params){
		if(params == null) return null;
		String[] sckeys = new String[]{SalesContractBean.SC_CODE,SalesContractBean.SC_AMOUNT, SalesContractBean.SC_PROJECT_ID,
				SalesContractBean.SC_CUSTOMER_ID};
		
		String[] prkeys = new String[]{ ProjectBean.PROJECT_CODE, ProjectBean.PROJECT_NAME};
		String[] cuKey = new String[]{CustomerBean.CODE, CustomerBean.NAME};
		String scid = (String) params.get(PurchaseBack.salesContract_id);
		
		Map<String, Object> sc = dao.findOne(ApiConstants.MONGO_ID, scid, sckeys, DBBean.SALES_CONTRACT);
		if(sc != null){
			params.put(PurchaseBack.salesContract_id, scid);
			params.put(PurchaseBack.salesContract_code, sc.get(SalesContractBean.SC_CODE));
			params.put(PurchaseBack.salesContract_money, sc.get(SalesContractBean.SC_AMOUNT));
			
			Map<String,Object> project = dao.findOne(ApiConstants.MONGO_ID, sc.get(SalesContractBean.SC_PROJECT_ID), prkeys, DBBean.PROJECT);
			Map<String,Object> customer = dao.findOne(ApiConstants.MONGO_ID, sc.get(SalesContractBean.SC_CUSTOMER_ID), cuKey, DBBean.CUSTOMER);

			Map<String, Object> query = new HashMap<String, Object>();
			query.put(EqCostListBean.EQ_LIST_SC_ID, scid);
			Map<String, Object> eqMap = dao.list(query, DBBean.EQ_COST);
			List<Map<String,Object>> eqList = (List<Map<String,Object>>)eqMap.get(ApiConstants.RESULTS_DATA);
			
			if(customer != null){
				params.put(PurchaseBack.customer_code, customer.get(CustomerBean.CODE));
				params.put(PurchaseBack.customer_name, customer.get(CustomerBean.NAME));
			}
			if(project != null){
				params.put(PurchaseBack.project_code, project.get(ProjectBean.PROJECT_CODE));
				params.put(PurchaseBack.project_name, project.get(ProjectBean.PROJECT_NAME));
				params.put(PurchaseBack.project_managerName, project.get(ProjectBean.PROJECT_MANAGER));
			}
			//TOTO: delete?			
			params.put(PurchaseBack.eqcostList, eqList);
		
		}
		return params;
	}
	
	@Override
	public Map<String, Object> loadRequest(Map<String, Object> params) {
		Map<String,Object> request = dao.findOne(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID), DBBean.PURCHASE_BACK);
		mergeSalesContract(request);
		return request;
		
	}

	@Override
	public Map<String, Object> prepareRequest(Map<String, Object> params) {
		Map<String,Object> request = new LinkedHashMap<String,Object>();
		request.put(PurchaseBack.status, PurchaseBack.status_new );
		request.put(PurchaseBack.salesContract_id, params.get(PurchaseBack.salesContract_id));
		mergeSalesContract(request);
		return request;
	}

	@Override
	public Map<String, Object> approveRequest(Map<String, Object> params) {
		Map<String,Object> obj = new HashMap<String,Object>();
		obj.put(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID));
		//TOTO:
		obj.put(PurchaseBack.code, "T"+(int)(Math.random()*10000));
		obj.put(PurchaseBack.status, PurchaseBack.status_approved);
		obj.put(PurchaseBack.approveDate, new Date());
		return dao.updateById(obj, DBBean.PURCHASE_BACK);
	}

	@Override
	public Map<String, Object> rejectRequest(Map<String, Object> params) {
		Map<String,Object> obj = new HashMap<String,Object>();
		obj.put(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID));
		obj.put(PurchaseBack.status, PurchaseBack.status_rejected);
		return dao.updateById(obj, DBBean.PURCHASE_BACK);
	}

	@Override
	public Map<String, Object> submitRequest(Map<String, Object> params) {
		Map<String,Object> obj = new HashMap<String,Object>();
		obj.put(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID));
		obj.put(PurchaseBack.status, PurchaseBack.status_submited);
		return dao.updateById(obj, DBBean.PURCHASE_BACK);
	}
	
	public Map<String, Object> saveRequest(Map<String, Object> params) {
		Map<String,Object> obj = new HashMap<String,Object>();
		obj.put(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID));
		obj.put(PurchaseBack.status, PurchaseBack.status_saved);
		return dao.updateById(obj, DBBean.PURCHASE_BACK);
	}	
}
