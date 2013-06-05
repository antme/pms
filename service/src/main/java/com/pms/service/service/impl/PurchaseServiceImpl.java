package com.pms.service.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.pms.service.exception.ApiResponseException;
import com.pms.service.mockbean.ApiConstants;
import com.pms.service.mockbean.DBBean;
import com.pms.service.mockbean.UserBean;
import com.pms.service.service.AbstractService;
import com.pms.service.service.ICustomerService;
import com.pms.service.service.IPurchaseService;
import com.pms.service.service.IUserService;
import com.pms.service.util.DataEncrypt;
import com.pms.service.util.status.ResponseCodeConstants;

public class PurchaseServiceImpl extends AbstractService implements IPurchaseService {

    private static final Logger logger = LogManager.getLogger(PurchaseServiceImpl.class);
    
	@Override
	public String geValidatorFileName() {
		return "procure";
	}

	@Override
	public Map<String,Object> create(Map<String, Object> params) {
		return dao.add(params, DBBean.PURCHASE_REQUEST);
	}

	@Override
	public Map<String,Object> update(Map<String, Object> params) {
		return dao.updateById(params, DBBean.PURCHASE_REQUEST);
	}
	
	@Override
	public void destroy(Map<String, Object> params) {
		List<String> ids = new ArrayList<String>();
		ids.add(String.valueOf(params.get(ApiConstants.MONGO_ID)));
		dao.deleteByIds(ids, DBBean.PURCHASE_REQUEST);
	}

	@Override
	public Map<String, Object> list(Map<String, Object> params) {
		return dao.list(params, DBBean.PURCHASE_REQUEST);
	}

	@Override
	public Map<String, Object> prepareRequest(Map<String, Object> params) {
		//list good list basing on projectName from request.
		int count = dao.count(null, "test_goodsInProject");
		if(count != 0) return dao.list(params, "test_goodsInProject");
		
    	for(int i=0; i<10; i++){
    		Map<String,Object> map = new HashMap<String,Object>();
    		map.put("good_name", "网线 A"+i);
    		map.put("good_code", "WARE_"+i);
    		map.put("good_applyCount", 0);
    		map.put("good_totalCount", 100);
    		dao.add(map, "test_goodsInProject");
    	}	
		return dao.list(params, "test_goodsInProject");
	}
}
