package com.pms.service.service;

import java.util.Map;

public interface ISalesContractService {
	public Map<String, Object> listSC(Map<String, Object> params);
	
	public Map<String, Object> addSC(Map<String, Object> params);
	
	public Map<String, Object> listSCsForSelect(Map<String, Object> params);
	
	public Map<String, Object> listEquipmentsForSC(Map<String, Object> params);
}
