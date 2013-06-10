package com.pms.service.controller;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.pms.service.service.IShipService;

@Controller
@RequestMapping("/ship")
public class ShipController extends AbstractController {
	
	private static Logger logger = LogManager.getLogger(ShipController.class);

    private IShipService shipService;
    
    public IShipService getShipService() {
		return shipService;
	}

	public void setShipService(IShipService shipService) {
		this.shipService = shipService;
	}

	@RequestMapping("/list")
    public void list(HttpServletRequest request, HttpServletResponse response) {
    	Map<String, Object> params = this.parserJsonParameters(request, true);
    	responseWithData(shipService.list(params), request, response);
    }
    
    @RequestMapping("/update")
    public void update(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        responseWithData(shipService.update(params), request, response);
    }

    @RequestMapping("/destroy")
    public void destroy(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        shipService.destroy(params);
        responseWithData(null, request, response);
    }
    
    @RequestMapping("/create")
    public void create(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        responseWithData(shipService.create(params), request, response);
    }
}
