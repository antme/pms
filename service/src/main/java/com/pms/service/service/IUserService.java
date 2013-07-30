package com.pms.service.service;

import java.util.Map;

public interface IUserService {

    public Map<String, Object> updateUser(Map<String, Object> map);
    
    public Map<String, Object> loadUserInfo(Map<String, Object> map); 
    
    public Map<String, Object> loadMyUserInfo(Map<String, Object> map); 
    
    public Map<String, Object> loadUserInfo(String userId); 
    
    public Map<String, Object> loadCurrentUserInfo(); 
    
    public Map<String, Object> importUser(Map<String, Object> map);
    
    public Map<String, Object> importPM(Map<String, Object> map);
    
    public void deleteUser(Map<String, Object> user);

    public Map<String, Object> login(Map<String, Object> parameters);

    public String logout(Map<String, Object> parameters);
    
    
    public Map<String, Object> listRoleItems(Map<String, Object> parameters);
    
    public Map<String, Object> listGroups(Map<String, Object> parameters);
    
    
    public Map<String, Object> updateUserGroup(Map<String, Object> userGroup);
    
    public Map<String, Object> changePassword(Map<String, Object> params);
    
    
    public void deleteUserGroup(Map<String, Object> userGroup);
    
 
    public Map<String, Object> listUserHomePageData();
    
    
    public void checkUserRole(String userId, String path);
    
    public Map<String, Object> listUsers(Map<String, Object> parameters);
    
    public Map<String, Object> listPMs(Map<String, Object> parameters);

    public Map<String, Object> listNotUserRoleItems(Map<String, Object> roles);
    
    
    public Map<String, Object> listMyTasks();

    
}
