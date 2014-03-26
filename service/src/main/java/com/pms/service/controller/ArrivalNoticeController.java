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
import com.pms.service.service.IArrivalNoticeService;

@Controller
@RequestMapping("/arrivalNotice")
@RoleValidate
@LoginRequired
public class ArrivalNoticeController extends AbstractController {
	
	private static Logger logger = LogManager.getLogger(ArrivalNoticeController.class);

    private IArrivalNoticeService arrivalNoticeService;

	public IArrivalNoticeService getArrivalNoticeService() {
		return arrivalNoticeService;
	}

	public void setArrivalNoticeService(IArrivalNoticeService arrivalNoticeService) {
		this.arrivalNoticeService = arrivalNoticeService;
	}

	@RequestMapping("/list")
    public void list(HttpServletRequest request, HttpServletResponse response) {
    	Map<String, Object> params = this.parserJsonParameters(request, true);
    	responseWithData(arrivalNoticeService.list(params), request, response);
    }
	

	@RequestMapping("/get")
    public void getArrivalNotice(HttpServletRequest request, HttpServletResponse response) {
    	Map<String, Object> params = this.parserJsonParameters(request, true);
    	responseWithData(arrivalNoticeService.getArrivalNotice(params), request, response);
    }

    @RequestMapping("/canshipeq/list")
    public void eqlist(HttpServletRequest request, HttpServletResponse response) {
    	Map<String, Object> params = this.parserJsonParameters(request, true);
    	responseWithData(arrivalNoticeService.listCanShipEq(params), request, response);
    }
    
    @RequestMapping("/project/list")
    public void listProjectsForSelect(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        responseWithData(arrivalNoticeService.listProjectsForSelect(params), request, response);
    }

    
    @RequestMapping("/create/byorder")
    @RoleValidate(roleID=RoleValidConstants.PURCHASE_ORDER_ARRIVAL_NOTICE, desc = RoleValidConstants.PURCHASE_ORDER_ARRIVAL_NOTICE_DESC)
    public void createByOrder(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        responseWithData(arrivalNoticeService.createByOrder(params), request, response);
    }
    
    
    
    @RequestMapping("/order/eqlist")
    public void loadArrivalEqListByOrder(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        responseWithData(arrivalNoticeService.loadArrivalEqListByOrder(params), request, response);
    }
}
