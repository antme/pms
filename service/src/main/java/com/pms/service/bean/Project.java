package com.pms.service.bean;

import com.google.gson.annotations.Expose;

public class Project extends SCBaseEntity {

    // 项目缩写
    @Expose
    private String projectAbbr;


    @Expose
    private String projectStatus;
    
    @Expose
    private String signBy;

    // 项目实施地址
    @Expose
    private String projectAddress;

    // 备注
    @Expose
    private String projectMemo;

    public String getProjectAbbr() {
        return projectAbbr;
    }

    public void setProjectAbbr(String projectAbbr) {
        this.projectAbbr = projectAbbr;
    }



    public String getProjectStatus() {
        return projectStatus;
    }

    public void setProjectStatus(String projectStatus) {
        this.projectStatus = projectStatus;
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

	public String getSignBy() {
		return signBy;
	}

	public void setSignBy(String signBy) {
		this.signBy = signBy;
	}
    
    

}
