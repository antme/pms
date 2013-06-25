package com.pms.service.util;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import com.pms.service.mockbean.ApiConstants;
import com.pms.service.mockbean.UserBean;

public class ApiThreadLocal {

    public static final Map values = Collections.synchronizedMap(new HashMap());

    public static Object get(String key) {
        Thread curThread = Thread.currentThread();
        Map<String, Object> map = getMapResult(curThread);
        return map.get(key);
    }

    private static Map<String, Object> getMapResult(Thread curThread) {
        Object o = values.get(curThread);
        if (o == null && !values.containsKey(curThread)) {
            o = initialValue();
            values.put(curThread, o);
        }
        Map<String, Object> map = (Map<String, Object>) o;
        return map;
    }

    public static void set(String key, Object newValue) {
        Thread currentThread = Thread.currentThread();
        Map<String, Object> map = getMapResult(currentThread);
        map.put(key, newValue);
        values.put(currentThread, map);
    }

    public static Object initialValue() {
        return new HashMap<String, Object>();
    }

    public static void removeAll() {
        Thread curThread = Thread.currentThread();
        values.remove(curThread);
    }

    public static String getCurrentUserId() {

        return get(UserBean.USER_ID) == null ? null : get(UserBean.USER_ID).toString();
    }
    
    public static String getCurrentUserName() {

        return get(UserBean.USER_NAME) == null ? null : get(UserBean.USER_NAME).toString();
    }
    
    public static String getMyTask() {

        return get(ApiConstants.MY_TASKS) == null ? null : get(ApiConstants.MY_TASKS).toString();
    }
}
