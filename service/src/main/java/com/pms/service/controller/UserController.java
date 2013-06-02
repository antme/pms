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
import com.pms.service.service.IUserService;

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

    /**
     * Both client and backend will call this API
     * 
     * @param request
     * @param response
     */
    @RequestMapping("/info/edit")
    @RoleValidate(roleID=RoleValidConstants.USER_INFO_UPDATE, desc = RoleValidConstants.USER_INFO_UPDATE_DESC)
    public void update(HttpServletRequest request, HttpServletResponse response) {
        userService.updateUser(this.parserJsonParameters(request,  false));
        responseWithData(null, request, response);
    }

    @RequestMapping("/login")
    public void login(HttpServletRequest request, HttpServletResponse response) {
        String id = userService.login(parserJsonParameters(request,  false));
        request.getSession().setAttribute("userId", id);
        responseWithKeyValue(ApiConstants.MONGO_ID, id, request, response);
    }

    @RequestMapping("/info")
    public void loadUserInfo(HttpServletRequest request, HttpServletResponse response) {
        responseWithKeyValue(ApiConstants.MONGO_ID, "test", request, response);
    }
    
    
    @RequestMapping("/role/list")
    public void listRoleItems(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(userService.listRoleItems(), request, response);
    }
    
    @RequestMapping("/group/role/list")
    public void listGroupRoleItems(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(userService.listGroupRoleItems(parserJsonParameters(request,  false)), request, response);
    }
    
    
    @RequestMapping("/group/list")
    @LoginRequired()
    public void listGroupItems(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(userService.listGroups(), request, response);
    }

    
    @RequestMapping("/group/update")
    public void updateGroupItems(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(userService.updateUserGroup(parserJsonParameters(request,  false)), request, response, "update_success");
    }
    
    @RequestMapping("/group/add")
    @LoginRequired()
    public void addGroupItems(HttpServletRequest request, HttpServletResponse response) {

        responseWithData(userService.updateUserGroup(parserJsonParameters(request,  false)), request, response, "add_success");
    }
    
    @RequestMapping("/group/delete")
    public void deleteGroupItems(HttpServletRequest request, HttpServletResponse response) {
        userService.deleteUserGroup(parserJsonParameters(request,  false));
        responseWithData(null, request, response);
    }


    @RequestMapping("/list")
    public void listUsers(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(userService.listUsers(), request, response);
    }
    
    
    
    @RequestMapping("/update")
    @RoleValidate(roleID=RoleValidConstants.ROLE_LIST, desc = RoleValidConstants.ROLE_LIST_DESC)
    public void updateUser(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(userService.updateUser(parserJsonParameters(request,  false)), request, response, "update_success");
    }
    
    @RequestMapping("/add")
    @RoleValidate(roleID=RoleValidConstants.ROLE_LIST, desc = RoleValidConstants.ROLE_LIST_DESC)
    public void addUser(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(userService.updateUser(parserJsonParameters(request,  false)), request, response, "add_success");
    }
    
    @RequestMapping("/delete")
    @RoleValidate(roleID=RoleValidConstants.ROLE_LIST, desc = RoleValidConstants.ROLE_LIST_DESC)
    public void deleteUser(HttpServletRequest request, HttpServletResponse response) {
        userService.deleteUser(parserJsonParameters(request,  false));
        responseWithData(null, request, response);
    }

    
    @RequestMapping("/logout")
    public void logout(HttpServletRequest request, HttpServletResponse response) {
        if(request.getSession().getAttribute("userId") != null){           
            request.getSession().removeAttribute("userId");
        }
        responseWithData(null, request, response);
    }


    public IUserService getUserService() {
        return userService;
    }

    public void setUserService(IUserService userService) {
        this.userService = userService;
    }

}
