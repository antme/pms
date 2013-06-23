package com.pms.service.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.pms.service.dbhelper.DBQuery;
import com.pms.service.dbhelper.DBQueryOpertion;
import com.pms.service.mockbean.ApiConstants;
import com.pms.service.mockbean.BorrowingBean;
import com.pms.service.mockbean.DBBean;
import com.pms.service.mockbean.ProjectBean;
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
		
		Map<String, Object> result = dao.list(queryMap, DBBean.BORROWING);
		
		List<Map<String, Object>> list = (List<Map<String, Object>>) result.get(ApiConstants.RESULTS_DATA);
		
		List<String> pId = new ArrayList<String>();
		for (Map<String, Object> p:list){
			if (p.containsKey(BorrowingBean.BORROW_IN_PROJECT_ID)) {
				String inId = p.get(BorrowingBean.BORROW_IN_PROJECT_ID).toString();
				if (!inId.equals("")) {
					pId.add(inId.toString());
				}
			}
			if (p.containsKey(BorrowingBean.BORROW_OUT_PROJECT_ID)) {
				String outId = p.get(BorrowingBean.BORROW_OUT_PROJECT_ID).toString();
				if (!outId.equals("")) {
					pId.add(outId.toString());
				}
			}
		}
		
		// 有项目信息需要获取
		if (!pId.isEmpty()) {
			// 获取project信息
			Map<String, Object> queryContract = new HashMap<String, Object>();
			queryContract.put(ApiConstants.MONGO_ID, new DBQuery(DBQueryOpertion.IN, pId));
			Map<String, Object> cInfoMap = dao.listToOneMapByKey(queryContract, DBBean.PROJECT, ApiConstants.MONGO_ID);
			
			List<String> pmId = new ArrayList<String>();
			
			for (Map<String, Object> p:list){
				String inProjectId = p.get(BorrowingBean.BORROW_IN_PROJECT_ID).toString();
				Map<String, Object> inProjectMap = (Map<String, Object>) cInfoMap.get(inProjectId);
				if (inProjectMap != null) {
					p.put(BorrowingBean.BORROW_IN_PROJECT_CODE, inProjectMap.get(ProjectBean.PROJECT_CODE));
					p.put(BorrowingBean.BORROW_IN_PROJECT_NAME, inProjectMap.get(ProjectBean.PROJECT_NAME));
					p.put(BorrowingBean.BORROW_IN_PROJECT_MANAGER, inProjectMap.get(ProjectBean.PROJECT_MANAGER));
					pmId.add(inProjectMap.get(ProjectBean.PROJECT_MANAGER).toString());
				}
				
				String outProjectId = p.get(BorrowingBean.BORROW_OUT_PROJECT_ID).toString();
				Map<String, Object> outProjectMap = (Map<String, Object>) cInfoMap.get(outProjectId);
				if (outProjectMap != null) {
					p.put(BorrowingBean.BORROW_OUT_PROJECT_CODE, outProjectMap.get(ProjectBean.PROJECT_CODE));
					p.put(BorrowingBean.BORROW_OUT_PROJECT_NAME, outProjectMap.get(ProjectBean.PROJECT_NAME));
					p.put(BorrowingBean.BORROW_OUT_PROJECT_MANAGER, outProjectMap.get(ProjectBean.PROJECT_MANAGER));
					pmId.add(outProjectMap.get(ProjectBean.PROJECT_MANAGER).toString());
				}
			}
			
			if (!pmId.isEmpty()) {
				// 获取项目负责人信息
				Map<String, Object> pmQueryContract = new HashMap<String, Object>();
				pmQueryContract.put(ApiConstants.MONGO_ID, new DBQuery(DBQueryOpertion.IN, pmId));
				pmQueryContract.put(ApiConstants.LIMIT_KEYS, new String[] {UserBean.USER_NAME});
				Map<String, Object> pmMap = dao.listToOneMapByKey(pmQueryContract, DBBean.USER, ApiConstants.MONGO_ID);
				
				for (Map<String, Object> p:list){
					if (p.containsKey(BorrowingBean.BORROW_IN_PROJECT_MANAGER)) {
						String inPmId = p.get(BorrowingBean.BORROW_IN_PROJECT_MANAGER).toString();
						if (!inPmId.equals("")) {
							Map<String, Object> inPmMap = (Map<String, Object>) pmMap.get(inPmId);
							if (inPmMap != null) {
								p.put(BorrowingBean.BORROW_IN_PROJECT_MANAGER, inPmMap.get(UserBean.USER_NAME));
							}
						}
					}
					
					if (p.containsKey(BorrowingBean.BORROW_OUT_PROJECT_MANAGER)) {
						String outPmId = p.get(BorrowingBean.BORROW_OUT_PROJECT_MANAGER).toString();
						if (!outPmId.equals("")) {
							Map<String, Object> outPmMap = (Map<String, Object>) pmMap.get(outPmId);
							if (outPmMap != null) {
								p.put(BorrowingBean.BORROW_OUT_PROJECT_MANAGER, outPmMap.get(UserBean.USER_NAME));
							}
						}
					}
				}
			}
		}
		
		return result;
	}

	public Map<String, Object> create(Map<String, Object> params) {
		params.put(BorrowingBean.BORROW_STATUS, 0);
		params.put(BorrowingBean.BORROW_DATE, ApiUtil.formateDate(new Date(), "yyy-MM-dd"));
		return dao.add(params, DBBean.BORROWING);
	}
	
	public Map<String, Object> option(Map<String, Object> params) {
		Map<String, Object> result = null;
		if (params.containsKey(BorrowingBean.BORROW_STATUS)) {
			Map<String, Object> cc = dao.findOne(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID), DBBean.BORROWING);
	        params.put(ApiConstants.MONGO_ID, cc.get(ApiConstants.MONGO_ID));
	        params.put(BorrowingBean.BORROW_STATUS, params.get(BorrowingBean.BORROW_STATUS));

	        result =  dao.updateById(params, DBBean.BORROWING);
		}
        
        return result;
    }

}
