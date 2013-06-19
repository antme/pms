package com.pms.service.service;

import java.util.List;
import java.util.Map;

public interface IShipService {
	
	public Map<String, Object> get(Map<String, Object> params);
	
	public Map<String, Object> list(Map<String, Object> params);
	
	public Map<String, Object> update(Map<String, Object> params);
	
	public void destroy(Map<String, Object> params);
	
	public Map<String, Object> create(Map<String, Object> params);

	public Map<String, Object> eqlist(Map<String, Object> params);
	
	public List<Map<String,Object>> shipedList(String saleId);

	public Map<String, Object> option(Map<String, Object> params);
}
