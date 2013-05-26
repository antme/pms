package com.pms.service.dbhelper;

public class DBQuery {

    private DBQueryOpertion operation;

    private Object value;

    @SuppressWarnings("unused")
    private DBQuery() {

    }

    public DBQuery(DBQueryOpertion operation) {
        this.operation = operation;
        this.value = null;
    }

    public DBQuery(DBQueryOpertion operation, Object value) {
        this.operation = operation;
        this.value = value;

    }

    public DBQueryOpertion getOperation() {
        return operation;
    }

    public void setOperation(DBQueryOpertion operation) {
        this.operation = operation;
    }

    public Object getValue() {
        return value;
    }

    public void setValue(Object value) {
        this.value = value;
    }

}
