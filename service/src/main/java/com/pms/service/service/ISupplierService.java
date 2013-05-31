package com.pms.service.service;

import java.util.Map;

public interface ISupplierService {
	
	public Map<String, Object> list(Map<String, Object> params);
	
	public Map<String, Object> update(Map<String, Object> params);
	
	public Map<String, Object> destroy(Map<String, Object> params);
	
	public Map<String, Object> create(Map<String, Object> params);
}
