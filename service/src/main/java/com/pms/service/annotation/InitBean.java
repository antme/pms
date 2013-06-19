package com.pms.service.annotation;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider;
import org.springframework.core.type.filter.AnnotationTypeFilter;
import org.springframework.web.bind.annotation.RequestMapping;

import com.pms.service.PackageRole;
import com.pms.service.dao.ICommonDao;
import com.pms.service.mockbean.ApiConstants;
import com.pms.service.mockbean.DBBean;
import com.pms.service.mockbean.GroupBean;
import com.pms.service.mockbean.RoleBean;
import com.pms.service.mockbean.UserBean;
import com.pms.service.util.DataEncrypt;

public class InitBean {

    public static final Set<String> loginPath = new HashSet<String>();
    public static final Map<String, String> validationPath = new HashMap<String, String>();
    public static final Map<String, String> rolesValidationMap = new HashMap<String, String>();
    private static final Logger logger = LogManager.getLogger(InitBean.class);

    public static final String ADMIN_USER_NAME = "admin";
    
    /**
     * 初始化数据库
     * 
     * @param dao
     * @throws SecurityException
     * @throws ClassNotFoundException
     */
    public static void initUserRoleDB(ICommonDao dao) throws SecurityException, ClassNotFoundException {
        initRoleItems(dao);
        setLoginPathValidation();

        createAdminGroup(dao);
        createSystemDefaultGroups(dao);
        createAdminUser(dao);
    }
    
    

    private static void createSystemDefaultGroups(ICommonDao dao) {
        String[] groupNames = new String[] { GroupBean.DEPARTMENT_ASSISTANT_VALUE, GroupBean.DEPARTMENT_MANAGER_VALUE, GroupBean.COO_VALUE, GroupBean.DEPOT_MANAGER_VALUE, GroupBean.PURCHASE_VALUE, GroupBean.FINANCE };

        for (String name : groupNames) {
            Map<String, Object> adminGroup = new HashMap<String, Object>();
            adminGroup.put(GroupBean.GROUP_NAME, name);

            // 查找是否角色已经初始化
            Map<String, Object> group = dao.findOne(GroupBean.GROUP_NAME, GroupBean.GROUP_ADMIN_VALUE, DBBean.USER_GROUP);
            if (group == null) {
                //系统角色不允许删除
                adminGroup.put(GroupBean.IS_SYSTEM_GROUP, true);
                dao.add(adminGroup, DBBean.USER_GROUP);
            } else {
                group.put(GroupBean.IS_SYSTEM_GROUP, true);
                dao.updateById(group, DBBean.USER_GROUP);
            }
        }

    }

    private static void createAdminGroup(ICommonDao dao) {
        logger.info("Init admin group");
        Map<String, Object> adminGroup = new HashMap<String, Object>();
        adminGroup.put(GroupBean.GROUP_NAME, GroupBean.GROUP_ADMIN_VALUE);
        
        //查找是否admin角色已经初始化
        Map<String, Object> group = dao.findOne(GroupBean.GROUP_NAME, GroupBean.GROUP_ADMIN_VALUE, DBBean.USER_GROUP);       
               
        
        //查询所有的权限赋值给admin
        Map<String, Object> roleItemQuery = new HashMap<String, Object>();
        roleItemQuery.put(ApiConstants.LIMIT_KEYS, new String[] { ApiConstants.MONGO_ID });
        List<Object> list = dao.listLimitKeyValues(roleItemQuery, DBBean.ROLE_ITEM);
        
        
        if (group == null) {
            adminGroup.put(GroupBean.ROLES, list);
            dao.add(adminGroup, DBBean.USER_GROUP);
        } else {
            group.put(GroupBean.ROLES, list);
            dao.updateById(group, DBBean.USER_GROUP);
        }

    }

    private static void createAdminUser(ICommonDao dao) {
        Map<String, Object> adminUser = new HashMap<String, Object>();
        adminUser.put(UserBean.USER_NAME, ADMIN_USER_NAME);
        Map<String, Object> user = dao.findOne(UserBean.USER_NAME, ADMIN_USER_NAME, DBBean.USER);
        
        
        //查找admin角色的_id
        Map<String, Object> groupQuery = new HashMap<String, Object>();
        groupQuery.put(GroupBean.GROUP_NAME, GroupBean.GROUP_ADMIN_VALUE);
        groupQuery.put(ApiConstants.LIMIT_KEYS, new String[] { ApiConstants.MONGO_ID });
        List<Object> list = dao.listLimitKeyValues(groupQuery, DBBean.USER_GROUP);

        if (user == null) {
            adminUser.put(UserBean.GROUPS, list);
            adminUser.put(UserBean.PASSWORD, DataEncrypt.generatePassword("123456"));
            dao.add(adminUser, DBBean.USER);
        } else {
            user.put(UserBean.GROUPS, list);
            dao.updateById(user, DBBean.USER);
        }
    }

    
    /**
     * 初始化那些path需要登录验证，数据放到内存中
     * 
     * 
     * @throws ClassNotFoundException
     */
    private static void setLoginPathValidation() throws ClassNotFoundException {
        ClassPathScanningCandidateComponentProvider scanner = new ClassPathScanningCandidateComponentProvider(false);
        scanner.resetFilters(true);
        scanner.addIncludeFilter(new AnnotationTypeFilter(LoginRequired.class));
        for (BeanDefinition bd : scanner.findCandidateComponents(PackageRole.class.getPackage().getName())) {
            Class<?> classzz = Class.forName(bd.getBeanClassName());
            Method metods[] = classzz.getMethods();

            RequestMapping parent = classzz.getAnnotation(RequestMapping.class);
            String path = "";
            if (parent != null) {
                path = parent.value()[0];
            }

            for (Method m : metods) {
                LoginRequired rv = m.getAnnotation(LoginRequired.class);
                if (rv != null) {
                    RequestMapping mapping = m.getAnnotation(RequestMapping.class);

                    if (mapping != null) {
                        loginPath.add(path + mapping.value()[0]);

                    }
                }
            }

        }
    }

    /**
     * 
     * 出事化权限表，权限来至于 @RoleValidate 
     * 
     * @param dao
     * @throws ClassNotFoundException
     */
    private static void initRoleItems(ICommonDao dao) throws ClassNotFoundException {
        ClassPathScanningCandidateComponentProvider scanner = new ClassPathScanningCandidateComponentProvider(false);
        scanner.addIncludeFilter(new AnnotationTypeFilter(RoleValidate.class));
        List<String> roleIds = new ArrayList<String>();

        //FIXME: 删除不存在的role，但是也需要删除group， user中相关联的数据
        for (BeanDefinition bd : scanner.findCandidateComponents(PackageRole.class.getPackage().getName())) {
            Class<?> classzz = Class.forName(bd.getBeanClassName());
            Method metods[] = classzz.getMethods();

            RequestMapping parent = classzz.getAnnotation(RequestMapping.class);
            String path = "";
            if (parent != null) {
                path = parent.value()[0];
            }

            for (Method m : metods) {
                RoleValidate rv = m.getAnnotation(RoleValidate.class);
                if (rv != null) {

                    RequestMapping mapping = m.getAnnotation(RequestMapping.class);
                    if (mapping != null) {
                        validationPath.put(path + mapping.value()[0], rv.roleID());
                    }
                    if (!roleIds.contains(rv.roleID())) {
                        roleIds.add(rv.roleID());
                    }
                    @SuppressWarnings("unchecked")
                    Map<String, Object> role = dao.findOne(RoleBean.ROLE_ID, rv.roleID(), DBBean.ROLE_ITEM);
                    if (role != null) {
                        role.put(RoleBean.ROLE_DESC, rv.desc());
                        dao.updateById(role, DBBean.ROLE_ITEM);
                    } else {
                        Map<String, Object> roleMap = new HashMap<String, Object>();
                        roleMap.put(RoleBean.ROLE_ID, rv.roleID());
                        roleMap.put(RoleBean.ROLE_DESC, rv.desc());
                        dao.add(roleMap, DBBean.ROLE_ITEM);
                    }

                    rolesValidationMap.put(path + mapping.value()[0], rv.roleID());
                }
            }
        }
    }

}
