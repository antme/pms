package com.pms.service.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.google.gson.Gson;
import com.pms.service.dbhelper.DBQuery;
import com.pms.service.dbhelper.DBQueryOpertion;
import com.pms.service.mockbean.ApiConstants;
import com.pms.service.mockbean.DBBean;
import com.pms.service.mockbean.ProjectBean;
import com.pms.service.mockbean.SalesContractBean;
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
		contract.put(SalesContractBean.SC_CUSTOMER_NAME, params.get(SalesContractBean.SC_CUSTOMER_NAME));
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
		for (Map<String, Object> sc:list){
			pIdList.add((String)sc.get(SalesContractBean.SC_PROJECT_ID));
		}
		
		Map<String, Object> queryProject = new HashMap<String, Object>();
		queryProject.put(ApiConstants.MONGO_ID, new DBQuery(DBQueryOpertion.IN, pIdList));
		queryProject.put(ApiConstants.LIMIT_KEYS, new String[] {ProjectBean.PROJECT_NAME, 
				ProjectBean.PROJECT_MANAGER, ProjectBean.PROJECT_CODE});
		Map<String, Object> pInfoMap = dao.listToOneMapAndIdAsKey(queryProject, DBBean.PROJECT_CONTRACT);
		
		for (Map<String, Object> sc:list){
			String pId = (String) sc.get(SalesContractBean.SC_PROJECT_ID);
			Map<String, Object> pro = (Map<String, Object>) pInfoMap.get(pId);
			pro.remove(ApiConstants.MONGO_ID);
			sc.putAll(pro);
		}
	}
}
