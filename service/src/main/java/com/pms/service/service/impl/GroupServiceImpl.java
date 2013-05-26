package com.pms.service.service.impl;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.pms.service.service.AbstractService;
import com.pms.service.service.IGroupService;
import com.pms.service.service.IUserService;

public class GroupServiceImpl extends AbstractService implements IGroupService {

    private static Logger logger = LogManager.getLogger(GroupServiceImpl.class);
    
    private IUserService userService;
    
    
    

    @Override
    public String geValidatorFileName() {
        return "group";
    }

  
}
