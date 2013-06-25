package com.pms.service.service.impl;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.pms.service.annotation.InitBean;
import com.pms.service.dbhelper.DBQuery;
import com.pms.service.dbhelper.DBQueryOpertion;
import com.pms.service.dbhelper.DBQueryUtil;
import com.pms.service.exception.ApiLoginException;
import com.pms.service.exception.ApiResponseException;
import com.pms.service.mockbean.ApiConstants;
import com.pms.service.mockbean.DBBean;
import com.pms.service.mockbean.GroupBean;
import com.pms.service.mockbean.PurchaseBack;
import com.pms.service.mockbean.PurchaseRequest;
import com.pms.service.mockbean.RoleBean;
import com.pms.service.mockbean.ShipBean;
import com.pms.service.mockbean.UserBean;
import com.pms.service.service.AbstractService;
import com.pms.service.service.IUserService;
import com.pms.service.service.impl.PurchaseServiceImpl.PurchaseStatus;
import com.pms.service.util.ApiThreadLocal;
import com.pms.service.util.ApiUtil;
import com.pms.service.util.DataEncrypt;
import com.pms.service.util.status.ResponseCodeConstants;

public class UserServiceImpl extends AbstractService implements IUserService {

    private static final Logger logger = LogManager.getLogger(UserServiceImpl.class);


    
    /**
     * 新用户添加，编辑，管理员账号不允许编辑
     * 
     * @param
     * @return
     * 
     */
    public Map<String, Object> updateUser(Map<String, Object> userInfoMap) {


        Map<String, Object> user = dao.findOne(ApiConstants.MONGO_ID, userInfoMap.get(ApiConstants.MONGO_ID), DBBean.USER);
        if (user != null) {
            
            //管理员不允许编辑
            if (user.get(UserBean.USER_NAME).equals(InitBean.ADMIN_USER_NAME)) {
                throw new ApiResponseException("Not allowed to edit admin account!", ResponseCodeConstants.ADMIN_EDIT_DISABLED);
            }
            if (!ApiUtil.isEmpty(userInfoMap.get(UserBean.PASSWORD)) && !userInfoMap.get(UserBean.PASSWORD).equals(user.get(UserBean.PASSWORD))) {
                userInfoMap.put(UserBean.PASSWORD, DataEncrypt.generatePassword(userInfoMap.get(UserBean.PASSWORD).toString()));
            } else {
                // 密码没有修改的时候不需要更新
                userInfoMap.remove(UserBean.PASSWORD);
            }
            userInfoMap.put(ApiConstants.MONGO_ID, user.get(ApiConstants.MONGO_ID));
            return dao.updateById(userInfoMap, DBBean.USER);

        } else {
            validate(userInfoMap, "register");
            userInfoMap.put(UserBean.PASSWORD, DataEncrypt.generatePassword(userInfoMap.get(UserBean.PASSWORD).toString()));
            return dao.add(userInfoMap, DBBean.USER);
        }

    }
    
    public Map<String, Object> loadUserInfo(Map<String, Object> map){
        return dao.findOne(ApiConstants.MONGO_ID, map.get(ApiConstants.MONGO_ID), DBBean.USER);
    }
    
    public Map<String, Object> importUser(Map<String, Object> map){
        Map<String, Object> user = dao.findOne(UserBean.USER_NAME, map.get(UserBean.USER_NAME), DBBean.USER);
        if (user == null) {
            user =  dao.add(map, DBBean.USER);
        }
        return user;
    }

    public void deleteUser(Map<String, Object> user) {

        Map<String, Object> adminUser = dao.findOne(ApiConstants.MONGO_ID, user.get(ApiConstants.MONGO_ID), DBBean.USER);
        if (adminUser != null && adminUser.get(UserBean.USER_NAME).equals(InitBean.ADMIN_USER_NAME)) {
            // 管理员不允许删除
            throw new ApiResponseException("Not allowed to delete admin account!", ResponseCodeConstants.ADMIN_EDIT_DISABLED);
        }
        List<String> ids = new ArrayList<String>();
        ids.add(user.get(ApiConstants.MONGO_ID).toString());
        dao.deleteByIds(ids, DBBean.USER);
    }

    @Override
    public Map<String, Object> login(Map<String, Object> parameters) {
        this.validate(parameters, "login");
        Map<String, Object> query = new HashMap<String, Object>();
        query.put(UserBean.USER_NAME, parameters.get(UserBean.USER_NAME));
        query.put(UserBean.PASSWORD, DataEncrypt.generatePassword(parameters.get(UserBean.PASSWORD).toString()));
        Map<String, Object> user = dao.findOneByQuery(query, DBBean.USER);
        if (user == null) {
            throw new ApiResponseException(String.format("Name or password is incorrect when try to login [%s] ", parameters), ResponseCodeConstants.USER_LOGIN_USER_NAME_OR_PASSWORD_INCORRECT);
        }
        ApiThreadLocal.set(UserBean.USER_ID, user.get(ApiConstants.MONGO_ID));
        ApiThreadLocal.set(UserBean.USER_NAME, user.get(UserBean.USER_NAME));
        logger.info(ApiThreadLocal.get(UserBean.USER_ID));
        
        return user;
    }

    public Map<String, Object> listRoleItems() {
        return this.dao.list(null, DBBean.ROLE_ITEM);
    }
    
    public Map<String, Object> listNotUserRoleItems(Map<String, Object> roles) {

        if (ApiThreadLocal.get(UserBean.USER_ID) != null) {
            List<String> userRoles = this.listUserRoleIds(ApiThreadLocal.get(UserBean.USER_ID).toString());
            String[] checkRoles = roles.get("ids").toString().split(",");
            List<String> notUserRoles = new ArrayList<String>();

            for (String role : checkRoles) {
                if (!userRoles.contains(role.trim())) {
                    notUserRoles.add(role.trim());
                }
            }

            Map<String, Object> resutls = new HashMap<String, Object>();
            resutls.put("data", notUserRoles);
            return resutls;

        } else {
            throw new ApiLoginException();
        }
    }

    public Map<String, Object> listGroups() {
        return this.dao.list(null, DBBean.USER_GROUP);
    }

    public Map<String, Object> listUsers() {        
        return this.dao.list(null, DBBean.USER);

    }

    public Map<String, Object> updateUserGroup(Map<String, Object> userGroup) {
        Map<String, Object> group = dao.findOne(ApiConstants.MONGO_ID, userGroup.get(ApiConstants.MONGO_ID), DBBean.USER_GROUP);

        if (group != null) {
            if (group.get(GroupBean.GROUP_NAME).equals(GroupBean.GROUP_ADMIN_VALUE)) {
                throw new ApiResponseException("Not allowed to edit admin group!", ResponseCodeConstants.ADMIN_GROUP_EDIT_DISABLED);
            }

            if (group != null && group.get(ApiConstants.CREATOR) == null && !group.get(GroupBean.GROUP_NAME).toString().equalsIgnoreCase(userGroup.get(GroupBean.GROUP_NAME).toString())) {
                throw new ApiResponseException("Not allowed to edit system default group!", ResponseCodeConstants.ADMIN_GROUP_EDIT_DISABLED);
            }

            userGroup.put(ApiConstants.MONGO_ID, userGroup.get(ApiConstants.MONGO_ID));
            return dao.updateById(userGroup, DBBean.USER_GROUP);
        } else {
            return dao.add(userGroup, DBBean.USER_GROUP);
        }

    }

    public void deleteUserGroup(Map<String, Object> userGroup) {        
        Map<String, Object> group = dao.findOne(ApiConstants.MONGO_ID, userGroup.get(ApiConstants.MONGO_ID), DBBean.USER_GROUP);

        if (group != null && group.get(ApiConstants.CREATOR) == null) {
            throw new ApiResponseException("Not allowed to delete system default group!", ResponseCodeConstants.ADMIN_GROUP_DELETE_DISABLED);
        }
            
        List<String> ids = new ArrayList<String>();
        ids.add(userGroup.get(ApiConstants.MONGO_ID).toString());
        dao.deleteByIds(ids, DBBean.USER_GROUP);
    }

    
    public Map<String, Object> listUserHomePageData() {
        String userId = ApiThreadLocal.getCurrentUserId();
        List<String> ids = listUserRoleIds(userId);
        Map<String, Object> query = new HashMap<String, Object>();
        query.put(ApiConstants.MONGO_ID, new DBQuery(DBQueryOpertion.IN, ids));
        Map<String, Object> homeData = this.dao.list(query, DBBean.ROLE_ITEM);
        homeData.put(UserBean.USER_NAME, ApiThreadLocal.getCurrentUserName());

        homeData.put("mytasks", listMyTasks());
        return homeData;
    }
    
    public void checkUserRole(String userId, String path) {

        String roleId = InitBean.rolesValidationMap.get(path);

        if (roleId != null) {
            if (userId == null) {
                logger.debug("Role requried for path : " + path);
                throw new ApiResponseException(String.format("No role to for user[%s] and path[%s]", userId, path), "role_required");
            }
            List<String> roles = this.listUserRoleIds(userId);

            Map<String, Object> limitQuery = new HashMap<String, Object>();
            limitQuery.put(RoleBean.ROLE_ID, new DBQuery(DBQueryOpertion.IN, roleId.split(",")));
            limitQuery.put(ApiConstants.LIMIT_KEYS, new String[] { RoleBean.ROLE_ID });
            Map<String, Object> role = dao.findOneByQuery(limitQuery, DBBean.ROLE_ITEM);

            if (!roles.contains(role.get(ApiConstants.MONGO_ID))) {
                logger.debug("Role requried for path : " + path);
                throw new ApiResponseException(String.format("No role to for user[%s] and path[%s]", userId, path), "role_required");
            }
        }
    }

    public List<String> listUserRoleIds(String userId) {
        Map<String, Object> query = new HashMap<String, Object>();
        query.put(ApiConstants.MONGO_ID, userId);
        query.put(ApiConstants.LIMIT_KEYS, new String[] { UserBean.GROUPS });
        Map<String, Object> user = dao.findOneByQuery(query, DBBean.USER);
        List<String> groups = (List<String>) user.get(UserBean.GROUPS);
        
        Map<String, Object> limitQuery = new HashMap<String, Object>();
        limitQuery.put(ApiConstants.MONGO_ID, new DBQuery(DBQueryOpertion.IN, groups));
        limitQuery.put(ApiConstants.LIMIT_KEYS, new String[]{GroupBean.ROLES});
        
        List<Object> list = dao.listLimitKeyValues(limitQuery, DBBean.USER_GROUP);
        List<String> roles = new ArrayList<String>();

        for(Object role: list){
            roles.addAll((Collection<? extends String>) role);
        }
        
        if(user.get(UserBean.OTHER_ROLES)!=null){
            roles.addAll((List<? extends String>) user.get(UserBean.OTHER_ROLES));
        }

        return roles;
    }
    
    public Map<String, Object> listMyTasks() {
        
        Map<String, Object> result = new HashMap<String, Object>();
        
        queryTasks("draft", result, getMyDraftQuery());

        queryTasks("inprogress", result, getMyInprogressQuery());
      
        //我的回退
        queryTasks("rejected", result, getMyRejectedQuey());

        queryTasks("approved", result, getMyApprovedQuery());

        return result;
    }


    private Map<String, Object> queryTasks(String key, Map<String, Object> result, Map<String, Object> query) {
        List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
        
        getCount(list, query, DBBean.PURCHASE_REQUEST);
        getCount(list, query, DBBean.PURCHASE_BACK);
        getCount(list, query, DBBean.PURCHASE_ORDER);
        getCount(list, query, DBBean.PURCHASE_CONTRACT);
        getCount(list, query, DBBean.PURCHASE_CONTRACT);
        getCount(list, query, DBBean.PURCHASE_ALLOCATE);
        getCount(list, query, DBBean.REPOSITORY);
        getCount(list, query, DBBean.SHIP);
        
        result.put(key, list);
        int count = 0;
        for(Map<String, Object>  item: list){
            count = count + Integer.parseInt(item.get("count").toString());
        }
        result.put(key + "Length", count);
        return result;
    }

    private void getCount(List<Map<String, Object>> results, Map<String, Object> myDraftPurchaseRequest, String db) {
        int count = this.dao.count(myDraftPurchaseRequest, db);
        Map<String, Object> countMap = new HashMap<String, Object>();
        if (count > 0) {
            countMap.put("db", db);
            countMap.put("count", count);
            results.add(countMap);
        }
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
