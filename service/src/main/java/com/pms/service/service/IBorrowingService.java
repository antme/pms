package com.pms.service.service;

import java.util.Map;

public interface IBorrowingService {
	
	public Map<String, Object> get(Map<String, Object> params);
	
	public Map<String, Object> list(Map<String, Object> params);
	
	public Map<String, Object> update(Map<String, Object> params);
	
	public void destroy(Map<String, Object> params);
	
	public Map<String, Object> create(Map<String, Object> params);

	public Map<String, Object> eqlist(Map<String, Object> params);
	
	public Map<String, Object> option(Map<String, Object> params);
	
	public Map<String, Object> listScByProjectForBorrowing(Map<String, Object> params);
	
	public Map<String, Object> listProjectForBorrowing(Map<String, Object> params);

	public Map<String, Object> searchBorrowing(Map<String, Object> params);

	public Map<String, Object> approveBorrowing(Map<String, Object> params);

	public Map<String, Object> submitBorrowingReturn(Map<String, Object> params);
}
