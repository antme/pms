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
		
		newObj.putAll(countEqcostList(params));
		if(params.get(ApiConstants.MONGO_ID) == null){
			newObj.put(PurchaseBack.code, produceCode("pb",DBBean.PURCHASE_BACK));
			return dao.add(newObj, DBBean.PURCHASE_BACK);
		}else{
			return dao.updateById(newObj, DBBean.PURCHASE_BACK);
		}
		
	}

	@Override
	public Map<String, Object> submitBack(Map<String, Object> params) {
		params.put(PurchaseBack.status, PurchaseStatus.submited.toString());
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
		if(params.get(PurchaseBack.code) == null) newObj.put(PurchaseBack.code, produceCode("pb",DBBean.PURCHASE_BACK));
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
			obj.put(PurchaseBack.code, produceCode("pb",DBBean.PURCHASE_BACK));
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
		obj.putAll(countAllotEqcostList(params));
		return dao.updateById(obj, DBBean.PURCHASE_ALLOCATE);
	}

	@Override
	public Map<String, Object> pendingBack(Map<String, Object> params) {
		Map<String,Object> obj = new HashMap<String,Object>();
		obj.put(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID));
		obj.put(PurchaseBack.status, PurchaseStatus.interruption.toString());
		obj.put(PurchaseBack.operateDate, new Date());
		return dao.updateById(obj, DBBean.PURCHASE_BACK);
	}

	///////////////////////////allot 调拨///////////
	@Override
	public Map<String, Object> submitAllot(Map<String, Object> params) {
		Map<String,Object> obj = new HashMap<String,Object>();
		obj.put(PurchaseBack.salesContract_id, params.get(PurchaseBack.salesContract_id));
		obj.put(PurchaseBack.purchaseBack_id, params.get(PurchaseBack.purchaseBack_id));
		obj.put(PurchaseBack.status, PurchaseStatus.submited.toString());
		obj.put(PurchaseBack.code, produceCode("pa",DBBean.PURCHASE_ALLOCATE));
		obj.putAll(countAllotEqcostList(params));
		return dao.add(obj, DBBean.PURCHASE_ALLOCATE);
	}

	public Map<String, Object> loadAllot(Map<String, Object> params) {
		Map<String,Object> allot = dao.findOne(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID), DBBean.PURCHASE_ALLOCATE);
		mergeSalesContract(allot);
		mergeEqcostForAllot(allot);
		return allot;
	}

	public Map<String, Object> prepareAllot(Map<String, Object> params) {
		Map<String,Object> obj = dao.findOne(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID), DBBean.PURCHASE_BACK);
		mergeSalesContract(obj);
		mergeEqcost(obj);
		obj.put(PurchaseBack.purchaseBack_id, params.get(ApiConstants.MONGO_ID));
		obj.put(PurchaseBack.status, PurchaseStatus.unsaved.toString());
		obj.put(ApiConstants.MONGO_ID, null);
		obj.put(PurchaseBack.code, null);
		return obj;
	}
	
	public Map<String, Object> approveAllot(Map<String, Object> params) {
		Map<String,Object> obj = new HashMap<String,Object>();
		obj.put(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID));
		obj.put(PurchaseBack.status, PurchaseStatus.approved.toString());
		obj.put(PurchaseBack.operateDate, new Date());
		obj.putAll(countAllotEqcostList(params));
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
		saleIds.remove(null);
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
		saleIds.remove(null);
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

	private String produceCode(String flag,String db){
		String str = new SimpleDateFormat("yyyyMMdd").format(new Date());
		int count = dao.count(null, db);
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
		
		Map<String,Object> backEqData = (Map<String,Object>)params.get(PurchaseBack.eqcostList);
		if(backEqData == null) backEqData = new HashMap<String,Object>();
		
		if(PurchaseStatus.submited.toString().equals(status)){
			for(Map<String,Object> obj : eqList){
				String id = String.valueOf(obj.get(ApiConstants.MONGO_ID));
				if(backEqData.containsKey(id)){
					obj.put(PurchaseBack.backTotalCount, ApiUtil.getDouble(backEqData, id, 0));
				}else {
					eqList.remove(obj);
				}
			}
		} else {
			for(Map<String,Object> obj : eqList){
				String id = String.valueOf(obj.get(ApiConstants.MONGO_ID));
				if(backEqData.containsKey(id)){
					obj.put(PurchaseBack.backTotalCount, ApiUtil.getDouble(backEqData, id, 0));
				}else {
					obj.put(PurchaseBack.backTotalCount, 0);
				}
			}
		}
		
		params.put(PurchaseBack.eqcostList, eqList);
	}

	private void mergeEqcostForAllot(Map<String,Object> params){
		Map<String,Object> allotEq = (Map<String,Object>)params.get(PurchaseBack.eqcostList);
		if(allotEq == null) allotEq = new HashMap<String,Object>();
		
		String backId = (String) params.get(PurchaseBack.purchaseBack_id);
		Map<String,Object> back = dao.findOne(ApiConstants.MONGO_ID, backId,  DBBean.PURCHASE_BACK);
		mergeEqcost(back);
		List<Map<String,Object>> eqList = (List<Map<String,Object>>)back.get(PurchaseBack.eqcostList);
		if(eqList == null) eqList = new ArrayList();
		for(Map<String,Object> obj : eqList){
			String id = String.valueOf(obj.get(ApiConstants.MONGO_ID));
			if(allotEq.containsKey(id)){
				obj.put(PurchaseBack.allotCount, ApiUtil.getDouble(allotEq, id, 0));
			}else {
				eqList.remove(obj);
			}
		}
		params.put(PurchaseBack.department, back.get(PurchaseBack.department));
		params.put(PurchaseBack.planDate, back.get(PurchaseBack.planDate));
		params.put(PurchaseBack.type, back.get(PurchaseBack.type));
		params.put(PurchaseBack.eqcostList, eqList);
	}	
	
	//验证并记录申请货物清单列表，计算申请总额
	public Map<String,Object> countEqcostList(Map<String,Object> params) {
		Object eqList = params.get(PurchaseBack.eqcostList);
		String status = (String) params.get(PurchaseBack.status);
		Map<String,Object> result = new HashMap<String,Object>();
		
		Map<String,Double> eqData = new HashMap<String,Double>();
		Double totalMoney = 0.00;
		List list = new Gson().fromJson(eqList.toString(), List.class);
		for(Object obj : list){
			Map<String,Object> map = (Map<String,Object>)obj;
			String id = (String)map.get(ApiConstants.MONGO_ID);
			Double applyCount = ApiUtil.getDouble(map, PurchaseBack.backTotalCount,0);
			Double price = ApiUtil.getDouble(map, SalesContractBean.SC_EQ_LIST_BASE_PRICE,0);
			
			if(PurchaseStatus.submited.toString().equals(status)){
				dao.updateCount(ApiConstants.MONGO_ID, map.get(ApiConstants.MONGO_ID), EqCostListBean.EQ_LIST_LEFT_AMOUNT, DBBean.EQ_COST, -applyCount);
			}
			totalMoney += applyCount*price;
			eqData.put(id, applyCount);
		}
		result.put(PurchaseBack.eqcostList, eqData);
		result.put(PurchaseBack.money, totalMoney);
		return result;
	}	
	public Map<String,Object> countAllotEqcostList(Map<String,Object> params) {
		Object eqList = params.get(PurchaseBack.eqcostList);
		Map<String,Object> result = new HashMap<String,Object>();
		
		Map<String,Double> eqData = new HashMap<String,Double>();
		List list = new Gson().fromJson(eqList.toString(), List.class);
		for(Object obj : list){
			Map<String,Object> map = (Map<String,Object>)obj;
			String id = (String)map.get(ApiConstants.MONGO_ID);
			Double applyCount = ApiUtil.getDouble(map, PurchaseBack.allotCount,0);
			eqData.put(id, applyCount);
		}
		result.put(PurchaseBack.eqcostList, eqData);
		return result;
	}
	
	/**{_id:allotCount}*/
	public Map<String,Double> getAllotEqCountBySalesContractId(String saleId){
		Map<String,Double> result = new HashMap<String,Double>(); 
		Map<String, Object> query = new HashMap<String, Object>();
		query.put(PurchaseBack.salesContract_id, saleId);
		query.put(PurchaseBack.status, PurchaseStatus.approved.toString());
		query.put(ApiConstants.LIMIT_KEYS, new String[]{PurchaseBack.eqcostList});
		
		List<Object> list = dao.listLimitKeyValues(query, DBBean.PURCHASE_ALLOCATE);
		for(Object obj : list){
			Map<String, Double> eqMap = (Map<String, Double>)obj;
			for(Map.Entry<String, Double> entry: eqMap.entrySet()){
				String key = entry.getKey();
				Double value = entry.getValue();
				if(result.containsKey(key)){
					result.put(key, result.get(key)+value);
				}else{
					result.put(key, value);
				}
			}
		}
		return result;
	}
	
    @Override
	public Map<String, Double> getBackEqCountBySalesContractId(String saleId) {
		Map<String,Double> result = new HashMap<String,Double>(); 
		Map<String, Object> query = new HashMap<String, Object>();
		query.put(PurchaseBack.salesContract_id, saleId);
		query.put(PurchaseBack.status, PurchaseStatus.approved.toString());
		query.put(ApiConstants.LIMIT_KEYS, new String[]{PurchaseBack.eqcostList});
		
		List<Object> list = dao.listLimitKeyValues(query, DBBean.PURCHASE_ALLOCATE);
		for(Object obj : list){
			Map<String, Double> eqMap = (Map<String, Double>)obj;
			for(Map.Entry<String, Double> entry: eqMap.entrySet()){
				String key = entry.getKey();
				Double value = entry.getValue();
				if(result.containsKey(key)){
					result.put(key, result.get(key)+value);
				}else{
					result.put(key, value);
				}
			}
		}
		return result;
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
