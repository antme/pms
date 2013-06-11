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
import com.pms.service.mockbean.EqCostListBean;
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
		String[] limitKeys = {SalesContractBean.SC_CODE, SalesContractBean.SC_AMOUNT, 
				SalesContractBean.SC_DATE, SalesContractBean.SC_PROJECT_ID};
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
//		contract.put(SalesContractBean.SC_CUSTOMER, params.get(SalesContractBean.SC_CUSTOMER));
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
		//contract.put(SalesContractBean.SC_EQ_LIST, eqcostList);
		
		Map<String, Object> addedContract = null;
		if (_id == null){//Add
			contract.put(SalesContractBean.SC_MODIFY_TIMES, 0);
			addedContract = dao.add(contract, DBBean.SALES_CONTRACT);
			
			//添加成本设备清单记录
			if (!eqcostList.isEmpty()){
				addEqCostListForContract(eqcostList, (String)addedContract.get(ApiConstants.MONGO_ID));
			}
			
			return addedContract;
		}else{//Update
			
		}
		return null;
	}
	
	private void addEqCostListForContract(List<Map<String, Object>> eqcostList, String cId){
		for (Map<String, Object> item : eqcostList){
			item.put(EqCostListBean.EQ_LIST_SC_ID, cId);
			dao.add(item, DBBean.EQ_COST);
		}
	}

	@Override
	public Map<String, Object> listSCsForSelect(Map<String, Object> params) {
		Map<String,Object> query = new HashMap<String,Object>();
		query.put(ApiConstants.LIMIT_KEYS, new String[]{SalesContractBean.SC_CODE});
		return dao.list(query, DBBean.SALES_CONTRACT);
	}

	@Override
	public Map<String, Object> listEqListBySC(Map<String, Object> params) {
		// TODO Auto-generated method stub
		String cId = (String) params.get(EqCostListBean.EQ_LIST_SC_ID);
		Map<String, Object> query = new HashMap<String, Object>();
		query.put(EqCostListBean.EQ_LIST_SC_ID, cId);
		Map<String, Object> result = dao.list(query, DBBean.EQ_COST);
		return result;
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

	@Override
	public Map<String, Object> getSC(Map<String, Object> params) {
		String _id = (String) params.get(ApiConstants.MONGO_ID);
		Map<String, Object> sc = dao.findOne(ApiConstants.MONGO_ID, _id, DBBean.SALES_CONTRACT);
		
		Map<String, Object> eqCostQuery = new HashMap<String, Object>();
		eqCostQuery.put(EqCostListBean.EQ_LIST_SC_ID, _id);
		Map<String, Object> eqList = dao.list(eqCostQuery, DBBean.EQ_COST);
		List<Map<String, Object>> eqListData = (List<Map<String, Object>>) eqList.get(ApiConstants.RESULTS_DATA);
		
		sc.put(SalesContractBean.SC_EQ_LIST, eqListData);
		return sc;
	}
}
