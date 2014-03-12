package com.pms.service.controller;

import java.io.IOException;
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

import com.pms.service.annotation.LoginRequired;
import com.pms.service.annotation.RoleValidConstants;
import com.pms.service.annotation.RoleValidate;
import com.pms.service.service.IShipService;

@Controller
@RequestMapping("/ship")
@RoleValidate
@LoginRequired
public class ShipController extends AbstractController {
	
	private static Logger logger = LogManager.getLogger(ShipController.class);

    private IShipService shipService;
    
    public IShipService getShipService() {
		return shipService;
	}

	public void setShipService(IShipService shipService) {
		this.shipService = shipService;
	}

	@RequestMapping("/get")
    public void get(HttpServletRequest request, HttpServletResponse response) {
    	Map<String, Object> params = this.parserJsonParameters(request, true);
    	responseWithData(shipService.get(params), request, response);
    }
    
	@RequestMapping("/list")
    public void list(HttpServletRequest request, HttpServletResponse response) {
    	Map<String, Object> params = this.parserJsonParameters(request, true);
    	responseWithData(shipService.list(params), request, response);
    }
    
    @RequestMapping("/update")
    @RoleValidate(roleID=RoleValidConstants.SHIP_MANAGEMENT, desc = RoleValidConstants.SHIP_MANAGEMENT_DESC)
    public void update(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        responseWithData(shipService.update(params), request, response);
    }

    @RequestMapping("/destroy")
    @RoleValidate(roleID=RoleValidConstants.SHIP_MANAGEMENT, desc = RoleValidConstants.SHIP_MANAGEMENT_DESC)
    public void destroy(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        shipService.destroy(params);
        responseWithData(null, request, response);
    }
    
    @RequestMapping("/create")
    @RoleValidate(roleID=RoleValidConstants.SHIP_MANAGEMENT, desc = RoleValidConstants.SHIP_MANAGEMENT_DESC)
    public void create(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        responseWithData(shipService.create(params), request, response);
    }

    @RequestMapping("/submit")
    @RoleValidate(roleID=RoleValidConstants.SHIP_MANAGEMENT, desc = RoleValidConstants.SHIP_MANAGEMENT_DESC)
    public void submit(HttpServletRequest request, HttpServletResponse response) {
    	responseWithData(shipService.submit(parserJsonParameters(request, false)), request, response);
    }
    
    @RequestMapping("/approve")
    @RoleValidate(roleID=RoleValidConstants.SHIP_MANAGEMENT_PROCESS, desc = RoleValidConstants.SHIP_MANAGEMENT_PROCESS_DESC)
    public void approve(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(shipService.approve(parserJsonParameters(request, false)), request, response);
    }
    
    @RequestMapping("/finalapprove")
    @RoleValidate(roleID=RoleValidConstants.SHIP_MANAGEMENT_FINAL_PROCESS, desc = RoleValidConstants.SHIP_MANAGEMENT_FINAL_PROCESS_DESC)
    public void finalApprove(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(shipService.approve(parserJsonParameters(request, false)), request, response);
    }
    
    @RequestMapping("/reject")
    @RoleValidate(roleID=RoleValidConstants.SHIP_MANAGEMENT_PROCESS, desc = RoleValidConstants.SHIP_MANAGEMENT_PROCESS_DESC)
    public void reject(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(shipService.reject(parserJsonParameters(request, false)), request, response);
    }
    
    @RequestMapping("/finalreject")
    @RoleValidate(roleID=RoleValidConstants.SHIP_MANAGEMENT_FINAL_PROCESS, desc = RoleValidConstants.SHIP_MANAGEMENT_FINAL_PROCESS_DESC)
    public void finalReject(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(shipService.reject(parserJsonParameters(request, false)), request, response);
    }
    
    @RequestMapping("/eqlist")
    public void eqlist(HttpServletRequest request, HttpServletResponse response) {
    	Map<String, Object> params = this.parserJsonParameters(request, true);
    	responseWithData(shipService.eqlist(params), request, response);
    }
    
    @RequestMapping("/record")
    @RoleValidate(roleID=RoleValidConstants.SHIP_ARRIVAL_RECORD, desc = RoleValidConstants.SHIP_ARRIVAL_RECORD_DESC)
    public void record(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        responseWithData(shipService.confirmShipData(params), request, response);
    }
    
    @RequestMapping("/count/list")
    public void listShipCount(HttpServletRequest request, HttpServletResponse response) {
    	Map<String, Object> params = this.parserJsonParameters(request, true);
    	responseWithData(shipService.listShipCount(params), request, response);
    }
    
    @RequestMapping("/count/submit")
    public void doCount(HttpServletRequest request, HttpServletResponse response) {
    	Map<String, Object> params = parserJsonParameters(request, false);
        responseWithData(shipService.submitShipCount(params), request, response);
    }
    
    @RequestMapping("/count/eqlist")
    public void listCountEq(HttpServletRequest request, HttpServletResponse response) {
    	Map<String, Object> params = parserJsonParameters(request, false);
        responseWithData(shipService.listCountEq(params), request, response);
    }
    
    @RequestMapping("/count/get")
    public void getShipCount(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        responseWithData(shipService.getShipCount(params), request, response);
    }
    
    
    @RequestMapping("/importship")
    //@RoleValidate(roleID=RoleValidConstants.SALES_CONTRACT_ADD, desc = RoleValidConstants.SALES_CONTRACT_ADD_DESC)
    public void importShipHistoryData(HttpServletRequest request, HttpServletResponse response){
        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;   
        MultipartFile uploadFile = multipartRequest.getFile("shipFile");        
        Map<String,Object> result = new HashMap<String,Object>();
//        try {
//			result = shipService.importShipHistoryData(uploadFile.getInputStream());
//		} catch (IOException e) {
//			e.printStackTrace();
//		}
        
    	responseWithData(result, request, response);
    }  
    
}
