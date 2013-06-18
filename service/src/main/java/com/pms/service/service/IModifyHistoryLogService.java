package com.pms.service.service;

import java.util.Map;

public interface IModifyHistoryLogService {
	
	public void addModifyHistoryLog(Map<String, Object> map, String[] logField, String dbbean);
}
