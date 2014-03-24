package com.pms.service.service;

import java.io.InputStream;
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
	
	public Map<String, Object> confirmShipData(Map<String, Object> params);
	
	public Map<String, Object> listShipCount(Map<String, Object> params);
	
	public Map<String, Object> doCount(Map<String, Object> params);
		
	public Map<String, Object> listCountEq(Map<String, Object> params);

    public Map<String, Object> getShipCount(Map<String, Object> params);

    public Map<String, Object> submitShipCount(Map<String, Object> params);

	public Map<String, Object> importShipHistoryData(InputStream inputStream);

	public Map<String, Object> listSettlement(Map<String, Object> params);

	public Map<String, Object> loadEqlistForSettlement(Map<String, Object> params);
	
	
	public Map<String, Object> addSettlement(Map<String, Object> params);

	public void destroySettlement(Map<String, Object> params);

	public Map<String, Object> getSettlement(Map<String, Object> params);

	public Map<String, Object> approveSettlement(Map<String, Object> params);

	public Map<String, Object> rejectSettlement(Map<String, Object> params);

}
