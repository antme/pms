package com.pms.service.dbhelper;

public enum DBQueryOpertion {

	LARGER_THAN, LESS_THAN, EQUAILS, GREATER_THAN_EQUALS, LESS_THAN_EQUAILS, NOT_NULL, NOT_IN, IN, NOT_EQUALS, BETWEEN_AND, CASE_INSENSITIVE, LIKE;

	public static DBQueryOpertion getOperation(String operator) {
		// for 1.6
		int key = 1;

		if (operator.equalsIgnoreCase("like")) {
			key = 1;
		} else if (operator.equalsIgnoreCase("neq")) {
			key = 2;
		} else if (operator.equalsIgnoreCase("lt")) {
			key = 3;
		} else if (operator.equalsIgnoreCase("gt")) {
			key = 4;
		} else if (operator.equalsIgnoreCase("eq")) {
			key = 5;
		}

		switch (key) {
		case 1:
			return LIKE;
		case 2:
			return NOT_EQUALS;
		case 3:
			return LESS_THAN;
		case 4:
			return LARGER_THAN;
		case 5:
			return EQUAILS;
		default:
			return EQUAILS;
		}

	}

}
