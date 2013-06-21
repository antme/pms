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
import com.pms.service.service.ICustomerService;
import com.pms.service.service.IProjectService;
import com.pms.service.service.ISalesContractService;
import com.pms.service.service.IUserService;
import com.pms.service.util.ApiUtil;
import com.pms.service.util.ExcleUtil;

public class ProjectServiceImpl extends AbstractService implements IProjectService {
	
	private IUserService userService;
	
	private ICustomerService customerService;
	
	private ISalesContractService salesContractService;

	@Override
	public String geValidatorFileName() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Map<String, Object> listProjects(Map<String, Object> params) {

		String[] limitKeys = new String[] {ProjectBean.PROJECT_CODE, ProjectBean.PROJECT_NAME, ProjectBean.PROJECT_CUSTOMER,
				ProjectBean.PROJECT_MANAGER, ProjectBean.PROJECT_TYPE, ProjectBean.PROJECT_STATUS, ProjectBean.PROJECT_ABBR};
		params.put(ApiConstants.LIMIT_KEYS, limitKeys);

		Map<String, Object> result = this.dao.list(params, DBBean.PROJECT);
		
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
		String[] limitKeys = {ProjectBean.PROJECT_NAME,ProjectBean.PROJECT_CODE, ProjectBean.PROJECT_MANAGER};
		Map<String, Object> query = new HashMap<String, Object>();
		query.put(ApiConstants.LIMIT_KEYS, limitKeys);
		Map<String, Object> result = dao.list(query, DBBean.PROJECT);
		
		List<Map<String, Object>> resultList = (List<Map<String, Object>>) result.get(ApiConstants.RESULTS_DATA); 
		List<String> pmIds = new ArrayList<String>();
		for(Map<String, Object> p : resultList){
			pmIds.add((String)p.get(ProjectBean.PROJECT_MANAGER));
		}
		Map<String, Object> pmQuery = new HashMap<String, Object>();
		pmQuery.put(ApiConstants.MONGO_ID, new DBQuery(DBQueryOpertion.IN, pmIds));
		pmQuery.put(ApiConstants.LIMIT_KEYS, new String[] {UserBean.USER_NAME});
		Map<String, Object> pms = dao.listToOneMapAndIdAsKey(pmQuery, DBBean.USER);
		
		for (Map<String, Object> p : resultList){
			String pmid = (String)p.get(ProjectBean.PROJECT_MANAGER);
			Map<String, Object> pmInfo = (Map<String, Object>) pms.get(pmid);
			p.put(ProjectBean.PROJECT_MANAGER, pmInfo.get(UserBean.USER_NAME));
		}
		
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
			pro.put("pmId", pmId);
			Map<String, Object> pmInfo = (Map<String, Object>) pmData.get(pmId);
			if (pmInfo != null){
				pro.put(ProjectBean.PROJECT_MANAGER, pmInfo.get(UserBean.USER_NAME));
			}

			String cId = (String) pro.get(ProjectBean.PROJECT_CUSTOMER);
			pro.put("cId", cId);
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

	@Override
	public void importProjectAndSCData(Map<String, Object> params) {
		String filePath = (String) params.get("filePath");
		ExcleUtil excleUtil = new ExcleUtil(filePath);
		List<String[]> list = excleUtil.getAllData(0);
		List<Map<String, Object>> rows = new ArrayList<Map<String, Object>>();
		for (int i=0; i<list.size(); i++){
			if (i>3){
				Map<String, Object> row = new HashMap<String, Object>();
				row.put(ProjectBean.PROJECT_NAME, list.get(i)[9].trim());
				row.put(ProjectBean.PROJECT_ABBR, list.get(i)[4].trim());
				row.put(ProjectBean.PROJECT_CUSTOMER, list.get(i)[8].trim());
				row.put(ProjectBean.PROJECT_MANAGER, list.get(i)[5].trim());
				row.put(ProjectBean.PROJECT_TYPE, list.get(i)[12].trim());
				
				row.put(SalesContractBean.SC_CODE, list.get(i)[2].trim());
				row.put(SalesContractBean.SC_PERSON, list.get(i)[7].trim());
				row.put(SalesContractBean.SC_TYPE, list.get(i)[10].trim());
				row.put(SalesContractBean.SC_DATE, list.get(i)[14].trim());
				row.put(SalesContractBean.SC_AMOUNT, list.get(i)[23].trim());
				row.put(SalesContractBean.SC_RUNNING_STATUS, list.get(i)[34].trim());
				
				rows.add(row);
			}
		}
		
		for(Map<String, Object> row : rows){
			Map<String, Object> customerQuery = new HashMap<String, Object>();
			customerQuery.put(CustomerBean.NAME, row.get(ProjectBean.PROJECT_CUSTOMER));
			Map<String, Object> customerMap = customerService.importCustomer(customerQuery);
			String customerId = (String) customerMap.get(ApiConstants.MONGO_ID);
			
			Map<String, Object> pmQuery = new HashMap<String, Object>();
			pmQuery.put(UserBean.USER_NAME, row.get(ProjectBean.PROJECT_MANAGER));
			Map<String, Object> pmMap = userService.importUser(pmQuery);
			String pmId = (String) pmMap.get(ApiConstants.MONGO_ID);
			
			Map<String, Object> project = new HashMap<String, Object>();

			project.put(ProjectBean.PROJECT_NAME, row.get(ProjectBean.PROJECT_NAME));
			project.put(ProjectBean.PROJECT_ABBR, row.get(ProjectBean.PROJECT_ABBR));
			project.put(ProjectBean.PROJECT_CUSTOMER, customerId);
			project.put(ProjectBean.PROJECT_MANAGER, pmId);
			project.put(ProjectBean.PROJECT_TYPE, row.get(ProjectBean.PROJECT_TYPE));
			Map<String, Object> projectMap = addProject(project);
			String proId = (String) projectMap.get(ApiConstants.MONGO_ID);
			
			Map<String, Object> sc = new HashMap<String, Object>();
			sc.put(SalesContractBean.SC_CODE, row.get(SalesContractBean.SC_CODE));
			sc.put(SalesContractBean.SC_PERSON, row.get(SalesContractBean.SC_PERSON));
			sc.put(SalesContractBean.SC_TYPE, row.get(SalesContractBean.SC_TYPE));
			sc.put(SalesContractBean.SC_DATE, row.get(SalesContractBean.SC_DATE));
			sc.put(SalesContractBean.SC_AMOUNT, row.get(SalesContractBean.SC_AMOUNT));
			row.put(SalesContractBean.SC_RUNNING_STATUS, row.get(SalesContractBean.SC_RUNNING_STATUS));
			sc.put(SalesContractBean.SC_PROJECT_ID, proId);
			salesContractService.addSC(sc);
		}
	}

	public IUserService getUserService() {
		return userService;
	}

	public void setUserService(IUserService userService) {
		this.userService = userService;
	}

	public ICustomerService getCustomerService() {
		return customerService;
	}

	public void setCustomerService(ICustomerService customerService) {
		this.customerService = customerService;
	}

	public ISalesContractService getSalesContractService() {
		return salesContractService;
	}

	public void setSalesContractService(ISalesContractService salesContractService) {
		this.salesContractService = salesContractService;
	}

}
