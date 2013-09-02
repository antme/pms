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
	/**初审通过备货申请*/
	public Map<String, Object> approveBack(Map<String, Object> params);
	/**初审退回备货申请*/
	public Map<String, Object> rejectBack(Map<String, Object> params);
	/**中止备货申请*/
	public Map<String,Object> pendingBack(Map<String,Object> params);
	/**删除*/
	public void destoryBack(Map<String,Object> params);
	/**列出备货申请，依据角色*/
	public Map<String,Object> listBack(Map<String,Object> params);	
	/**列出所有备货申请*/
	public Map<String,Object> listAllBack(Map<String,Object> params);
	/**列出已审核的备货申请 (包括已审核，调拨中，已调拨，已采购申请)*/
	public Map<String,Object> listCheckedBack(Map<String,Object> params);
	/**列出已调拨的备货申请*/
	public Map<String,Object> listAllot(Map<String,Object> params);	

	//--------调拨API---------
	public Map<String, Object> prepareAllot(Map<String, Object> params);
	/**提交*/
	public Map<String,Object> submitAllot(Map<String,Object> params);		
	/**初审 终审*/
	public Map<String,Object> approveAllot(Map<String,Object> params);
	/**拒绝*/
	public Map<String,Object> rejectAllot(Map<String,Object> params);
	/**加载详情*/
	public Map<String,Object> loadAllot(Map<String,Object> params);	
	

    public Map<String, Object> mergeBackRestEqCount(Map<String, Object> back);
        
    //根据备货申请id查询此备货下面可用的采购申请数量和调拨数量
    public Map<String, Integer> countRestEqByBackId(String backId);
    
    public Map<String, Object> checkEqCountForAllot(Map<String, Object> params);
    
    

}
