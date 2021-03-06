package com.pms.service.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.pms.service.dbhelper.DBQuery;
import com.pms.service.dbhelper.DBQueryOpertion;
import com.pms.service.mockbean.ApiConstants;
import com.pms.service.mockbean.DBBean;
import com.pms.service.mockbean.UserBean;
import com.pms.service.service.AbstractService;
import com.pms.service.service.IModifyHistoryLogService;
import com.pms.service.util.ApiUtil;
import com.pms.service.util.DateUtil;

public class ModifyHistoryLogServiceImpl extends AbstractService implements IModifyHistoryLogService {

	@Override
	public String geValidatorFileName() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Map<String, Object> listHistoryByCollectionAndId(String collection,
			String id, List<String> keys) {
		Map<String, Object> query = new HashMap<String, Object>();
		query.put(ApiConstants.HISTORY_DATA_ID, id);
		query.put(ApiConstants.HISTORY_KEY, new DBQuery(DBQueryOpertion.IN, keys));
		
		Map<String, Object> order = new LinkedHashMap<String, Object>();
        order.put(ApiConstants.HISTORY_TIME, ApiConstants.DB_QUERY_ORDER_BY_DESC);
        query.put(ApiConstants.DB_QUERY_ORDER_BY, order);
        
        String[] limitKeys = {ApiConstants.HISTORY_KEY, ApiConstants.HISTORY_OLD, ApiConstants.HISTORY_NEW,
        		ApiConstants.HISTORY_OPERATOR, ApiConstants.HISTORY_TIME, ApiConstants.HISTORY_DATA_ID};
        query.put(ApiConstants.LIMIT_KEYS, limitKeys);
        
        Map<String, Object> result = dao.list(query, collection+"_history");
		return result;
	}

	@Override
	public List<Map<String, Object>> listHistoryBySonCollectionAndId(
			String sonCollection, String foreignName, String foreignValue,
			List<String> keys) {
		List<Map<String, Object>> result = new ArrayList<Map<String, Object>>();
		
		Map<String, Object> sonQuery = new HashMap<String, Object>();
		sonQuery.put(foreignName, foreignValue);
		sonQuery.put(ApiConstants.LIMIT_KEYS, new String[] {ApiConstants.MONGO_ID});
		Map<String, Object> sonResult = dao.list(sonQuery, sonCollection);
		List<Map<String, Object>> sonResultList = (List<Map<String, Object>>) sonResult.get(ApiConstants.RESULTS_DATA);
		List<String> ids = new ArrayList<String>();
		for (Map<String, Object> map : sonResultList){
			ids.add((String)map.get(ApiConstants.MONGO_ID));
		}
		
		for (String dataId : ids){
			result.add(this.listHistoryByCollectionAndId(sonCollection, dataId, keys));
		}
		return result;
	}

	@Override
	public Map<String, Object> listHistoryForAKey(String collection, String id,
			String key) {
		Map<String, Object> query = new HashMap<String, Object>();
		query.put(ApiConstants.HISTORY_DATA_ID, id);
		query.put(ApiConstants.HISTORY_KEY, key);
		
		Map<String, Object> order = new LinkedHashMap<String, Object>();
        order.put(ApiConstants.HISTORY_TIME, ApiConstants.DB_QUERY_ORDER_BY_DESC);
        query.put(ApiConstants.DB_QUERY_ORDER_BY, order);
        
        String[] limitKeys = {ApiConstants.HISTORY_KEY, ApiConstants.HISTORY_OLD, ApiConstants.HISTORY_NEW,
        		ApiConstants.HISTORY_OPERATOR, ApiConstants.HISTORY_TIME, ApiConstants.HISTORY_DATA_ID};
        query.put(ApiConstants.LIMIT_KEYS, limitKeys);
        
        Map<String, Object> result = dao.list(query, collection+"_history");
        List<Map<String, Object>> resultList = (List<Map<String, Object>>) result.get(ApiConstants.RESULTS_DATA);
        
        List<String> operatorIds = new ArrayList<String>();
        for (Map<String, Object> map : resultList){
        	operatorIds.add((String)map.get(ApiConstants.HISTORY_OPERATOR));
        }
        
        Map<String, Object> operatorQuery = new HashMap<String, Object>();
        operatorQuery.put(ApiConstants.MONGO_ID, new DBQuery(DBQueryOpertion.IN, operatorIds));
        operatorQuery.put(ApiConstants.LIMIT_KEYS, new String[] {UserBean.USER_NAME});
        Map<String, Object> userMap = dao.listToOneMapAndIdAsKey(operatorQuery, DBBean.USER);
        
        for (Map<String, Object> map : resultList){
        	String operatorId = (String)map.get(ApiConstants.HISTORY_OPERATOR);
        	Map<String, Object> userInfo = (Map<String, Object>) userMap.get(operatorId);

        	map.put(ApiConstants.HISTORY_OPERATOR, userInfo.get(UserBean.USER_NAME));
        	Long times = ApiUtil.getLongParam(map, ApiConstants.HISTORY_TIME);
        	map.put(ApiConstants.HISTORY_TIME, DateUtil.getDateStringByLong(times));
        }
		return result;
	}


}
