package com.pms.service.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import com.google.gson.Gson;
import com.pms.service.dbhelper.DBQuery;
import com.pms.service.dbhelper.DBQueryOpertion;
import com.pms.service.mockbean.ApiConstants;
import com.pms.service.mockbean.CustomerBean;
import com.pms.service.mockbean.DBBean;
import com.pms.service.mockbean.ProjectBean;
import com.pms.service.mockbean.SalesContractBean;
import com.pms.service.mockbean.UserBean;
import com.pms.service.service.AbstractService;
import com.pms.service.service.ISalesContractService;

public class SalesContractServiceImpl extends AbstractService implements ISalesContractService {

	@Override
	public String geValidatorFileName() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Map<String, Object> listSC(Map<String, Object> params) {
		Map<String, Object> queryMap = new HashMap<String, Object>();
		String[] limitKeys = {SalesContractBean.SC_CODE, SalesContractBean.SC_CUSTOMER, 
				SalesContractBean.SC_AMOUNT, SalesContractBean.SC_DATE, SalesContractBean.SC_PROJECT_ID};
		queryMap.put(ApiConstants.LIMIT_KEYS, limitKeys);
		Map<String, Object> result = dao.list(queryMap, DBBean.SALES_CONTRACT);
		
		mergeProjectInfoForSC(result);
		return result;
	}

	@Override
	public Map<String, Object> addSC(Map<String, Object> params) {
		String _id = (String) params.get(ApiConstants.MONGO_ID);
		
		//构造合同信息
		Map<String, Object> contract = new HashMap<String, Object>();
		contract.put(SalesContractBean.SC_PROJECT_ID, params.get(SalesContractBean.SC_PROJECT_ID));
		contract.put(SalesContractBean.SC_CUSTOMER, params.get(SalesContractBean.SC_CUSTOMER));
		contract.put(SalesContractBean.SC_AMOUNT, params.get(SalesContractBean.SC_AMOUNT));
		contract.put(SalesContractBean.SC_INVOICE_TYPE, params.get(SalesContractBean.SC_INVOICE_TYPE));
		contract.put(SalesContractBean.SC_ESTIMATE_EQ_COST0, params.get(SalesContractBean.SC_ESTIMATE_EQ_COST0));
		contract.put(SalesContractBean.SC_ESTIMATE_EQ_COST1, params.get(SalesContractBean.SC_ESTIMATE_EQ_COST1));
		contract.put(SalesContractBean.SC_ESTIMATE_SUB_COST, params.get(SalesContractBean.SC_ESTIMATE_SUB_COST));
		contract.put(SalesContractBean.SC_ESTIMATE_PM_COST, params.get(SalesContractBean.SC_ESTIMATE_PM_COST));
		contract.put(SalesContractBean.SC_ESTIMATE_DEEP_DESIGN_COST, params.get(SalesContractBean.SC_ESTIMATE_DEEP_DESIGN_COST));
		contract.put(SalesContractBean.SC_ESTIMATE_DEBUG_COST, params.get(SalesContractBean.SC_ESTIMATE_DEBUG_COST));
		contract.put(SalesContractBean.SC_ESTIMATE_OTHER_COST, params.get(SalesContractBean.SC_ESTIMATE_OTHER_COST));
		contract.put(SalesContractBean.SC_DEBUG_COST_TYPE, params.get(SalesContractBean.SC_DEBUG_COST_TYPE));
		contract.put(SalesContractBean.SC_TAX_TYPE, params.get(SalesContractBean.SC_TAX_TYPE));
		contract.put(SalesContractBean.SC_CODE, params.get(SalesContractBean.SC_CODE));
		contract.put(SalesContractBean.SC_PERSON, params.get(SalesContractBean.SC_PERSON));
		contract.put(SalesContractBean.SC_TYPE, params.get(SalesContractBean.SC_TYPE));
		contract.put(SalesContractBean.SC_ARCHIVE_STATUS, params.get(SalesContractBean.SC_ARCHIVE_STATUS));
		contract.put(SalesContractBean.SC_RUNNING_STATUS, params.get(SalesContractBean.SC_RUNNING_STATUS));
		contract.put(SalesContractBean.SC_DATE, params.get(SalesContractBean.SC_DATE));
		contract.put(SalesContractBean.SC_DOWN_PAYMENT, params.get(SalesContractBean.SC_DOWN_PAYMENT));
		contract.put(SalesContractBean.SC_PROGRESS_PAYMENT, params.get(SalesContractBean.SC_PROGRESS_PAYMENT));
		contract.put(SalesContractBean.SC_QUALITY_MONEY, params.get(SalesContractBean.SC_QUALITY_MONEY));
		contract.put(SalesContractBean.SC_MEMO, params.get(SalesContractBean.SC_MEMO));
		
		List<Map<String, Object>> eqcostList = new ArrayList<Map<String, Object>>();
		eqcostList = new Gson().fromJson(params.get(SalesContractBean.SC_EQ_LIST).toString(), List.class);
		contract.put(SalesContractBean.SC_EQ_LIST, eqcostList);
		if (_id == null){//Add
			contract.put(SalesContractBean.SC_MODIFY_TIMES, 0);
			return dao.add(contract, DBBean.SALES_CONTRACT);
		}else{//Update
			
		}
		return null;
	}

	@Override
	public Map<String, Object> listSCsForSelect(Map<String, Object> params) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Map<String, Object> listEquipmentsForSC(Map<String, Object> params) {
		// TODO Auto-generated method stub
		return null;
	}

	private void mergeProjectInfoForSC(Map<String, Object> result){
		List<Map<String, Object>> list = (List<Map<String, Object>>) result.get(ApiConstants.RESULTS_DATA);
		
		List<String> pIdList = new ArrayList<String>();
		List<String> pmIds = new ArrayList<String>();
		List<String> custIds = new ArrayList<String>();
		for (Map<String, Object> sc:list){
			pIdList.add((String)sc.get(SalesContractBean.SC_PROJECT_ID));
		}
		
		Map<String, Object> queryProject = new HashMap<String, Object>();
		queryProject.put(ApiConstants.MONGO_ID, new DBQuery(DBQueryOpertion.IN, pIdList));
		queryProject.put(ApiConstants.LIMIT_KEYS, new String[] {ProjectBean.PROJECT_NAME, 
				ProjectBean.PROJECT_MANAGER, ProjectBean.PROJECT_CODE, ProjectBean.PROJECT_CUSTOMER});
		Map<String, Object> pInfoMap = dao.listToOneMapAndIdAsKey(queryProject, DBBean.PROJECT);
		
		pInfoMap.remove(ApiConstants.RESULTS_DATA);
		pInfoMap.remove(ApiConstants.PAGENATION);
		for (Entry<String, Object> pro : pInfoMap.entrySet()){
			Map<String, Object> value = (Map<String, Object>) pro.getValue(); 
			pmIds.add((String) value.get(ProjectBean.PROJECT_MANAGER));
			custIds.add((String) value.get(ProjectBean.PROJECT_CUSTOMER));
		}
		
		Map<String, Object> pmQuery = new HashMap<String, Object>();
		pmQuery.put(ApiConstants.LIMIT_KEYS, new String[] {UserBean.USER_NAME});
		pmQuery.put(ApiConstants.MONGO_ID, new DBQuery(DBQueryOpertion.IN, pmIds));
		Map<String, Object> pmData = dao.listToOneMapAndIdAsKey(pmQuery, DBBean.USER);
		
		Map<String, Object> customerQuery = new HashMap<String, Object>();
		customerQuery.put(ApiConstants.LIMIT_KEYS, new String[] {CustomerBean.NAME});
		customerQuery.put(ApiConstants.MONGO_ID, new DBQuery(DBQueryOpertion.IN, custIds));
		Map<String, Object> customerData = dao.listToOneMapAndIdAsKey(customerQuery, DBBean.CUSTOMER);
		
		for (Map<String, Object> sc:list){
			String pId = (String) sc.get(SalesContractBean.SC_PROJECT_ID);
			Map<String, Object> pro = (Map<String, Object>) pInfoMap.get(pId);
			String pmId = (String) pro.get(ProjectBean.PROJECT_MANAGER);
			String cusId =(String) pro.get(ProjectBean.PROJECT_CUSTOMER); 
			
			sc.put(ProjectBean.PROJECT_CODE, pro.get(ProjectBean.PROJECT_CODE));
			sc.put(ProjectBean.PROJECT_NAME, pro.get(ProjectBean.PROJECT_NAME));
			
			Map<String, Object> pmInfo = (Map<String, Object>) pmData.get(pmId);
			sc.put(ProjectBean.PROJECT_MANAGER, pmInfo.get(UserBean.USER_NAME));
			
			Map<String, Object> cusInfo = (Map<String, Object>) customerData.get(cusId);
			sc.put(ProjectBean.PROJECT_CUSTOMER, cusInfo.get(CustomerBean.NAME));
		}
	}
}
