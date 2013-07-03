package com.pms.service.service;

import java.util.Map;

public interface IPurchaseService {
	
	//--------备货API---------
	/**初始化备货申请添加页面*/
	public Map<String,Object> prepareBack(Map<String,Object> params);
	/**加载备货申请详情*/
	public Map<String,Object> loadBack(Map<String,Object> params);
	/**保存备货申请*/
	public Map<String,Object> saveBack(Map<String,Object> params);
	/**提交备货申请*/
	public Map<String,Object> submitBack(Map<String,Object> params);
	/**中止备货申请*/
	public Map<String,Object> pendingBack(Map<String,Object> params);
	/**删除*/
	public void destoryBack(Map<String,Object> params);
	/**列出所有备货申请*/
	public Map<String,Object> listAllBack(Map<String,Object> params);
	/**列出采购已审核的备货申请 (包括已审核，调拨中，已调拨，已采购申请)*/
	public Map<String,Object> listCheckedBack(Map<String,Object> params);
	/**列出已调拨的备货申请*/
	public Map<String,Object> listAllot(Map<String,Object> params);	

	//--------调拨API---------
	public Map<String, Object> prepareAllot(Map<String, Object> params);
	/**提交*/
	public Map<String,Object> submitAllot(Map<String,Object> params);		
	/**批准*/
	public Map<String,Object> approveAllot(Map<String,Object> params);
	/**拒绝*/
	public Map<String,Object> rejectAllot(Map<String,Object> params);
	/**加载详情*/
	public Map<String,Object> loadAllot(Map<String,Object> params);	
	
	
	/**根据合同id获取调拨清单列表*/
	public Map<String,Double> getAllotEqCountBySalesContractId(String saleId);
	/**根据合同id获取备货清单列表*/
	public Map<String,Double> getBackEqCountBySalesContractId(String saleId);
	
	//选择销售合同，如果已经有备货申请则过滤掉
    public Map<String, Object> listSCsForSelect(Map<String, Object> params);
    
    
    //根据查询出一批设备清单，计算其中某个字段的总数, 数据格式必须是collection中有eqcostList属性的collection
    public Map<String, Integer> countEqByKey(Map<String, Object> query, String db, String queryKey, Map<String, Integer> count);
    
    
    //根据备货申请id查询此备货下面可用的采购申请数量和调拨数量
    public Map<String, Integer> countRestEqByBackId(String backId);
    

}
