package com.pms.service.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.pms.service.dbhelper.DBQuery;
import com.pms.service.dbhelper.DBQueryOpertion;
import com.pms.service.mockbean.ApiConstants;
import com.pms.service.mockbean.DBBean;
import com.pms.service.mockbean.ShipBean;
import com.pms.service.service.AbstractService;
import com.pms.service.service.IPurchaseContractService;
import com.pms.service.service.IPurchaseService;
import com.pms.service.service.IShipService;
import com.pms.service.util.ApiUtil;

public class ShipServiceImpl extends AbstractService implements IShipService {
	
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
		return "ship";
	}
	
	public Map<String, Object> get(Map<String, Object> params) {
		return dao.findOne(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID), DBBean.SHIP);
	}

	public Map<String, Object> list(Map<String, Object> params) {
		return dao.list(null, DBBean.SHIP);
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
		params.put(ShipBean.SHIP_STATUS, 0);
		params.put(ShipBean.SHIP_DATE, ApiUtil.formateDate(new Date(), "yyy-MM-dd"));
		return dao.add(params, DBBean.SHIP);
	}
	
	public Map<String, Object> eqlist(Map<String, Object> params) {
		Map<String, Object> res = new HashMap<String, Object>();
		String saleId = (String) params.get(ShipBean.SHIP_SALES_CONTRACT_ID);
		
		Map<String, Double> alloeq = purchaseService.getAllotEqCountBySalesContractId(saleId);
		
		for (Map.Entry mapEntry : alloeq.entrySet()) {
			mapEntry.getKey();
		}
		
		List<Map<String, Object>> list = pService.listApprovedPurchaseContractCosts(saleId);
		res.put(ApiConstants.RESULTS_DATA, list);
		return res;
	}

	public Map<String, Object> shipedList(Map<String, Object> params) {
		String saleId = (String) params.get(ShipBean.SHIP_SALES_CONTRACT_ID);
		Map<String, Object> parameters = new HashMap<String, Object>();
		parameters.put(ShipBean.SHIP_STATUS, new DBQuery(DBQueryOpertion.EQUAILS, 1));
		parameters.put(ShipBean.SHIP_SALES_CONTRACT_ID, new DBQuery(DBQueryOpertion.EQUAILS, saleId));
		return dao.list(parameters, DBBean.SHIP);
	}

	public Map<String, Object> approve(Map<String, Object> params) {
        Map<String, Object> cc = dao.findOne(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID), DBBean.SHIP);
        params.put(ApiConstants.MONGO_ID, cc.get(ApiConstants.MONGO_ID));
        params.put(ShipBean.SHIP_STATUS, 1);

        Map<String, Object> result =  dao.updateById(params, DBBean.SHIP);
        
        return result;
    }

	public Map<String, Object> reject(Map<String, Object> params) {
        Map<String, Object> cc = dao.findOne(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID), DBBean.SHIP);
        params.put(ApiConstants.MONGO_ID, cc.get(ApiConstants.MONGO_ID));
        params.put(ShipBean.SHIP_STATUS, 2);

        Map<String, Object> result =  dao.updateById(params, DBBean.SHIP);
        
        return result;
    }

}
