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
		
		String type = params.get(ArrivalNoticeBean.SHIP_TYPE).toString();
		String foreignKey = params.get(ArrivalNoticeBean.FOREIGN_KEY).toString();
		
		if (type.equals(ArrivalNoticeBean.SHIP_TYPE_0)) {
			if (dao.exist(ArrivalNoticeBean.FOREIGN_KEY, foreignKey, DBBean.ARRIVAL_NOTICE)) {
				throw new ApiResponseException("对应到货通知已存在", ResponseCodeConstants.ARRIVAL_NOTICE_ALREADY_EXIST);
			}
		}
		
		params.put(ArrivalNoticeBean.ARRIVAL_DATE, ApiUtil.formateDate(new Date(), "yyy-MM-dd"));
		return dao.add(params, DBBean.ARRIVAL_NOTICE);
	}

}
