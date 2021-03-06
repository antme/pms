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


    
    @RequestMapping("/confirm")
    @RoleValidate(roleID=RoleValidConstants.BORROWING_MANAGEMENT_CONFIRM, desc = RoleValidConstants.BORROWING_MANAGEMENT_CONFIRM_DESC)
    public void confirmBorrowing(HttpServletRequest request, HttpServletResponse response) {
    	responseWithData(borrowingService.confirmBorrowing(parserJsonParameters(request, false)), request, response);
    }
    
    
    @RequestMapping("/approve")
    @RoleValidate(roleID=RoleValidConstants.BORROWING_MANAGEMENT_PROCESS, desc = RoleValidConstants.BORROWING_MANAGEMENT_PROCESS_DESC)
    public void approveBorrowing(HttpServletRequest request, HttpServletResponse response) {
    	responseWithData(borrowingService.approveBorrowing(parserJsonParameters(request, false)), request, response);
    }
    
    @RequestMapping("/reject")
    @RoleValidate(roleID=RoleValidConstants.BORROWING_MANAGEMENT_PROCESS, desc = RoleValidConstants.BORROWING_MANAGEMENT_PROCESS_DESC)
    public void rejectBorrowing(HttpServletRequest request, HttpServletResponse response) {
    	responseWithData(borrowingService.rejectBorrowing(parserJsonParameters(request, false)), request, response);
    }
    
    @RequestMapping("/return/submit")
    @RoleValidate(roleID=RoleValidConstants.BORROWING_MANAGEMENT, desc = RoleValidConstants.BORROWING_MANAGEMENT_DESC)
    public void submitBorrowingReturn(HttpServletRequest request, HttpServletResponse response) {
    	responseWithData(borrowingService.submitBorrowingReturn(parserJsonParameters(request, false)), request, response);
    }
    
    @RequestMapping("/return/confirm")
    @RoleValidate(roleID=RoleValidConstants.BORROWING_MANAGEMENT_BACK_CONFIRM, desc = RoleValidConstants.BORROWING_MANAGEMENT_BACK_CONFIRM_DESC)
    public void confirmBorrowingReturn(HttpServletRequest request, HttpServletResponse response) {
    	responseWithData(borrowingService.confirmBorrowingReturn(parserJsonParameters(request, false)), request, response);
    }
    
    @RequestMapping("/eqlist")
    public void eqlist(HttpServletRequest request, HttpServletResponse response) {
    	Map<String, Object> params = this.parserJsonParameters(request, true);
    	responseWithData(borrowingService.listNeedBorrowingEqlist(params), request, response);
    }
    
    @RequestMapping("/sclist")
    public void listScByProjectForBorrowing(HttpServletRequest request, HttpServletResponse response) {
    	Map<String, Object> params = this.parserJsonParameters(request, true);
    	responseWithData(borrowingService.listScByProjectForBorrowing(params), request, response);
    }
    
    @RequestMapping("/list/project")
    public void listProjectForBorrowing(HttpServletRequest request, HttpServletResponse response) {
    	Map<String, Object> params = this.parserJsonParameters(request, true);
    	responseWithData(borrowingService.listProjectForBorrowing(params), request, response);
    }
    
    
    @RequestMapping("/search")
    public void searchBorrowing(HttpServletRequest request, HttpServletResponse response) {
    	Map<String, Object> params = this.parserJsonParameters(request, true);
    	responseWithData(borrowingService.searchBorrowing(params), request, response);
    }
}
