package com.pms.service.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.pms.service.dbhelper.DBQuery;
import com.pms.service.dbhelper.DBQueryOpertion;
import com.pms.service.mockbean.ApiConstants;
import com.pms.service.mockbean.ArrivalNoticeBean;
import com.pms.service.mockbean.DBBean;
import com.pms.service.mockbean.EqCostListBean;
import com.pms.service.mockbean.SalesContractBean;
import com.pms.service.mockbean.ShipBean;
import com.pms.service.service.AbstractService;
import com.pms.service.service.IArrivalNoticeService;
import com.pms.service.service.IPurchaseContractService;
import com.pms.service.service.IPurchaseService;
import com.pms.service.service.IShipService;
import com.pms.service.util.ApiUtil;

public class ShipServiceImpl extends AbstractService implements IShipService {
	
	private IPurchaseContractService pService;
	
	private IArrivalNoticeService arrivalService;
		
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
	
	

	public IArrivalNoticeService getArrivalService() {
        return arrivalService;
    }

    public void setArrivalService(IArrivalNoticeService arrivalService) {
        this.arrivalService = arrivalService;
    }
    

    @Override
	public String geValidatorFileName() {
		return "ship";
	}
	
	public Map<String, Object> get(Map<String, Object> params) {
		return dao.findOne(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID), DBBean.SHIP);
	}

	public Map<String, Object> list(Map<String, Object> params) {
	    mergeMyTaskQuery(params, DBBean.SHIP);
		return dao.list(params, DBBean.SHIP);
	}

	public Map<String, Object> update(Map<String, Object> params) {
		params.put(ShipBean.SHIP_STATUS, ShipBean.SHIP_STATUS_DRAFT);
		return dao.updateById(params, DBBean.SHIP);
	}

	public void destroy(Map<String, Object> params) {
		List<String> ids = new ArrayList<String>();
		ids.add(String.valueOf(params.get(ApiConstants.MONGO_ID)));
		dao.deleteByIds(ids, DBBean.SHIP);
	}

	public Map<String, Object> create(Map<String, Object> params) {
		String status;
		if (params.containsKey(ShipBean.SHIP_STATUS)) {
			status = params.get(ShipBean.SHIP_STATUS).toString();
		} else {
			status = ShipBean.SHIP_STATUS_DRAFT;
		}
		
		params.put(ShipBean.SHIP_STATUS, status);
		return dao.add(params, DBBean.SHIP);
	}
	
	public Map<String, Object> listCanShipEq(Map<String, Object> params) {
		params.put(ArrivalNoticeBean.NOTICE_STATUS, ArrivalNoticeBean.NOTICE_STATUS_NORMAL);
		dao.list(params, DBBean.ARRIVAL_NOTICE);
		return null;
	}
	
	public Map<String, Object> eqlist(Map<String, Object> params) {
		
		String saleId = (String) params.get(ShipBean.SHIP_SALES_CONTRACT_ID);
		
		// 已批准的 调拨申请的 设备清单
		Map<String, Double> alloEqList = purchaseService.getAllotEqCountBySalesContractId(saleId);
		
		// 已到货 的 设备清单
		Map<String, Object> map = arrivalService.listEqListByScIDForShip(saleId);
		
		List<Map<String, Object>> purchaseEqList = (List<Map<String, Object>>) map.get(SalesContractBean.SC_EQ_LIST);
		
		// 已发货的设备清单
		List<Map<String, Object>> shipedEqList = shipedList(saleId);
		
		// 调拨 + 采购
		for (Map<String, Object> p:purchaseEqList){
			String id = p.get(ApiConstants.MONGO_ID).toString();
			Double amount = 0.0;
			if (p.containsKey("eqcostApplyAmount")) {
				amount = (Double) p.get("eqcostApplyAmount");
			}
			
			if (alloEqList.containsKey(id)) {
				amount = +alloEqList.get(id);
			}
			
			alloEqList.put(id, amount);
		}
		
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
		List<Map<String, Object>> result = new ArrayList<Map<String, Object>>();
		for (Map.Entry mapEntry : alloEqList.entrySet()) {
			Map<String, Object> eqMap = (Map<String, Object>) eqInfoMap.get(mapEntry.getKey().toString());
			if (eqMap != null) {
				eqMap.put(EqCostListBean.EQ_LIST_AMOUNT, mapEntry.getValue());
				eqMap.put(ShipBean.SHIP_EQ_ARRIVAL_AMOUNT, 0);
				eqMap.put(ShipBean.SHIP_EQ_GIVE_UP, ShipBean.SHIP_EQ_GIVE_UP_FAULSE);
				result.add(eqMap);
			}
		}
		
		Map<String, Object> res = new HashMap<String, Object>();
		res.put(ApiConstants.RESULTS_DATA, result);
		return res;
	}
	
	// 已批准的发货设备清单 - 入参 销售合同id
	public List<Map<String,Object>> shipedList(String saleId) {
		
		Map<String, Object> parameters = new HashMap<String, Object>();
		
		parameters.put(ShipBean.SHIP_STATUS, ShipBean.SHIP_STATUS_APPROVE);
		parameters.put(ShipBean.SHIP_SALES_CONTRACT_ID, saleId);
		
		Map<String, Object> result = dao.list(parameters, DBBean.SHIP);
		List<Map<String, Object>> list = (List<Map<String, Object>>) result.get(ApiConstants.RESULTS_DATA);
		
		List<Map<String, Object>> eqList = new ArrayList<Map<String, Object>>();
		for (Map<String, Object> p:list){
			eqList.addAll((List<Map<String, Object>>) p.get(ShipBean.SHIP_EQ_LIST));
		}
		return eqList;
	}
	
	public Map<String, Object> option(Map<String, Object> params) {
		Map<String, Object> result = null;
		if (params.containsKey(ShipBean.SHIP_STATUS)) {
			String status = params.get(ShipBean.SHIP_STATUS).toString();
			Map<String, Object> cc = dao.findOne(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID), DBBean.SHIP);
	        params.put(ApiConstants.MONGO_ID, cc.get(ApiConstants.MONGO_ID));
	        params.put(ShipBean.SHIP_STATUS, status);
	        
	        if (status.equals(ShipBean.SHIP_STATUS_SUBMIT)) {
	    		params.put(ShipBean.SHIP_DATE, ApiUtil.formateDate(new Date(), "yyy-MM-dd"));
			}

	        result =  dao.updateById(params, DBBean.SHIP);
		}
        
        return result;
    }
	
	public Map<String, Object> record(Map<String, Object> params) {
		List<Map<String, Object>> eqlist = (List<Map<String, Object>>) params.get(ShipBean.SHIP_EQ_LIST);
		boolean close = true;
		for (Map<String, Object> eq:eqlist) {
			if (ShipBean.SHIP_EQ_GIVE_UP_FAULSE.equals(eq.get(ShipBean.SHIP_EQ_GIVE_UP))) {
				Double arrivalAmount = (Double) eq.get(ShipBean.SHIP_EQ_ARRIVAL_AMOUNT);
				Double amount = (Double) eq.get(EqCostListBean.EQ_LIST_AMOUNT);
				if (amount != arrivalAmount) {
					close = false;
					break;
				}
			}
		}
		
		if (close) {
			params.put(ShipBean.SHIP_STATUS, ShipBean.SHIP_STATUS_CLOSE);
		}
		
		return dao.updateById(params, DBBean.SHIP);
	}
	
	// 更新到货通知中已被申请发货的设备数量
	private void updateArrivalNotice(List<Map<String, Object>> eqlist) {
		Map<String, Object> noticeKeyEqList = new HashMap<String, Object>();
		for (Map<String, Object> eq:eqlist) {
			List<Map<String, Object>> list;
			String noticeId = (String) eq.get(ArrivalNoticeBean.NOTICE_ID);
			if (noticeKeyEqList.containsKey(noticeId)) {
				list = (List<Map<String, Object>>) noticeKeyEqList.get(noticeId);
			} else {
				list = new ArrayList<Map<String, Object>>();
			}
			list.add(eq);
			noticeKeyEqList.put(noticeId, list);
		}
		
		for (Map.Entry mapEntry : noticeKeyEqList.entrySet()) {
			Map<String, Object> notice = dao.findOne(ApiConstants.MONGO_ID, mapEntry.getKey(), DBBean.ARRIVAL_NOTICE);
//			notice.put(ArrivalNoticeBean.EQ_LIST, value);
			arrivalService.update(notice);
		}
	}

}
