package com.pms.service.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.google.gson.Gson;
import com.pms.service.service.IProjectService;

@Controller
@RequestMapping("/project")
public class ProjectController extends AbstractController {
	
	private static Logger logger = LogManager.getLogger(ProjectController.class);

    private IProjectService projectService;
    
    @RequestMapping("/test")
    public void test(HttpServletRequest request, HttpServletResponse response) {
//    	String data = "[{\"_id\":\"51a41a1affcbd28dcc2bada4\",\"customerName\":\"dfgh\",\"purchaseAmount\":\"65\",\"projectStatus\":\"dfgh\",\"projectCode\":\"9078567\",\"description\":\"\",\"invoiceAmount\":\"34\",\"totalAmount\":\"456\",\"projectManager\":\"dfgh\",\"projectType\":\"dfgh\",\"projectName\":\"rfhdf\",\"getAmount\":\"456\",\"createdOn\":1369709082301,\"updatedOn\":1369709082301},{\"_id\":\"51a41a0cffcbd28dcc2bada3\",\"customerName\":\"ertyer\",\"purchaseAmount\":\"456\",\"projectStatus\":\"dfg\",\"projectCode\":\"2452345\",\"description\":\"\",\"invoiceAmount\":\"345\",\"totalAmount\":\"345634\",\"projectManager\":\"sryh\",\"projectType\":\"sdfg\",\"projectName\":\"dfhdft\",\"getAmount\":\"456\",\"createdOn\":1369709068214,\"updatedOn\":1369709068214}]";
//    	data = data + "";
    	String data="{\"d\" : {\"results\": [{\"name\":\"shihua\",\"age\":22},{\"name\":\"shihua\",\"age\":22},{\"name\":\"shihua\",\"age\":22}], \"__count\": \"3\"}}";
    	String callback = request.getParameter("$callback");
    	String jsonReturn=callback + "(" + data + ")";
        response.setContentType("text/plain;charset=UTF-8");
        response.setContentType("application/x-javascript;charset=UTF-8");
        response.addHeader("Accept-Encoding", "gzip, deflate");
        try {
            response.getWriter().write(jsonReturn);
        } catch (IOException e) {
            logger.fatal("Write response data to client failed!", e);
        }
    }
    
    @RequestMapping("/list")
    public void listProjects(HttpServletRequest request, HttpServletResponse response) {
    	Map<String, Object> params = this.parserJsonParameters(request, true);
    	responseWithData(projectService.listProjects(params), request, response);
    }
    
    @RequestMapping("/add")
    public void addProject(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        projectService.addProject(params);
        responseWithData(null, request, response);
    }

	public IProjectService getProjectService() {
		return projectService;
	}

	public void setProjectService(IProjectService projectService) {
		this.projectService = projectService;
	}
    
    

}
