package com.pms.service.service;

import java.util.Map;

public interface IShipService {
	
	public Map<String, Object> list(Map<String, Object> params);
	
	public Map<String, Object> update(Map<String, Object> params);
	
	public void destroy(Map<String, Object> params);
	
	public Map<String, Object> create(Map<String, Object> params);

	public Map<String, Object> eqlist(Map<String, Object> params);
}
