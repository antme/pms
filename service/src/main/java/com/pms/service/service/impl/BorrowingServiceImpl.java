package com.pms.service.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.pms.service.dbhelper.DBQuery;
import com.pms.service.dbhelper.DBQueryOpertion;
import com.pms.service.mockbean.AllocateBean;
import com.pms.service.mockbean.ApiConstants;
import com.pms.service.mockbean.BorrowingBean;
import com.pms.service.mockbean.DBBean;
import com.pms.service.mockbean.ProjectBean;
import com.pms.service.mockbean.ShipBean;
import com.pms.service.mockbean.UserBean;
import com.pms.service.service.AbstractService;
import com.pms.service.service.IBorrowingService;
import com.pms.service.service.IPurchaseContractService;
import com.pms.service.service.IPurchaseService;
import com.pms.service.util.ApiUtil;

public class BorrowingServiceImpl extends AbstractService implements IBorrowingService {
	
	private IPurchaseContractService pService;
	
	private IPurchaseService purchaseService;

	public IPurchaseContractService getpService() {
		return pService;
	}

	public IPurchaseService getPurchaseService() {
		return purchaseService;
	}

	public void setPurchaseService(IPurchaseService purchaseService) {
		this.purchaseService = purchaseService;
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
		String inProjectId = result.get(BorrowingBean.BORROW_IN_PROJECT_ID).toString();
		String outProjectId = result.get(BorrowingBean.BORROW_OUT_PROJECT_ID).toString();
		return result;
	}

	public Map<String, Object> list(Map<String, Object> params) {
		Map<String, Object> result = dao.list(null, DBBean.BORROWING);
		
		List<Map<String, Object>> list = (List<Map<String, Object>>) result.get(ApiConstants.RESULTS_DATA);
		
		List<String> pId = new ArrayList<String>();
		for (Map<String, Object> p:list){
			pId.add(p.get(BorrowingBean.BORROW_IN_PROJECT_ID).toString());
			pId.add(p.get(BorrowingBean.BORROW_OUT_PROJECT_ID).toString());
		}
		
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
		
		// 获取项目负责人信息
		Map<String, Object> pmQueryContract = new HashMap<String, Object>();
		pmQueryContract.put(ApiConstants.MONGO_ID, new DBQuery(DBQueryOpertion.IN, pmId));
		pmQueryContract.put(ApiConstants.LIMIT_KEYS, new String[] {UserBean.USER_NAME});
		Map<String, Object> pmMap = dao.listToOneMapByKey(pmQueryContract, DBBean.USER, ApiConstants.MONGO_ID);
		
		for (Map<String, Object> p:list){
			String inPmId = p.get(BorrowingBean.BORROW_IN_PROJECT_MANAGER).toString();
			Map<String, Object> inPmMap = (Map<String, Object>) pmMap.get(inPmId);
			if (inPmMap != null) {
				p.put(BorrowingBean.BORROW_IN_PROJECT_MANAGER, inPmMap.get(UserBean.USER_NAME));
			}
			
			String outPmId = p.get(BorrowingBean.BORROW_OUT_PROJECT_MANAGER).toString();
			Map<String, Object> outPmMap = (Map<String, Object>) pmMap.get(outPmId);
			if (outPmMap != null) {
				p.put(BorrowingBean.BORROW_OUT_PROJECT_MANAGER, outPmMap.get(UserBean.USER_NAME));
			}
		}
		
		return result;
	}

	public Map<String, Object> update(Map<String, Object> params) {
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
		Map<String, Object> res = new HashMap<String, Object>();
		String saleId = (String) params.get(BorrowingBean.BORROW_OUT_SALES_CONTRACT_ID);
		
		Map<String, Double> alloeq = purchaseService.getAllotEqCountBySalesContractId(saleId);
		
		for (Map.Entry mapEntry : alloeq.entrySet()) {
			
		}
		
		List<Map<String, Object>> list = pService.listApprovedPurchaseContractCosts(saleId);
		res.put(ApiConstants.RESULTS_DATA, list);
		return res;
	}

	@Override
	public Map<String, Object> approve(Map<String, Object> params) {
        Map<String, Object> cc = dao.findOne(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID), DBBean.BORROWING);
        params.put(ApiConstants.MONGO_ID, cc.get(ApiConstants.MONGO_ID));
        params.put(BorrowingBean.BORROW_STATUS, 1);

        Map<String, Object> result =  dao.updateById(params, DBBean.BORROWING);
        
        return result;
    }

	@Override
	public Map<String, Object> reject(Map<String, Object> params) {
        Map<String, Object> cc = dao.findOne(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID), DBBean.BORROWING);
        params.put(ApiConstants.MONGO_ID, cc.get(ApiConstants.MONGO_ID));
        params.put(BorrowingBean.BORROW_STATUS, 2);

        Map<String, Object> result =  dao.updateById(params, DBBean.BORROWING);
        
        return result;
    }

}
