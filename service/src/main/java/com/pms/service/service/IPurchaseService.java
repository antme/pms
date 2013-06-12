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
	/**批准审核备货申请，已提交=》已批准=》已审核=》调拨中=》已调拨*/
	public Map<String,Object> approveBack(Map<String,Object> params);
	/**拒绝备货申请*/
	public Map<String,Object> rejectAllot(Map<String,Object> params);
	/**中止备货申请*/
	public Map<String,Object> pendingBack(Map<String,Object> params);
	/**列出所有备货申请*/
	public Map<String,Object> listAllBack(Map<String,Object> params);
	/**列出采购已审核的备货申请 (包括已审核，调拨中，已调拨，已采购申请)*/
	public Map<String,Object> listCheckedBack(Map<String,Object> params);
	/**列出已调拨的备货申请*/
	public Map<String,Object> listAllot(Map<String,Object> params);	
	/**删除*/
	public void destoryBack(Map<String,Object> params);
	/**提交调拨申请*/
	public Map<String,Object> submitAllot(Map<String,Object> params);	
	/**仓库管理员完成调拨申请，输入可调拨货物数字，0--备货数*/
	public Map<String,Object> approveAllot(Map<String,Object> params);	
	/**加载备货申请详情*/
	public Map<String,Object> loadAllot(Map<String,Object> params);	
}
