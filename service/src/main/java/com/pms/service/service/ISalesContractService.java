package com.pms.service.service;

import java.util.List;
import java.util.Map;

public interface ISalesContractService {
	public Map<String, Object> listSC(Map<String, Object> params);
	
	public Map<String, Object> addSC(Map<String, Object> params);
	
	public Map<String, Object> listSCsForSelect(Map<String, Object> params);

	
	//返回的是合并后真实的设备清单列表，EqCostListBean.EQ_LIST_REAL_AMOUNT 不为空的数据
	public Map<String, Object> listMergedEqListBySC(Map<String, Object> params);
	
	public Map<String, Object> getSC(Map<String, Object> params);
	
	public Map<String,Object> prepareInvoiceForSC(Map<String, Object> params);
	
	public Map<String, Object> addInvoiceForSC(Map<String, Object> params);
	
	public Map<String, Object> loadInvoiceForSC(Map<String, Object> params);
	
	public Map<String, Object> approveInvoiceForSC(Map<String, Object> params);
	
	public Map<String, Object> managerRejectInvoiceForSC(Map<String, Object> params);
	
	public Map<String, Object> finRejectInvoiceForSC(Map<String, Object> params);
	
	public Map<String, Object> listInvoiceForSC(Map<String, Object> params);
	
	public Map<String, Object> addMonthShipmentsForSC(Map<String, Object> params);
	
	public Map<String, Object> listMonthShipmentsForSC(Map<String, Object> params);
	
	public Map<String, Object> getRelatedProjectInfo(Map<String, Object> params);
	
	public Map<String,Object> getBaseInfoByIds(List<String> ids);
	
	public Map<String,Object> getEqBaseInfoBySalesContractIds(String id);
	
	public Map<String,Object> getEqBaseInfoByIds(String ids);
	
	public Map<String, Object> getSCAndCustomerInfo(Map<String, Object> params);
	
	public Map<String, Object> getSCeqByIds(Map<String, Object> params);
	
	public Map<String, Object> listSCByProject(Map<String, Object> params);
	
	public void mergeCommonFieldsFromSc(Map<String, Object> data, Object scId);
	
	public Map<String, Object> listEqHistoryAndLatestEqList(Map<String, Object> params);
	
	public Map<String, Object> importEqCostList(Map<String, Object> params);
	///
	public Map<String, Object> saveGetMoneyForSC(Map<String, Object> params);
	
	public Map<String, Object> listGetMoneyForSC(Map<String, Object> params);	
	
	public void destoryGetMoney(Map<String,Object> params);
	
	public Map<String, Object> setSCRunningStatus(Map<String, Object> params);
	
	public Map<String, Object> setSCArchiveStatusStatus(Map<String, Object> params);
}
