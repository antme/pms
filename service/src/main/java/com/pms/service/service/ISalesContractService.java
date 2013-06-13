package com.pms.service.service;

import java.util.List;
import java.util.Map;

public interface ISalesContractService {
	public Map<String, Object> listSC(Map<String, Object> params);
	
	public Map<String, Object> addSC(Map<String, Object> params);
	
	public Map<String, Object> listSCsForSelect(Map<String, Object> params);

	public Map<String, Object> listEqListBySC(Map<String, Object> params);
	
	public Map<String, Object> getSC(Map<String, Object> params);
	
	public Map<String, Object> addInvoiceForSC(Map<String, Object> params);
	
	public Map<String, Object> listInvoiceForSC(Map<String, Object> params);
	
	public Map<String, Object> addGotMoneyForSC(Map<String, Object> params);
	
	public Map<String, Object> listGotMoneyForSC(Map<String, Object> params);
	
	public Map<String, Object> addMonthShipmentsForSC(Map<String, Object> params);
	
	public Map<String, Object> listMonthShipmentsForSC(Map<String, Object> params);
	
	public Map<String, Object> getRelatedProjectInfo(Map<String, Object> params);
	
	public Map<String,Object> getBaseInfoByIds(List<String> ids);
	
	public Map<String,Object> getEqBaseInfoBySalesContractIds(String id);
	
	public Map<String,Object> getEqBaseInfoByIds(String ids);
	
	public Map<String, Object> getSCAndCustomerInfo(Map<String, Object> params);
}
