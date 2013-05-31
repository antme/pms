package com.pms.service.dao.impl.mongo;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.pms.service.base.BaseTestCase;
import com.pms.service.cfg.ConfigurationManager;
import com.pms.service.dbhelper.DBQuery;
import com.pms.service.dbhelper.DBQueryOpertion;
import com.pms.service.mockbean.ApiConstants;
import com.pms.service.util.ApiTestHelper;
import com.pms.service.util.ApiUtil;

public class CommonDaoMongoImplTest extends BaseTestCase {

    private static final String TEST_COLLECTION_NAME = "data_temp";

    private static Logger logger = LogManager.getLogger(CommonDaoMongoImplTest.class);

    public void setUp() {
        commonDao.getConnection(ConfigurationManager.getDbName(), TEST_COLLECTION_NAME).drop();

    }

    public void testAdd() {


    }

    public void testListQuery() {

        commonDao.add(ApiTestHelper.loadJsonMapTestData(CommonDaoMongoImplTest.class, "data", "data1"), TEST_COLLECTION_NAME);
        commonDao.add(ApiTestHelper.loadJsonMapTestData(CommonDaoMongoImplTest.class, "data", "data2"), TEST_COLLECTION_NAME);
        commonDao.add(ApiTestHelper.loadJsonMapTestData(CommonDaoMongoImplTest.class, "data", "data3"), TEST_COLLECTION_NAME);

        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("name", "angry birds");
        Map<String, Object> result = this.commonDao.list(parameters, TEST_COLLECTION_NAME);
        List<Map<String, Object>> results = (List<Map<String, Object>>) result.get(ApiConstants.RESULTS_DATA);
        assertNotNull(results);
        assertEquals(1, results.size());

        parameters.clear();
        parameters.put("name", "angry");
        result = this.commonDao.list(parameters, TEST_COLLECTION_NAME);
        results = (List<Map<String, Object>>) result.get(ApiConstants.RESULTS_DATA);
        assertNotNull(results);
        assertEquals(2, results.size());

    }

    public void testListKeysQuery() {

        commonDao.add(ApiTestHelper.loadJsonMapTestData(CommonDaoMongoImplTest.class, "data", "data1"), TEST_COLLECTION_NAME);
        commonDao.add(ApiTestHelper.loadJsonMapTestData(CommonDaoMongoImplTest.class, "data", "data2"), TEST_COLLECTION_NAME);
        commonDao.add(ApiTestHelper.loadJsonMapTestData(CommonDaoMongoImplTest.class, "data", "data3"), TEST_COLLECTION_NAME);

        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put(ApiConstants.LIMIT_KEYS, new String[] { "name" });
        List<Object> result = this.commonDao.listLimitKeyValues(parameters, TEST_COLLECTION_NAME);
        System.out.println(result);
        // [angry, angry, angry birds]
        assertNotNull(result);
        assertEquals(3, result.size());

        parameters.put(ApiConstants.LIMIT_KEYS, new String[] { "name", "version" });
        result = this.commonDao.listLimitKeyValues(parameters, TEST_COLLECTION_NAME);

        System.out.println(result);
        /*
         * [ {_id=50f391e3e6050df477a8e878, name=angry, version=1.2},
         * {_id=50f391e3e6050df477a8e877, name=angry, version=1.2},
         * {_id=50f391e3e6050df477a8e876, name=angry birds, version=1.2} ]
         */

    }

    public void testListAndMergeOne() {



    }

    public void testListOrderBy() {

        commonDao.add(ApiTestHelper.loadJsonMapTestData(CommonDaoMongoImplTest.class, "data", "data1"), TEST_COLLECTION_NAME);
        commonDao.add(ApiTestHelper.loadJsonMapTestData(CommonDaoMongoImplTest.class, "data", "data2"), TEST_COLLECTION_NAME);
        commonDao.add(ApiTestHelper.loadJsonMapTestData(CommonDaoMongoImplTest.class, "data", "data3"), TEST_COLLECTION_NAME);

        Map<String, Object> parameters = new HashMap<String, Object>();

        Map<String, Object> orderby = new LinkedHashMap<String, Object>();
        parameters.put(ApiConstants.DB_QUERY_ORDER_BY, orderby);

        Map<String, Object> result = this.commonDao.list(parameters, TEST_COLLECTION_NAME);

        System.out.println(result);

    }

    public void testListInQuery() {



    }

    public void testInArrayQuery() {
        commonDao.add(ApiTestHelper.loadJsonMapTestData(CommonDaoMongoImplTest.class, "data", "inquery.data1"), TEST_COLLECTION_NAME);
        commonDao.add(ApiTestHelper.loadJsonMapTestData(CommonDaoMongoImplTest.class, "data", "inquery.data2"), TEST_COLLECTION_NAME);
        commonDao.add(ApiTestHelper.loadJsonMapTestData(CommonDaoMongoImplTest.class, "data", "inquery.data3"), TEST_COLLECTION_NAME);
        Map<String, Object> parameters = new HashMap<String, Object>();
        List<String> dev = new ArrayList<String>();
        dev.add("chengos");
        dev.add("pms");
        parameters.put("developer", new DBQuery(DBQueryOpertion.IN, dev));
        Map<String, Object> result = this.commonDao.list(parameters, TEST_COLLECTION_NAME);
        List<Map<String, Object>> results = (List<Map<String, Object>>) result.get(ApiConstants.RESULTS_DATA);
        assertNotNull(results);
        assertEquals(3, results.size());

    }

    public void testNotNullQuery() {

        commonDao.add(ApiTestHelper.loadJsonMapTestData(CommonDaoMongoImplTest.class, "data", "notnull.data1"), TEST_COLLECTION_NAME);
        commonDao.add(ApiTestHelper.loadJsonMapTestData(CommonDaoMongoImplTest.class, "data", "notnull.data2"), TEST_COLLECTION_NAME);
        commonDao.add(ApiTestHelper.loadJsonMapTestData(CommonDaoMongoImplTest.class, "data", "notnull.data3"), TEST_COLLECTION_NAME);

        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("name", new DBQuery(DBQueryOpertion.NOT_NULL));
        Map<String, Object> result = this.commonDao.list(parameters, TEST_COLLECTION_NAME);
        List<Map<String, Object>> results = (List<Map<String, Object>>) result.get(ApiConstants.RESULTS_DATA);
        assertNotNull(results);
        assertEquals(1, results.size());

    }

    public void testInnerDocQuery() {

        commonDao.add(ApiTestHelper.loadJsonMapTestData(CommonDaoMongoImplTest.class, "data", "inner.data1"), TEST_COLLECTION_NAME);
        commonDao.add(ApiTestHelper.loadJsonMapTestData(CommonDaoMongoImplTest.class, "data", "inner.data2"), TEST_COLLECTION_NAME);
        commonDao.add(ApiTestHelper.loadJsonMapTestData(CommonDaoMongoImplTest.class, "data", "inner.data3"), TEST_COLLECTION_NAME);

        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put(ApiConstants.LIMIT_KEYS, new String[] { "apps.name", "apps.score" });
        parameters.put("apps.name", "augmentum");
        Map<String, Object> result = this.commonDao.list(parameters, TEST_COLLECTION_NAME);
        List<Map<String, Object>> results = (List<Map<String, Object>>) result.get(ApiConstants.RESULTS_DATA);
        assertNotNull(results);
        logger.info(results);

    }

    public void testAddBatch() {

        Map<String, Object> app1 = new HashMap<String, Object>();
        app1.put("author", "dylan");
        app1.put("version", "1.2");
        app1.put("name", "angry birds");

        Map<String, Object> app2 = new HashMap<String, Object>();
        app2.put("author", "harrison");
        app2.put("version", "1.4");
        app2.put("name", "Gold Maner");

        List<Map<String, Object>> dataList = new ArrayList<Map<String, Object>>();
        dataList.add(app1);
        dataList.add(app2);

    }

    public void testGroup() {
        commonDao.add(ApiTestHelper.loadJsonMapTestData(CommonDaoMongoImplTest.class, "data", "group.data1"), TEST_COLLECTION_NAME);
        commonDao.add(ApiTestHelper.loadJsonMapTestData(CommonDaoMongoImplTest.class, "data", "group.data2"), TEST_COLLECTION_NAME);
        commonDao.add(ApiTestHelper.loadJsonMapTestData(CommonDaoMongoImplTest.class, "data", "group.data3"), TEST_COLLECTION_NAME);
        commonDao.add(ApiTestHelper.loadJsonMapTestData(CommonDaoMongoImplTest.class, "data", "group.data4"), TEST_COLLECTION_NAME);
        String[] groupKeys = new String[] { "score" };

        // String reduce = "function(doc,out){out.count++;};";

        List<Map<String, Object>> result = commonDao.groupQuery(groupKeys, null, null, null, null, TEST_COLLECTION_NAME);
        assertTrue(!result.isEmpty());

        for (Map<String, Object> rs : result) {
            if (rs.get("score").toString().equalsIgnoreCase("1")) {
                assertEquals(2, ApiUtil.getIntegerParam(rs, "count").intValue());
            } else if (rs.get("score").toString().equalsIgnoreCase("2")) {
                assertEquals(1, ApiUtil.getIntegerParam(rs, "count").intValue());
            } else if (rs.get("score").toString().equalsIgnoreCase("3")) {
                assertEquals(1, ApiUtil.getIntegerParam(rs, "count").intValue());
            }
        }
    }

    public void testCustomerGroupQuery() {
        commonDao.add(ApiTestHelper.loadJsonMapTestData(CommonDaoMongoImplTest.class, "data", "c.group.data1"), TEST_COLLECTION_NAME);
        commonDao.add(ApiTestHelper.loadJsonMapTestData(CommonDaoMongoImplTest.class, "data", "c.group.data2"), TEST_COLLECTION_NAME);
        commonDao.add(ApiTestHelper.loadJsonMapTestData(CommonDaoMongoImplTest.class, "data", "c.group.data3"), TEST_COLLECTION_NAME);
        commonDao.add(ApiTestHelper.loadJsonMapTestData(CommonDaoMongoImplTest.class, "data", "c.group.data4"), TEST_COLLECTION_NAME);
        commonDao.add(ApiTestHelper.loadJsonMapTestData(CommonDaoMongoImplTest.class, "data", "c.group.data5"), TEST_COLLECTION_NAME);
        commonDao.add(ApiTestHelper.loadJsonMapTestData(CommonDaoMongoImplTest.class, "data", "c.group.data6"), TEST_COLLECTION_NAME);
        String[] groupKeys = new String[] { "city" };

        String reduce = "function(doc,out){out.count++; out.total=out.total+doc.salary;};";
        String finalize = "function(out){out.avg=out.total/out.count;};";
        Map<String, Object> initialParameters = new HashMap<String, Object>();
        initialParameters.put("count", 0);
        initialParameters.put("avg", 0);
        initialParameters.put("total", 0);
        List<Map<String, Object>> result = commonDao.groupQuery(groupKeys, null, initialParameters, reduce, finalize, TEST_COLLECTION_NAME);
        assertTrue(!result.isEmpty());

        for (Map<String, Object> rs : result) {
            // if(rs.get("score").toString().equalsIgnoreCase("1")){
            // assertEquals(2, ApiUtil.getIntegerParam(rs, "count").intValue());
            // }else if(rs.get("score").toString().equalsIgnoreCase("2")){
            // assertEquals(1, ApiUtil.getIntegerParam(rs, "count").intValue());
            // }else if(rs.get("score").toString().equalsIgnoreCase("3")){
            // assertEquals(1, ApiUtil.getIntegerParam(rs, "count").intValue());
            // }
        }
    }

    public void tearDown() {
    }

}
