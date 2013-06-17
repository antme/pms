package com.pms.service.mockbean;

import java.util.Map;

import com.google.gson.Gson;

public class BaseEntity {

    private String _id;

    private String createdOn;

    private String updatedOn;

    private String creator;
    
    private String status;
    
    private int updateTimes;
    
    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    public String getCreatedOn() {
        return createdOn;
    }

    public void setCreatedOn(String createdOn) {
        this.createdOn = createdOn;
    }

    public String getUpdatedOn() {
        return updatedOn;
    }

    public void setUpdatedOn(String updatedOn) {
        this.updatedOn = updatedOn;
    }

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }
    
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }


    public int getUpdateTimes() {
        return updateTimes;
    }

    public void setUpdateTimes(int updateTimes) {
        this.updateTimes = updateTimes;
    }

    public String toString() {
        return toJson();
    }

    public String toJson() {
        return new Gson().toJson(this);
    }

    public Map<String, Object> toMap() {

        return new Gson().fromJson(toString(), Map.class);
    }

    public BaseEntity toEntity(Map<String, Object> map) {

        return new Gson().fromJson(new Gson().toJson(map), this.getClass());
    }

}
