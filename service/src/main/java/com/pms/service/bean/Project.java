package com.pms.service.bean;

import com.google.gson.annotations.Expose;

public class Project extends BaseEntity {

	// 项目编号
	@Expose
	private String projectCode;
	// 项目缩写
	@Expose
	private String projectAbbr;
	
	@Expose
	private String projectName;
	
	@Expose
	private String projectManagerId;
	
	@Expose
	private String projectManagerName;
	
	@Expose
	private String projectStatus;
	
	@Expose
	private String projectType;
	// 项目实施地址
	@Expose
	private String projectAddress;

	// 备注
	@Expose
	private String projectMemo;
	
	@Expose
	private String customerId;
	
	@Expose
	private String customerName;

	public String getProjectCode() {
		return projectCode;
	}

	public void setProjectCode(String projectCode) {
		this.projectCode = projectCode;
	}

	public String getProjectAbbr() {
		return projectAbbr;
	}

	public void setProjectAbbr(String projectAbbr) {
		this.projectAbbr = projectAbbr;
	}

	public String getProjectName() {
		return projectName;
	}

	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}

	public String getProjectManagerId() {
		return projectManagerId;
	}

	public void setProjectManagerId(String projectManagerId) {
		this.projectManagerId = projectManagerId;
	}

	public String getProjectManagerName() {
		return projectManagerName;
	}

	public void setProjectManagerName(String projectManagerName) {
		this.projectManagerName = projectManagerName;
	}

	public String getProjectStatus() {
		return projectStatus;
	}

	public void setProjectStatus(String projectStatus) {
		this.projectStatus = projectStatus;
	}

	public String getProjectType() {
		return projectType;
	}

	public void setProjectType(String projectType) {
		this.projectType = projectType;
	}

	public String getProjectAddress() {
		return projectAddress;
	}

	public void setProjectAddress(String projectAddress) {
		this.projectAddress = projectAddress;
	}

	public String getProjectMemo() {
		return projectMemo;
	}

	public void setProjectMemo(String projectMemo) {
		this.projectMemo = projectMemo;
	}

	public String getCustomerId() {
		return customerId;
	}

	public void setCustomerId(String customerId) {
		this.customerId = customerId;
	}

	public String getCustomerName() {
		return customerName;
	}

	public void setCustomerName(String customerName) {
		this.customerName = customerName;
	}

}
