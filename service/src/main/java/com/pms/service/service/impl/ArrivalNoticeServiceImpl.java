package com.pms.service.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.pms.service.exception.ApiResponseException;
import com.pms.service.mockbean.ApiConstants;
import com.pms.service.mockbean.ArrivalNoticeBean;
import com.pms.service.mockbean.DBBean;
import com.pms.service.mockbean.PurchaseCommonBean;
import com.pms.service.service.AbstractService;
import com.pms.service.service.IArrivalNoticeService;
import com.pms.service.util.ApiUtil;

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
		if (!params.containsKey(PurchaseCommonBean.SALES_COUNTRACT_ID)) {
			throw new ApiResponseException("销售合同id不能为空", "销售合同id不能为空");
		}
		if (params.containsKey(PurchaseCommonBean.PURCHASE_ORDER_ID)) {
			String purchaseOrderId = params.get(PurchaseCommonBean.PURCHASE_ORDER_ID).toString();
			Map<String, Object> purchaseOrder = new HashMap<String, Object>();
			if (dao.exist(PurchaseCommonBean.PURCHASE_ORDER_ID, purchaseOrderId, DBBean.ARRIVAL_NOTICE)) {
				throw new ApiResponseException("采购订单已存在到货通知", "采购订单已存在到货通知");
			}
		}
		params.put(ArrivalNoticeBean.ARRIVAL_DATE, ApiUtil.formateDate(new Date(), "yyy-MM-dd"));
		return dao.add(params, DBBean.ARRIVAL_NOTICE);
	}

}
