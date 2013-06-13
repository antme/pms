package com.pms.service.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.pms.service.mockbean.ApiConstants;
import com.pms.service.mockbean.DBBean;
import com.pms.service.mockbean.ShipBean;
import com.pms.service.service.AbstractService;
import com.pms.service.service.IPurchaseContractService;
import com.pms.service.service.IShipService;

public class ShipServiceImpl extends AbstractService implements IShipService {
	
	private IPurchaseContractService pService;
//	private ISalesContractService salesContractService;
//
//	public ISalesContractService getSalesContractService() {
//		return salesContractService;
//	}
//
//	public void setSalesContractService(ISalesContractService salesContractService) {
//		this.salesContractService = salesContractService;
//	}

	public IPurchaseContractService getpService() {
		return pService;
	}

	public void setpService(IPurchaseContractService pService) {
		this.pService = pService;
	}

	@Override
	public String geValidatorFileName() {
		return "ship";
	}
	
	public Map<String, Object> get(Map<String, Object> params) {
		return dao.findOne(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID), DBBean.SHIP);
	}

	public Map<String, Object> list(Map<String, Object> params) {
		return dao.list(null, DBBean.SHIP);
//		Map<String, Object> result = dao.list(null, DBBean.SHIP);
//		
//		List<Map<String, Object>> list = (List<Map<String, Object>>) result.get(ApiConstants.RESULTS_DATA);
//		
//		List<String> pId = new ArrayList<String>();
//		for (Map<String, Object> p:list){
//			pId.add(p.get(ShipBean.SHIP_SALES_CONTRACT_ID).toString());
//		}
//		
//		Map<String, Object> scParams = new HashMap<String, Object>();
//		scParams.put(SalesContractBean.SC_ID, pId);
//		Map<String, Object> cInfoMap = salesContractService.getSCAndCustomerInfo(scParams);
//		
//		for (Map<String, Object> p:list){
//			String scId = p.get(ShipBean.SHIP_SALES_CONTRACT_ID).toString();
//			Map<String, Object> scMap = (Map<String, Object>) cInfoMap.get(scId);
//			if (scMap != null) {
//				p.put(ShipBean.SHIP_SALES_CONTRACT_NO, scMap.get(SalesContractBean.SC_CODE));
//				p.put(ShipBean.SHIP_CUSTOMER_NAME, scMap.get(ProjectBean.PROJECT_CUSTOMER));
//			}
//		}
//		
//		return result;
	}

	public Map<String, Object> update(Map<String, Object> params) {
		return dao.updateById(params, DBBean.SHIP);
	}

	public void destroy(Map<String, Object> params) {
		List<String> ids = new ArrayList<String>();
		ids.add(String.valueOf(params.get(ApiConstants.MONGO_ID)));
		dao.deleteByIds(ids, DBBean.SHIP);
	}

	public Map<String, Object> create(Map<String, Object> params) {
		return dao.add(params, DBBean.SHIP);
	}
	
	public Map<String, Object> eqlist(Map<String, Object> params) {
		Map<String, Object> res = new HashMap<String, Object>();
		res.put(ApiConstants.RESULTS_DATA, pService.listApprovedPurchaseContractCosts((String) params.get(ShipBean.SHIP_SALES_CONTRACT_NO)));
		return res;
	}

}
