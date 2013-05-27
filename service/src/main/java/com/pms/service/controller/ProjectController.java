package com.pms.service.controller;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import com.pms.service.service.IProjectService;

@Controller
@RequestMapping("/project")
public class ProjectController extends AbstractController {
	
	private static Logger logger = LogManager.getLogger(ProjectController.class);

    private IProjectService projectService;
    
    @RequestMapping("/list")
    public void listProjects(HttpServletRequest request, HttpServletResponse response) {
    	Map<String, Object> params = this.parserJsonParameters(request, true);
        responseSuccessWithMap(projectService.listProjects(params), null, request, response);
    }
    
    @RequestMapping("/add")
    public void addProject(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        responseSuccessWithMap(projectService.addProject(params), null, request, response);
    }

	public IProjectService getProjectService() {
		return projectService;
	}

	public void setProjectService(IProjectService projectService) {
		this.projectService = projectService;
	}
    
    

}
