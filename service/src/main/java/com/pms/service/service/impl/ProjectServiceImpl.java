package com.pms.service.service.impl;

import java.util.HashMap;
import java.util.Map;

import com.pms.service.mockbean.ApiConstants;
import com.pms.service.mockbean.DBBean;
import com.pms.service.mockbean.ProjectBean;
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
	public void addProject(Map<String, Object> params) {
		dao.add(params, DBBean.PROJECT);
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
		// TODO Auto-generated method stub
		return null;
	}

}
