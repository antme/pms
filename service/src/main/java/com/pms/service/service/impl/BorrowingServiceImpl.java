package com.pms.service.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.pms.service.dbhelper.DBQuery;
import com.pms.service.dbhelper.DBQueryOpertion;
import com.pms.service.mockbean.ApiConstants;
import com.pms.service.mockbean.BorrowingBean;
import com.pms.service.mockbean.DBBean;
import com.pms.service.mockbean.EqCostListBean;
import com.pms.service.mockbean.ProjectBean;
import com.pms.service.mockbean.UserBean;
import com.pms.service.service.AbstractService;
import com.pms.service.service.IBorrowingService;
import com.pms.service.service.IPurchaseContractService;
import com.pms.service.service.IShipService;
import com.pms.service.util.ApiUtil;

public class BorrowingServiceImpl extends AbstractService implements IBorrowingService {
	
	private IPurchaseContractService pService;
	
	private IShipService shipService;

	public IShipService getShipService() {
		return shipService;
	}

	public void setShipService(IShipService shipService) {
		this.shipService = shipService;
	}

	public IPurchaseContractService getpService() {
		return pService;
	}

	public void setpService(IPurchaseContractService pService) {
		this.pService = pService;
	}

	@Override
	public String geValidatorFileName() {
		return "borrowing";
	}
	
	public Map<String, Object> get(Map<String, Object> params) {
		Map<String, Object> result = dao.findOne(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID), DBBean.BORROWING);
//		String inProjectId = result.get(BorrowingBean.BORROW_IN_PROJECT_ID).toString();
//		String outProjectId = result.get(BorrowingBean.BORROW_OUT_PROJECT_ID).toString();
		return result;
	}

	public Map<String, Object> list(Map<String, Object> params) {
		int limit = ApiUtil.getInteger(params, ApiConstants.PAGE_SIZE, 15);
		int limitStart = ApiUtil.getInteger(params, ApiConstants.SKIP, 0);
		Map<String, Object> queryMap = new HashMap<String, Object>();
		queryMap.put(ApiConstants.LIMIT, limit);
		queryMap.put(ApiConstants.LIMIT_START, limitStart);
		
		Map<String, Object> result = dao.list(queryMap, DBBean.BORROWING);
		
		List<Map<String, Object>> list = (List<Map<String, Object>>) result.get(ApiConstants.RESULTS_DATA);
		
		List<String> pId = new ArrayList<String>();
		for (Map<String, Object> p:list){
			if (p.containsKey(BorrowingBean.BORROW_IN_PROJECT_ID)) {
				String inId = p.get(BorrowingBean.BORROW_IN_PROJECT_ID).toString();
				if (!inId.equals("")) {
					pId.add(inId.toString());
				}
			}
			if (p.containsKey(BorrowingBean.BORROW_OUT_PROJECT_ID)) {
				String outId = p.get(BorrowingBean.BORROW_OUT_PROJECT_ID).toString();
				if (!outId.equals("")) {
					pId.add(outId.toString());
				}
			}
		}
		
		// 有项目信息需要获取
		if (!pId.isEmpty()) {
			// 获取project信息
			Map<String, Object> queryContract = new HashMap<String, Object>();
			queryContract.put(ApiConstants.MONGO_ID, new DBQuery(DBQueryOpertion.IN, pId));
			Map<String, Object> cInfoMap = dao.listToOneMapByKey(queryContract, DBBean.PROJECT, ApiConstants.MONGO_ID);
			
			List<String> pmId = new ArrayList<String>();
			
			for (Map<String, Object> p:list){
				String inProjectId = p.get(BorrowingBean.BORROW_IN_PROJECT_ID).toString();
				Map<String, Object> inProjectMap = (Map<String, Object>) cInfoMap.get(inProjectId);
				if (inProjectMap != null) {
					p.put(BorrowingBean.BORROW_IN_PROJECT_CODE, inProjectMap.get(ProjectBean.PROJECT_CODE));
					p.put(BorrowingBean.BORROW_IN_PROJECT_NAME, inProjectMap.get(ProjectBean.PROJECT_NAME));
					p.put(BorrowingBean.BORROW_IN_PROJECT_MANAGER, inProjectMap.get(ProjectBean.PROJECT_MANAGER));
					pmId.add(inProjectMap.get(ProjectBean.PROJECT_MANAGER).toString());
				}
				
				String outProjectId = p.get(BorrowingBean.BORROW_OUT_PROJECT_ID).toString();
				Map<String, Object> outProjectMap = (Map<String, Object>) cInfoMap.get(outProjectId);
				if (outProjectMap != null) {
					p.put(BorrowingBean.BORROW_OUT_PROJECT_CODE, outProjectMap.get(ProjectBean.PROJECT_CODE));
					p.put(BorrowingBean.BORROW_OUT_PROJECT_NAME, outProjectMap.get(ProjectBean.PROJECT_NAME));
					p.put(BorrowingBean.BORROW_OUT_PROJECT_MANAGER, outProjectMap.get(ProjectBean.PROJECT_MANAGER));
					pmId.add(outProjectMap.get(ProjectBean.PROJECT_MANAGER).toString());
				}
			}
			
			if (!pmId.isEmpty()) {
				// 获取项目负责人信息
				Map<String, Object> pmQueryContract = new HashMap<String, Object>();
				pmQueryContract.put(ApiConstants.MONGO_ID, new DBQuery(DBQueryOpertion.IN, pmId));
				pmQueryContract.put(ApiConstants.LIMIT_KEYS, new String[] {UserBean.USER_NAME});
				Map<String, Object> pmMap = dao.listToOneMapByKey(pmQueryContract, DBBean.USER, ApiConstants.MONGO_ID);
				
				for (Map<String, Object> p:list){
					if (p.containsKey(BorrowingBean.BORROW_IN_PROJECT_MANAGER)) {
						String inPmId = p.get(BorrowingBean.BORROW_IN_PROJECT_MANAGER).toString();
						if (!inPmId.equals("")) {
							Map<String, Object> inPmMap = (Map<String, Object>) pmMap.get(inPmId);
							if (inPmMap != null) {
								p.put(BorrowingBean.BORROW_IN_PROJECT_MANAGER, inPmMap.get(UserBean.USER_NAME));
							}
						}
					}
					
					if (p.containsKey(BorrowingBean.BORROW_OUT_PROJECT_MANAGER)) {
						String outPmId = p.get(BorrowingBean.BORROW_OUT_PROJECT_MANAGER).toString();
						if (!outPmId.equals("")) {
							Map<String, Object> outPmMap = (Map<String, Object>) pmMap.get(outPmId);
							if (outPmMap != null) {
								p.put(BorrowingBean.BORROW_OUT_PROJECT_MANAGER, outPmMap.get(UserBean.USER_NAME));
							}
						}
					}
				}
			}
		}
		
		return result;
	}

	public Map<String, Object> update(Map<String, Object> params) {
		params.put(BorrowingBean.BORROW_STATUS, 0);
		return dao.updateById(params, DBBean.BORROWING);
	}

	public void destroy(Map<String, Object> params) {
		List<String> ids = new ArrayList<String>();
		ids.add(String.valueOf(params.get(ApiConstants.MONGO_ID)));
		dao.deleteByIds(ids, DBBean.BORROWING);
	}

	public Map<String, Object> create(Map<String, Object> params) {
		params.put(BorrowingBean.BORROW_STATUS, 0);
		params.put(BorrowingBean.BORROW_DATE, ApiUtil.formateDate(new Date(), "yyy-MM-dd"));
		return dao.add(params, DBBean.BORROWING);
	}
	
	public Map<String, Object> eqlist(Map<String, Object> params) {
		
		String saleId = (String) params.get(BorrowingBean.BORROW_OUT_SALES_CONTRACT_ID);
		
		// 已批准的 采购合同 的设备清单
		List<Map<String, Object>> purchaseEqList = pService.listApprovedPurchaseContractCosts(saleId);
		
		// 已发货的设备清单
		List<Map<String, Object>> shipedEqList = shipService.shipedList(saleId);
		
		Map<String, Double> alloEqList = new HashMap<String, Double>();

		// 采购
		for (Map<String, Object> p:purchaseEqList){
			if (p != null) {
				String id = p.get(ApiConstants.MONGO_ID).toString();
				Double amount = (Double) p.get(EqCostListBean.EQ_LIST_AMOUNT);
				alloEqList.put(id, amount);
			}
		}
		
		// 结果数据
		List<Map<String, Object>> result = new ArrayList<Map<String, Object>>();
		
		if (alloEqList != null) {
			// - 已发货
			for (Map<String, Object> s:shipedEqList){
				String id = s.get(ApiConstants.MONGO_ID).toString();
				if (alloEqList.containsKey(id)) {
					Double amount = (Double) s.get(EqCostListBean.EQ_LIST_AMOUNT);
					Double aAmount = alloEqList.get(id);
					alloEqList.put(id, aAmount-amount);
				}
			}
			
			// 取设备信息
			List<String> eqId = new ArrayList<String>();
			for (String id : alloEqList.keySet()) {
				eqId.add(id);
			}
			Map<String, Object> queryContract = new HashMap<String, Object>();
			queryContract.put(ApiConstants.MONGO_ID, new DBQuery(DBQueryOpertion.IN, eqId));
			Map<String, Object> eqInfoMap = dao.listToOneMapByKey(queryContract, DBBean.EQ_COST, ApiConstants.MONGO_ID);
			
			// 封装结果数据
			for (Map.Entry mapEntry : alloEqList.entrySet()) {
				Map<String, Object> eqMap = (Map<String, Object>) eqInfoMap.get(mapEntry.getKey().toString());
				if (eqMap != null) {
					eqMap.put(EqCostListBean.EQ_LIST_AMOUNT, mapEntry.getValue());
					result.add(eqMap);
				}
			}
		}
		
		
		
		Map<String, Object> res = new HashMap<String, Object>();
		res.put(ApiConstants.RESULTS_DATA, result);
		return res;
	}

	public Map<String, Object> option(Map<String, Object> params) {
		Map<String, Object> result = null;
		if (params.containsKey(BorrowingBean.BORROW_STATUS)) {
			Map<String, Object> cc = dao.findOne(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID), DBBean.BORROWING);
	        params.put(ApiConstants.MONGO_ID, cc.get(ApiConstants.MONGO_ID));
	        params.put(BorrowingBean.BORROW_STATUS, params.get(BorrowingBean.BORROW_STATUS));

	        result =  dao.updateById(params, DBBean.BORROWING);
		}
        
        return result;
    }

}
