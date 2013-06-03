package com.pms.service.base;

import junit.framework.TestCase;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.FileSystemXmlApplicationContext;

import com.pms.service.cfg.ConfigurationManager;
import com.pms.service.dao.ICommonDao;
import com.pms.service.dao.impl.mongo.CommonDaoMongoImpl;
import com.pms.service.mockbean.DBBean;
import com.pms.service.service.IUserService;
import com.pms.service.service.impl.UserServiceImpl;

public class BaseTestCase extends TestCase {

    protected static ApplicationContext ac;
    protected static ICommonDao commonDao;
    protected static IUserService userService;
    public static final String TEST_ID = "123456789012345678901234";

    public BaseTestCase() {
        ac = new FileSystemXmlApplicationContext("/src/main/webapp/WEB-INF/applicationContext.xml");
        commonDao = (CommonDaoMongoImpl) ac.getBean("commonDao");
        userService = (UserServiceImpl) ac.getBean("userService");
        ConfigurationManager.setProperties(ConfigurationManager.DB_NAME, "pms_test");
    }

    public void testEmpty() {
        assertTrue(true);
    }
    
    public void setUp(){
//        commonDao.deleteByQuery(null, DBBean.USER);
    }
    
}
