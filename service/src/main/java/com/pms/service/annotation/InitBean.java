package com.pms.service.annotation;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider;
import org.springframework.core.type.filter.AnnotationTypeFilter;

import com.pms.service.PackageRole;
import com.pms.service.dao.ICommonDao;
import com.pms.service.mockbean.DBBean;
import com.pms.service.mockbean.RoleBean;
import com.pms.service.mockbean.UserBean;
import com.pms.service.util.DataEncrypt;

public class InitBean {

    /**
     * 初始化数据库
     * 
     * @param dao
     * @throws SecurityException
     * @throws ClassNotFoundException
     */
    public static void initUserRoleDB(ICommonDao dao) throws SecurityException, ClassNotFoundException {
        ClassPathScanningCandidateComponentProvider scanner = new ClassPathScanningCandidateComponentProvider(false);
        scanner.addIncludeFilter(new AnnotationTypeFilter(RoleValidate.class));
        List<String> roleIds = new ArrayList<String>();

        for (BeanDefinition bd : scanner.findCandidateComponents(PackageRole.class.getPackage().getName())) {
            Method metods[] = Class.forName(bd.getBeanClassName()).getMethods();
            for (Method m : metods) {
                RoleValidate rv = m.getAnnotation(RoleValidate.class);
                if (rv != null) {

                    if (!roleIds.contains(rv.roleID())) {
                        roleIds.add(rv.roleID());
                    }
                    @SuppressWarnings("unchecked")
                    Map<String, Object> role = dao.findOne(RoleBean.ROLE_ID, rv.roleID(), DBBean.DB_ROLE_ITEM);
                    if (role != null) {
                        role.put(RoleBean.ROLE_DESC, rv.desc());
                        dao.updateById(role, DBBean.DB_ROLE_ITEM);
                    } else {
                        Map<String, Object> roleMap = new HashMap<String, Object>();
                        roleMap.put(RoleBean.ROLE_ID, rv.roleID());
                        roleMap.put(RoleBean.ROLE_DESC, rv.desc());
                        dao.add(roleMap, DBBean.DB_ROLE_ITEM);
                    }

                }
            }

        }

        Map<String, Object> adminUser = new HashMap<String, Object>();
        adminUser.put(UserBean.USER_NAME, "admin");

        Map<String, Object> user = dao.findOne(UserBean.USER_NAME, "admin", DBBean.USER);

        if (user != null) {
            user.put(UserBean.ROLES, roleIds);
            dao.updateById(user, DBBean.USER);
        } else {
            adminUser.put(UserBean.ROLES, roleIds);
            adminUser.put(UserBean.PASSWORD, DataEncrypt.generatePassword("123456"));
            dao.add(adminUser, DBBean.USER);
        }
               

    }

}
