package com.pms.service.controller;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.pms.service.service.ISupplierService;

@Controller
@RequestMapping("/suppliers")
public class SupplierController extends AbstractController {
	
	private static Logger logger = LogManager.getLogger(SupplierController.class);

    private ISupplierService supplierService;
    
    @RequestMapping("/list")
    public void list(HttpServletRequest request, HttpServletResponse response) {
    	Map<String, Object> params = this.parserJsonParameters(request, true);
    	responseWithData(supplierService.list(params), request, response);
    }
    
    @RequestMapping("/update")
    public void update(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        responseWithData(supplierService.update(params), request, response);
    }

    @RequestMapping("/destroy")
    public void destroy(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        supplierService.destroy(params);
        responseWithData(null, request, response);
    }
    
    @RequestMapping("/create")
    public void create(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        responseWithData(supplierService.create(params), request, response);
    }
    

	public ISupplierService getSupplierService() {
		return supplierService;
	}

	public void setSupplierService(ISupplierService supplierService) {
		this.supplierService = supplierService;
	}
    
    
}
