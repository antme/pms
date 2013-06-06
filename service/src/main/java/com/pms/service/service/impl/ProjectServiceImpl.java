package com.pms.service.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.pms.service.mockbean.ApiConstants;
import com.pms.service.mockbean.DBBean;
import com.pms.service.mockbean.ProjectBean;
import com.pms.service.mockbean.ProjectContractBean;
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
		queryMap.put(ApiConstants.LIMIT, limit);
		queryMap.put(ApiConstants.LIMIT_START, limitStart);
		
		Map<String, Object> result = this.dao.list(queryMap, DBBean.PROJECT);
		return result;
	}

	@Override
	public Map<String, Object> addProject(Map<String, Object> params) {
		Map<String, Object> projectBean = new HashMap<String, Object>();
		projectBean.put(ProjectBean.PROJECT_CODE, params.get(ProjectBean.PROJECT_CODE));
		projectBean.put(ProjectBean.PROJECT_NAME, params.get(ProjectBean.PROJECT_NAME));
		projectBean.put(ProjectBean.PROJECT_MANAGER, params.get(ProjectBean.PROJECT_MANAGER));
		projectBean.put(ProjectBean.PROJECT_STATUS, params.get(ProjectBean.PROJECT_STATUS));
		projectBean.put(ProjectBean.PROJECT_TYPE, params.get(ProjectBean.PROJECT_TYPE));
		projectBean.put(ProjectBean.PROJECT_ADDRESS, params.get(ProjectBean.PROJECT_ADDRESS));
		projectBean.put(ProjectBean.PROJECT_MEMO, params.get(ProjectBean.PROJECT_MEMO));
		projectBean.put(ProjectBean.PROJECT_CUSTOMER_NAME, params.get(ProjectBean.PROJECT_CUSTOMER_NAME));
		
		//初始化项目列表的4个金额字段
		projectBean.put(ProjectBean.PROJECT_TOTAL_AMOUNT, 0);
		projectBean.put(ProjectBean.PROJECT_INVOICE_AMOUNT, 0);
		projectBean.put(ProjectBean.PROJECT_GET_AMOUNT, 0);
		projectBean.put(ProjectBean.PROJECT_PURCHASE_AMOUNT, 0);
		
		//后台处理字段
		projectBean.put(ProjectBean.PROJECT_MODIFY_TIMES, 0);
		
		Map<String, Object> newProject = dao.add(projectBean, DBBean.PROJECT);
		String _id = newProject.get(ApiConstants.MONGO_ID).toString(); 
		
		Map<String, Object> contract = new HashMap<String, Object>();
		contract.put(ProjectContractBean.PC_PROJECT_ID, _id);
		contract.put(ProjectContractBean.PC_CUSTOMER_NAME, params.get(ProjectContractBean.PC_CUSTOMER_NAME));
		contract.put(ProjectContractBean.PC_AMOUNT, params.get(ProjectContractBean.PC_AMOUNT));
		contract.put(ProjectContractBean.PC_ESTIMATE_EQ_COST0, params.get(ProjectContractBean.PC_ESTIMATE_EQ_COST0));
		contract.put(ProjectContractBean.PC_ESTIMATE_EQ_COST1, params.get(ProjectContractBean.PC_ESTIMATE_EQ_COST1));
		contract.put(ProjectContractBean.PC_ESTIMATE_SUB_COST, params.get(ProjectContractBean.PC_ESTIMATE_SUB_COST));
		contract.put(ProjectContractBean.PC_ESTIMATE_PM_COST, params.get(ProjectContractBean.PC_ESTIMATE_PM_COST));
		contract.put(ProjectContractBean.PC_ESTIMATE_DEEP_DESIGN_COST, params.get(ProjectContractBean.PC_ESTIMATE_DEEP_DESIGN_COST));
		contract.put(ProjectContractBean.PC_ESTIMATE_DEBUG_COST, params.get(ProjectContractBean.PC_ESTIMATE_DEBUG_COST));
		contract.put(ProjectContractBean.PC_ESTIMATE_OTHER_COST, params.get(ProjectContractBean.PC_ESTIMATE_OTHER_COST));
		contract.put(ProjectContractBean.PC_DEBUG_COST_TYPE, params.get(ProjectContractBean.PC_DEBUG_COST_TYPE));
		contract.put(ProjectContractBean.PC_TAX_TYPE, params.get(ProjectContractBean.PC_TAX_TYPE));
		contract.put(ProjectContractBean.PC_CODE, params.get(ProjectContractBean.PC_CODE));
		contract.put(ProjectContractBean.PC_PERSON, params.get(ProjectContractBean.PC_PERSON));
		contract.put(ProjectContractBean.PC_TYPE, params.get(ProjectContractBean.PC_TYPE));
		contract.put(ProjectContractBean.PC_DATE, params.get(ProjectContractBean.PC_DATE));
		contract.put(ProjectContractBean.PC_DOWN_PAYMENT, params.get(ProjectContractBean.PC_DOWN_PAYMENT));
		contract.put(ProjectContractBean.PC_PROGRESS_PAYMENT, params.get(ProjectContractBean.PC_PROGRESS_PAYMENT));
		contract.put(ProjectContractBean.PC_QUALITY_MONEY, params.get(ProjectContractBean.PC_QUALITY_MONEY));
		contract.put(ProjectContractBean.PC_MEMO, params.get(ProjectContractBean.PC_MEMO));
		
		List<Map<String, Object>> eqcostList = new ArrayList<Map<String, Object>>();
		for (int i=0; i<5; i++){
			Map<String, Object> equipment = new HashMap<String, Object>();
			equipment.put(ProjectContractBean.PC_EQ_LIST_NO, "201306"+i);
			equipment.put(ProjectContractBean.PC_EQ_LIST_MATERIAL_CODE, "PJ-xx-"+i);
			equipment.put(ProjectContractBean.PC_EQ_LIST_PRODUCT_NAME, "路由器"+i);
			equipment.put(ProjectContractBean.PC_EQ_LIST_PRODUCT_TYPE, i+"M/s");
			equipment.put(ProjectContractBean.PC_EQ_LIST_AMOUNT, 100);
			equipment.put(ProjectContractBean.PC_EQ_LIST_UNIT, "个");
			equipment.put(ProjectContractBean.PC_EQ_LIST_BRAND, "TP-LINK");
			equipment.put(ProjectContractBean.PC_EQ_LIST_BASE_PRICE, 100);
			equipment.put(ProjectContractBean.PC_EQ_LIST_TOTAL_AMOUNT, 10000);
			equipment.put(ProjectContractBean.PC_EQ_LIST_MEMO, "memo...");
			
			eqcostList.add(equipment);
		}
		
		contract.put(ProjectContractBean.PC_EQ_LIST, eqcostList);
		dao.add(contract, DBBean.PROJECT_CONTRACT);
		
		return newProject;
	}

	@Override
	public void deleteProject(Map<String, Object> params) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void updateProject(Map<String, Object> params) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public Map<String, Object> listProjectsForSelect(Map<String, Object> params) {
		// TODO Add logic to filter the projects which in progresss
		String[] limitKeys = {ProjectBean.PROJECT_NAME};
		Map<String, Object> query = new HashMap<String, Object>();
		query.put(ApiConstants.LIMIT_KEYS, limitKeys);
		Map<String, Object> result = dao.list(query, DBBean.PROJECT);
		
		return result;
	}

	@Override
	public Map<String, Object> listEquipmentsForProject(
			Map<String, Object> params) {
		String projectId = (String) params.get(ProjectContractBean.PC_PROJECT_ID);
		String[] limitKeys = {ProjectContractBean.PC_EQ_LIST};
		
		Map<String, Object> query = new HashMap<String, Object>();
		query.put(ProjectContractBean.PC_PROJECT_ID, projectId);
		query.put(ApiConstants.LIMIT_KEYS, limitKeys);
		
		Map<String, Object> re = dao.findOneByQuery(query, DBBean.PROJECT_CONTRACT);
		Map<String, Object> re2 = new HashMap<String, Object>();
		re2.put(ApiConstants.RESULTS_DATA, re.get(ProjectContractBean.PC_EQ_LIST));
		return re2;
	}

}
