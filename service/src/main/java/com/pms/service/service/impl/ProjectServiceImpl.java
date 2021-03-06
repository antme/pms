package com.pms.service.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.pms.service.bean.Project;
import com.pms.service.dbhelper.DBQuery;
import com.pms.service.dbhelper.DBQueryOpertion;
import com.pms.service.mockbean.ApiConstants;
import com.pms.service.mockbean.CustomerBean;
import com.pms.service.mockbean.DBBean;
import com.pms.service.mockbean.ProjectBean;
import com.pms.service.mockbean.SalesContractBean;
import com.pms.service.mockbean.UserBean;
import com.pms.service.service.AbstractService;
import com.pms.service.service.ICustomerService;
import com.pms.service.service.IProjectService;
import com.pms.service.service.IUserService;
import com.pms.service.util.ApiUtil;
import com.pms.service.util.DataUtil;
import com.pms.service.util.ExcleUtil;

public class ProjectServiceImpl extends AbstractService implements IProjectService {
	
	private IUserService userService;
	
	private ICustomerService customerService;
	
	@Override
	public String geValidatorFileName() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Map<String, Object> listProjects(Map<String, Object> params) {

		String[] limitKeys = new String[] {ProjectBean.PROJECT_CODE, ProjectBean.PROJECT_NAME, ProjectBean.PROJECT_CUSTOMER_ID,
				ProjectBean.PROJECT_MANAGER_ID, ProjectBean.PROJECT_TYPE, ProjectBean.PROJECT_STATUS, ProjectBean.PROJECT_ABBR, "signBy", "isSetuped"};
		params.put(ApiConstants.LIMIT_KEYS, limitKeys);
		
	    mergeRefSearchQuery(params, ProjectBean.PROJECT_CUSTOMER_ID, ProjectBean.PROJECT_CUSTOMER_NAME, CustomerBean.NAME,  DBBean.CUSTOMER);
	    mergeRefSearchQuery(params, ProjectBean.PROJECT_MANAGER_ID, ProjectBean.PROJECT_MANAGER_ID, UserBean.USER_NAME,  DBBean.USER);
	    mergeDataRoleQueryWithProjectAndScType(params, ProjectBean.PROJECT_TYPE);
		Map<String, Object> result = this.dao.list(params, DBBean.PROJECT);
		
		mergePMandCustomerInfo(result);
		return result;
	}

	
    public void addProject(Project project) {


        if (ApiUtil.isEmpty(project.get_id())){
            //Add
        	
        	if(ApiUtil.isEmpty(project.getProjectCode())){
        		project.setProjectCode(genProjectCode(project.getProjectType(), project.getProjectStatus()));
        	}
            
			if (ApiUtil.isEmpty(project.getProjectStatus())) {
				project.setProjectStatus(ProjectBean.PROJECT_STATUS_PRE);
			}
            dao.add(project, DBBean.PROJECT, Project.class);
            
		} else {// Update

			dao.updateById(project, DBBean.PROJECT, Project.class);			

		}
    
    }
    
    
    /**
     * 某个字段更新，相关联冗余存放该字段的地方都要同时更新。
     * @param collections 冗余存放某字段，需要同时更新的 集合
     * @param query 待更新记录的条件
     * @param updateKey 更新字段
     * @param updateValue 更新字段新的值
     */
    public void updateProjectRelatedCollectionInfo(String[] collections, String projectId){
    	
//		String[] relatedCollections = new String[] { DBBean.SALES_CONTRACT, DBBean.PURCHASE_BACK, DBBean.PURCHASE_ALLOCATE, DBBean.PURCHASE_BACK, DBBean.PURCHASE_ORDER, DBBean.PURCHASE_REQUEST };
//		updateProjectRelatedCollectionInfo(relatedCollections, project.get_id());
//		
		Map<String, Object> query = new HashMap<String, Object>();
		query.put(ProjectBean.PROJECT_ID, projectId);
    	query.put(ApiConstants.LIMIT_KEYS, new String[] {ApiConstants.MONGO_ID});
    	for (int i=0; i<collections.length; i++){
    		String cName = collections[i];
    		List<Object> ids = dao.listLimitKeyValues(query, cName);
    		for (Object id : ids){
    			Map<String, Object> updateQuery = new HashMap<String, Object>();
        		updateQuery.put(ApiConstants.MONGO_ID, id);
        		scs.mergeCommonProjectInfo(updateQuery, projectId);
        		dao.updateById(updateQuery, cName);
    		}
    	}
    }

    public Map<String, Object> getProjectForAddSc(Map<String, Object> params){
        
        String[] limitKeys = {ProjectBean.PROJECT_NAME,ProjectBean.PROJECT_CODE, ProjectBean.PROJECT_MANAGER_ID, 
                ProjectBean.PROJECT_STATUS, ProjectBean.PROJECT_CUSTOMER_ID};
        Map<String, Object> query = new HashMap<String, Object>();
        query.put(ApiConstants.LIMIT_KEYS, limitKeys);
        query.put(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID));
        Map<String, Object> result = dao.list(query, DBBean.PROJECT);
        
        Map<String, Object> projectList = mergeProjectForSc(result);
        
        List<Map<String, Object>> pList = (List<Map<String, Object>>) projectList.get(ApiConstants.RESULTS_DATA);
        return pList.get(0);
    }

	@Override
	public Map<String, Object> listProjectsForSelect(Map<String, Object> params, boolean all) {
		// TODO Add logic to filter the projects which in progresss
		String[] limitKeys = {ProjectBean.PROJECT_NAME,ProjectBean.PROJECT_CODE, ProjectBean.PROJECT_MANAGER_ID, 
				ProjectBean.PROJECT_STATUS, ProjectBean.PROJECT_CUSTOMER_ID};
		Map<String, Object> query = new HashMap<String, Object>();
		query.put(ApiConstants.LIMIT_KEYS, limitKeys);
		if(!all){
		    query.put(ProjectBean.PROJECT_STATUS, ProjectBean.PROJECT_STATUS_OFFICIAL);
		}
		Map<String, Object> result = dao.list(query, DBBean.PROJECT);
		
		return mergeProjectForSc(result);
	}

	public Map<String, Object> mergeProjectForSc(Map<String, Object> result) {
		List<Map<String, Object>> resultList = (List<Map<String, Object>>) result.get(ApiConstants.RESULTS_DATA);
		List<String> proIds = new ArrayList<String>();
		for (Map<String, Object> p : resultList) {
			String proid = (String) p.get(ApiConstants.MONGO_ID);
			proIds.add(proid);
		}

		for (Map<String, Object> p : resultList) {

			scs.mergeCommonProjectInfo(p, p.get(ApiConstants.MONGO_ID));

		}

		mergeScTypeInfo(proIds, result);

		return result;
	}
	
	private void mergeScTypeInfo(List<String> proIds, Map<String, Object> result){
		Map<String, Object> scQuery = new HashMap<String, Object>();
		scQuery.put(ApiConstants.LIMIT_KEYS, new String[] {SalesContractBean.SC_TYPE, SalesContractBean.SC_PROJECT_ID});
		scQuery.put(SalesContractBean.SC_PROJECT_ID, new DBQuery(DBQueryOpertion.IN, proIds));
		Map<String, Object> scData = dao.listToOneMapByKey(scQuery, DBBean.SALES_CONTRACT, SalesContractBean.SC_PROJECT_ID);
		
		List<Map<String, Object>> resultList = (List<Map<String, Object>>) result.get(ApiConstants.RESULTS_DATA);
		for (Map<String, Object> map : resultList){
			String proid = (String) map.get(ApiConstants.MONGO_ID);
			Map<String, Object> scMap = (Map<String, Object>) scData.get(proid);
			if (ApiUtil.isEmpty(scMap)){
				map.put(SalesContractBean.SC_TYPE, null);
			}else{
				map.put(SalesContractBean.SC_TYPE, scMap.get(SalesContractBean.SC_TYPE));
			}
		}
	}

	@Override
	public Map<String, Object> listEquipmentsForProject(Map<String, Object> params) {
		return null;
	}

    @Override
    public Map<String, Object> getProjectById(Map<String, Object> params) {

        Map<String, Object> project = dao.findOne(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID), DBBean.PROJECT);

        if (params.get("isScDraft") != null) {
            Map<String, Object> query = new HashMap<String, Object>();
            query.put("status", SalesContractBean.SC_STATUS_DRAFT);
            query.put(SalesContractBean.SC_PROJECT_ID, params.get(ApiConstants.MONGO_ID));
            Map<String, Object> result = this.dao.findOneByQuery(query, DBBean.SALES_CONTRACT);

            if (result != null) {
                Object scId = result.get(ApiConstants.MONGO_ID);
                result = scs.getSC(result);

                // 项目信息覆盖
                result.putAll(project);
                result.put(ProjectBean.PROJECT_ID, project.get(ApiConstants.MONGO_ID));
                result.put(SalesContractBean.SC_ID, scId);
                return result;
            }
        }
        
        project.put(ProjectBean.PROJECT_ID, project.get(ApiConstants.MONGO_ID));
        return project;

    }

	/**
	 * 预立项 转 正式立项：
	 * 1.项目状态改变；
	 * 2.项目编号 预立项前缀 Y- 去除
	 */
	@Override
	public Map<String, Object> setupProject(Map<String, Object> params) {
		String _id = (String) params.get(ApiConstants.MONGO_ID);
		Map<String, Object> pro = dao.findOne(ApiConstants.MONGO_ID, _id, DBBean.PROJECT);
		String pCode = (String)pro.get(ProjectBean.PROJECT_CODE);
		pro.put(ProjectBean.PROJECT_STATUS, ProjectBean.PROJECT_STATUS_OFFICIAL);
//		int prefixIndex = pCode.indexOf(ProjectBean.PROJECT_YULIXIANG_PREFIX);
//		if (prefixIndex != -1){//考虑到老数据编号字段格式没有 Y-前缀
//			pro.put(ProjectBean.PROJECT_CODE, pCode.substring(prefixIndex+2, pCode.length()));
//		}
//		
		return dao.updateById(pro, DBBean.PROJECT);
	}
	
	public void mergePMandCustomerInfo(Map<String, Object> result){
		List<Map<String, Object>> resultListData = (List<Map<String, Object>>) result.get(ApiConstants.RESULTS_DATA);
		
		
		for (Map<String, Object> pro : resultListData){
			scs.mergeCommonProjectInfo(pro, pro.get(ApiConstants.MONGO_ID));
			
		}
		
		
	}

	@Override
	public String getCustomerIdByProId(String pId) {
		Map<String, Object> query = new HashMap<String, Object>();
		query.put(ApiConstants.MONGO_ID, pId);
		query.put(ApiConstants.LIMIT_KEYS, new String[] {ProjectBean.PROJECT_CUSTOMER_ID});
		Map<String, Object> p = dao.findOneByQuery(query, DBBean.PROJECT);
		return (String)p.get(ProjectBean.PROJECT_CUSTOMER_ID);
	}

	@Override
	public String getCustomerNameByProId(String pId) {
		Map<String, Object> query = new HashMap<String, Object>();
		query.put(ApiConstants.MONGO_ID, pId);
		query.put(ApiConstants.LIMIT_KEYS, new String[] {ProjectBean.PROJECT_CUSTOMER_ID});
		Map<String, Object> p = dao.findOneByQuery(query, DBBean.PROJECT);
		String cId = (String)p.get(ProjectBean.PROJECT_CUSTOMER_ID);
		
		Map<String, Object> cQuery = new HashMap<String, Object>();
		cQuery.put(ApiConstants.MONGO_ID, cId);
		cQuery.put(ApiConstants.LIMIT_KEYS, new String[] {CustomerBean.NAME});
		Map<String, Object> customer = dao.findOneByQuery(cQuery, DBBean.CUSTOMER);
		return (String) customer.get(CustomerBean.NAME);
	}

	
	

	public IUserService getUserService() {
		return userService;
	}

	public void setUserService(IUserService userService) {
		this.userService = userService;
	}

	public ICustomerService getCustomerService() {
		return customerService;
	}

	public void setCustomerService(ICustomerService customerService) {
		this.customerService = customerService;
	}

	@Override
	public Map<String, Object> getProjectByIdAndMergeSCInfo(
			Map<String, Object> params) {
		String id = (String) params.get(ApiConstants.MONGO_ID);
		Map<String, Object> p = dao.findOne(ApiConstants.MONGO_ID, id, DBBean.PROJECT);
		
		scs.mergeCommonProjectInfo(p, p.get(ApiConstants.MONGO_ID));
		
		Map<String, Object> scQuery = new HashMap<String, Object>();
		scQuery.put(ProjectBean.PROJECT_ID, p.get(ApiConstants.MONGO_ID));
		scQuery.put(ApiConstants.LIMIT_KEYS, new String[] {SalesContractBean.SC_CODE, SalesContractBean.SC_PERSON, SalesContractBean.SC_DATE,
				SalesContractBean.SC_CUSTOMER_ID, SalesContractBean.SC_TYPE, SalesContractBean.SC_RUNNING_STATUS, SalesContractBean.SC_AMOUNT});
		Map<String, Object> scList = dao.list(scQuery, DBBean.SALES_CONTRACT);
		List<Map<String, Object>> scListData = (List<Map<String, Object>>) scList.get(ApiConstants.RESULTS_DATA);
		List<String> cIds = new ArrayList<String>();
		for (Map<String, Object> sc : scListData){
			String cid = (String) sc.get(SalesContractBean.SC_CUSTOMER_ID);
			if (!ApiUtil.isEmpty(cid)){
				cIds.add(cid);
			}
		}
		Map<String, Object> query = new HashMap<String, Object>();
		query.put(ApiConstants.MONGO_ID, new DBQuery(DBQueryOpertion.IN, cIds));
		query.put(ApiConstants.LIMIT_KEYS, new String[] {CustomerBean.NAME});
		Map<String, Object> cMap = dao.listToOneMapAndIdAsKey(query, DBBean.CUSTOMER);
		for(Map<String, Object> sc : scListData){
			String cid = (String) sc.get(SalesContractBean.SC_CUSTOMER_ID);
			if (!ApiUtil.isEmpty(cid)){
				Map<String, Object> cData = (Map<String, Object>) cMap.get(cid);
				sc.put(ProjectBean.PROJECT_CUSTOMER_NAME, cData.get(CustomerBean.NAME));
			}
		}
		p.put("scs", scList.get(ApiConstants.RESULTS_DATA));
		return p;
	}
	
	public String genProjectCode(String ptype, String pStatus){
		String prefix = ProjectBean.PROJECT_CODE_PREFIX_SERVICE;
		if (ProjectBean.PROJECT_TYPE_PRODUCT.equals(ptype)){
			prefix = ProjectBean.PROJECT_CODE_PREFIX_PRODUCT;
		}else if (ProjectBean.PROJECT_TYPE_PROJECT.equals(ptype)){
			prefix = ProjectBean.PROJECT_CODE_PREFIX_PROJECT;
		}
		
		if (!ProjectBean.PROJECT_STATUS_OFFICIAL.equals(pStatus)){
			prefix = ProjectBean.PROJECT_YULIXIANG_PREFIX + prefix;
		}
		
		
		
		return generateCode(prefix, DBBean.PROJECT, ProjectBean.PROJECT_CODE);
		
	}

	@Override
	public Map<String, Object> importProject(Map<String, Object> params) {

		Map<String, Object> query = new HashMap<String, Object>();
		query.put(ProjectBean.PROJECT_NAME, params.get(ProjectBean.PROJECT_NAME));
		query.put(ProjectBean.PROJECT_CODE, params.get(ProjectBean.PROJECT_CODE));

		Map<String, Object> p = dao.findOneByQuery(query, DBBean.PROJECT);

		if (p == null) {
			Object pt = params.get(ProjectBean.PROJECT_TYPE);
			String ptString = pt == null ? ProjectBean.PROJECT_TYPE_PROJECT : pt.toString();

			if (ApiUtil.isEmpty(params.get(ProjectBean.PROJECT_CODE))) {
				params.put(ProjectBean.PROJECT_CODE, genProjectCode(ptString, ProjectBean.PROJECT_STATUS_OFFICIAL));
			}

			return dao.add(params, DBBean.PROJECT);
		} else {

			params.put(ApiConstants.MONGO_ID, p.get(ApiConstants.MONGO_ID));
			return dao.updateById(params, DBBean.PROJECT);

		}

	}

}
