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
import com.pms.service.mockbean.PurchaseCommonBean;
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
        Map<String, Object> result = dao.findOne(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID), DBBean.SHIP);
        result.put(SalesContractBean.SC_EQ_LIST, scs.mergeEqListBasicInfo(result.get(SalesContractBean.SC_EQ_LIST)));
        return result;

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
        if (params.get(ShipBean.SHIP_STATUS) == null) {
            params.put(ShipBean.SHIP_STATUS, ShipBean.SHIP_STATUS_DRAFT);
        } 
        if (params.get(ApiConstants.MONGO_ID) != null) {
            return update(params);
        } else {
            return dao.add(params, DBBean.SHIP);

        }
    }
	
	public Map<String, Object> listCanShipEq(Map<String, Object> params) {
		params.put(ArrivalNoticeBean.NOTICE_STATUS, ArrivalNoticeBean.NOTICE_STATUS_NORMAL);
		dao.list(params, DBBean.ARRIVAL_NOTICE);
		return null;
	}
	
	public Map<String, Object> eqlist(Map<String, Object> params) {
		
		String saleId = (String) params.get(ShipBean.SHIP_SALES_CONTRACT_ID);
		// 已到货 的 设备清单，来自于调拨申请,入库和直发到货通知
		Map<String, Object> map = arrivalService.listEqListByScIDForShip(saleId);
		List<Map<String, Object>> purchaseEqList = (List<Map<String, Object>>) map.get(SalesContractBean.SC_EQ_LIST);
		purchaseEqList = scs.mergeEqListBasicInfo(purchaseEqList);

		
		//已发货的数量统计
        Map<String, Object> parameters = new HashMap<String, Object>();
//        parameters.put(ShipBean.SHIP_STATUS, ShipBean.SHIP_STATUS_APPROVE);
        parameters.put(ShipBean.SHIP_SALES_CONTRACT_ID, saleId);
        Map<String, Integer> shipedCountMap = countEqByKey(parameters, DBBean.SHIP, ShipBean.EQCOST_SHIP_AMOUNT, null);
        
        for (Map<String, Object> eqMap : purchaseEqList) {
            int arriveCount = ApiUtil.getInteger(eqMap.get(ArrivalNoticeBean.EQCOST_ARRIVAL_AMOUNT), 0);
            if (shipedCountMap.get(eqMap.get(ApiConstants.MONGO_ID)) != null) {
                eqMap.put(ShipBean.SHIP_LEFT_AMOUNT, arriveCount - shipedCountMap.get(eqMap.get(ApiConstants.MONGO_ID)));
                eqMap.put(ShipBean.EQCOST_SHIP_AMOUNT, arriveCount - shipedCountMap.get(eqMap.get(ApiConstants.MONGO_ID)));
            } else {
                eqMap.put(ShipBean.SHIP_LEFT_AMOUNT, arriveCount);
                eqMap.put(ShipBean.EQCOST_SHIP_AMOUNT, arriveCount);
            }
        }

		Map<String, Object> res = new HashMap<String, Object>();
		res.put(ApiConstants.RESULTS_DATA, purchaseEqList);
		return res;
	}
	
    public Map<String, Object> submit(Map<String, Object> params) {
        params.put(ShipBean.SHIP_DATE, ApiUtil.formateDate(new Date(), "yyy-MM-dd"));
        params.put(ShipBean.SHIP_STATUS, ShipBean.SHIP_STATUS_SUBMIT);
        if (params.get(ApiConstants.MONGO_ID) != null) {
            return dao.updateById(params, DBBean.SHIP);
        } else {
            return dao.add(params, DBBean.SHIP);

        }

    }
	   
    public Map<String, Object> approve(Map<String, Object> params){
        params.put(ShipBean.SHIP_STATUS, ShipBean.SHIP_STATUS_APPROVE);
        return this.dao.updateById(params, DBBean.SHIP);
    }
    
    public Map<String, Object> reject(Map<String, Object> params){
        params.put(ShipBean.SHIP_STATUS, ShipBean.SHIP_STATUS_REJECT);
        return this.dao.updateById(params, DBBean.SHIP); 
    }
	
	public Map<String, Object> record(Map<String, Object> params) {
		List<Map<String, Object>> eqlist = (List<Map<String, Object>>) params.get(ShipBean.SHIP_EQ_LIST);
		boolean close = true;
        for (Map<String, Object> eq : eqlist) {

            if (ApiUtil.isEmpty(eq.get(ShipBean.REPOSITORY_NAME))) {
                //直发才需要检查数量
                int arrivalAmount = ApiUtil.getInteger(eq.get(ShipBean.SHIP_EQ_ACTURE_AMOUNT), 0);
                int amount = ApiUtil.getInteger(eq.get(ShipBean.EQCOST_SHIP_AMOUNT), 0);
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
			Map<String, Object> eqList = new HashMap<String, Object>();
			String noticeId = (String) eq.get(ArrivalNoticeBean.NOTICE_ID);
			if (noticeKeyEqList.containsKey(noticeId)) {
				eqList = (Map<String, Object>) noticeKeyEqList.get(noticeId);
			}
			eqList.put((String) eq.get(ApiConstants.MONGO_ID), eq);
			noticeKeyEqList.put(noticeId, eqList);
		}
		
		for (Map.Entry mapEntry : noticeKeyEqList.entrySet()) {
			Map<String, Object> notice = dao.findOne(ApiConstants.MONGO_ID, mapEntry.getKey(), DBBean.ARRIVAL_NOTICE);
			List<Map<String, Object>> noticeEqList = (List<Map<String, Object>>) notice.get(ArrivalNoticeBean.EQ_LIST);
			Map<String, Object> eqIdKey = (Map<String, Object>) mapEntry.getValue();
			// 是否关闭到货通知 - 全部发货时关闭
			boolean close = true;
			for (Map<String, Object> eq:noticeEqList) {
				if (eqIdKey.containsKey(eq.get(ApiConstants.MONGO_ID))) {
					Map<String, Object> shipEqInfo = (Map<String, Object>) eqIdKey.get(eq.get(ApiConstants.MONGO_ID));
					// 发货数量
					Double shipAmount = (Double) shipEqInfo.get(ShipBean.EQCOST_SHIP_AMOUNT);
					Double arrivalAmount = (Double) eq.get(ArrivalNoticeBean.EQCOST_ARRIVAL_AMOUNT);
					eq.put(ShipBean.EQCOST_SHIP_AMOUNT, shipAmount);
					if (shipAmount != arrivalAmount) {
						close = false;
					}
				} else {
					close = false;
				}
			}
			if (close) {
				notice.put(ArrivalNoticeBean.NOTICE_STATUS, ArrivalNoticeBean.NOTICE_STATUS_CLOSE);
			}
			notice.put(ArrivalNoticeBean.EQ_LIST, noticeEqList);
			arrivalService.update(notice);
		}
	}
	
	// 统计三类虚拟的采购合同在每月的发货合计
	public Map<String, Object> shipCountOfVPC(Map<String, Object> params) {
		Map<String, Object> shipQuery = new HashMap<String, Object>();
		shipQuery.put("eqcostList.contractExecuteCate", new DBQuery(DBQueryOpertion.NOT_NULL));
		
		Map<String, Integer> shipedCountMap = countEqByKey(shipQuery, DBBean.SHIP, ShipBean.EQCOST_SHIP_AMOUNT, null);
		return null;
	}

}
