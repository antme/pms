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
import com.pms.service.service.ICustomerService;

@Controller
@RequestMapping("/customer")
@RoleValidate()
public class CustomerController extends AbstractController {

	private static Logger logger = LogManager.getLogger(UserController.class);
	
 	private ICustomerService customerService;
	
    @RequestMapping("/create")
    @RoleValidate(roleID=RoleValidConstants.CUSTOMER_MANAGEMENT, desc = RoleValidConstants.CUSTOMER_MANAGEMENT_DESC)
    public void addUser(HttpServletRequest request, HttpServletResponse response) {
    	Map<String,Object> obj = parserJsonParameters(request,  false);
    	responseWithData(customerService.create(obj), request, response, "add_success");
    }
    
    @RequestMapping("/get")
    public void getCustomer(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(customerService.get(parserJsonParameters(request,  false)), request, response);
    }

    @RequestMapping("/destroy")
    @RoleValidate(roleID=RoleValidConstants.CUSTOMER_MANAGEMENT, desc = RoleValidConstants.CUSTOMER_MANAGEMENT_DESC)
    public void deleteUser(HttpServletRequest request, HttpServletResponse response) {
    	customerService.destroy(parserJsonParameters(request,  false));
    	responseWithData(null, request, response);
    }	
    
    @RequestMapping("/update")
    @RoleValidate(roleID=RoleValidConstants.CUSTOMER_MANAGEMENT, desc = RoleValidConstants.CUSTOMER_MANAGEMENT_DESC)
    public void updateUser(HttpServletRequest request, HttpServletResponse response) {
    	Map<String,Object> obj = customerService.update(parserJsonParameters(request,  false));
    	responseWithData(obj, request, response, "update_success");
    }
    
    @RequestMapping("/list")
    public void listUsers(HttpServletRequest request, HttpServletResponse response) {
    	responseWithData(customerService.list(parserJsonParameters(request,  false)), request, response);
    }

	public ICustomerService getCustomerService() {
		return customerService;
	}

	public void setCustomerService(ICustomerService customerService) {
		this.customerService = customerService;
	}
}
