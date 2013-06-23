package com.pms.service.service;

import java.util.Map;

public interface IReturnService {
	
	public Map<String, Object> get(Map<String, Object> params);
	
	public Map<String, Object> list(Map<String, Object> params);
	
	public Map<String, Object> create(Map<String, Object> params);
	
	public Map<String, Object> option(Map<String, Object> params);
}
