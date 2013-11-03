package com.pms.service.controller;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.pms.service.annotation.RoleValidConstants;
import com.pms.service.annotation.RoleValidate;
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
    @RoleValidate(roleID=RoleValidConstants.SUPPLIER_MANAGEMENT, desc = RoleValidConstants.SUPPLIER_MANAGEMENT_DESC)
    public void update(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        responseWithData(supplierService.update(params), request, response);
    }

    @RequestMapping("/destroy")
    @RoleValidate(roleID=RoleValidConstants.SUPPLIER_MANAGEMENT, desc = RoleValidConstants.SUPPLIER_MANAGEMENT_DESC)
    public void destroy(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        supplierService.destroy(params);
        responseWithData(null, request, response);
    }
    
    @RequestMapping("/create")
    @RoleValidate(roleID=RoleValidConstants.SUPPLIER_MANAGEMENT, desc = RoleValidConstants.SUPPLIER_MANAGEMENT_DESC)
    public void create(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        responseWithData(supplierService.create(params), request, response);
    }
    
    @RequestMapping("/upload")
    @RoleValidate(roleID=RoleValidConstants.SUPPLIER_MANAGEMENT, desc = RoleValidConstants.SUPPLIER_MANAGEMENT_DESC)
    public void upload(HttpServletRequest request, HttpServletResponse response) {
        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;   
        MultipartFile uploadFile = multipartRequest.getFile("files");        
        Map<String,Object> result = new HashMap<String,Object>();
        try {
            InputStream inputStream = uploadFile.getInputStream();
            Map<String,Object> map = new HashMap<String,Object>();
            map.put("inputStream", inputStream);
            supplierService.upload(map);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    

	public ISupplierService getSupplierService() {
		return supplierService;
	}

	public void setSupplierService(ISupplierService supplierService) {
		this.supplierService = supplierService;
	}
    
    
}
