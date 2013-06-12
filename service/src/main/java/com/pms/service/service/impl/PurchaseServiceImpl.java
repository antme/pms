package com.pms.service.service.impl;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.ejb.EnterpriseBean;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.google.gson.Gson;
import com.mongodb.Mongo;
import com.pms.service.dbhelper.DBQuery;
import com.pms.service.dbhelper.DBQueryOpertion;
import com.pms.service.mockbean.ApiConstants;
import com.pms.service.mockbean.CustomerBean;
import com.pms.service.mockbean.DBBean;
import com.pms.service.mockbean.EqCostListBean;
import com.pms.service.mockbean.ProjectBean;
import com.pms.service.mockbean.PurchaseBack;
import com.pms.service.mockbean.SalesContractBean;
import com.pms.service.mockbean.PurchaseRequestBean;
import com.pms.service.mockbean.UserBean;
import com.pms.service.service.AbstractService;
import com.pms.service.service.IPurchaseService;
import com.pms.service.service.ISalesContractService;
import com.pms.service.util.ApiUtil;

public class PurchaseServiceImpl extends AbstractService implements IPurchaseService {

    private static final Logger logger = LogManager.getLogger(PurchaseServiceImpl.class);
	
    private ISalesContractService salesContractService;
    
    @Override
	public Map<String, Object> prepareBack(Map<String, Object> params) {
		Map<String,Object> request = new LinkedHashMap<String,Object>();
		request.put(PurchaseBack.status, PurchaseStatus.unsaved.toString());
		request.put(PurchaseBack.salesContract_id, params.get(PurchaseBack.salesContract_id));
		mergeSalesContract(request);
		mergeEqcost(request);
		return request;
	}

	@Override
	public Map<String, Object> loadBack(Map<String, Object> params) {
		Map<String,Object> request = dao.findOne(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID), DBBean.PURCHASE_BACK);
		mergeSalesContract(request);
		mergeEqcost(request);
		return request;
	}

	@Override
	public Map<String, Object> saveBack(Map<String, Object> params) {
		Map<String,Object> newObj = new HashMap<String,Object>();
		newObj.put(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID));
		newObj.put(PurchaseBack.department, params.get(PurchaseBack.department));
		newObj.put(PurchaseBack.type, params.get(PurchaseBack.type));
		newObj.put(PurchaseBack.comment, params.get(PurchaseBack.comment));
		newObj.put(PurchaseBack.planDate, params.get(PurchaseBack.planDate));
		newObj.put(PurchaseBack.salesContract_id, params.get(PurchaseBack.salesContract_id));
		newObj.put(PurchaseBack.status, PurchaseStatus.saved.toString());
		newObj.put(PurchaseBack.operateDate, new Date());
		newObj.put(PurchaseBack.planDate, params.get(PurchaseBack.planDate));
		newObj.put(PurchaseBack.code, produceCode("pb"));
		newObj.putAll(countEqcostList(params));
		if(params.get(ApiConstants.MONGO_ID) == null){
			return dao.add(newObj, DBBean.PURCHASE_BACK);
		}else{
			return dao.updateById(newObj, DBBean.PURCHASE_BACK);
		}
		
	}

	@Override
	public Map<String, Object> submitBack(Map<String, Object> params) {
		Map<String,Object> newObj = new HashMap<String,Object>();
		newObj.put(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID));
		newObj.put(PurchaseBack.department, params.get(PurchaseBack.department));
		newObj.put(PurchaseBack.type, params.get(PurchaseBack.type));
		newObj.put(PurchaseBack.comment, params.get(PurchaseBack.comment));
		newObj.put(PurchaseBack.planDate, params.get(PurchaseBack.planDate));
		newObj.put(PurchaseBack.salesContract_id, params.get(PurchaseBack.salesContract_id));
		newObj.put(PurchaseBack.status, PurchaseStatus.submited.toString());
		newObj.put(PurchaseBack.submitDate, new Date());
		newObj.put(PurchaseBack.operateDate, new Date());
		if(params.get(PurchaseBack.code) == null) newObj.put(PurchaseBack.code, produceCode("pb"));
		newObj.putAll(countEqcostList(params));
		dao.updateCount(ApiConstants.MONGO_ID, params.get(PurchaseBack.salesContract_id), SalesContractBean.SC_BACK_REQUEST_COUNT, DBBean.SALES_CONTRACT, 1);
		if(params.get(ApiConstants.MONGO_ID) == null){
			return dao.add(newObj, DBBean.PURCHASE_BACK);
		}else{
			return dao.updateById(newObj, DBBean.PURCHASE_BACK);
		}
	}
	@Deprecated
	@Override
	public Map<String, Object> approveBack(Map<String, Object> params) {
		Map<String,Object> obj = dao.findOne(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID), new String[]{PurchaseBack.status}, DBBean.PURCHASE_BACK);
		String status = String.valueOf(obj.get(PurchaseBack.status));
		if(PurchaseStatus.approved.toString().equals(status)){
			status = PurchaseStatus.checked.toString();
			obj.put(PurchaseBack.code, produceCode("pb"));
		}else {
			status = PurchaseStatus.approved.toString();
		}
		obj.put(PurchaseBack.status, status);
		obj.put(PurchaseBack.operateDate, new Date());
		obj.put(PurchaseBack.approveDate, new Date());
		return dao.updateById(obj, DBBean.PURCHASE_BACK);
	}

	@Override
	public Map<String, Object> rejectAllot(Map<String, Object> params) {
		Map<String,Object> obj = new HashMap<String,Object>();
		obj.put(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID));
		obj.put(PurchaseBack.status, PurchaseStatus.rejected.toString());
		obj.put(PurchaseBack.operateDate, new Date());
		return dao.updateById(obj, DBBean.PURCHASE_ALLOCATE);
	}

	@Override
	public Map<String, Object> pendingBack(Map<String, Object> params) {
		Map<String,Object> obj = new HashMap<String,Object>();
		obj.put(PurchaseBack.status, PurchaseStatus.interruption.toString());
		obj.put(PurchaseBack.operateDate, new Date());
		return dao.updateById(obj, DBBean.PURCHASE_BACK);
	}

	///////////////////////////allot 调拨///////////
	@Override
	public Map<String, Object> submitAllot(Map<String, Object> params) {
		Map<String,Object> back = dao.findOne(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID), DBBean.PURCHASE_BACK);
		Map<String,Object> obj = new HashMap<String,Object>();
		obj.put(PurchaseBack.salesContract_id, back.get(PurchaseBack.salesContract_id));
		obj.put(PurchaseBack.purchaseBack_id, params.get(ApiConstants.MONGO_ID));
		obj.put(PurchaseBack.status, PurchaseStatus.submited.toString());
		obj.put(PurchaseBack.code, produceCode("pa"));
		return dao.add(obj, DBBean.PURCHASE_ALLOCATE);
	}

	public Map<String, Object> loadAllot(Map<String, Object> params) {
		Map<String,Object> allot = dao.findOne(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID), DBBean.PURCHASE_ALLOCATE);
		String backId = (String)allot.get(PurchaseBack.purchaseBack_id);
		Map<String,Object> back = dao.findOne(ApiConstants.MONGO_ID, backId, DBBean.PURCHASE_BACK);
		mergeEqcost(back);
		back.put(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID));
		return back;
	}
	
	public Map<String, Object> approveAllot(Map<String, Object> params) {
		Map<String,Object> obj = new HashMap<String,Object>();
		obj.put(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID));
		obj.put(PurchaseBack.status, PurchaseStatus.approved.toString());
		obj.put(PurchaseBack.operateDate, new Date());
		obj.put(PurchaseBack.eqcostList, countAllotEqcostList(params));	
		return dao.updateById(obj, DBBean.PURCHASE_ALLOCATE);
	}
	
	@Override
	public Map<String, Object> listAllBack(Map<String, Object> params) {
		String[] keys = new String[]{PurchaseBack.code,PurchaseBack.type,PurchaseBack.status,
				PurchaseBack.approveDate,PurchaseBack.money,PurchaseBack.salesContract_id};
		Map<String,Object> query = new HashMap<String,Object>();
		query.put(ApiConstants.LIMIT_KEYS, keys);
		Map<String,Object> map = dao.list(query,null, DBBean.PURCHASE_BACK);
		List<Map<String,Object>> list = (List<Map<String,Object>>)map.get(ApiConstants.RESULTS_DATA);
		Set<String> saleIds = new HashSet<String>();
		for(Map<String,Object> re : list){
			saleIds.add((String)re.get(PurchaseBack.salesContract_id));
		}
		Map<String,Object> baseInfoMap = salesContractService.getBaseInfoByIds(new ArrayList(saleIds));
		for(Map<String,Object> re : list){
			re.putAll((Map)baseInfoMap.get(re.get(PurchaseBack.salesContract_id)));
		}
		return map;
	}

	@Override
	public Map<String, Object> listCheckedBack(Map<String, Object> params) {
		String[] keys = new String[]{PurchaseBack.code,PurchaseBack.type,PurchaseBack.status,
				PurchaseBack.approveDate,PurchaseBack.money,PurchaseBack.salesContract_id};
		Map<String,Object> query = new HashMap<String,Object>();
		query.put(ApiConstants.LIMIT_KEYS, keys);
		query.put(PurchaseBack.status, PurchaseStatus.submited.toString());
		Map<String,Object> map = dao.list(query, DBBean.PURCHASE_BACK);
		List<Map<String,Object>> list = (List<Map<String,Object>>)map.get(ApiConstants.RESULTS_DATA);
		Set<String> saleIds = new HashSet<String>();
		for(Map<String,Object> re : list){
			saleIds.add((String)re.get(PurchaseBack.salesContract_id));
		}
		Map<String,Object> baseInfoMap = salesContractService.getBaseInfoByIds(new ArrayList(saleIds));
		for(Map<String,Object> re : list){
			re.putAll((Map)baseInfoMap.get(re.get(PurchaseBack.salesContract_id)));
		}
		return map;
		
	}

	@Override
	public Map<String, Object> listAllot(Map<String, Object> params) {
		
		Map<String,Object> map = dao.list(null, DBBean.PURCHASE_ALLOCATE);
		List<Map<String,Object>> list = (List<Map<String,Object>>)map.get(ApiConstants.RESULTS_DATA);
		Set<String> saleIds = new HashSet<String>();
		for(Map<String,Object> re : list){
			saleIds.add((String)re.get(PurchaseBack.salesContract_id));
		}
		saleIds.remove(null);
		if(!saleIds.isEmpty()){
		Map<String,Object> baseInfoMap = salesContractService.getBaseInfoByIds(new ArrayList(saleIds));
		for(Map<String,Object> re : list){
			re.putAll((Map)baseInfoMap.get(re.get(PurchaseBack.salesContract_id)));
		}
		}
		return map;		
	}


	@Override
	public void destoryBack(Map<String, Object> params) {
		List<String> ids = new ArrayList<String>();
		ids.add(String.valueOf(params.get(ApiConstants.MONGO_ID)));
		dao.deleteByIds(ids, DBBean.PURCHASE_BACK);
	}

	private String produceCode(String flag){
		String str = new SimpleDateFormat("yyyyMMdd").format(new Date());
		int count = dao.count(null, DBBean.PURCHASE_BACK);
		str = str.substring(2) + "-" + String.valueOf(count+1);
		if(flag !=null) str = flag + str;
		return str;
	}
	
	private Map<String,Object> mergeSalesContract(Map<String,Object> params){
		String saleId = (String)params.get(PurchaseBack.salesContract_id);
		List<String> ids = new ArrayList<String>();
		ids.add(saleId);
		Map<String,Object> saleInfoMap = salesContractService.getBaseInfoByIds(ids);
		params.putAll((Map)saleInfoMap.get(saleId));
		return params;
	}
	private void mergeAllotEqcost(Map<String,Object> params){
		
	}
	private void mergeEqcost(Map<String,Object> params){
		String status = (String)params.get(PurchaseBack.status);
		
		Map<String, Object> query = new HashMap<String, Object>();
		query.put(EqCostListBean.EQ_LIST_SC_ID, params.get(PurchaseBack.salesContract_id));
		Map<String, Object> eqMap = dao.list(query, DBBean.EQ_COST);
		List<Map<String,Object>> eqList = (List<Map<String,Object>>)eqMap.get(ApiConstants.RESULTS_DATA);
		
		//如果已提交，则只加载已申请的货物清单
		if(PurchaseStatus.saved.toString().equals(status)){
			List<Map<String,Object>> backList = (List<Map<String,Object>>)params.get(PurchaseBack.eqcostList);
			Map<String,Object> backMap = new HashMap<String,Object>();
			for(Map<String,Object> eq : backList){
				backMap.put((String)eq.get(ApiConstants.MONGO_ID), eq);
			}
			for(Map<String,Object> obj : eqList){
				obj.putAll((Map<String,Object>)backMap.get(obj.get(ApiConstants.MONGO_ID)));
			}
			params.put(PurchaseBack.eqcostList, eqList);
		} else if(PurchaseStatus.submited.toString().equals(status)){
			List<Map<String,Object>> list = (List<Map<String,Object>>)params.get(PurchaseBack.eqcostList);
			Map<String,Object> map = new HashMap<String,Object>();
			for(Map<String,Object> eq : eqList){
				map.put((String)eq.get(ApiConstants.MONGO_ID), eq);
			}
			for(Map<String,Object> obj : list){
				obj.putAll((Map<String,Object>)map.get(obj.get(ApiConstants.MONGO_ID)));
			}
			params.put(PurchaseBack.eqcostList, list);
		} else {
			params.put(PurchaseBack.eqcostList, eqList);
		}
	}
	
	//验证并记录申请货物清单列表，计算申请总额
	public Map<String,Object> countEqcostList(Map<String,Object> params) {
		Object eqList = params.get(PurchaseBack.eqcostList);
		String status = (String) params.get(PurchaseBack.status);
		Map<String,Object> result = new HashMap<String,Object>();
		List<Map<String,Object>> newList = new ArrayList<Map<String,Object>>();
		Double totalMoney = 0.00;
		List list = new Gson().fromJson(eqList.toString(), List.class);
		for(Object obj : list){
			Map<String,Object> map = (Map<String,Object>)obj;
			Map<String,Object> newMap = new HashMap<String,Object>();
			Double applyCount = ApiUtil.getDouble(map, PurchaseBack.backTotalCount,0);
			Double price = ApiUtil.getDouble(map, SalesContractBean.SC_EQ_LIST_BASE_PRICE,0);
			
			newMap.put(ApiConstants.MONGO_ID, map.get(ApiConstants.MONGO_ID));
			newMap.put(SalesContractBean.SC_EQ_LIST_NO, map.get(SalesContractBean.SC_EQ_LIST_NO));
			newMap.put(PurchaseBack.backTotalCount, applyCount);
			newMap.put(PurchaseBack.backLeftCount, applyCount);
			newMap.put(PurchaseBack.backUsedCount, 0);
			newList.add(newMap);
			if(PurchaseStatus.submited.toString().equals(status)){
				dao.updateCount(ApiConstants.MONGO_ID, map.get(ApiConstants.MONGO_ID), EqCostListBean.EQ_LIST_LEFT_AMOUNT, DBBean.EQ_COST, -applyCount);
			}
			totalMoney += applyCount*price;
			
		}
		result.put(PurchaseBack.eqcostList, newList);
		result.put(PurchaseBack.money, totalMoney);
		return result;
	}	
	public List countAllotEqcostList(Map<String,Object> params) {
		Object eqList = params.get(PurchaseBack.eqcostList);
		List<Map<String,Object>> newList = new ArrayList<Map<String,Object>>();
		List list = new Gson().fromJson(eqList.toString(), List.class);
		for(Object obj : list){
			Map<String,Object> map = (Map<String,Object>)obj;
			Map<String,Object> newMap = new HashMap<String,Object>();
			newMap.put(ApiConstants.MONGO_ID, map.get(ApiConstants.MONGO_ID));
			newMap.put(SalesContractBean.SC_EQ_LIST_NO, map.get(SalesContractBean.SC_EQ_LIST_NO));
			Double allotCount = ApiUtil.getDouble(map, PurchaseBack.allotCount,0);
			newMap.put(PurchaseBack.allotCount, allotCount);
			newList.add(newMap);
		}
		
		return newList;
	}
	
	
    public enum PurchaseStatus {
    	unsaved,saved,submited,approved,checked,rejected,interruption,allotting,allotted,requested;
		@Override
		public String toString() {
			String value = "undefine";
			switch(this){
				case unsaved: value="未保存"; break;
				case saved: value="已保存"; break;
				case submited: value="已提交"; break;
				case approved: value="已批准"; break;
				case checked: value="已审核"; break;
				case rejected: value="已拒绝"; break;
				case allotting: value="调拨中"; break;
				case allotted: value="已调拨"; break;
				case requested: value="已采购申请"; break;
				case interruption: value="已中止"; break;
				default: break;
			}
			return value;
		}
    }
	
	public ISalesContractService getSalesContractService() {
		return salesContractService;
	}

	public void setSalesContractService(ISalesContractService salesContractService) {
		this.salesContractService = salesContractService;
	}

	@Override
	public String geValidatorFileName() {
		return "purchase";
	}
}
