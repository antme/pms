package com.pms.service.dao.impl.mongo;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.bson.types.ObjectId;

import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.Mongo;
import com.mongodb.QueryBuilder;
import com.mongodb.WriteConcern;
import com.mongodb.WriteResult;
import com.pms.service.cfg.ConfigurationManager;
import com.pms.service.dao.ICommonDao;
import com.pms.service.dbhelper.DBQueryUtil;
import com.pms.service.dbhelper.Pagnation;
import com.pms.service.exception.ApiResponseException;
import com.pms.service.mockbean.ApiConstants;
import com.pms.service.util.ApiThreadLocal;
import com.pms.service.util.ApiUtil;

public class CommonDaoMongoImpl implements ICommonDao {
    
    private Mongo mongo;

    private static Logger logger = LogManager.getLogger(CommonDaoMongoImpl.class);
    
    public Map<String, Object> add(Map<String, Object> data, String collection) {
  
//        logger.debug(String.format("Add data into collection[%s] with parameters [%s]", collection, data));
        Map<String, Object> clone = DBQueryUtil.generateQueryFields(data);

        ObjectId id = new ObjectId();
        clone.put(ApiConstants.MONGO_ID, id);
        BasicDBObject doc = new BasicDBObject(clone);
        Date date = new Date();
        doc.put(ApiConstants.CREATED_ON, date.getTime());
        doc.put(ApiConstants.UPDATED_ON, date.getTime());
        doc.put(ApiConstants.CREATOR, ApiThreadLocal.getCurrentUserId());
        doc.put(ApiConstants.SERIAL_NUMBER, this.count(null, collection) + 1);
        WriteResult result = this.getConnection(ConfigurationManager.getDbName(), collection).insert(doc);
        doc.put(ApiConstants.MONGO_ID, id.toString());
        return result.getError() == null ? doc : null;
    }

    public boolean addBatch(List<Map<String, Object>> data, String collection) {
//        logger.debug(String.format("Add data into collection[%s] with parameters [%s]", collection, data));
        List<DBObject> dataList = new ArrayList<DBObject>();
        for (Map<String, Object> map : data) {
            BasicDBObject doc = new BasicDBObject(map);
            // TODO: add CREATED_ON, UPDATED_ON here
            dataList.add(doc);
        }
        WriteResult result = this.getConnection(ConfigurationManager.getDbName(), collection).insert(dataList);
        return result.getError() == null ? true : false;
    }

    public Map<String, Object> save(Map<String, Object> data, String collection) {
    	String id = (String)data.get(ApiConstants.MONGO_ID);
    	if(id == null || id.isEmpty()){
    		return add(data, collection);
    	} else {
    		return updateById(data, collection);
    	}
    }
    
    public Map<String, Object> list(Map<String, Object> parameters, String collection) {
        DBObject query = DBQueryUtil.buildQueryObject(parameters, true, true);
        return list(parameters, query, collection);
    }
    
    public Map<String, Object> list(Map<String, Object> parameters, DBObject query, String collection){        
        return doPageNationQuery(parameters, collection, query, false, null);
    }
    
    
    public List<Object> listLimitKeyValues(Map<String, Object> parameters, String collection) {

//        if (parameters.get(ApiConstants.LIMIT_KEYS) == null) {
//            throw new ApiResponseException("should set limitKeys varable", null);
//        }
        String[] limitKeys = getLimitKeys(parameters);

        DBObject query = DBQueryUtil.buildQueryObject(parameters, true, true);
        Pagnation page = getPagnation(parameters);
        DBCursor cursor = getCursor(parameters, collection, query, page);

        if (limitKeys!=null && limitKeys.length == 1) {
            return listMongoKey(parameters, cursor, collection, limitKeys[0]);
        } else {
            return listMongoKey(parameters, cursor, collection, null);

        }

    }
    
    public Object querySingleKeyById(String key, Object id, String collection) {
        String[] limitKeys = { key };
        Map<String, Object> query = new HashMap<String, Object>();
        query.put(ApiConstants.LIMIT_KEYS, limitKeys);
        query.put(ApiConstants.MONGO_ID, id);
        Map<String, Object> object = this.findOneByQuery(query, collection);
        if(object != null){
        	 return object.get(key);
        } else {
        	return null;
        }
    }
    
    public Map<String, Object> listToOneMapAndIdAsKey(Map<String, Object> parameters, String collection){
        DBObject query = DBQueryUtil.buildQueryObject(parameters, true, true);
        Map<String, Object> result = doPageNationQuery(parameters, collection, query, true, null);
        result.remove(ApiConstants.TOTAL);
        result.remove(ApiConstants.RESULTS_DATA);
        result.remove(ApiConstants.PAGENATION);
        return result;
        
    }
    
    public Map<String, Object> listToOneMapByKey(Map<String, Object> parameters, String collection, String mapKey){
        DBObject query = DBQueryUtil.buildQueryObject(parameters, true, true);
        return doPageNationQuery(parameters, collection, query, true, mapKey);
        
    }

    public Map<String,Object> findOneByQuery(Map<String, Object> parameters, String collection) {

        DBObject query = DBQueryUtil.buildQueryObject(parameters, true, true);
               
        BasicDBObject queryKeys = null;
        if (parameters.get(ApiConstants.LIMIT_KEYS) != null) {
            queryKeys = getQueryKey(parameters);
        }

        DBObject result = this.getConnection(ConfigurationManager.getDbName(), collection).findOne(query, queryKeys);

        if (result == null) {
            return null;
        }
        Map<String, Object> map = result.toMap();
        map.remove(ApiConstants.JSON_PARAMETERS_LABEL);
        //FIXME: HOT FIX BUGS
        map.remove("fields");
        map.remove("_defaultId");
        mergeDefaultValue(parameters, collection, map);
        return map;
    }

    private void mergeDefaultValue(Map<String, Object> parameters, String collection, Map<String, Object> map) {
        map.put(ApiConstants.MONGO_ID, map.get(ApiConstants.MONGO_ID).toString());

        
        if (map.get(ApiConstants.CREATED_ON) != null) {
            if (map.get(ApiConstants.CREATED_ON) instanceof Date) {
                Date date = (Date) map.get(ApiConstants.CREATED_ON);
                map.put(ApiConstants.CREATED_ON, date.getTime());
                Map<String, Object> temp = new HashMap<String, Object>();
                temp.put(ApiConstants.MONGO_ID, map.get(ApiConstants.MONGO_ID));
                temp.put(ApiConstants.CREATED_ON, date.getTime());
                this.updateById(temp, collection);
            }
        }

        if (map.get(ApiConstants.UPDATED_ON) != null) {
            if (map.get(ApiConstants.UPDATED_ON) instanceof Date) {
                Date date = (Date) map.get(ApiConstants.UPDATED_ON);
                map.put(ApiConstants.UPDATED_ON, date.getTime());
                Map<String, Object> temp = new HashMap<String, Object>();
                temp.put(ApiConstants.MONGO_ID, map.get(ApiConstants.MONGO_ID));
                temp.put(ApiConstants.UPDATED_ON, date.getTime());
                this.updateById(temp, collection);
            }
        }
    }

    private String concatUrl(String url, Object value){
        if(value.toString().indexOf(url) !=-1){
            return value.toString();
        }
        return url.concat(value.toString());
    }



    @SuppressWarnings("rawtypes")
    @Override
    @Deprecated
    //use findOne(String key, Object value, String[] limitKeys, String collection) to replace
    public Map findOne(String key, Object value, String collection) {
        Map<String, Object> query = new  HashMap<String, Object>();
        query.put(key, value);    
        return this.findOneByQuery(query, collection);
    }
    
    public Map findOne(String key, Object value, String[] limitKeys, String collection){
        Map<String, Object> query = new  HashMap<String, Object>();
        query.put(key, value);    
        query.put(ApiConstants.LIMIT_KEYS, limitKeys);
        return this.findOneByQuery(query, collection);
    }

    public Map<String,Object> loadById(String id, String collection){
        Map<String, Object> query = new HashMap<String, Object>();
        query.put(ApiConstants.MONGO_ID, id);
        return findOneByQuery(query, collection);
    }
    public boolean exist(String key, Object value, String collection) {
        value = convertMongoId(key, value);
        Map<String, Object> caseInsensitiveQuery = new HashMap<String, Object>();
        DBObject query = null;
        caseInsensitiveQuery.put(key, value);
        query = DBQueryUtil.buildQueryObject(caseInsensitiveQuery, true, true);
        return this.getConnection(ConfigurationManager.getDbName(), collection).count(query) > 0 ? true : false;
    }

    public boolean exist(Map<String, Object> parameters, String collection) {
        DBObject query = DBQueryUtil.buildQueryObject(parameters, true, true);
        return this.getConnection(ConfigurationManager.getDbName(), collection).count(query) > 0 ? true : false;
    }

    /**
     * Update DB object by the "_id" property, so the Map should contains the
     * "_id" property
     * 
     * @param map
     *            the data that will be updated
     * @param collection
     *            collection name
     * @return return WriteResult or NUll if no "_id" passed to
     */
    public Map<String, Object> updateById(Map<String, Object> parameters, String collection) {
        Map<String, Object> clone = DBQueryUtil.generateQueryFields(parameters);
        WriteResult result = null;
        if (clone.get(ApiConstants.MONGO_ID) != null) {
            String id = clone.get(ApiConstants.MONGO_ID).toString();
            clone.remove(ApiConstants.MONGO_ID);
            clone.remove(ApiConstants.CREATED_ON);
            
            try {
                // Before update we record the modify trace
                addUpdateHistoryLog(clone, id, collection);
            } catch (Exception e) {
                logger.error("Create history log failed ::::: " + parameters, e);
            }
            clone.put(ApiConstants.UPDATED_ON, new Date().getTime());
            BasicDBObject doc = new BasicDBObject(clone);
            result = this.getConnection(ConfigurationManager.getDbName(), collection).update(new BasicDBObject(ApiConstants.MONGO_ID, new ObjectId(id)),
                    new BasicDBObject("$set", doc));
            clone.put(ApiConstants.MONGO_ID, id);
            return result.getError() == null ? clone : null;

        }
        
        return null;

    }
    
    public void addUpdateHistoryLog(Map<String, Object> newMap, String _id, String collection) {
		String cName = collection + "_history";
		
		List<String> limitKeysList = new ArrayList<String>();

		for (Entry<String, Object> entry : newMap.entrySet()){
			limitKeysList.add(entry.getKey());
		}
		limitKeysList.remove(ApiConstants.UPDATED_ON);
		int limitKeysSize = limitKeysList.size();
		String[] limitKeys = (String[]) limitKeysList.toArray(new String[limitKeysSize]);
		
		Map<String, Object> oldQuery = new HashMap<String, Object>();
		oldQuery.put(ApiConstants.MONGO_ID, _id);
		oldQuery.put(ApiConstants.LIMIT_KEYS, limitKeys);
		Map<String, Object> oldMap = findOneByQuery(oldQuery, collection);
		oldMap.remove(ApiConstants.MONGO_ID);
		oldMap.remove(ApiConstants.CREATED_ON);
		oldMap.remove(ApiConstants.UPDATED_ON);
		
		List<Map<String, Object>> changeFieldList = generateModifiedMaps(_id, oldMap, newMap);
		for (Map<String, Object> map : changeFieldList){
			add(map, cName);
		}
		
	}
    
    /**
     * 更新一条数据库记录前，比较待更新数据与数据库中对应数据 各字段。
     * 提取出改变的字段。
     * 
     * @param _id
     * @param oldMap
     * @param newMap
     * @return
     */
    public List<Map<String, Object>> generateModifiedMaps(String _id, Map<String, Object> oldMap, Map<String, Object> newMap){
    	List<Map<String, Object>> result = new ArrayList<Map<String, Object>>();
		String operator = ApiThreadLocal.getCurrentUserId();
		Long now = new Date().getTime();
		
    	for (Entry<String, Object> entry : newMap.entrySet()){
    		String key = entry.getKey();
    		Object newValue = entry.getValue();
    		Object oldValue = oldMap.get(key);
    		if (oldValue == null && newValue == null){
    			continue;
    		}
    		
    		if (!(oldValue instanceof Map) && !(oldValue instanceof List) && String.valueOf(oldValue).equals(String.valueOf(newValue))){
    			//基本数据类型，且值相等
    			continue;
    		}

    		Map<String, Object> historyItem = new HashMap<String, Object>();
    		historyItem.put(ApiConstants.HISTORY_KEY, key);
    		historyItem.put(ApiConstants.HISTORY_DATA_ID, _id);
    		historyItem.put(ApiConstants.HISTORY_OPERATOR, operator);
    		historyItem.put(ApiConstants.HISTORY_TIME, now);
    		if (oldValue == null && newValue != null && !ApiConstants.UPDATED_ON.equals(key)){//老数据没有值，新数据有值
    			historyItem.put(ApiConstants.HISTORY_OLD, oldValue);
        		historyItem.put(ApiConstants.HISTORY_NEW, newValue);
        		result.add(historyItem);
        		continue;
    		}
    		
    		if (!(oldValue instanceof Map) && !(oldValue instanceof List) && !(String.valueOf(oldValue).equals(String.valueOf(newValue)))){
    			//基本数据类型，且值不相等
    			historyItem.put(ApiConstants.HISTORY_OLD, oldValue);
        		historyItem.put(ApiConstants.HISTORY_NEW, newValue);
        		result.add(historyItem);
    			continue;
    		}
    		
    		if (oldValue instanceof Map){
    			//字段存储一个 Map.只考虑 Map 中的每个value都是 基本数据类型 ： eg. {k0="abc",k1="efg"}
    			Map<String, Object> newValueMap = (Map<String, Object>)newValue;
    			Map<String, Object> oldValueMap = (Map<String, Object>)oldValue;
    			for (Entry<String, Object> e : newValueMap.entrySet()){//记录两种case: 1.新数据中有的key，老数据中没有此key；2. 新老数据都有的key，但value有变化；
    				String k = e.getKey();
    				Object newItemValue = e.getValue();
    				Object oldItemValue = oldValueMap.get(k);
    				oldValueMap.remove(k);
    				if (!(oldItemValue instanceof Map) && !(oldItemValue instanceof List) && 
    						!(String.valueOf(oldItemValue).equals(String.valueOf(newItemValue)))){
    	    			//基本数据类型，且值不相等
    					Map<String, Object> hi = new HashMap<String, Object>();
    					hi.put(ApiConstants.HISTORY_KEY, key+"."+ k);
    					hi.put(ApiConstants.HISTORY_DATA_ID, _id);
    					hi.put(ApiConstants.HISTORY_OPERATOR, operator);
    					hi.put(ApiConstants.HISTORY_TIME, now);
    					hi.put(ApiConstants.HISTORY_OLD, oldValue);
    					hi.put(ApiConstants.HISTORY_NEW, newValue);
    	        		result.add(hi);
    	    			continue;
    	    		}
    			}//end for loop
    			
				if (!oldValueMap.isEmpty()){//记录1中case： 1.老数据中有key，新数据中无此key。相当于删除了此key
					for (Entry<String, Object> oldEn : oldValueMap.entrySet()){
						String k = oldEn.getKey();
						Map<String, Object> hi = new HashMap<String, Object>();
    					hi.put(ApiConstants.HISTORY_KEY, key+"."+ k);
    					hi.put(ApiConstants.HISTORY_DATA_ID, _id);
    					hi.put(ApiConstants.HISTORY_OPERATOR, operator);
    					hi.put(ApiConstants.HISTORY_TIME, now);
    					hi.put(ApiConstants.HISTORY_OLD, oldEn.getValue());
    					hi.put(ApiConstants.HISTORY_NEW, null);
    	        		result.add(hi);
    	    			continue;
					}//end for loop
				}
				
    			continue;
    		}
    		
    		if (oldValue instanceof List){
    			//字段存储一个 List.只考虑List 中存放的是 基本数据类型.eg. ["abc","abcd","efg"]
    			//暂时不记录此种数据痕迹
    			continue;
    		}
    		
    	}
    	return result;
    }
    
    public Map<String, Object> updateNoDateById(Map<String, Object> parameters, String collection) {
        Map<String, Object> clone = DBQueryUtil.generateQueryFields(parameters);
        WriteResult result = null;
        if (clone.get(ApiConstants.MONGO_ID) != null) {
            String id = clone.get(ApiConstants.MONGO_ID).toString();
            clone.remove(ApiConstants.MONGO_ID);
            BasicDBObject doc = new BasicDBObject(clone);

            result = this.getConnection(ConfigurationManager.getDbName(), collection).update(new BasicDBObject(ApiConstants.MONGO_ID, new ObjectId(id)),
                    new BasicDBObject("$set", doc));
            clone.put(ApiConstants.MONGO_ID, id);
            return result.getError() == null ? clone : null;
        }
        return null;

    }    
   

    public void deleteByIds(List<String> ids, String collection) {
        QueryBuilder builder = new QueryBuilder();

        builder.put(ApiConstants.MONGO_ID);
        BasicDBList dbList = new BasicDBList();
        for (String id : ids) {
            dbList.add(new ObjectId(id));
        }
        builder.in(dbList);
        this.getConnection(ConfigurationManager.getDbName(), collection).remove(builder.get());
    }
    
    public void deleteByQuery(Map<String, Object> parameters, String collection) {
        DBObject query = DBQueryUtil.buildQueryObject(parameters, true, true);
        this.getConnection(ConfigurationManager.getDbName(), collection).remove(query);
    }

    public int count(Map<String, Object> parameters, String collection) {

        if (parameters == null || parameters.isEmpty()) {
            return this.getConnection(ConfigurationManager.getDbName(), collection).find().count();
        } else {
            return this.getConnection(ConfigurationManager.getDbName(), collection).find(DBQueryUtil.buildQueryObject(parameters, true, true)).count();
        }
    }
    

    public int countDistinct(String key, DBObject query, String collection){
    	return this.getConnection(ConfigurationManager.getDbName(), collection).distinct(key, query).size();
    }

    
    public List<Map<String, Object>> groupQuery(String[] groupKeys, DBObject queryCondition, Map<String, Object> initialParameters, String reduce, String finalize,  String collection) {
        DBObject query = new BasicDBObject();
        for (String key : groupKeys) {
            query.put(key, true);
        }

        DBObject initial = new BasicDBObject();
        
        if(initialParameters == null){
            initialParameters = new HashMap<String, Object>();
            initialParameters.put("count", 0);
        }
        if (initialParameters != null && !initialParameters.isEmpty()) {
            Set<String> initialKeys = initialParameters.keySet();
            for (String key : initialKeys) {

                initial.put(key, initialParameters.get(key));
            }
        }
        
        if (reduce == null) {
            reduce = "function(doc,out){out.count++;};";
        }
        DBObject object = null;
        if(finalize == null){
            object = this.getConnection(ConfigurationManager.getDbName(), collection).group(query, queryCondition, initial, reduce);
        }else{
            object = this.getConnection(ConfigurationManager.getDbName(), collection).group(query, queryCondition, initial, reduce, finalize);
        }

        List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
        Set set = object.keySet();

        Iterator it = set.iterator();

        while (it.hasNext()) {
            DBObject obj = (DBObject) object.get(it.next().toString());
            list.add(obj.toMap());
        }
        return list;
    }
   

    /**
     * Open a new DBCollection by db name and collection
     * 
     * @param dbName
     *            the db which will to connect
     * @param collection
     * @return
     */
    public DBCollection getConnection(String dbName, String collection) {
        DB db = mongo.getDB(dbName);
        mongo.setWriteConcern(WriteConcern.SAFE);
        return db.getCollection(collection);
    }

    

    private Object convertMongoId(String key, Object value) {
        if (key == ApiConstants.MONGO_ID) {

            try {
                value = new ObjectId(value.toString());
            } catch (IllegalArgumentException e) {
                logger.error("Illegal Object id: ".concat(value.toString()), e);
            }
        }
        return value;
    }

    /**
     * 
     * 
     * @param parameters
     *            include the query values[key:value] and the pagenation info
     *            [limit, limitStart]
     * @param collection
     *            the Mongo db collection which to be query
     * @param query
     *            the Mongo query Object: DBObject
     * @return return Map with results=query objects, pagenation=pagenation
     *         info: limit, limitStart, totalPages
     */
    private Map<String, Object> doPageNationQuery(Map<String, Object> parameters, String collection, DBObject query, boolean mergeToOneMap, String mapKey) {

        Pagnation page = getPagnation(parameters);      
        DBCursor cursor = getCursor(parameters, collection, query, page);
        
        
        Map<String, Object> results  = listMongoObjects(parameters, cursor, collection, mergeToOneMap, mapKey);
        if (page != null) {
//            page.setTotal(cursor.count());
//            Map<String, Object> pageMap = new HashMap<String, Object>();
//            pageMap.put(ApiConstants.LIMIT, page.getLimit());
//            pageMap.put(ApiConstants.LIMIT_START, page.getLimitStart());
//            pageMap.put(ApiConstants.TOTAL_PAGES, page.getTotalPages());
//            pageMap.put(ApiConstants.TOTAL, page.getTotal());
//            results.put(ApiConstants.PAGENATION, pageMap);
        	
        	results.put(ApiConstants.TOTAL, cursor.count());
        }
        
        return results;

    }

    private Pagnation getPagnation(Map<String, Object> parameters) {
        Pagnation page = null;
        

        if (parameters != null) {
            page = new Pagnation();
            if (parameters.get(ApiConstants.LIMIT) != null) {
                page.setLimit(Integer.parseInt(parameters.get(ApiConstants.LIMIT).toString()));
            }

            if (parameters.get(ApiConstants.LIMIT_START) != null) {
                page.setLimitStart(Integer.parseInt(parameters.get(ApiConstants.LIMIT_START).toString()));
            }
        }
        return page;
    }

    private DBCursor getCursor(Map<String, Object> parameters, String collection, DBObject query, Pagnation page) {
        BasicDBObject queryKeys = null;
        BasicDBObject orderObj = new BasicDBObject();
        DBCursor cursor = null;

        if (parameters != null) {
            if (parameters.get(ApiConstants.LIMIT_KEYS) != null) {
                queryKeys = getQueryKey(parameters);
            }

            if (parameters.get(ApiConstants.DB_QUERY_ORDER_BY) != null) {
                Map<String, Object> orderValues = (Map<String, Object>) parameters.get(ApiConstants.DB_QUERY_ORDER_BY);
                Set<String> orderKeys = orderValues.keySet();
                for (String key : orderKeys) {
                    if (orderValues.get(key) != null) {
                        orderObj.put(key, orderValues.get(key));
                    }
                }
            }

        }

        if (orderObj.isEmpty()) {
            orderObj.put(ApiConstants.UPDATED_ON, ApiConstants.DB_QUERY_ORDER_BY_DESC);
        }
        if (page != null && page.getLimit() > 0) {
            // find objects by limit and limit start property
            cursor = this.getConnection(ConfigurationManager.getDbName(), collection).find(query, queryKeys).sort(orderObj).skip(page.getLimitStart())
                    .limit(page.getLimit());
        } else {
            // find all objects if no pagnation info
            cursor = this.getConnection(ConfigurationManager.getDbName(), collection).find(query, queryKeys).sort(orderObj);

        }
        return cursor;
    }

    private BasicDBObject getQueryKey(Map<String, Object> parameters) {
        BasicDBObject queryKeys;
        String keys[] = null;
        keys = getLimitKeys(parameters);

        queryKeys = new BasicDBObject();
        queryKeys.put(ApiConstants.MONGO_ID, 1);
        for (String queryKey : keys) {
            queryKeys.put(queryKey, 1);
        }
        return queryKeys;
    }

    private String[] getLimitKeys(Map<String, Object> parameters) {
        String[] keys;
        if (parameters.get(ApiConstants.LIMIT_KEYS) instanceof String) {
            keys = new String[] { parameters.get(ApiConstants.LIMIT_KEYS).toString() };
        }else{
            keys = (String[]) parameters.get(ApiConstants.LIMIT_KEYS);
        }
        return keys;
    }


    /**
     * 
     * List the objects by DBCursor
     * 
     * @param cursor
     * @return
     */
    @SuppressWarnings("unchecked")
    private Map<String, Object> listMongoObjects(Map<String, Object> parameters, DBCursor cursor, String collection, boolean mergeToMap, String mapKey) {
        Map<String, Object> results = new HashMap<String, Object>();
        List<Map<String, Object>> data = new ArrayList<Map<String, Object>>();
        while (cursor.hasNext()) {
            Map<String, Object> map = cursor.next().toMap();
            mergeDefaultValue(parameters, collection, map);

            if (mergeToMap) {
                if (mapKey == null){
                    results.put(map.get(ApiConstants.MONGO_ID).toString(), map);
                }else{
                    results.put(map.get(mapKey).toString(), map);
                }
                
            } else {
                data.add(map);
            }
        }
        cursor.close();
        results.put(ApiConstants.RESULTS_DATA, data);
        return results;
    }
    

    /**
     * 
     * List the objects by DBCursor
     * 
     * @param cursor
     * @return
     */
    @SuppressWarnings("unchecked")
    private List<Object> listMongoKey(Map<String, Object> parameters, DBCursor cursor, String collection, String key) {
        List<Object> data = new ArrayList<Object>();
        while (cursor.hasNext()) {
            Map<String, Object> map = cursor.next().toMap();
            mergeDefaultValue(parameters, collection, map);

            if (key != null) {
                if(map.get(key)!=null){
                    data.add(map.get(key));
                }
            } else {
                data.add(map);
            }
        }
        cursor.close();
        return data;
    }
    
    public void updateCount(String queryKey, Object queryValue, String updateKey, String collection, double number) {
        Map<String, Object> query = new HashMap<String, Object>();
        query.put(queryKey, queryValue);
        query.put(ApiConstants.LIMIT_KEYS, new String[] { updateKey });
        Map<String, Object> obj = this.findOneByQuery(query, collection);
        if (obj != null && !obj.isEmpty()) {
            Double old = ApiUtil.getDouble(obj, updateKey, 0);
            number = number + old;
            obj.put(updateKey, number);
            this.updateById(obj, collection);
        }
    }

    public Mongo getMongo() {
        return mongo;
    }

    public void setMongo(Mongo mongo) {
        this.mongo = mongo;
    }

}
