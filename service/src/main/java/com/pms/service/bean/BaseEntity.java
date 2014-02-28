package com.pms.service.bean;

import java.util.Date;
import java.util.Map;

import com.pms.service.util.DataUtil;

public class BaseEntity {

	public static final String MONGO_ID = "_id";
	public static final String CREATOR = "creator";
	public static final String CREATED_ON = "createdOn";
	public static final String UPDATED_ON = "updatedOn";

	private String _id;

	private String creator;

	private Date createdOn;

	private Date updatedOn;

	public String get_id() {
		return _id;
	}

	public void set_id(String _id) {
		this._id = _id;
	}

	public String getCreator() {
		return creator;
	}

	public void setCreator(String creator) {
		this.creator = creator;
	}

	public Date getCreatedOn() {
		return createdOn;
	}

	public void setCreatedOn(Date createdOn) {
		this.createdOn = createdOn;
	}

	public Date getUpdatedOn() {
		return updatedOn;
	}

	public void setUpdatedOn(Date updatedOn) {
		this.updatedOn = updatedOn;
	}
	
	
	/**
	 * 打印类字段信息
	 */
	@Override
	public String toString() {
		
		return DataUtil.toJson(this);
	}

	@SuppressWarnings("unchecked")
	public Map<String, Object> toMap() {
		return DataUtil.toMap(this);
	}


}
