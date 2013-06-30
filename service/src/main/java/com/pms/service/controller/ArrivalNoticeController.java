package com.pms.service.controller;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.pms.service.annotation.LoginRequired;
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
    
    @RequestMapping("/create")
    public void create(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        responseWithData(arrivalNoticeService.create(params), request, response);
    }
}
