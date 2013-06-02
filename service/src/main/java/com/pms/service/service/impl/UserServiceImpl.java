package com.pms.service.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.pms.service.exception.ApiResponseException;
import com.pms.service.mockbean.ApiConstants;
import com.pms.service.mockbean.DBBean;
import com.pms.service.mockbean.GroupBean;
import com.pms.service.mockbean.UserBean;
import com.pms.service.service.AbstractService;
import com.pms.service.service.IUserService;
import com.pms.service.util.DataEncrypt;
import com.pms.service.util.status.ResponseCodeConstants;

public class UserServiceImpl extends AbstractService implements IUserService {

    private static final Logger logger = LogManager.getLogger(UserServiceImpl.class);

    @Override
    public Map<String, Object> updateUser(Map<String, Object> userInfoMap) {

        Map<String, Object> user = dao.findOne("_id", userInfoMap.get("_id"), DBBean.USER);
        if (user != null) {
            
            userInfoMap.put("_id", user.get("_id"));
            return dao.updateById(userInfoMap, DBBean.USER);
            
        } else {
            
            validate(userInfoMap, "register");
            return dao.add(userInfoMap, DBBean.USER);
        }

    }

    public void deleteUser(Map<String, Object> userGroup) {
        List<String> ids = new ArrayList<String>();
        ids.add(userGroup.get("_id").toString());
        dao.deleteByIds(ids, DBBean.USER);
    }

    @Override
    public String login(Map<String, Object> parameters) {
        this.validate(parameters, "login");
        Map<String, Object> query = new HashMap<String, Object>();
        query.put(UserBean.USER_NAME, parameters.get(UserBean.USER_NAME));
        query.put(UserBean.PASSWORD, DataEncrypt.generatePassword(parameters.get(UserBean.PASSWORD).toString()));
        Map<String, Object> user = dao.findOneByQuery(query, DBBean.USER);

        if (user == null) {
            throw new ApiResponseException(String.format("Name or password is incorrect when try to login [%s] ", parameters), ResponseCodeConstants.USER_LOGIN_USER_NAME_OR_PASSWORD_INCORRECT);
        }
        return (String) user.get(ApiConstants.MONGO_ID);
    }

    public Map<String, Object> listRoleItems() {
        return this.dao.list(null, DBBean.ROLE_ITEM);
    }

    public Map<String, Object> listGroups() {
        return this.dao.list(null, DBBean.USER_GROUP);
    }
    
    public Map<String, Object> listGroupRoleItems(Map<String, Object> parameters){
        
        return this.dao.list(null, DBBean.ROLE_ITEM);
    }

    public Map<String, Object> listUsers() {        
        return this.dao.list(null, DBBean.USER);

    }

    public Map<String, Object> updateUserGroup(Map<String, Object> userGroup) {
        Map<String, Object> group = dao.findOne("_id", userGroup.get("_id"), DBBean.USER_GROUP);
        if (group != null) {
            userGroup.put("_id", userGroup.get("_id"));
            dao.updateById(userGroup, DBBean.USER_GROUP);
        } else {
            return dao.add(userGroup, DBBean.USER_GROUP);
        }
        
        return null;
    }

    public void deleteUserGroup(Map<String, Object> userGroup) {

        List<String> ids = new ArrayList<String>();
        ids.add(userGroup.get("_id").toString());
        dao.deleteByIds(ids, DBBean.USER_GROUP);

    }

    @Override
    public String geValidatorFileName() {
        return "user";
    }

    @Override
    public String logout(Map<String, Object> parameters) {
        return null;
    }

}
