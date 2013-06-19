package com.pms.service.controller;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.pms.service.mockbean.ApiConstants;
import com.pms.service.mockbean.DBBean;
import com.pms.service.mockbean.SalesContractBean;
import com.pms.service.service.IModifyHistoryLogService;

@Controller
@RequestMapping("/history")
public class UpdateHistoryController extends AbstractController {
	
	private static Logger logger = LogManager.getLogger(UpdateHistoryController.class);
	
	private IModifyHistoryLogService historyService;

    @RequestMapping("/sc/amount")
    public void listHistoryForSCAmount(HttpServletRequest request, HttpServletResponse response) {
    	Map<String, Object> params = this.parserJsonParameters(request, true);
    	responseWithData(historyService.listHistoryForAKey(DBBean.SALES_CONTRACT, (String)params.get(ApiConstants.MONGO_ID), 
    			SalesContractBean.SC_AMOUNT), request, response);
    }

	public IModifyHistoryLogService getHistoryService() {
		return historyService;
	}

	public void setHistoryService(IModifyHistoryLogService historyService) {
		this.historyService = historyService;
	}

}
