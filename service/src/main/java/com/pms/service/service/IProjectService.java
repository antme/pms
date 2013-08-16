package com.pms.service.service;

import java.util.Map;

public interface IProjectService {
	
	public Map<String, Object> listProjects(Map<String, Object> params);
	
	public Map<String, Object> addProject(Map<String, Object> params);
	
	public void deleteProject(Map<String, Object> params);
	
	public Map<String, Object> updateProject(Map<String, Object> params);
	
	public Map<String, Object> listProjectsForSelect(Map<String, Object> params);
	
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
