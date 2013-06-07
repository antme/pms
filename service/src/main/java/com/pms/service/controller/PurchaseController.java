package com.pms.service.controller;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.pms.service.annotation.RoleValidConstants;
import com.pms.service.annotation.RoleValidate;
import com.pms.service.mockbean.ApiConstants;
import com.pms.service.service.ICustomerService;
import com.pms.service.service.IPurchaseService;

@Controller
@RequestMapping("/purchase")
@RoleValidate()
public class PurchaseController extends AbstractController {

	private static Logger logger = LogManager.getLogger(PurchaseController.class);
	
 	private IPurchaseService purchaseService;
	
 	/****CRUD 采购申请********/
    @RequestMapping("/request/create")
    //@RoleValidate(roleID=RoleValidConstants.ROLE_LIST, desc = RoleValidConstants.ROLE_LIST_DESC)
    public void addRequest(HttpServletRequest request, HttpServletResponse response) {
    	Map<String,Object> obj = purchaseService.create(parserJsonParameters(request,  false));
    	responseWithData(obj, request, response, "add_success");
    }

    @RequestMapping("/request/destroy")
    //@RoleValidate(roleID=RoleValidConstants.ROLE_LIST, desc = RoleValidConstants.ROLE_LIST_DESC)
    public void deleteRequest(HttpServletRequest request, HttpServletResponse response) {
    	purchaseService.destroy(parserJsonParameters(request,  false));
    	responseWithData(null, request, response);
    }	
    
    @RequestMapping("/request/update")
    //@RoleValidate(roleID=RoleValidConstants.ROLE_LIST, desc = RoleValidConstants.ROLE_LIST_DESC)
    public void updateRequest(HttpServletRequest request, HttpServletResponse response) {
    	Map<String,Object> obj = purchaseService.update(parserJsonParameters(request,  false));
    	responseWithData(obj, request, response, "update_success");
    }
    
    @RequestMapping("/request/list")
    //@RoleValidate(roleID=RoleValidConstants.ROLE_LIST, desc = RoleValidConstants.ROLE_LIST_DESC)
    public void listRequest(HttpServletRequest request, HttpServletResponse response) {
    	responseWithData(purchaseService.list(parserJsonParameters(request,  false)), request, response);
    }

    //获取某项目的清单列表
    @RequestMapping("/request/prepare")
    //@RoleValidate(roleID=RoleValidConstants.ROLE_LIST, desc = RoleValidConstants.ROLE_LIST_DESC)
    public void prepareRequest(HttpServletRequest request, HttpServletResponse response) {
    	responseWithData(purchaseService.prepareRequest(parserJsonParameters(request,  false)), request, response);
    }    

    @RequestMapping("/request/approve")
    //@RoleValidate(roleID=RoleValidConstants.ROLE_LIST, desc = RoleValidConstants.ROLE_LIST_DESC)
    public void approveRequest(HttpServletRequest request, HttpServletResponse response) {
    	responseWithData(purchaseService.approveRequest(parserJsonParameters(request,  false)), request, response);
    } 
    
    @RequestMapping("/request/reject")
    //@RoleValidate(roleID=RoleValidConstants.ROLE_LIST, desc = RoleValidConstants.ROLE_LIST_DESC)
    public void rejectRequest(HttpServletRequest request, HttpServletResponse response) {
    	responseWithData(purchaseService.rejectRequest(parserJsonParameters(request,  false)), request, response);
    }
    
    @RequestMapping("/request/submit")
    //@RoleValidate(roleID=RoleValidConstants.ROLE_LIST, desc = RoleValidConstants.ROLE_LIST_DESC)
    public void submitRequest(HttpServletRequest request, HttpServletResponse response) {
    	responseWithData(purchaseService.submitRequest(parserJsonParameters(request,  false)), request, response);
    }    
    /****CRUD 采购订单********/
    
    
	public IPurchaseService getPurchaseService() {
		return purchaseService;
	}

	public void setPurchaseService(IPurchaseService purchaseService) {
		this.purchaseService = purchaseService;
	}

}
