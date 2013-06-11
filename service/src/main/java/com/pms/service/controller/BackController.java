package com.pms.service.controller;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.pms.service.annotation.RoleValidate;
import com.pms.service.service.IBackService;

@Controller
@RequestMapping("/back")
@RoleValidate()
public class BackController extends AbstractController {

	private static Logger logger = LogManager.getLogger(BackController.class);
	
 	private IBackService backService;
	
    @RequestMapping("/create")
    //@RoleValidate(roleID=RoleValidConstants.ROLE_LIST, desc = RoleValidConstants.ROLE_LIST_DESC)
    public void addRequest(HttpServletRequest request, HttpServletResponse response) {
    	Map<String,Object> obj = backService.create(parserJsonParameters(request,  false));
    	responseWithData(obj, request, response, "add_success");
    }

    @RequestMapping("/destroy")
    //@RoleValidate(roleID=RoleValidConstants.ROLE_LIST, desc = RoleValidConstants.ROLE_LIST_DESC)
    public void deleteRequest(HttpServletRequest request, HttpServletResponse response) {
    	backService.destroy(parserJsonParameters(request,  false));
    	responseWithData(null, request, response);
    }	
    
    @RequestMapping("/update")
    //@RoleValidate(roleID=RoleValidConstants.ROLE_LIST, desc = RoleValidConstants.ROLE_LIST_DESC)
    public void updateRequest(HttpServletRequest request, HttpServletResponse response) {
    	Map<String,Object> obj = backService.update(parserJsonParameters(request,  false));
    	responseWithData(obj, request, response, "update_success");
    }
    
    @RequestMapping("/list")
    //@RoleValidate(roleID=RoleValidConstants.ROLE_LIST, desc = RoleValidConstants.ROLE_LIST_DESC)
    public void listRequest(HttpServletRequest request, HttpServletResponse response) {
    	responseWithData(backService.list(parserJsonParameters(request,  false)), request, response);
    }

    //获取某项目的清单列表
    @RequestMapping("/prepare")
    //@RoleValidate(roleID=RoleValidConstants.ROLE_LIST, desc = RoleValidConstants.ROLE_LIST_DESC)
    public void prepareRequest(HttpServletRequest request, HttpServletResponse response) {
    	responseWithData(backService.prepareRequest(parserJsonParameters(request,  false)), request, response);
    }

    //获取某项目的清单列表
    @RequestMapping("/load")
    //@RoleValidate(roleID=RoleValidConstants.ROLE_LIST, desc = RoleValidConstants.ROLE_LIST_DESC)
    public void loadRequest(HttpServletRequest request, HttpServletResponse response) {
    	responseWithData(backService.loadRequest(parserJsonParameters(request,  false)), request, response);
    }
    
    @RequestMapping("/approve")
    //@RoleValidate(roleID=RoleValidConstants.ROLE_LIST, desc = RoleValidConstants.ROLE_LIST_DESC)
    public void approveRequest(HttpServletRequest request, HttpServletResponse response) {
    	responseWithData(backService.approveRequest(parserJsonParameters(request,  false)), request, response);
    } 
    
    @RequestMapping("/reject")
    //@RoleValidate(roleID=RoleValidConstants.ROLE_LIST, desc = RoleValidConstants.ROLE_LIST_DESC)
    public void rejectRequest(HttpServletRequest request, HttpServletResponse response) {
    	responseWithData(backService.rejectRequest(parserJsonParameters(request,  false)), request, response);
    }
    
    @RequestMapping("/submit")
    //@RoleValidate(roleID=RoleValidConstants.ROLE_LIST, desc = RoleValidConstants.ROLE_LIST_DESC)
    public void submitRequest(HttpServletRequest request, HttpServletResponse response) {
    	responseWithData(backService.submitRequest(parserJsonParameters(request,  false)), request, response);
    }    
    /****CRUD 采购订单********/

	public IBackService getBackService() {
		return backService;
	}

	public void setBackService(IBackService backService) {
		this.backService = backService;
	}
    


}
