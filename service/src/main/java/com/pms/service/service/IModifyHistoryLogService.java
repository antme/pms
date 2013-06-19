package com.pms.service.service;

import java.util.List;
import java.util.Map;

public interface IModifyHistoryLogService {
	
	public Map<String, Object> listHistoryByCollectionAndId(String collection,String id, List<String> keys);
	
	public Map<String, Object> listHistoryForAKey(String collection,String id, String key);
	
	public List<Map<String, Object>> listHistoryBySonCollectionAndId(String sonCollection,String foreignName,String foreignValue, List<String> keys);
}
