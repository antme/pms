package com.pms.service.controller;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.pms.service.service.IAllocateService;

@Controller
@RequestMapping("/allocate")
public class AllocateController extends AbstractController {
	
	private static Logger logger = LogManager.getLogger(AllocateController.class);

    private IAllocateService allocateService;
    
    public IAllocateService getAllocateService() {
		return allocateService;
	}

	public void setAllocateService(IAllocateService allocateService) {
		this.allocateService = allocateService;
	}

	@RequestMapping("/list")
    public void list(HttpServletRequest request, HttpServletResponse response) {
    	Map<String, Object> params = this.parserJsonParameters(request, true);
    	responseWithData(allocateService.list(params), request, response);
    }
    
    @RequestMapping("/update")
    public void update(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        responseWithData(allocateService.update(params), request, response);
    }

    @RequestMapping("/destroy")
    public void destroy(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        allocateService.destroy(params);
        responseWithData(null, request, response);
    }
    
    @RequestMapping("/create")
    public void create(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        responseWithData(allocateService.create(params), request, response);
    }
}
