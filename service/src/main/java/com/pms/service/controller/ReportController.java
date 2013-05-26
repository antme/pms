package com.pms.service.controller;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.pms.service.service.IReportService;

@Controller
@RequestMapping("/report")
public class ReportController extends AbstractController {
	
	private static Logger logger = LogManager.getLogger(ReportController.class);

    private IReportService reportService;
    

    
	public IReportService getReportService() {
		return reportService;
	}

	public void setReportService(IReportService reportService) {
		this.reportService = reportService;
	}
	
}
