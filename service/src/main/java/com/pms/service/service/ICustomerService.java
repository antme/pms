package com.pms.service.service;

import java.util.Map;

public interface ICustomerService {
    
	public String create(Map<String,Object> params);
	
	public void update(Map<String,Object> params);
	
	public void destroy(Map<String,Object> params);
	
	public Map<String,Object> list(Map<String,Object> params);
	
}
