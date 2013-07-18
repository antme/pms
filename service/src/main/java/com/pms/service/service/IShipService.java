package com.pms.service.service;

import java.util.Map;

public interface IShipService {
	
	public Map<String, Object> get(Map<String, Object> params);
	
	public Map<String, Object> list(Map<String, Object> params);
	
	public Map<String, Object> update(Map<String, Object> params);
	
	public void destroy(Map<String, Object> params);
	
	public Map<String, Object> create(Map<String, Object> params);

	public Map<String, Object> eqlist(Map<String, Object> params);
		
	public Map<String, Object> approve(Map<String, Object> params);
	
	public Map<String, Object> submit(Map<String, Object> params);
	
	public Map<String, Object> reject(Map<String, Object> params);
	
	public Map<String, Object> record(Map<String, Object> params);
	
	public Map<String, Object> listShipCount(Map<String, Object> params);
}
