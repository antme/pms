package com.pms.service.service.impl;

import java.util.HashMap;
import java.util.Map;

import com.pms.service.mockbean.ApiConstants;
import com.pms.service.mockbean.DBBean;
import com.pms.service.service.AbstractService;
import com.pms.service.service.IProjectService;

public class ProjectServiceImpl extends AbstractService implements IProjectService {

	@Override
	public String geValidatorFileName() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Map<String, Object> listProjects(Map<String, Object> params) {
		// Get parameters from the input params
		Map<String, Object> result = this.dao.list(null, DBBean.PROJECT);
		return result;
	}

	@Override
	public Map<String, Object> addProject(Map<String, Object> params) {
		String id = dao.add(params, DBBean.PROJECT);
		
		Map<String, Object> query = new HashMap<String, Object>();
		query.put(ApiConstants.MONGO_ID, id);
		
		Map<String, Object> result = dao.list(query, DBBean.PROJECT);
		return result;
	}

	@Override
	public void deleteProject(Map<String, Object> params) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void updateProject(Map<String, Object> params) {
		// TODO Auto-generated method stub
		
	}

}
