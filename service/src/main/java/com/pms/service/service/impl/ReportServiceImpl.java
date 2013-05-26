package com.pms.service.service.impl;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.pms.service.service.AbstractService;
import com.pms.service.service.IReportService;

public class ReportServiceImpl extends AbstractService implements IReportService  {
	
	private static final Logger logger = LogManager.getLogger(ReportServiceImpl.class);

	@Override
	public String geValidatorFileName() {
		return null;
	}
	

	
}
