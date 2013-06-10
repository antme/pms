package com.pms.service.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


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
import com.pms.service.service.IProjectService;
import com.pms.service.util.ApiUtil;

public class ProjectServiceImpl extends AbstractService implements IProjectService {

	@Override
	public String geValidatorFileName() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Map<String, Object> listProjects(Map<String, Object> params) {
		// Get parameters from the input params
		int limit = ApiUtil.getInteger(params, "pageSize", 10);
		int limitStart = ApiUtil.getInteger(params, "skip", 0);
		Map<String, Object> queryMap = new HashMap<String, Object>();
		String[] limitKeys = new String[] {ProjectBean.PROJECT_CODE, ProjectBean.PROJECT_NAME, ProjectBean.PROJECT_CUSTOMER,
				ProjectBean.PROJECT_MANAGER, ProjectBean.PROJECT_TYPE, ProjectBean.PROJECT_STATUS, ProjectBean.PROJECT_ABBR};
//		queryMap.put(ApiConstants.LIMIT, limit);
//		queryMap.put(ApiConstants.LIMIT_START, limitStart);
		queryMap.put(ApiConstants.LIMIT_KEYS, limitKeys);
		Map<String, Object> result = this.dao.list(queryMap, DBBean.PROJECT);
		
		mergePMandCustomerInfo(result);
		return result;
	}

	@Override
	public Map<String, Object> addProject(Map<String, Object> params) {
		String _id = (String) params.get(ApiConstants.MONGO_ID);
		
		Map<String, Object> projectBean = new HashMap<String, Object>();
		projectBean.put(ProjectBean.PROJECT_CODE, params.get(ProjectBean.PROJECT_CODE));
		projectBean.put(ProjectBean.PROJECT_NAME, params.get(ProjectBean.PROJECT_NAME));
		projectBean.put(ProjectBean.PROJECT_MANAGER, params.get(ProjectBean.PROJECT_MANAGER));
		projectBean.put(ProjectBean.PROJECT_STATUS, params.get(ProjectBean.PROJECT_STATUS));
		projectBean.put(ProjectBean.PROJECT_TYPE, params.get(ProjectBean.PROJECT_TYPE));
		projectBean.put(ProjectBean.PROJECT_ADDRESS, params.get(ProjectBean.PROJECT_ADDRESS));
		projectBean.put(ProjectBean.PROJECT_MEMO, params.get(ProjectBean.PROJECT_MEMO));
		projectBean.put(ProjectBean.PROJECT_CUSTOMER, params.get(ProjectBean.PROJECT_CUSTOMER));
		projectBean.put(ProjectBean.PROJECT_ABBR, params.get(ProjectBean.PROJECT_ABBR));
		
		//初始化项目列表的4个金额字段
		//FIXME
		/*projectBean.put(ProjectBean.PROJECT_TOTAL_AMOUNT, 0);
		projectBean.put(ProjectBean.PROJECT_INVOICE_AMOUNT, 0);
		projectBean.put(ProjectBean.PROJECT_GET_AMOUNT, 0);
		projectBean.put(ProjectBean.PROJECT_PURCHASE_AMOUNT, 0);*/
		
		if (_id == null){//Add
			return dao.add(projectBean, DBBean.PROJECT);
		}else{//Update
			projectBean.put(ApiConstants.MONGO_ID, _id);
			return dao.updateById(projectBean, DBBean.PROJECT);
		}
	}

	@Override
	public void deleteProject(Map<String, Object> params) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public Map<String, Object> updateProject(Map<String, Object> params) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Map<String, Object> listProjectsForSelect(Map<String, Object> params) {
		// TODO Add logic to filter the projects which in progresss
		String[] limitKeys = {ProjectBean.PROJECT_NAME,ProjectBean.PROJECT_CODE};
		Map<String, Object> query = new HashMap<String, Object>();
		query.put(ApiConstants.LIMIT_KEYS, limitKeys);
		Map<String, Object> result = dao.list(query, DBBean.PROJECT);
		
		return result;
	}

	@Override
	public Map<String, Object> listEquipmentsForProject(Map<String, Object> params) {
		return null;
	}

	@Override
	public Map<String, Object> getProjectById(String id) {
		return dao.findOne(ApiConstants.MONGO_ID, id, DBBean.PROJECT);
	}

	@Override
	public Map<String, Object> setupProject(Map<String, Object> params) {
		String _id = (String) params.get(ApiConstants.MONGO_ID);
		Map<String, Object> pro = dao.findOne(ApiConstants.MONGO_ID, _id, DBBean.PROJECT);
		pro.put(ProjectBean.PROJECT_STATUS, ProjectBean.PROJECT_STATUS_OFFICIAL);
		return dao.updateById(pro, DBBean.PROJECT);
	}
	
	public void mergePMandCustomerInfo(Map<String, Object> result){
		List<Map<String, Object>> resultListData = (List<Map<String, Object>>) result.get(ApiConstants.RESULTS_DATA);
		
		List<String> pmIds = new ArrayList<String>();
		List<String> customerIds = new ArrayList<String>();
		
		for (Map<String, Object> pro : resultListData){
			String pPM = (String) pro.get(ProjectBean.PROJECT_MANAGER);
			if (pPM != null && pPM.length() > 0){
				pmIds.add(pPM);
			}
			String pC = (String) pro.get(ProjectBean.PROJECT_CUSTOMER);
			if (pC != null && pC.length() > 0){
				customerIds.add(pC);
			}
			
		}
		
		Map<String, Object> pmQuery = new HashMap<String, Object>();
		pmQuery.put(ApiConstants.LIMIT_KEYS, new String[] {UserBean.USER_NAME});
		pmQuery.put(ApiConstants.MONGO_ID, new DBQuery(DBQueryOpertion.IN, pmIds));
		Map<String, Object> pmData = dao.listToOneMapAndIdAsKey(pmQuery, DBBean.USER);
		
		Map<String, Object> customerQuery = new HashMap<String, Object>();
		customerQuery.put(ApiConstants.LIMIT_KEYS, new String[] {CustomerBean.NAME});
		customerQuery.put(ApiConstants.MONGO_ID, new DBQuery(DBQueryOpertion.IN, customerIds));
		Map<String, Object> customerData = dao.listToOneMapAndIdAsKey(customerQuery, DBBean.CUSTOMER);
		
		for (Map<String, Object> pro : resultListData){
			String pmId = (String) pro.get(ProjectBean.PROJECT_MANAGER);
			Map<String, Object> pmInfo = (Map<String, Object>) pmData.get(pmId);
			if (pmInfo != null){
				pro.put(ProjectBean.PROJECT_MANAGER, pmInfo.get(UserBean.USER_NAME));
			}
			

			String cId = (String) pro.get(ProjectBean.PROJECT_CUSTOMER);
			Map<String, Object> cInfo = (Map<String, Object>) customerData.get(cId);
			if (cInfo != null){
				pro.put(ProjectBean.PROJECT_CUSTOMER, cInfo.get(CustomerBean.NAME));
			}
			
		}
	}

	@Override
	public String getCustomerIdByProId(String pId) {
		Map<String, Object> query = new HashMap<String, Object>();
		query.put(ApiConstants.MONGO_ID, pId);
		query.put(ApiConstants.LIMIT_KEYS, new String[] {ProjectBean.PROJECT_CUSTOMER});
		Map<String, Object> p = dao.findOneByQuery(query, DBBean.PROJECT);
		return (String)p.get(ProjectBean.PROJECT_CUSTOMER);
	}

	@Override
	public String getCustomerNameByProId(String pId) {
		Map<String, Object> query = new HashMap<String, Object>();
		query.put(ApiConstants.MONGO_ID, pId);
		query.put(ApiConstants.LIMIT_KEYS, new String[] {ProjectBean.PROJECT_CUSTOMER});
		Map<String, Object> p = dao.findOneByQuery(query, DBBean.PROJECT);
		String cId = (String)p.get(ProjectBean.PROJECT_CUSTOMER);
		
		Map<String, Object> cQuery = new HashMap<String, Object>();
		cQuery.put(ApiConstants.MONGO_ID, cId);
		cQuery.put(ApiConstants.LIMIT_KEYS, new String[] {CustomerBean.NAME});
		Map<String, Object> customer = dao.findOneByQuery(cQuery, DBBean.CUSTOMER);
		return (String) customer.get(CustomerBean.NAME);
	}

}
