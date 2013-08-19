package com.pms.service.service;

import java.util.Map;

public interface ISupplierService {
	
	public Map<String, Object> list(Map<String, Object> params);
	
	public Map<String, Object> update(Map<String, Object> params);
	
	public void destroy(Map<String, Object> params);
	
	public Map<String, Object> create(Map<String, Object> params);
	
    public Map<String,Object> importSupplier(String supplierName);
    
    
    public void mergeSupplierInfo(Map<String, Object> data, String refKey, String[] mergeKeys);

}
