package com.pms.service.controller;

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
import com.pms.service.service.IReturnService;

@Controller
@RequestMapping("/return")
@RoleValidate
@LoginRequired
public class ReturnController extends AbstractController {
	
	private static Logger logger = LogManager.getLogger(ReturnController.class);

    private IReturnService returnService;

	public IReturnService getReturnService() {
		return returnService;
	}

	public void setReturnService(IReturnService returnService) {
		this.returnService = returnService;
	}

	@RequestMapping("/get")
    public void get(HttpServletRequest request, HttpServletResponse response) {
    	Map<String, Object> params = this.parserJsonParameters(request, true);
    	responseWithData(returnService.get(params), request, response);
    }
    
	@RequestMapping("/list")
    public void list(HttpServletRequest request, HttpServletResponse response) {
    	Map<String, Object> params = this.parserJsonParameters(request, true);
    	responseWithData(returnService.list(params), request, response);
    }

    @RequestMapping("/submit")
    @RoleValidate(roleID=RoleValidConstants.BORROWING_MANAGEMENT, desc = RoleValidConstants.BORROWING_MANAGEMENT_DESC)
    public void submit(HttpServletRequest request, HttpServletResponse response) {
    	responseWithData(returnService.option(parserJsonParameters(request, false)), request, response);
    }
    
    @RequestMapping("/option")
    @RoleValidate(roleID=RoleValidConstants.BORROWING_MANAGEMENT_PROCESS, desc = RoleValidConstants.BORROWING_MANAGEMENT_PROCESS_DESC)
    public void option(HttpServletRequest request, HttpServletResponse response) {
    	responseWithData(returnService.option(parserJsonParameters(request, false)), request, response);
    }
}
