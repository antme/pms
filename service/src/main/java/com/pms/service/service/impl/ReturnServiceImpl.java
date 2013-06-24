package com.pms.service.service.impl;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import com.pms.service.mockbean.ApiConstants;
import com.pms.service.mockbean.DBBean;
import com.pms.service.mockbean.ReturnBean;
import com.pms.service.mockbean.UserBean;
import com.pms.service.service.AbstractService;
import com.pms.service.service.IReturnService;
import com.pms.service.util.ApiUtil;

public class ReturnServiceImpl extends AbstractService implements IReturnService {
	
	@Override
	public String geValidatorFileName() {
		return "return";
	}
	
	public Map<String, Object> get(Map<String, Object> params) {
		Map<String, Object> result = dao.findOne(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID), DBBean.BORROWING);
		return result;
	}

	public Map<String, Object> list(Map<String, Object> params) {
		int limit = ApiUtil.getInteger(params, ApiConstants.PAGE_SIZE, 15);
		int limitStart = ApiUtil.getInteger(params, ApiConstants.SKIP, 0);
		Map<String, Object> queryMap = new HashMap<String, Object>();
		queryMap.put(ApiConstants.LIMIT, limit);
		queryMap.put(ApiConstants.LIMIT_START, limitStart);
		return dao.list(queryMap, DBBean.RETURN);
	}

	public Map<String, Object> create(Map<String, Object> params) {
		params.put(ReturnBean.RETURN_STATUS, ReturnBean.RETURN_STATUS_TOBE);
		return dao.add(params, DBBean.RETURN);
	}
	
	public Map<String, Object> option(Map<String, Object> params) {
		Map<String, Object> result = null;
		if (params.containsKey(ReturnBean.RETURN_STATUS)) {
			String status = params.get(ReturnBean.RETURN_STATUS).toString();
			Map<String, Object> cc = dao.findOne(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID), DBBean.RETURN);
	        params.put(ApiConstants.MONGO_ID, cc.get(ApiConstants.MONGO_ID));
	        params.put(ReturnBean.RETURN_STATUS, status);
	        
	        if (status.equals(ReturnBean.RETURN_STATUS_SUBMIT)) {
	        	Map<String, Object> user = dao.findOne(ApiConstants.MONGO_ID, getCurrentUserId(), DBBean.USER);
	        	params.put(ReturnBean.RETURN_APPLICANT, user.get(UserBean.USER_NAME));
	    		params.put(ReturnBean.RETURN_DATE, ApiUtil.formateDate(new Date(), "yyy-MM-dd"));
			}

	        result =  dao.updateById(params, DBBean.RETURN);
		}
        
        return result;
    }

}
