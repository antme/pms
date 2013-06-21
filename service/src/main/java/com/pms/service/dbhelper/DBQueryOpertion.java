package com.pms.service.dbhelper;

public enum DBQueryOpertion {

    LARGER_THAN, LESS_THAN, EQUAILS, GREATER_THAN_EQUALS, LESS_THAN_EQUAILS, NOT_NULL, NOT_IN, IN, NOT_EQUALS, BETWEEN_AND, CASE_INSENSITIVE, LIKE;

    public static DBQueryOpertion getOperation(String operator) {

        switch (operator) {
        case "like":
            return LIKE;
        case "neq":
            return NOT_EQUALS;
        case "lt":
            return LESS_THAN;
        case "gt":
            return LARGER_THAN;
        case "eq":
            return EQUAILS;
        default:
            return EQUAILS;
        }

    }

}
