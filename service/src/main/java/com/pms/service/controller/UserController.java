package com.pms.service.controller;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.pms.service.annotation.LoginRequired;
import com.pms.service.annotation.RoleValidConstants;
import com.pms.service.annotation.RoleValidate;
import com.pms.service.mockbean.ApiConstants;
import com.pms.service.mockbean.UserBean;
import com.pms.service.service.IUserService;
import com.pms.service.util.ApiThreadLocal;

@Controller
@RequestMapping("/user")
@RoleValidate()
@LoginRequired()
public class UserController extends AbstractController {

    private IUserService userService = null;

    private static Logger logger = LogManager.getLogger(UserController.class);


    @RequestMapping("/register")
    public void register(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> user = parserJsonParameters(request, false);
        responseWithData(userService.updateUser(user), request, response);
    }

    @RequestMapping("/login")
    public void login(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> user = userService.login(parserJsonParameters(request,  false));
        request.getSession().setAttribute(UserBean.USER_ID, user.get(ApiConstants.MONGO_ID));
        request.getSession().setAttribute(UserBean.USER_NAME, user.get(UserBean.USER_NAME));

        responseWithKeyValue(ApiConstants.MONGO_ID, user.get(ApiConstants.MONGO_ID).toString(), request, response);
    }
        
    @RequestMapping("/logout")
    public void logout(HttpServletRequest request, HttpServletResponse response) {
        request.getSession().removeAttribute(UserBean.USER_ID);
        request.getSession().removeAttribute(UserBean.USER_NAME);

        ApiThreadLocal.removeAll();
        responseWithData(null, request, response);
    }

    @RequestMapping("/load")
    public void loadUserInfo(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(userService.loadUserInfo(parserJsonParameters(request,  false)), request, response);
    }
    
    @RequestMapping("/list")
    public void listUsers(HttpServletRequest request, HttpServletResponse response) {
    	Map<String, Object> params = this.parserJsonParameters(request, true);
        responseWithData(userService.listUsers(params), request, response);
    }
       
    @RequestMapping("/update")
    @RoleValidate(roleID = RoleValidConstants.USER_MANAGEMENT, desc = RoleValidConstants.USER_MANAGEMENT_DESC)
    public void updateUser(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(userService.updateUser(parserJsonParameters(request, false)), request, response, "update_success");
    }

    @RequestMapping("/add")
    @RoleValidate(roleID = RoleValidConstants.USER_MANAGEMENT, desc = RoleValidConstants.USER_MANAGEMENT_DESC)
    public void addUser(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(userService.updateUser(parserJsonParameters(request, false)), request, response, "add_success");
    }

    @RequestMapping("/delete")
    @RoleValidate(roleID = RoleValidConstants.USER_MANAGEMENT, desc = RoleValidConstants.USER_MANAGEMENT_DESC)
    public void deleteUser(HttpServletRequest request, HttpServletResponse response) {
        userService.deleteUser(parserJsonParameters(request, false));
        responseWithData(null, request, response);
    }

    
    @RequestMapping("/role/list")
    public void listRoleItems(HttpServletRequest request, HttpServletResponse response) {
    	Map<String, Object> params = this.parserJsonParameters(request, true);
        responseWithData(userService.listRoleItems(params), request, response);
    }
    
    @RequestMapping("/role/not/list")
    public void listNotUserRoleItems(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(userService.listNotUserRoleItems(parserJsonParameters(request, false)), request, response);
    }
    
    
    @RequestMapping("/home")
    public void listUserRoleItems(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(userService.listUserHomePageData(), request, response);
    }
    
    @RequestMapping("/group/list")
    @LoginRequired()
    public void listGroupItems(HttpServletRequest request, HttpServletResponse response) {
    	Map<String, Object> params = this.parserJsonParameters(request, true);
        responseWithData(userService.listGroups(params), request, response);
    }

    
    @RequestMapping("/group/update")
    @RoleValidate(roleID = RoleValidConstants.GROUP_MANAGEMENT, desc = RoleValidConstants.GROUP_MANAGEMENT_DESC)
    public void updateGroupItems(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(userService.updateUserGroup(parserJsonParameters(request,  false)), request, response, "update_success");
    }
    
    @RequestMapping("/group/add")
    @RoleValidate(roleID = RoleValidConstants.GROUP_MANAGEMENT, desc = RoleValidConstants.GROUP_MANAGEMENT_DESC)
    public void addGroupItems(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(userService.updateUserGroup(parserJsonParameters(request,  false)), request, response, "add_success");
    }
    
    @RequestMapping("/group/delete")
    @RoleValidate(roleID = RoleValidConstants.GROUP_MANAGEMENT, desc = RoleValidConstants.GROUP_MANAGEMENT_DESC)
    public void deleteGroupItems(HttpServletRequest request, HttpServletResponse response) {
        userService.deleteUserGroup(parserJsonParameters(request,  false));
        responseWithData(null, request, response);
    }
    
    
    @RequestMapping("/mytasks")
    public void listMyTasks(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(userService.listMyTasks(), request, response);
    }
       



    public IUserService getUserService() {
        return userService;
    }

    public void setUserService(IUserService userService) {
        this.userService = userService;
    }

}
