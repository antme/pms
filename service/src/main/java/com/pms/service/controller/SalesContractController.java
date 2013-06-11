package com.pms.service.controller;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.pms.service.service.ISalesContractService;

@Controller
@RequestMapping("/sc")
public class SalesContractController extends AbstractController {
	
	private static Logger logger = LogManager.getLogger(SalesContractController.class);

    private ISalesContractService salesContractService;
    
    @RequestMapping("/list")
    public void listSCs(HttpServletRequest request, HttpServletResponse response) {
    	Map<String, Object> params = this.parserJsonParameters(request, true);
    	responseWithData(salesContractService.listSC(params), request, response);
    }
    
    @RequestMapping("/listforselect")
    public void listSCsForSelect(HttpServletRequest request, HttpServletResponse response) {
    	Map<String, Object> params = this.parserJsonParameters(request, true);
    	responseWithData(salesContractService.listSCsForSelect(params), request, response);
    }
    
    @RequestMapping("/eqlist")
    public void listEquipmentListBySC(HttpServletRequest request, HttpServletResponse response) {
    	Map<String, Object> params = this.parserJsonParameters(request, false);
    	responseWithData(salesContractService.listEqListBySC(params), request, response);
    }
    
    @RequestMapping("/add")
    public void addSC(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        responseWithData(salesContractService.addSC(params), request, response);
    }
    
    @RequestMapping("/update")
    public void updateSC(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        responseWithData(salesContractService.addSC(params), request, response);
    }
    
    @RequestMapping("/get")
    public void getSC(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        responseWithData(salesContractService.getSC(params), request, response);
    }
    

	public ISalesContractService getSalesContractService() {
		return salesContractService;
	}

	public void setSalesContractService(ISalesContractService salesContractService) {
		this.salesContractService = salesContractService;
	}
    
    
    
}
