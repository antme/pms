package com.pms.service.util.status;

public class ResponseCodeConstants {
    // *********Common
    public static final String PARAMETERS_EMPTY = "-4";
    public static final String ID_IS_NULL = "-5";
    public static final String ID_NO_RECORD_IN_DB = "-6";
    public static final String NUMBER_PARAMETER_ILLEGAL = "-9";
    public static final String USER_BANNED_PUBLISH = "user_banned";
    
    public static final String SERVER_ERROR = "-1";
    public static final String USER_LOGIN_USER_NAME_OR_PASSWORD_INCORRECT = "username_or_pass_incorrect";
    public static final String USER_CHANGE_PASSWORD_OLD_PASSWORD_INCORRECT = "old_password_incorrect";

    
    public static final String  PARAMETERS_NOT_JSON = "-2";
    // *********Common end

    public static final String  ADMIN_EDIT_DISABLED = "admin_edit_disabled";
    public static final String  ADMIN_DELETE_DISABLED = "admin_delete_disabled";
    public static final String  ADMIN_GROUP_EDIT_DISABLED = "admin_group_edit_disabled";
    public static final String  SYSTEM_GROUP_EDIT_DISABLED = "system_group_edit_disabled";

    public static final String  ADMIN_GROUP_DELETE_DISABLED = "admin_group_delete_disabled";
    
    public static final String PROJECT_ID_IS_EMPTY = "project_id_is_empty";
    
    public static final String  ARRIVAL_NOTICE_ALREADY_EXIST = "arrival_notice_already_exist";
    
    public static final String  EQCOST_APPLY_ERROR =  "eqcost_apply_error";
    
    public static final String  PURCHASE_ORDER_UNFINISHED = "purchase_order_unfinished";
    
    public static final String  JUST_DIRECT = "just_direct";
}
