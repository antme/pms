package com.pms.service.service;

import java.util.List;
import java.util.Map;

public interface IUserService {

    public Map<String, Object> updateUser(Map<String, Object> map);
    
    public void deleteUser(Map<String, Object> userGroup);

    public String login(Map<String, Object> parameters);

    public String logout(Map<String, Object> parameters);
    
    
    public Map<String, Object> listRoleItems();
    
    public Map<String, Object> listGroups();
    
    
    public Map<String, Object> updateUserGroup(Map<String, Object> userGroup);
    
    
    public void deleteUserGroup(Map<String, Object> userGroup);
    
    public List<String> listUserRoles(String userId);
    
    public void checkUserRole(String userId, String path);
    
    public Map<String, Object> listUsers();

    public Map<String, Object> listGroupRoleItems(Map<String, Object> parameters);
    
}
