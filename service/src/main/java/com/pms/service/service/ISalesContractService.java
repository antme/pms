package com.pms.service.service;

import java.util.List;
import java.util.Map;

public interface ISalesContractService {
	public Map<String, Object> listSC(Map<String, Object> params);
	
	public Map<String, Object> addSC(Map<String, Object> params);
	
	public Map<String, Object> listSCsForSelect(Map<String, Object> params);
	
	public Map<String, Object> listSCsForPurchaseBackSelect(Map<String, Object> params);


	//返回的是合并后真实的设备清单列表，EqCostListBean.EQ_LIST_REAL_AMOUNT 不为空的数据
	public Map<String, Object> listMergedEqListBySC(Map<String, Object> params);
	
	public Map<String, Object> getSC(Map<String, Object> params);
	
	public Map<String,Object> prepareInvoiceForSC(Map<String, Object> params);
	
	public Map<String, Object> addInvoiceForSC(Map<String, Object> params);
	
	public Map<String, Object> loadInvoiceForSC(Map<String, Object> params);
	
	public Map<String, Object> approveInvoiceForSC(Map<String, Object> params);
	
	public Map<String, Object> rejectInvoiceForSC(Map<String, Object> params);
	
	public Map<String, Object> listInvoiceForSC(Map<String, Object> params);
	
	public Map<String, Object> viewSC(Map<String, Object> params);
	
	public Map<String, Object> viewInvoiceForSC(Map<String, Object> params);
	
	public Map<String, Object> addMonthShipmentsForSC(Map<String, Object> params);
	
	public Map<String, Object> listMonthShipmentsForSC(Map<String, Object> params);
	
	public Map<String, Object> getRelatedProjectInfo(Map<String, Object> params);
	
	public Map<String,Object> getBaseInfoByIds(List<String> ids);
	
	public Map<String,Object> getEqBaseInfoByScIds(String id);
	
	public Map<String,Object> getEqBaseInfoByIds(String ids);
	
	public Map<String, Object> getSCAndCustomerInfo(Map<String, Object> params);
	
	public Map<String, Object> getSCeqByIds(Map<String, Object> params);
	
	public Map<String, Object> listSCByProject(Map<String, Object> params);
	
	public void mergeCommonFieldsFromSc(Map<String, Object> data, Object scId);
	
	public void mergeCommonProjectInfo(Map<String, Object> data, Object projectId);
	
	public Map<String, Object> listEqHistoryAndLatestEqList(Map<String, Object> params);
	
	public Map<String, Object> listCommerceInfoHistory(Map<String, Object> params);
	
	public Map<String, Object> importEqCostList(Map<String, Object> params);
	
	public Map<String, Object> importEqHistoryExcleFile(Map<String, Object> params);
	///
	public Map<String, Object> saveGetMoneyForSC(Map<String, Object> params);
	
	public Map<String, Object> listGetMoneyForSC(Map<String, Object> params);	
	
	public void destoryGetMoney(Map<String,Object> params);
	
	public Map<String, Object> setSCRunningStatus(Map<String, Object> params);
	
	public Map<String, Object> setSCArchiveStatusStatus(Map<String, Object> params);
	
    public List<Map<String, Object>> mergeEqListBasicInfo(Object eqList);
    
    public Map<String, Object> importSCExcleFile(Map<String, Object> params);

    
	public Map<String, Object> getCustomerBySC(Map<String, Object> params);

	public void clearEqCost(); 

}
