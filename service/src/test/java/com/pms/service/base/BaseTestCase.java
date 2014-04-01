package com.pms.service.base;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import junit.framework.TestCase;

import org.springframework.context.ApplicationContext;

import com.pms.service.dao.ICommonDao;
import com.pms.service.service.IProjectService;
import com.pms.service.service.ISalesContractService;
import com.pms.service.service.IUserService;
import com.pms.service.util.HttpClientUtil;

public class BaseTestCase extends TestCase {

    protected static ApplicationContext ac;
    protected static ICommonDao commonDao;
    protected static IUserService userService;
    protected static IProjectService projectService;
    protected static ISalesContractService scService;
    public static final String TEST_ID = "123456789012345678901234";

    public BaseTestCase() {
//        ac = new FileSystemXmlApplicationContext("/src/main/webapp/WEB-INF/applicationContext.xml");
//        commonDao = (CommonDaoMongoImpl) ac.getBean("commonDao");
//        userService = (UserServiceImpl) ac.getBean("userService");
//        projectService = (ProjectServiceImpl) ac.getBean("projectService");
//        scService = (ISalesContractService) ac.getBean("salesContractService");
//        ConfigurationManager.setProperties(ConfigurationManager.DB_NAME, "pms_dev");
    }

    public void testEmpty() throws IOException {
//    	
//    	InputStream inputStream = new FileInputStream(new File("/Users/ymzhou/Documents/sc.xlsx"));
//    	Map<String,Object> map = new HashMap<String,Object>();
//		map.put("inputStream", inputStream);
//		scService.importSCExcleFile(map);

		
//		Project project = new Project();
//		projectService.addProject(project);
//		assertNotNull(project);
    	
    	
    	Map<String, Object> parameters = new HashMap<String,Object>();
    	parameters.put("node[title]", "test");
    	parameters.put("node[type]", "gsgg");
    	parameters.put("node[body]", "test");
    	
    	System.out.println(HttpClientUtil.doPost("http://localhost/api/node", parameters));
//    	String s = null;
//    	String s1 = null;
//    	System.out.println(s.equals(s1));
//		
//        assertTrue(true);
//
//        List emails = new ArrayList();
//        emails.add("chen_lieping@thtf.com.cn");
//        emails.add("251148471@qq.com");
//
//        EmailUtil.sendMail("test", emails, "contract approved", null);
    	
//    	  scService.importSCExcleFile(params)
       
    }
    
    public void testImportPurchaseContract(){
//    	reportService.importPurchaseContract(null);
    }
    
    public void setUp(){
//        commonDao.deleteByQuery(null, DBBean.USER);
    }
    
}
