package com.pms.service.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.pms.service.annotation.RoleValidConstants;
import com.pms.service.annotation.RoleValidate;
import com.pms.service.service.IPurchaseService;

@Controller
@RequestMapping("/purchase")
@RoleValidate()
public class PurchaseController extends AbstractController {

	private static Logger logger = LogManager.getLogger(PurchaseController.class);
	
 	private IPurchaseService purchaseService;
	
    @RequestMapping("/back/prepare")
    //@RoleValidate(roleID=RoleValidConstants.ROLE_LIST, desc = RoleValidConstants.ROLE_LIST_DESC)
    public void prepareRequest(HttpServletRequest request, HttpServletResponse response) {
    	responseWithData(purchaseService.prepareBack(parserJsonParameters(request,  false)), request, response);
    }

    @RequestMapping("/back/load")
    //@RoleValidate(roleID=RoleValidConstants.ROLE_LIST, desc = RoleValidConstants.ROLE_LIST_DESC)
    public void loadBack(HttpServletRequest request, HttpServletResponse response) {
    	responseWithData(purchaseService.loadBack(parserJsonParameters(request,  false)), request, response);
    }
    
    @RequestMapping("/back/save")
    @RoleValidate(roleID=RoleValidConstants.PURCHASE_BACK_MANAGEMENT, desc = RoleValidConstants.PURCHASE_BACK_MANAGEMENT_DESC)
    public void saveBack(HttpServletRequest request, HttpServletResponse response) {
    	Map<String,Object> obj = purchaseService.saveBack(parserJsonParameters(request,  false));
    	responseWithData(obj, request, response, "update_success");
    }
    
    @RequestMapping("/back/submit")
    //@RoleValidate(roleID=RoleValidConstants.ROLE_LIST, desc = RoleValidConstants.ROLE_LIST_DESC)
    public void submitBack(HttpServletRequest request, HttpServletResponse response) {
    	responseWithData(purchaseService.submitBack(parserJsonParameters(request,  false)), request, response);
    }
    
    @RequestMapping("/back/reject")
    //@RoleValidate(roleID=RoleValidConstants.ROLE_LIST, desc = RoleValidConstants.ROLE_LIST_DESC)
    public void rejectBack(HttpServletRequest request, HttpServletResponse response) {
    	//responseWithData(purchaseService.rejectAllot(parserJsonParameters(request,  false)), request, response);
    }
 
    @RequestMapping("/back/pending")
    //@RoleValidate(roleID=RoleValidConstants.ROLE_LIST, desc = RoleValidConstants.ROLE_LIST_DESC)
    public void pendingBack(HttpServletRequest request, HttpServletResponse response) {
    	responseWithData(purchaseService.pendingBack(parserJsonParameters(request,  false)), request, response);
    }
    
    @RequestMapping("/back/destroy")
    //@RoleValidate(roleID=RoleValidConstants.ROLE_LIST, desc = RoleValidConstants.ROLE_LIST_DESC)
    public void destoryBack(HttpServletRequest request, HttpServletResponse response) {
    	purchaseService.destoryBack(parserJsonParameters(request,  false));
    	responseWithData(new HashMap(), request, response);
    }
    
    @RequestMapping("/back/list")
    //@RoleValidate(roleID=RoleValidConstants.ROLE_LIST, desc = RoleValidConstants.ROLE_LIST_DESC)
    public void listAllBack(HttpServletRequest request, HttpServletResponse response) {
    	responseWithData(purchaseService.listAllBack(parserJsonParameters(request,  false)), request, response);
    }
    
    @RequestMapping("/back/listchecked")
    //@RoleValidate(roleID=RoleValidConstants.ROLE_LIST, desc = RoleValidConstants.ROLE_LIST_DESC)
    public void listHasCheckedBack(HttpServletRequest request, HttpServletResponse response) {
    	responseWithData(purchaseService.listCheckedBack(parserJsonParameters(request,  false)), request, response);
    }

    @RequestMapping("/allot/prepare")
    //@RoleValidate(roleID=RoleValidConstants.ROLE_LIST, desc = RoleValidConstants.ROLE_LIST_DESC)
    public void prepareAllot(HttpServletRequest request, HttpServletResponse response) {
    	responseWithData(purchaseService.prepareAllot(parserJsonParameters(request,  false)), request, response);
    }
    
    @RequestMapping("/allot/list")
    //@RoleValidate(roleID=RoleValidConstants.ROLE_LIST, desc = RoleValidConstants.ROLE_LIST_DESC)
    public void listAllot(HttpServletRequest request, HttpServletResponse response) {
    	responseWithData(purchaseService.listAllot(parserJsonParameters(request,  false)), request, response);
    }

    @RequestMapping("/allot/load")
    //@RoleValidate(roleID=RoleValidConstants.ROLE_LIST, desc = RoleValidConstants.ROLE_LIST_DESC)
    public void loadAllot(HttpServletRequest request, HttpServletResponse response) {
    	responseWithData(purchaseService.loadAllot(parserJsonParameters(request,  false)), request, response);
    }
    
    @RequestMapping("/allot/submit")
    @RoleValidate(roleID=RoleValidConstants.PURCHASE_ALLOCATE_MANAGEMENT, desc = RoleValidConstants.PURCHASE_ALLOCATE_MANAGEMENT_DESC)
    public void submitAllotBack(HttpServletRequest request, HttpServletResponse response) {
    	responseWithData(purchaseService.submitAllot(parserJsonParameters(request,  false)), request, response);
    }
    
    @RequestMapping("/allot/approve")
    @RoleValidate(roleID=RoleValidConstants.PURCHASE_ALLOCATE_PROCESS, desc = RoleValidConstants.PURCHASE_ALLOCATE_PROCESS_DESC)
    public void approveAllotForBack(HttpServletRequest request, HttpServletResponse response) {
    	responseWithData(purchaseService.approveAllot(parserJsonParameters(request,  false)), request, response);
    }
 
    @RequestMapping("/allot/reject")
    //@RoleValidate(roleID=RoleValidConstants.ROLE_LIST, desc = RoleValidConstants.ROLE_LIST_DESC)
    public void rejectAllot(HttpServletRequest request, HttpServletResponse response) {
    	responseWithData(purchaseService.rejectAllot(parserJsonParameters(request,  false)), request, response);
    }
    
	public IPurchaseService getPurchaseService() {
		return purchaseService;
	}

	public void setPurchaseService(IPurchaseService purchaseService) {
		this.purchaseService = purchaseService;
	}

}
