package com.pms.service.base;

import java.io.File;
import java.io.IOException;

import junit.framework.TestCase;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.FileSystemXmlApplicationContext;

import com.pms.service.cfg.ConfigurationManager;
import com.pms.service.dao.ICommonDao;
import com.pms.service.dao.impl.mongo.CommonDaoMongoImpl;
import com.pms.service.service.IProjectService;
import com.pms.service.service.IReportService;
import com.pms.service.service.ISalesContractService;
import com.pms.service.service.IUserService;
import com.pms.service.service.impl.ProjectServiceImpl;
import com.pms.service.service.impl.ReportServiceImpl;
import com.pms.service.service.impl.UserServiceImpl;
import com.pms.service.util.EmailUtil;
import com.pms.service.util.ExcleUtil;

public class BaseTestCase extends TestCase {

    protected static ApplicationContext ac;
    protected static ICommonDao commonDao;
    protected static IUserService userService;
    protected static IProjectService projectService;
    protected static IReportService reportService;
    protected static ISalesContractService scService;
    public static final String TEST_ID = "123456789012345678901234";

    public BaseTestCase() {
        ac = new FileSystemXmlApplicationContext("/src/main/webapp/WEB-INF/applicationContext.xml");
        commonDao = (CommonDaoMongoImpl) ac.getBean("commonDao");
        userService = (UserServiceImpl) ac.getBean("userService");
        projectService = (ProjectServiceImpl) ac.getBean("projectService");
        reportService = (ReportServiceImpl) ac.getBean("reportService");
        scService = (ISalesContractService) ac.getBean("salesContractService");
        ConfigurationManager.setProperties(ConfigurationManager.DB_NAME, "pms_dev");
    }

    public void testEmpty() throws IOException {

        File f = new File("F:\\test.xls");

        ExcleUtil eu = new ExcleUtil();
        eu.createFile(f);
        eu = new ExcleUtil(f);

        try {
            eu.addRow(0, new String[] { "a", "b", "c" });
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        assertTrue(true);

        EmailUtil.sendMail("test", "251148471@qq.com", "dylan", "test", "F:\\test.xls");
    }
    
    public void testImportPurchaseContract(){
//    	reportService.importPurchaseContract(null);
    }
    
    public void setUp(){
//        commonDao.deleteByQuery(null, DBBean.USER);
    }
    
}
