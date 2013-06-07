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
import com.pms.service.mockbean.ProjectBean;
import com.pms.service.mockbean.ProjectContractBean;
import com.pms.service.mockbean.PurchaseRequestBean;
import com.pms.service.service.AbstractService;
import com.pms.service.service.IPurchaseService;

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
		params.put(PurchaseRequestBean.STATUS, "已提交");
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
	public Map<String, Object> prepareRequest(Map<String, Object> params) {
		Map<String,Object> request = new HashMap<String,Object>();
		
		String projectCode = String.valueOf(params.get("projectCode"));
		Map<String,Object> project = dao.findOne(ProjectBean.PROJECT_CODE, projectCode, DBBean.PROJECT);
		if(project != null) {
			String projectId = String.valueOf(project.get(ApiConstants.MONGO_ID));
			String[] limitKey =  {ProjectContractBean.PC_CODE, ProjectContractBean.PC_EQ_LIST};
			Map<String, Object> pc = dao.findOne(ProjectContractBean.PC_PROJECT_ID, projectId, limitKey, DBBean.PROJECT_CONTRACT);
			if(pc != null) {
				//request.put(ApiConstants.MONGO_ID, new ObjectId().toString());
				request.put(PurchaseRequestBean.SUBMIT_DATE, new Date());
				request.put(PurchaseRequestBean.PROJECT_CODE, project.get(ProjectBean.PROJECT_CODE));
				request.put(PurchaseRequestBean.PROJECT_NAME, project.get(ProjectBean.PROJECT_NAME));
				request.put(PurchaseRequestBean.PROJECT_MANAGER, project.get(ProjectBean.PROJECT_MANAGER));
				request.put(PurchaseRequestBean.CUSTOMER_NAME, project.get(ProjectBean.PROJECT_CUSTOMER_NAME));
				
				request.put(PurchaseRequestBean.PC_CODE, pc.get(ProjectContractBean.PC_CODE));
				request.put(PurchaseRequestBean.PC_EQ_LIST, pc.get(ProjectContractBean.PC_EQ_LIST));
			}
		}
		return request;
	}	
}
