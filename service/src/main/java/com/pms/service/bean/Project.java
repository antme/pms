package com.pms.service.bean;

public class Project extends BaseEntity {

	// 项目编号
	private String projectCode;
	// 项目缩写
	private String projectAbbr;

	private String projectName;

	private String projectManagerId;

	private String projectManagerName;

	private String projectStatus;

	private String projectType;
	// 项目实施地址
	private String projectAddress;

	// 备注
	private String projectMemo;

	private String customerId;

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
