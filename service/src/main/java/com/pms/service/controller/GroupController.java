package com.pms.service.controller;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.pms.service.service.IGroupService;

@Controller
@RequestMapping("/group")
public class GroupController extends AbstractController {
    
    private IGroupService groupService;
    
    private static Logger logger = LogManager.getLogger(GroupController.class);

    
    public IGroupService getGroupService() {
        return groupService;
    }

    public void setGroupService(IGroupService groupService) {
        this.groupService = groupService;
    }
    
    
}
