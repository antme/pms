package com.pms.service.service;

import java.util.Map;

public interface IArrivalNoticeService {
	
	public Map<String, Object> list(Map<String, Object> params);
	
	public Map<String, Object> update(Map<String, Object> params);
	
	public void destroy(Map<String, Object> params);
	
    public Map<String, Object> listProjectsForSelect(Map<String, Object> params);
    
    public Map<String, Object> listEqListByScIDForShip(Object scId);
    
    public Map<String, Object> listByScIdForBorrowing(Object scId);
    
    public Map<String, Object> listCanShipEq(Map<String, Object> params);
    
    public Map<String, Object> createByOrder(Map<String, Object> params);

	public Map<String, Object> createByAllocate(Map<String, Object> params);

    public Map<String, Object> loadArrivalEqListByOrder(Map<String, Object> params);
    
}

