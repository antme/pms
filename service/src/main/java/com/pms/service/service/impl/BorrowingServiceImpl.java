package com.pms.service.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.pms.service.mockbean.ApiConstants;
import com.pms.service.mockbean.BorrowingBean;
import com.pms.service.mockbean.DBBean;
import com.pms.service.mockbean.ShipBean;
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
		return dao.findOne(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID), DBBean.BORROWING);
	}

	public Map<String, Object> list(Map<String, Object> params) {
		return dao.list(null, DBBean.BORROWING);
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
