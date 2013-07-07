package com.pms.service.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.pms.service.dbhelper.DBQuery;
import com.pms.service.dbhelper.DBQueryOpertion;
import com.pms.service.exception.ApiResponseException;
import com.pms.service.mockbean.ApiConstants;
import com.pms.service.mockbean.ArrivalNoticeBean;
import com.pms.service.mockbean.DBBean;
import com.pms.service.mockbean.ProjectBean;
import com.pms.service.mockbean.PurchaseCommonBean;
import com.pms.service.mockbean.SalesContractBean;
import com.pms.service.service.AbstractService;
import com.pms.service.service.IArrivalNoticeService;
import com.pms.service.util.ApiUtil;
import com.pms.service.util.status.ResponseCodeConstants;

public class ArrivalNoticeServiceImpl extends AbstractService implements IArrivalNoticeService {

	@Override
	public String geValidatorFileName() {
		return null;
	}

	public Map<String, Object> list(Map<String, Object> params) {
	    mergeMyTaskQuery(params, DBBean.ARRIVAL_NOTICE);
		return dao.list(params, DBBean.ARRIVAL_NOTICE);
	}

	public Map<String, Object> update(Map<String, Object> params) {
		return dao.updateById(params, DBBean.ARRIVAL_NOTICE);
	}

	public void destroy(Map<String, Object> params) {
		List<String> ids = new ArrayList<String>();
		ids.add(String.valueOf(params.get(ApiConstants.MONGO_ID)));
		dao.deleteByIds(ids, DBBean.ARRIVAL_NOTICE);
	}

	public Map<String, Object> create(Map<String, Object> params) {
		
		String foreignKey = (String) params.get(ArrivalNoticeBean.FOREIGN_KEY);
		String type = (String) params.get(ArrivalNoticeBean.SHIP_TYPE);
		
		if (dao.exist(ArrivalNoticeBean.FOREIGN_KEY, foreignKey, DBBean.ARRIVAL_NOTICE)) {
			throw new ApiResponseException("对应到货通知已存在", ResponseCodeConstants.ARRIVAL_NOTICE_ALREADY_EXIST);
		}
		
		if (!ArrivalNoticeBean.SHIP_TYPE_0.equals(type)) {
			Map<String, Object> order = dao.findOne(ApiConstants.MONGO_ID, foreignKey, DBBean.PURCHASE_ORDER);
			if (order != null) {
				if (order.containsKey(PurchaseCommonBean.PROCESS_STATUS)) {
					if (!PurchaseCommonBean.STATUS_ORDER_FINISHED.equals(order.get(PurchaseCommonBean.PROCESS_STATUS))) {
						throw new ApiResponseException("采购未执行完毕", ResponseCodeConstants.PURCHASE_ORDER_UNFINISHED);
					}
				}
				String eqcostDeliveryType = (String) order.get("eqcostDeliveryType");
				
				params.put(ArrivalNoticeBean.FOREIGN_CODE, order.get(PurchaseCommonBean.PURCHASE_ORDER_CODE));
				params.put(ArrivalNoticeBean.PROJECT_ID, order.get(PurchaseCommonBean.PROJECT_ID));
				params.put(ArrivalNoticeBean.SALES_COUNTRACT_ID, order.get(PurchaseCommonBean.SALES_COUNTRACT_ID));
				if(!ApiUtil.isEmpty(type)){
				    params.put(ArrivalNoticeBean.SHIP_TYPE, type); 
				}else{
				    params.put(ArrivalNoticeBean.SHIP_TYPE, eqcostDeliveryType);
				}
				// 入库
				if (type == null) {
					params.put(ArrivalNoticeBean.EQ_LIST, params.get(SalesContractBean.SC_EQ_LIST));
				} else {
					params.put(ArrivalNoticeBean.EQ_LIST, order.get(SalesContractBean.SC_EQ_LIST));
				}
				
			}
		}
		
		params.put(ArrivalNoticeBean.ARRIVAL_DATE, ApiUtil.formateDate(new Date(), "yyy-MM-dd"));
		return dao.add(params, DBBean.ARRIVAL_NOTICE);
	}
	
	 public Map<String, Object> listProjectsForSelect(Map<String, Object> params){
	     Map<String, Object> query = new HashMap<String, Object>();
	     query.put(ApiConstants.LIMIT_KEYS, ArrivalNoticeBean.PROJECT_ID);
	     List<Object> projectIds = this.dao.listLimitKeyValues(query, DBBean.ARRIVAL_NOTICE);
	     
	     Map<String, Object> projectQuery = new HashMap<String, Object>();
	     projectQuery.put(ApiConstants.MONGO_ID, new DBQuery(DBQueryOpertion.IN, projectIds));
	     projectQuery.put(ApiConstants.LIMIT_KEYS, new String[]{ProjectBean.PROJECT_NAME, ProjectBean.PROJECT_CODE});
	     
	     return this.dao.list(projectQuery, DBBean.PROJECT);
	     
	     
	 }
	 
    public Map<String, Object> listByScID(Object scId) {
        Map<String, Object> query = new HashMap<String, Object>();
        query.put(ArrivalNoticeBean.SALES_COUNTRACT_ID, scId);
        query.put(ApiConstants.LIMIT_KEYS, ArrivalNoticeBean.EQ_LIST);
        return listEqlist(query);
    }
    
    public Map<String, Object> listByScIdForBorrowing(Object scId){

        Map<String, Object> query = new HashMap<String, Object>();
        query.put(ArrivalNoticeBean.SALES_COUNTRACT_ID, scId);    
        query.put(ArrivalNoticeBean.SHIP_TYPE, new DBQuery(DBQueryOpertion.NOT_IN, ArrivalNoticeBean.SHIP_TYPE_1));
        query.put(ApiConstants.LIMIT_KEYS, ArrivalNoticeBean.EQ_LIST);
        return listEqlist(query);
    
    }

    private Map<String, Object> listEqlist(Map<String, Object> query) {
        List<Object> obj = this.dao.listLimitKeyValues(query, DBBean.ARRIVAL_NOTICE);

        Map<String, Object> result = new HashMap<String, Object>();

        if (obj.size() == 1) {
            result.put(ArrivalNoticeBean.EQ_LIST, obj.get(0));
        }else{
            result.put(ArrivalNoticeBean.EQ_LIST, new ArrayList<Map<String, Object>>());
        }
        return result;
    }

}
