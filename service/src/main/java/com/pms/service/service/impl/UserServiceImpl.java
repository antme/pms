package com.pms.service.service.impl;

import java.awt.MenuBar;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.google.gson.Gson;
import com.pms.service.annotation.InitBean;
import com.pms.service.cfg.ConfigurationManager;
import com.pms.service.dbhelper.DBQuery;
import com.pms.service.dbhelper.DBQueryOpertion;
import com.pms.service.dbhelper.DBQueryUtil;
import com.pms.service.exception.ApiLoginException;
import com.pms.service.exception.ApiResponseException;
import com.pms.service.mockbean.ApiConstants;
import com.pms.service.mockbean.DBBean;
import com.pms.service.mockbean.GroupBean;
import com.pms.service.mockbean.MenuBean;
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

			if (this.dao.exist(UserBean.USER_NAME, userInfoMap.get(UserBean.USER_NAME), DBBean.USER)) {
				throw new ApiResponseException("username_exists", "username_exists");
			}
			return dao.add(userInfoMap, DBBean.USER);
		}

    }
    
    public Map<String, Object> loadUserInfo(Map<String, Object> map){
        return dao.findOne(ApiConstants.MONGO_ID, map.get(ApiConstants.MONGO_ID), DBBean.USER);
    }
    
    public Map<String, Object> loadMyUserInfo(Map<String, Object> map) {
        String[] limitKeys = new String[] { UserBean.EMAIL, "phone" };
        return dao.findOne(ApiConstants.MONGO_ID, map.get(ApiConstants.MONGO_ID), limitKeys, DBBean.USER);
    }
    
    public Map<String, Object> loadUserInfo(String userId){
        return dao.findOne(ApiConstants.MONGO_ID, userId, DBBean.USER);
    }
    
    public Map<String, Object> loadCurrentUserInfo(){
        return loadUserInfo(ApiThreadLocal.getCurrentUserId());
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
        
        Map<String, Object> lockQuery = new HashMap<String, Object>();
        lockQuery.put(UserBean.USER_NAME, parameters.get(UserBean.USER_NAME));
        lockQuery.put("status", "locked");
        if(this.dao.exist(lockQuery, DBBean.USER)){
            
          throw new ApiResponseException("user_locked", "user_locked");
            
        }
        
        
        Map<String, Object> query = new HashMap<String, Object>();
        query.put(UserBean.USER_NAME, parameters.get(UserBean.USER_NAME));
        query.put(UserBean.PASSWORD, DataEncrypt.generatePassword(parameters.get(UserBean.PASSWORD).toString()));
        query.put("status", new DBQuery(DBQueryOpertion.NOT_EQUALS, "locked"));
        Map<String, Object> user = dao.findOneByQuery(query, DBBean.USER);
        if (user == null) {
            throw new ApiResponseException(String.format("Name or password is incorrect when try to login [%s] ", parameters), ResponseCodeConstants.USER_LOGIN_USER_NAME_OR_PASSWORD_INCORRECT);
        }
        ApiThreadLocal.set(UserBean.USER_ID, user.get(ApiConstants.MONGO_ID));
        ApiThreadLocal.set(UserBean.USER_NAME, user.get(UserBean.USER_NAME));
        logger.info(ApiThreadLocal.get(UserBean.USER_ID));
        
        return user;
    }

    public Map<String, Object> listRoleItems(Map<String, Object> parameters) {
        return this.dao.list(parameters, DBBean.ROLE_ITEM);
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

    public Map<String, Object> listGroups(Map<String, Object> parameters) {
        return this.dao.list(parameters, DBBean.USER_GROUP);
    }

    public Map<String, Object> listUsers(Map<String, Object> parameters) {        
        return this.dao.list(parameters, DBBean.USER);

    }

    public Map<String, Object> updateUserGroup(Map<String, Object> newGroup) {
        Map<String, Object> oldGroup = dao.findOne(ApiConstants.MONGO_ID, newGroup.get(ApiConstants.MONGO_ID), DBBean.USER_GROUP);

        if (oldGroup != null) {
            if (oldGroup.get(GroupBean.GROUP_NAME).equals(GroupBean.GROUP_ADMIN_VALUE)) {
                throw new ApiResponseException("Not allowed to edit admin group!", ResponseCodeConstants.ADMIN_GROUP_EDIT_DISABLED);
            }

            if (oldGroup != null && oldGroup.get(ApiConstants.CREATOR) == null && !oldGroup.get(GroupBean.GROUP_NAME).toString().equalsIgnoreCase(newGroup.get(GroupBean.GROUP_NAME).toString())) {
                throw new ApiResponseException("Not allowed to edit system default group!", ResponseCodeConstants.SYSTEM_GROUP_EDIT_DISABLED);
            }

            newGroup.put(ApiConstants.MONGO_ID, newGroup.get(ApiConstants.MONGO_ID));
            return dao.updateById(newGroup, DBBean.USER_GROUP);
        } else {
            return dao.add(newGroup, DBBean.USER_GROUP);
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
        homeData.put(ApiConstants.MONGO_ID, userId);
        homeData.put("mytasks", listMyTasks());
        homeData.put("isAdmin", isAdmin());
        Map<String, Object> user = this.dao.findOne(ApiConstants.MONGO_ID, userId, new String[]{UserBean.GROUPS}, DBBean.USER);
        
        Map<String, Object> menuQuery = new HashMap<String, Object>();
        menuQuery.put(MenuBean.GROUPS, new DBQuery(DBQueryOpertion.IN, user.get(UserBean.GROUPS)));
        menuQuery.put(ApiConstants.LIMIT_KEYS, MenuBean.MENUID);
        
        homeData.put("menus", this.dao.list(menuQuery, DBBean.MENU).get(ApiConstants.RESULTS_DATA));
        
        
        Map<String, Object> groupQuery = new HashMap<String, Object>();
        groupQuery.put(ApiConstants.MONGO_ID, new DBQuery(DBQueryOpertion.IN, user.get(UserBean.GROUPS)));
        menuQuery.put(ApiConstants.LIMIT_KEYS, GroupBean.GROUP_NAME);
        homeData.put("groups", this.dao.list(groupQuery, DBBean.USER_GROUP).get(ApiConstants.RESULTS_DATA));
        
        homeData.put("isPurchase", isPurchase());
        homeData.put("isDepotManager", isDepotManager()); 
        
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

            if (role==null || !roles.contains(role.get(ApiConstants.MONGO_ID))) {
                logger.debug("Role requried for path : " + path);
                throw new ApiResponseException(String.format("No role to for user[%s] and path[%s]", userId, path), "role_required");
            }
        }
    }


    
    public Map<String, Object> listMyTasks() {
        
        Map<String, Object> result = new HashMap<String, Object>();
        
        queryTasks("draft", result, getMyDraftQuery());

        //FIXME: null as 我的待批
        queryTasks("inprogress", result, null);
      
        //我的回退
        queryTasks("rejected", result, getMyRejectedQuey());

        queryTasks("approved", result, getMyApprovedQuery());

        return result;
    }


    private Map<String, Object> queryTasks(String key, Map<String, Object> result, Map<String, Object> query) {
        List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
        
        String[] dbs = new String[]{DBBean.PURCHASE_REQUEST, DBBean.PURCHASE_BACK, DBBean.PURCHASE_ORDER, 
        		DBBean.PURCHASE_CONTRACT, DBBean.BORROWING, DBBean.PURCHASE_ALLOCATE, DBBean.REPOSITORY, 
        		DBBean.SHIP, DBBean.SALES_CONTRACT};
        
        for(String db: dbs){
            if(query == null){
                getCount(list, getMyInprogressQuery(db), db);
            }else{
                getCount(list, query, db);
            }
        }

        
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

	@Override
    public Map<String, Object> changePassword(Map<String, Object> params) {

        if (!ApiUtil.isEmpty(params.get("passwordOld")) && !ApiUtil.isEmpty(params.get("passwordNew"))) {
            String oldPass = (String) params.get("passwordOld");
            String oldPassEncry = DataEncrypt.generatePassword(oldPass);

            Map<String, Object> user = dao.findOne(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID), DBBean.USER);
            String passIndb = (String) user.get(UserBean.PASSWORD);
            if (!passIndb.equals(oldPassEncry)) {
                throw new ApiResponseException(String.format("Old password is not correct [%s] ", params), ResponseCodeConstants.USER_CHANGE_PASSWORD_OLD_PASSWORD_INCORRECT);
            }

            String newPass = (String) params.get("passwordNew");
            String newPassEncry = DataEncrypt.generatePassword(newPass);
            params.put(UserBean.PASSWORD, newPassEncry);
        }
        params.remove("passwordNew");
        params.remove("passwordOld");
        return dao.updateById(params, DBBean.USER);
    }

	@Override
	public Map<String, Object> listPMs(Map<String, Object> parameters) {
		Map<String, Object> groupPM = dao.findOne(GroupBean.GROUP_NAME, "项目经理", DBBean.USER_GROUP);
	      List<String> groupIds = new ArrayList<String>();

        if (groupPM != null) {
            String pmGid = (String) groupPM.get(ApiConstants.MONGO_ID);

            if (!ApiUtil.isEmpty(pmGid)) {
                groupIds.add(pmGid);
            }

        }
		Map<String, Object> query = new HashMap<String, Object>();
		query.put(UserBean.GROUPS, new DBQuery(DBQueryOpertion.IN, groupIds));
		
		return dao.list(query, DBBean.USER);
	}

	@Override
	public Map<String, Object> importPM(Map<String, Object> map) {
		Map<String, Object> user = dao.findOne(UserBean.USER_NAME, map.get(UserBean.USER_NAME), DBBean.USER);
		
        if (user == null) {
        	Map<String, Object> userGroup = dao.findOne("groupName", "项目经理", DBBean.USER_GROUP);
        	String ugId = (String) userGroup.get(ApiConstants.MONGO_ID);
        	List<String> groups = new ArrayList<String>();
        	groups.add(ugId);
        	map.put(UserBean.GROUPS, groups);
        	map.put(UserBean.PASSWORD, DataEncrypt.generatePassword("123456"));
            user = dao.add(map, DBBean.USER);
        }
        return user;
	}
	
	 public Map<String, Object> getMenuInfo(HashMap<String, Object> parameters){
	     
	     return this.dao.findOne("menuId", parameters.get("menuId"), "menu");
	 }
	 
    public Map<String, Object> saveMenuInfo(HashMap<String, Object> parameters) {
        Map<String, Object> menu = this.dao.findOne("menuId", parameters.get("menuId"), "menu");
        if (!ApiUtil.isEmpty(menu)) {
            parameters.put(ApiConstants.MONGO_ID, menu.get(ApiConstants.MONGO_ID));
            this.dao.updateById(parameters, "menu");
        } else {
            this.dao.add(parameters, "menu");
        }
        return null;
    }
    
    
    public void disableUsers(Map<String, Object> params){
    	String[] ids = (String[]) params.get("ids");
    	
    	for(String id: ids){
    		Map<String, Object> user = new HashMap<String, Object>();
    		user.put(ApiConstants.MONGO_ID, id);
    		user.put("status", "locked");
    		this.dao.updateById(user, DBBean.USER);
    	}
    }
    
	public void enableUsers(Map<String, Object> params) {
		String[] ids = (String[]) params.get("ids");

		for (String id : ids) {
			Map<String, Object> user = new HashMap<String, Object>();
			user.put(ApiConstants.MONGO_ID, id);
			user.put("status", "normal");
			this.dao.updateById(user, DBBean.USER);
		}
	}
	
	public Map<String, Object> updateSystemConfig(Map<String, Object> params) {

		for (String key : params.keySet()) {
			ConfigurationManager.setProperties(key, params.get(key).toString());
		}

		if (ApiUtil.isEmpty(params.get(ApiConstants.MONGO_ID))) {
			return this.dao.add(params, "sysConfig");
		} else {
			return this.dao.updateById(params, "sysConfig");
		}
	}

	public Map<String, Object> loadSystemConfig() {
		return this.dao.findOneByQuery(new HashMap<String, Object>(), "sysConfig");
	}

}
