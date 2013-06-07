package com.pms.service.service;

import java.util.Map;

public interface IProjectService {
	
	public Map<String, Object> listProjects(Map<String, Object> params);
	
	public Map<String, Object> addProject(Map<String, Object> params);
	
	public void deleteProject(Map<String, Object> params);
	
	public void updateProject(Map<String, Object> params);
	
	public Map<String, Object> listProjectsForSelect(Map<String, Object> params);
	
	public Map<String, Object> listEquipmentsForProject(Map<String, Object> params);
	
	public Map<String, Object> getProjectById(String id);
}
