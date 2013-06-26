package com.pms.service.base;

import junit.framework.TestCase;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.FileSystemXmlApplicationContext;

import com.pms.service.cfg.ConfigurationManager;
import com.pms.service.dao.ICommonDao;
import com.pms.service.dao.impl.mongo.CommonDaoMongoImpl;
import com.pms.service.mockbean.DBBean;
import com.pms.service.service.IProjectService;
import com.pms.service.service.IReportService;
import com.pms.service.service.IUserService;
import com.pms.service.service.impl.ProjectServiceImpl;
import com.pms.service.service.impl.ReportServiceImpl;
import com.pms.service.service.impl.UserServiceImpl;

public class BaseTestCase extends TestCase {

    protected static ApplicationContext ac;
    protected static ICommonDao commonDao;
    protected static IUserService userService;
    protected static IProjectService projectService;
    protected static IReportService reportService;
    public static final String TEST_ID = "123456789012345678901234";

    public BaseTestCase() {
        ac = new FileSystemXmlApplicationContext("/src/main/webapp/WEB-INF/applicationContext.xml");
        commonDao = (CommonDaoMongoImpl) ac.getBean("commonDao");
        userService = (UserServiceImpl) ac.getBean("userService");
        projectService = (ProjectServiceImpl) ac.getBean("projectService");
        reportService = (ReportServiceImpl) ac.getBean("reportService");
        ConfigurationManager.setProperties(ConfigurationManager.DB_NAME, "pms");
    }

    public void testEmpty() {
        assertTrue(true);
    }
    
    public void testImportPurchaseContract(){
//    	reportService.importPurchaseContract(null);
    }
    
    public void setUp(){
//        commonDao.deleteByQuery(null, DBBean.USER);
    }
    
}
