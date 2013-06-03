package com.pms.service.service.impl;

import java.util.HashMap;
import java.util.Map;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.pms.service.annotation.InitBean;
import com.pms.service.base.BaseTestCase;
import com.pms.service.dao.impl.mongo.CommonDaoMongoImplTest;
import com.pms.service.exception.ApiResponseException;
import com.pms.service.mockbean.ApiConstants;
import com.pms.service.mockbean.UserBean;
import com.pms.service.util.DataEncrypt;

public class UserServiceImplTest extends BaseTestCase {
    private static Logger logger = LogManager.getLogger(CommonDaoMongoImplTest.class);

    public void testUpdateUser() {

        Map<String, Object> newUser = new HashMap<String, Object>();
        newUser.put(UserBean.USER_NAME, "test");
        newUser.put(UserBean.EMAIL, "test@qq.com");
        newUser.put(UserBean.PASSWORD, "abc123_");
        Map<String, Object> updatedUser = userService.updateUser(newUser);
        assertNotNull(updatedUser.get(ApiConstants.MONGO_ID));
        assertEquals(DataEncrypt.generatePassword("abc123_"), newUser.get(UserBean.PASSWORD));

        try {
            updatedUser = userService.updateUser(newUser);
            fail("Same user cannot create again");
        } catch (ApiResponseException e) {

        }
        
        try {
            updatedUser = userService.updateUser(updatedUser);
            assertNotNull(updatedUser.get(ApiConstants.MONGO_ID));
            assertEquals(DataEncrypt.generatePassword("abc123_"), updatedUser.get(UserBean.PASSWORD));
            
            updatedUser.put(UserBean.PASSWORD, "");
            updatedUser = userService.updateUser(updatedUser);           
            assertNull(updatedUser.get(UserBean.PASSWORD));
            
            
     
            
        } catch (ApiResponseException e) {
            fail("Can edit exists user!");

        }
        
        try {
            updatedUser.put(UserBean.PASSWORD, "abc123_");
            userService.login(updatedUser);
        } catch (ApiResponseException e) {
            fail("User can login!");

        }
        
        

        newUser.put(UserBean.USER_NAME, InitBean.ADMIN_USER_NAME);

    }
}
