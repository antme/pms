package com.pms.service.service;

import java.util.Map;

public interface IUserService {

    public String register(Map<String, Object> parameters);

    public void updateUserInfo(Map<String, Object> map);

    public String login(Map<String, Object> parameters);

    public String logout(Map<String, Object> parameters);
    
    
    public Map<String, Object> listRoleItems();
    
    public Map<String, Object> listGroups();
    
    
    public void updateUserGroup(Map<String, Object> userGroup);
    
    
    public void deleteUserGroup(Map<String, Object> userGroup);
    
}
