package com.pms.service.dbhelper;

public enum DBQueryOpertion {

    LARGER_THAN, LESS_THAN, EQUAILS, GREATER_THAN_EQUALS, LESS_THAN_EQUAILS, NOT_NULL, NOT_IN, IN, NOT_EQUALS, BETWEEN_AND, CASE_INSENSITIVE, LIKE;

    public static DBQueryOpertion getOperation(String operator) {

        switch (operator) {
        case "like":
            return LIKE;
        case "neq":
            return NOT_EQUALS;
        case "lt_n":
            return LESS_THAN;
        case "gt_n":
            return LARGER_THAN;
        case "eq_n":
            return EQUAILS;
        case "lt_d":
            return LESS_THAN;
        case "gt_d":
            return LARGER_THAN;
        case "eq_d":
            return EQUAILS;
        default:
            return EQUAILS;
        }

    }

}
