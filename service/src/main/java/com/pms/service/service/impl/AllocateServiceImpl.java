package com.pms.service.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.pms.service.dbhelper.DBQuery;
import com.pms.service.dbhelper.DBQueryOpertion;
import com.pms.service.mockbean.AllocateBean;
import com.pms.service.mockbean.ApiConstants;
import com.pms.service.mockbean.DBBean;
import com.pms.service.mockbean.ProjectBean;
import com.pms.service.mockbean.SalesContractBean;
import com.pms.service.service.AbstractService;
import com.pms.service.service.IAllocateService;

public class AllocateServiceImpl extends AbstractService implements IAllocateService {

	@Override
	public String geValidatorFileName() {
		return "allocate";
	}

	public Map<String, Object> list(Map<String, Object> params) {
		Map<String, Object> result = dao.list(null, DBBean.ALLOCATE);
		
		List<Map<String, Object>> list = (List<Map<String, Object>>) result.get(ApiConstants.RESULTS_DATA);
		
		List<String> pId = new ArrayList<String>();
		for (Map<String, Object> p:list){
			pId.add(p.get(AllocateBean.IN_PROJECT_ID).toString());
			pId.add(p.get(AllocateBean.OUT_PROJECT_ID).toString());
		}
		
		Map<String, Object> queryContract = new HashMap<String, Object>();
		queryContract.put(ApiConstants.MONGO_ID, new DBQuery(DBQueryOpertion.IN, pId));
		Map<String, Object> cInfoMap = dao.listToOneMapByKey(queryContract, DBBean.PROJECT, ApiConstants.MONGO_ID);
		
		for (Map<String, Object> p:list){
			String inProjectId = p.get(AllocateBean.IN_PROJECT_ID).toString();
			Map<String, Object> inProjectMap = (Map<String, Object>) cInfoMap.get(inProjectId);
			if (inProjectMap != null) {
				p.put(AllocateBean.IN_PROJECT_CODE, inProjectMap.get(ProjectBean.PROJECT_CODE));
				p.put(AllocateBean.IN_PROJECT_NAME, inProjectMap.get(ProjectBean.PROJECT_NAME));
				p.put(AllocateBean.IN_PROJECT_MANAGER, inProjectMap.get(ProjectBean.PROJECT_MANAGER_ID));
			}
			
			String outProjectId = p.get(AllocateBean.OUT_PROJECT_ID).toString();
			Map<String, Object> outProjectMap = (Map<String, Object>) cInfoMap.get(outProjectId);
			if (outProjectMap != null) {
				p.put(AllocateBean.OUT_PROJECT_CODE, outProjectMap.get(ProjectBean.PROJECT_CODE));
				p.put(AllocateBean.OUT_PROJECT_NAME, outProjectMap.get(ProjectBean.PROJECT_NAME));
				p.put(AllocateBean.OUT_PROJECT_MANAGER, outProjectMap.get(ProjectBean.PROJECT_MANAGER_ID));
			}
		}
		
		return result;
	}

	public Map<String, Object> update(Map<String, Object> params) {
		return dao.updateById(params, DBBean.ALLOCATE);
	}

	public void destroy(Map<String, Object> params) {
		List<String> ids = new ArrayList<String>();
		ids.add(String.valueOf(params.get(ApiConstants.MONGO_ID)));
		dao.deleteByIds(ids, DBBean.ALLOCATE);
	}

	public Map<String, Object> create(Map<String, Object> params) {
		return dao.add(params, DBBean.ALLOCATE);
	}

}
