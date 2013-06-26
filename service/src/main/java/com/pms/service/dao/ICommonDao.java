package com.pms.service.dao;

import java.util.List;
import java.util.Map;

import com.mongodb.DBCollection;
import com.mongodb.DBObject;

public interface ICommonDao {

    /**
     * Add a single document into Mongo collection
     * 
     * @param map
     *            the data need to save, parameters should be child of Map, like
     *            HashMap, SortedMap, LinkedHashMap
     * @param collection
     *            the db collection name
     * @return return the id of the document
     */
    public Map<String, Object> add(Map<String, Object> map, String collection);

    /**
     * Add batch data into Mongo collection
     * 
     * @param list
     *            batch Map data for insert
     * @param collection
     * @return
     */
    public boolean addBatch(List<Map<String, Object>> list, String collection);

    /**
     * Add or Update
     * */
    public Map<String, Object> save(Map<String, Object> data, String collection);
    /**
     * 
     * @param parameters
     * @param collection
     * @return the return value contains a key named "results" with a
     *         List<Map<String, Object>> object, a key named "pagenation" with a
     *         Map<String, Object> Object
     */
    public Map<String, Object> list(Map<String, Object> parameters, String collection);

    /**
     * Support complex query, need build customer DB query, check
     * <code>DBQueryUtil.buildQueryObject</code>
     * 
     * @param parameters
     * @param query
     * @param collection
     * @return
     */
    public Map<String, Object> list(Map<String, Object> parameters, DBObject query, String collection);
    
    public List<Object> listLimitKeyValues(Map<String, Object> parameters, String collection);
        
    public Object querySingleKeyById(String key, Object id, String collection);
    
    public Map<String, Object> listToOneMapAndIdAsKey(Map<String, Object> parameters, String collection);
    
    public Map<String, Object> listToOneMapByKey(Map<String, Object> parameters, String collection, String mapKey);

    public Map<String, Object> updateById(Map<String, Object> parameters, String collection);
    
    public Map<String, Object> updateNoDateById(Map<String, Object> parameters, String collection);
    

    public DBCollection getConnection(String dbName, String collection);

    @SuppressWarnings("rawtypes")
    public Map<String,Object> findOneByQuery(Map<String, Object> parameters, String collection);

    @SuppressWarnings("rawtypes")
    public Map findOne(String key, Object value, String collection);
    
    public Map findOne(String key, Object value, String[] limitKeys, String collection);

    public boolean exist(String key, Object value, String collection);

    public boolean exist(Map<String, Object> parameters, String collection);

    public void deleteByIds(List<String> ids, String collection);
    
    public void deleteByQuery(Map<String, Object> parameters, String collection);

    public int count(Map<String, Object> parameters, String collection);

    public int countDistinct(String key, DBObject query, String collection);

    public List<Map<String, Object>> groupQuery(String[] queryKeys, DBObject queryCondition, Map<String, Object> initialParameters, String reduce,
            String finalize, String collection);
    
    public Map<String,Object> loadById(String id, String collection);
    
    public void updateCount(String queryKey, Object queryValue, String updateKey, String collection, double number);
}
