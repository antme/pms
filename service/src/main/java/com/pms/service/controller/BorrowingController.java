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
import com.pms.service.service.IBorrowingService;

@Controller
@RequestMapping("/borrowing")
@RoleValidate
@LoginRequired
public class BorrowingController extends AbstractController {
	
	private static Logger logger = LogManager.getLogger(BorrowingController.class);

    private IBorrowingService borrowingService;

	public IBorrowingService getBorrowingService() {
		return borrowingService;
	}

	public void setBorrowingService(IBorrowingService borrowingService) {
		this.borrowingService = borrowingService;
	}

	@RequestMapping("/get")
    public void get(HttpServletRequest request, HttpServletResponse response) {
    	Map<String, Object> params = this.parserJsonParameters(request, true);
    	responseWithData(borrowingService.get(params), request, response);
    }
    
	@RequestMapping("/list")
    public void list(HttpServletRequest request, HttpServletResponse response) {
    	Map<String, Object> params = this.parserJsonParameters(request, true);
    	responseWithData(borrowingService.list(params), request, response);
    }
    
    @RequestMapping("/update")
    @RoleValidate(roleID=RoleValidConstants.BORROWING_MANAGEMENT, desc = RoleValidConstants.BORROWING_MANAGEMENT_DESC)
    public void update(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        responseWithData(borrowingService.update(params), request, response);
    }

    @RequestMapping("/destroy")
    @RoleValidate(roleID=RoleValidConstants.BORROWING_MANAGEMENT, desc = RoleValidConstants.BORROWING_MANAGEMENT_DESC)
    public void destroy(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        borrowingService.destroy(params);
        responseWithData(null, request, response);
    }
    
    @RequestMapping("/create")
    @RoleValidate(roleID=RoleValidConstants.BORROWING_MANAGEMENT, desc = RoleValidConstants.BORROWING_MANAGEMENT_DESC)
    public void create(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        responseWithData(borrowingService.create(params), request, response);
    }

    @RequestMapping("/submit")
    @RoleValidate(roleID=RoleValidConstants.BORROWING_MANAGEMENT, desc = RoleValidConstants.BORROWING_MANAGEMENT_DESC)
    public void submit(HttpServletRequest request, HttpServletResponse response) {
    	responseWithData(borrowingService.option(parserJsonParameters(request, false)), request, response);
    }
    
    @RequestMapping("/option")
    @RoleValidate(roleID=RoleValidConstants.BORROWING_MANAGEMENT_PROCESS, desc = RoleValidConstants.BORROWING_MANAGEMENT_PROCESS_DESC)
    public void option(HttpServletRequest request, HttpServletResponse response) {
    	responseWithData(borrowingService.option(parserJsonParameters(request, false)), request, response);
    }
    
    @RequestMapping("/eqlist")
    public void eqlist(HttpServletRequest request, HttpServletResponse response) {
    	Map<String, Object> params = this.parserJsonParameters(request, true);
    	responseWithData(borrowingService.eqlist(params), request, response);
    }
}
