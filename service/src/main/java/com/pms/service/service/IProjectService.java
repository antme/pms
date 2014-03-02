package com.pms.service.service;

import java.util.Map;

import com.pms.service.bean.Project;

public interface IProjectService {
	
	public Map<String, Object> listProjects(Map<String, Object> params);
	
	public void addProject(Project project);

	public Map<String, Object> listProjectsForSelect(Map<String, Object> params, boolean all);
	
	public Map<String, Object> listEquipmentsForProject(Map<String, Object> params);
	
	
	public Map<String, Object> getProjectById(String id);
	
	public Map<String, Object> getProjectByIdAndMergeSCInfo(Map<String, Object> params);
	
	public Map<String, Object> setupProject(Map<String, Object> params);
	
	public String getCustomerIdByProId(String pId);
	
	public String getCustomerNameByProId(String pId);

	//FIXME: REMOVED? NOT USED?
	public void importProjectAndSCData(Map<String, Object> params);
	
	public Map<String, Object> importProject(Map<String, Object> params);
	
	public String genProjectCode(String ptype, String pStatus);
}
