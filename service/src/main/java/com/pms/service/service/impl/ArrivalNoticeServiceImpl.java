package com.pms.service.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import com.pms.service.exception.ApiResponseException;
import com.pms.service.mockbean.ApiConstants;
import com.pms.service.mockbean.ArrivalNoticeBean;
import com.pms.service.mockbean.DBBean;
import com.pms.service.mockbean.EqCostListBean;
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
				if (ArrivalNoticeBean.SHIP_TYPE_1.equals(type) && !PurchaseCommonBean.EQCOST_DELIVERY_TYPE_DIRECTY.equals(eqcostDeliveryType)) {
					throw new ApiResponseException("只能对直发现场的采购操作", ResponseCodeConstants.JUST_DIRECT);
				}
				params.put(ArrivalNoticeBean.FOREIGN_CODE, order.get(PurchaseCommonBean.PURCHASE_ORDER_CODE));
				params.put(ArrivalNoticeBean.PROJECT_ID, order.get(PurchaseCommonBean.PROJECT_ID));
				params.put(ArrivalNoticeBean.SALES_COUNTRACT_ID, order.get(PurchaseCommonBean.SALES_COUNTRACT_ID));
				params.put(ArrivalNoticeBean.SHIP_TYPE, order.get("eqcostDeliveryType"));
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

}
