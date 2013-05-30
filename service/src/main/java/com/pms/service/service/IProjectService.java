package com.pms.service.service;

import java.util.Map;

public interface IProjectService {
	
	public Map<String, Object> listProjects(Map<String, Object> params);
	
	public void addProject(Map<String, Object> params);
	
	public void deleteProject(Map<String, Object> params);
	
	public void updateProject(Map<String, Object> params);
}