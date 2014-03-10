package com.pms.service.controller;

import java.io.IOException;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.pms.service.annotation.LoginRequired;
import com.pms.service.annotation.RoleValidConstants;
import com.pms.service.annotation.RoleValidate;
import com.pms.service.bean.Project;
import com.pms.service.mockbean.ApiConstants;
import com.pms.service.service.IProjectService;

@Controller
@RequestMapping("/project")
@RoleValidate()
@LoginRequired()
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
    
    @RequestMapping("/listforselect")
    public void listProjectsForSelect(HttpServletRequest request, HttpServletResponse response) {
    	Map<String, Object> params = this.parserJsonParameters(request, true);
    	responseWithData(projectService.listProjectsForSelect(params, false), request, response);
    }
    
    @RequestMapping("/listAllForselect")
    public void listAllForselect(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = this.parserJsonParameters(request, true);
        responseWithData(projectService.listProjectsForSelect(params, true), request, response);
    }
    
    
    @RequestMapping("/listequipments")
    public void listEquipmentListByProject(HttpServletRequest request, HttpServletResponse response) {
    	Map<String, Object> params = this.parserJsonParameters(request, false);
    	responseWithData(projectService.listEquipmentsForProject(params), request, response);
    }
    
    /**
     * 新建项目
     * @param request
     * @param response
     */
    @RequestMapping("/add")
    @RoleValidate(roleID=RoleValidConstants.PROJECT_ADD, desc = RoleValidConstants.PROJECT_ADD_DESC)
    public void addProject(HttpServletRequest request, HttpServletResponse response) {
        updateProject(request, response);
    }
    
    /**
     * 变更项目
     * @param request
     * @param response
     */
    @RequestMapping("/update")
    @RoleValidate(roleID=RoleValidConstants.PROJECT_UPDATE, desc = RoleValidConstants.PROJECT_UPDATE_DESC)
    public void updateProject(HttpServletRequest request, HttpServletResponse response) {
        Project params = (Project) parserParametersToEntity(request, false, Project.class);
        projectService.addProject(params);
        responseWithData(null, request, response);
    }
    
    @RequestMapping("/get")
    public void getProjectById(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        String id = (String) params.get(ApiConstants.MONGO_ID);
        responseWithData(projectService.getProjectById(params), request, response);
    }
    
    @RequestMapping("/getandmergescinfo")
    public void getProjectByIdAndMergeSCInfo(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        String id = (String) params.get(ApiConstants.MONGO_ID);
        responseWithData(projectService.getProjectByIdAndMergeSCInfo(params), request, response);
    }
    
    /**
     * 正式立项
     * @param request
     * @param response
     */
    @RequestMapping("/setup")
    @RoleValidate(roleID=RoleValidConstants.PROJECT_UPDATE, desc = RoleValidConstants.PROJECT_UPDATE_DESC)
    public void setupProject(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        responseWithData(projectService.setupProject(params), request, response);
    }

	public IProjectService getProjectService() {
		return projectService;
	}

	public void setProjectService(IProjectService projectService) {
		this.projectService = projectService;
	}
    
    

}
