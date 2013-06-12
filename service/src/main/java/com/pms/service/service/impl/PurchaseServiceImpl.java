package com.pms.service.service.impl;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.ejb.EnterpriseBean;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.google.gson.Gson;
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
import com.pms.service.util.ApiUtil;

public class PurchaseServiceImpl extends AbstractService implements IPurchaseService {

    private static final Logger logger = LogManager.getLogger(PurchaseServiceImpl.class);
	
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
		newObj.put(PurchaseBack.department, params.get(PurchaseBack.department));
		newObj.put(PurchaseBack.type, params.get(PurchaseBack.type));
		newObj.put(PurchaseBack.comment, params.get(PurchaseBack.comment));
		newObj.put(PurchaseBack.planDate, params.get(PurchaseBack.planDate));
		newObj.put(PurchaseBack.salesContract_id, params.get(PurchaseBack.salesContract_id));
		newObj.put(PurchaseBack.status, PurchaseStatus.saved.toString());
		newObj.put(PurchaseBack.operateDate, new Date());
		newObj.putAll(countEqcostList(params));
		return dao.add(newObj, DBBean.PURCHASE_BACK);
	}

	@Override
	public Map<String, Object> submitBack(Map<String, Object> params) {
		Map<String,Object> newObj = new HashMap<String,Object>();
		newObj.put(PurchaseBack.department, params.get(PurchaseBack.department));
		newObj.put(PurchaseBack.type, params.get(PurchaseBack.type));
		newObj.put(PurchaseBack.comment, params.get(PurchaseBack.comment));
		newObj.put(PurchaseBack.planDate, params.get(PurchaseBack.planDate));
		newObj.put(PurchaseBack.salesContract_id, params.get(PurchaseBack.salesContract_id));
		newObj.put(PurchaseBack.status, PurchaseStatus.submited.toString());
		newObj.put(PurchaseBack.submitDate, new Date());
		newObj.put(PurchaseBack.operateDate, new Date());
		newObj.putAll(countEqcostList(params));
		dao.updateCount(ApiConstants.MONGO_ID, params.get(PurchaseBack.salesContract_id), SalesContractBean.SC_BACK_REQUEST_COUNT, DBBean.SALES_CONTRACT, 1);
		return dao.add(newObj, DBBean.PURCHASE_BACK);
	}

	@Override
	public Map<String, Object> approveBack(Map<String, Object> params) {
		Map<String,Object> obj = dao.findOne(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID), new String[]{PurchaseBack.status}, DBBean.PURCHASE_BACK);
		String status = String.valueOf(obj.get(PurchaseBack.status));
		if(PurchaseStatus.approved.toString().equals(status)){
			status = PurchaseStatus.checked.toString();
			obj.put(PurchaseBack.code, produceBackCode());
		}else {
			status = PurchaseStatus.approved.toString();
		}
		obj.put(PurchaseBack.status, status);
		obj.put(PurchaseBack.operateDate, new Date());
		obj.put(PurchaseBack.approveDate, new Date());
		return dao.updateById(obj, DBBean.PURCHASE_BACK);
	}

	@Override
	public Map<String, Object> rejectBack(Map<String, Object> params) {
		Map<String,Object> obj = new HashMap<String,Object>();
		obj.put(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID));
		obj.put(PurchaseBack.status, PurchaseStatus.rejected.toString());
		obj.put(PurchaseBack.operateDate, new Date());
		return dao.updateById(obj, DBBean.PURCHASE_BACK);
	}

	@Override
	public Map<String, Object> pendingBack(Map<String, Object> params) {
		Map<String,Object> obj = new HashMap<String,Object>();
		obj.put(PurchaseBack.status, PurchaseStatus.interruption.toString());
		obj.put(PurchaseBack.operateDate, new Date());
		return dao.updateById(obj, DBBean.PURCHASE_BACK);
	}

	@Override
	public Map<String, Object> submitAllotBack(Map<String, Object> params) {
		Map<String,Object> obj = new HashMap<String,Object>();
		obj.put(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID));
		obj.put(PurchaseBack.status, PurchaseStatus.allotting.toString());
		obj.put(PurchaseBack.operateDate, new Date());
		return dao.updateById(obj, DBBean.PURCHASE_BACK);
	}

	public Map<String, Object> approveAllotForBack(Map<String, Object> params) {
		
		Map<String,Object> obj = new HashMap<String,Object>();
		obj.put(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID));
		obj.put(PurchaseBack.status, PurchaseStatus.allotted.toString());
		obj.put(PurchaseBack.operateDate, new Date());
		obj.put(PurchaseBack.eqcostList, countAllotEqcostList(params));	
		return dao.updateById(obj, DBBean.PURCHASE_BACK);
	}
	
	@Override
	public Map<String, Object> listAllBack(Map<String, Object> params) {
		Map<String,Object> map = dao.list(null, DBBean.PURCHASE_BACK);
		List<Map<String,Object>> list = (List<Map<String,Object>>)map.get(ApiConstants.RESULTS_DATA);
		for(Map<String,Object> re : list){
			mergeSalesContract(re);
		}
		return map;
	}

	@Override
	public Map<String, Object> listCheckedBack(Map<String, Object> params) {
		Map<String,Object> query = new HashMap<String,Object>();
		List<String> st = new ArrayList<String>();
		st.add(PurchaseStatus.checked.toString());
		st.add(PurchaseStatus.allotted.toString());
		st.add(PurchaseStatus.allotting.toString());
		st.add(PurchaseStatus.requested.toString());
		query.put(PurchaseBack.status, new DBQuery(DBQueryOpertion.IN, st));
		Map<String,Object> map = dao.list(query, DBBean.PURCHASE_BACK);
		List<Map<String,Object>> list = (List<Map<String,Object>>)map.get(ApiConstants.RESULTS_DATA);
		for(Map<String,Object> re : list){
			mergeSalesContract(re);
		}
		return map;
	}

	@Override
	public Map<String, Object> listAllottedBack(Map<String, Object> params) {
		Map<String,Object> query = new HashMap<String,Object>();
		query.put(PurchaseBack.status, PurchaseStatus.allotted.toString());
		Map<String,Object> map = dao.list(params, DBBean.PURCHASE_BACK);
		List<Map<String,Object>> list = (List<Map<String,Object>>)map.get(ApiConstants.RESULTS_DATA);
		for(Map<String,Object> re : list){
			mergeSalesContract(re);
		}
		return map;
	}


	@Override
	public void destoryBack(Map<String, Object> params) {
		List<String> ids = new ArrayList<String>();
		ids.add(String.valueOf(params.get(ApiConstants.MONGO_ID)));
		dao.deleteByIds(ids, DBBean.PURCHASE_BACK);
	}

	private String produceBackCode(){
		String str = new SimpleDateFormat("yyyyMMdd").format(new Date());
		int count = dao.count(null, DBBean.PURCHASE_BACK);
		return str + "-" + String.valueOf(count+1);
	}
	
	private Map<String,Object> mergeSalesContract(Map<String,Object> params){
		if(params == null) return null;
		String[] sckeys = new String[]{SalesContractBean.SC_CODE,SalesContractBean.SC_AMOUNT, SalesContractBean.SC_PROJECT_ID,
				SalesContractBean.SC_CUSTOMER_ID,SalesContractBean.SC_BACK_REQUEST_COUNT};
		
		String[] prkeys = new String[]{ ProjectBean.PROJECT_CODE, ProjectBean.PROJECT_NAME,ProjectBean.PROJECT_MANAGER,ProjectBean.PROJECT_CUSTOMER};
		String[] cuKey = new String[]{CustomerBean.CODE, CustomerBean.NAME};
		String scid = (String) params.get(PurchaseBack.salesContract_id);
		
		Map<String, Object> sc = dao.findOne(ApiConstants.MONGO_ID, scid, sckeys, DBBean.SALES_CONTRACT);
		if(sc != null){
			params.put(PurchaseBack.salesContract_id, scid);
			params.put(PurchaseBack.salesContract_code, sc.get(SalesContractBean.SC_CODE));
			params.put(PurchaseBack.salesContract_money, sc.get(SalesContractBean.SC_AMOUNT));
			params.put(SalesContractBean.SC_BACK_REQUEST_COUNT, sc.get(SalesContractBean.SC_BACK_REQUEST_COUNT));
			
			Map<String,Object> project = dao.findOne(ApiConstants.MONGO_ID, sc.get(SalesContractBean.SC_PROJECT_ID), prkeys, DBBean.PROJECT);
			if(project != null){
				params.put(PurchaseBack.project_code, project.get(ProjectBean.PROJECT_CODE));
				params.put(PurchaseBack.project_name, project.get(ProjectBean.PROJECT_NAME));
				
				String managerId = (String)project.get(ProjectBean.PROJECT_MANAGER);
				Map<String,Object> manager = dao.findOne(ApiConstants.MONGO_ID, managerId,new String[]{UserBean.USER_NAME}, DBBean.USER);
				params.put(PurchaseBack.project_managerName, manager.get(UserBean.USER_NAME));
				
				String customerId = (String)project.get(ProjectBean.PROJECT_CUSTOMER);
				Map<String,Object> customer = dao.findOne(ApiConstants.MONGO_ID, customerId , cuKey, DBBean.CUSTOMER);
				if(customer != null){
					params.put(PurchaseBack.customer_code, customer.get(CustomerBean.CODE));
					params.put(PurchaseBack.customer_name, customer.get(CustomerBean.NAME));
				}
			}
		}
		return params;
	}
	
	private void mergeEqcost(Map<String,Object> params){
		String status = (String)params.get(PurchaseBack.status);
		//如果已提交，则只加载已申请的货物清单
		if(status == null || status.isEmpty() || status.equals(PurchaseStatus.unsaved.toString())){
			Map<String, Object> query = new HashMap<String, Object>();
			query.put(EqCostListBean.EQ_LIST_SC_ID, params.get(PurchaseBack.salesContract_id));
			Map<String, Object> eqMap = dao.list(query, DBBean.EQ_COST);
			List<Map<String,Object>> eqList = (List<Map<String,Object>>)eqMap.get(ApiConstants.RESULTS_DATA);
			params.put(PurchaseBack.eqcostList, eqList);
		} else {
			List<Map<String,Object>> backList = (List<Map<String,Object>>)params.get(PurchaseBack.eqcostList);
			Map<String,Object> backMap = new HashMap<String,Object>();
			for(Map<String,Object> eq : backList){
				backMap.put((String)eq.get(ApiConstants.MONGO_ID), eq);
			}
			Map<String, Object> query = new HashMap<String, Object>();
			query.put(ApiConstants.MONGO_ID, new DBQuery(DBQueryOpertion.IN, new ArrayList(backMap.keySet())));
			Map<String, Object> scMap = dao.list(query, DBBean.EQ_COST);
			List<Map<String,Object>> scList = (List<Map<String,Object>>)scMap.get(ApiConstants.RESULTS_DATA);
			for(Map<String,Object> obj : scList){
				obj.putAll((Map<String,Object>)backMap.get(obj.get(ApiConstants.MONGO_ID)));
			}
			params.put(PurchaseBack.eqcostList, scList);
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
			
			Double totalCount = ApiUtil.getDouble(map, PurchaseBack.backTotalCount,0);
			Double allotCount = ApiUtil.getDouble(map, PurchaseBack.backUsedCount,0);
			Double leftCount = totalCount - allotCount;
			
			newMap.put(PurchaseBack.backTotalCount, totalCount);
			newMap.put(PurchaseBack.backLeftCount, leftCount);
			newMap.put(PurchaseBack.backUsedCount, allotCount);
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
	
	@Override
	public String geValidatorFileName() {
		return "purchase";
	}
}
