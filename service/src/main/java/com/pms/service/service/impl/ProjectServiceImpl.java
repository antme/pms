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
import com.pms.service.util.DateUtil;
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
				ProjectBean.PROJECT_MANAGER_ID, ProjectBean.PROJECT_TYPE, ProjectBean.PROJECT_STATUS, ProjectBean.PROJECT_ABBR};
		params.put(ApiConstants.LIMIT_KEYS, limitKeys);
		
	    mergeRefSearchQuery(params, ProjectBean.PROJECT_CUSTOMER_ID, ProjectBean.PROJECT_CUSTOMER_ID, CustomerBean.NAME,  DBBean.CUSTOMER);
	    mergeRefSearchQuery(params, ProjectBean.PROJECT_MANAGER_ID, ProjectBean.PROJECT_MANAGER_ID, UserBean.USER_NAME,  DBBean.USER);
	    mergeDataRoleQueryWithProjectAndScType(params, ProjectBean.PROJECT_TYPE);
		Map<String, Object> result = this.dao.list(params, DBBean.PROJECT);
		
		mergePMandCustomerInfo(result);
		return result;
	}

	
    public void addProject(Project project) {


        if (ApiUtil.isEmpty(project.get_id())){
            //Add
             project.setProjectCode(genProjectCode(project.getProjectType(), project.getProjectStatus()));
            
			if (ApiUtil.isEmpty(project.getProjectStatus())) {
				project.setProjectStatus(ProjectBean.PROJECT_STATUS_PRE);
			}
            dao.add(project, DBBean.PROJECT, Project.class);
            
        }else{//Update
            
            Map<String, Object> existProjectQuery = new HashMap<String, Object>();
            existProjectQuery.put(ApiConstants.MONGO_ID, project.get_id());
            Project oldProject = (Project) dao.findOneByQuery(existProjectQuery, DBBean.PROJECT, Project.class);

            //项目 PM 发生改变
            String pmOld = oldProject.getProjectManagerId();
            String pmNew = project.getProjectManagerId();
            
            if (!pmOld.equals(pmNew)){
                //1.冗余存放 项目 PM 且存有 projectId 的相关集合，均需同步更新 项目 PM 字段
                //符合1.中的  集合添加到下一行 relatedCollections 数组中
                String[] relatedCollections = {DBBean.SALES_CONTRACT};//外键关联到project,又冗余存有 项目PM
                Map<String, Object> relatedCQuery = new HashMap<String, Object>();
                relatedCQuery.put(ProjectBean.PROJECT_ID, project.get_id());                
                updateRelatedCollectionForTheSameField(relatedCollections, relatedCQuery, ProjectBean.PROJECT_MANAGER_ID, pmNew);
            }                   
            dao.updateById(project, DBBean.PROJECT, Project.class);
        }
    
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
		
		List<Map<String, Object>> resultList = (List<Map<String, Object>>) result.get(ApiConstants.RESULTS_DATA); 
		List<String> pmIds = new ArrayList<String>(); 
		List<String> cIds = new ArrayList<String>();
		List<String> proIds = new ArrayList<String>();
		for(Map<String, Object> p : resultList){
			String pmid = (String)p.get(ProjectBean.PROJECT_MANAGER_ID);
			String cid = (String)p.get(ProjectBean.PROJECT_CUSTOMER_ID);
			String proid = (String)p.get(ApiConstants.MONGO_ID);
			proIds.add(proid);
			if (!ApiUtil.isEmpty(pmid)){
				pmIds.add(pmid);
			}
			if (!ApiUtil.isEmpty(cid)){
				cIds.add(cid);
			}
		}
		Map<String, Object> pmQuery = new HashMap<String, Object>();
		pmQuery.put(ApiConstants.MONGO_ID, new DBQuery(DBQueryOpertion.IN, pmIds));
		pmQuery.put(ApiConstants.LIMIT_KEYS, new String[] {UserBean.USER_NAME, UserBean.DEPARTMENT});
		Map<String, Object> pmData = dao.listToOneMapAndIdAsKey(pmQuery, DBBean.USER);
		
		Map<String, Object> cusQuery = new HashMap<String, Object>();
		cusQuery.put(ApiConstants.MONGO_ID, new DBQuery(DBQueryOpertion.IN, cIds));
		cusQuery.put(ApiConstants.LIMIT_KEYS, new String[] {CustomerBean.NAME});
		Map<String, Object> cusData = dao.listToOneMapAndIdAsKey(cusQuery, DBBean.USER);
		
		for (Map<String, Object> p : resultList){
			String pmid = (String)p.get(ProjectBean.PROJECT_MANAGER_ID);
			Map<String, Object> pmInfo = (Map<String, Object>) pmData.get(pmid);
			if(ApiUtil.isEmpty(pmInfo)){
				p.put(ProjectBean.PROJECT_MANAGER_ID, "N/A");
				p.put(UserBean.DEPARTMENT, "N/A");
			}else{
				p.put(ProjectBean.PROJECT_MANAGER_ID, pmInfo.get(UserBean.USER_NAME));
				p.put(UserBean.DEPARTMENT, pmInfo.get(UserBean.DEPARTMENT));
			}
			
			
			String customerId = (String)p.get(ProjectBean.PROJECT_CUSTOMER_ID);
			p.put("cId", customerId);
			Map<String, Object> customerInfo = (Map<String, Object>) cusData.get(customerId);
			if(ApiUtil.isEmpty(pmInfo)){
				p.put(ProjectBean.PROJECT_CUSTOMER_ID, "N/A");
			}else{
				p.put(ProjectBean.PROJECT_CUSTOMER_ID, pmInfo.get(UserBean.USER_NAME));
			}
			
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
				result = scs.getSC(result);

				project.putAll(result);
			}
		}

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
		
		List<String> pmIds = new ArrayList<String>();
		List<String> customerIds = new ArrayList<String>();
		
		for (Map<String, Object> pro : resultListData){
			String pPM = (String) pro.get(ProjectBean.PROJECT_MANAGER_ID);
			if (pPM != null && pPM.length() > 0){
				pmIds.add(pPM);
			}
			String pC = (String) pro.get(ProjectBean.PROJECT_CUSTOMER_ID);
			if (pC != null && pC.length() > 0){
				customerIds.add(pC);
			}
			
		}
		
		Map<String, Object> pmQuery = new HashMap<String, Object>();
		pmQuery.put(ApiConstants.LIMIT_KEYS, new String[] {UserBean.USER_NAME});
		pmQuery.put(ApiConstants.MONGO_ID, new DBQuery(DBQueryOpertion.IN, pmIds));
		Map<String, Object> pmData = dao.listToOneMapAndIdAsKey(pmQuery, DBBean.USER);
		
		Map<String, Object> customerQuery = new HashMap<String, Object>();
		customerQuery.put(ApiConstants.LIMIT_KEYS, new String[] {CustomerBean.NAME});
		customerQuery.put(ApiConstants.MONGO_ID, new DBQuery(DBQueryOpertion.IN, customerIds));
		Map<String, Object> customerData = dao.listToOneMapAndIdAsKey(customerQuery, DBBean.CUSTOMER);
		
		for (Map<String, Object> pro : resultListData){
			String pmId = (String) pro.get(ProjectBean.PROJECT_MANAGER_ID);
			pro.put(ProjectBean.PROJECT_MANAGER_ID, pmId);
			Map<String, Object> pmInfo = (Map<String, Object>) pmData.get(pmId);
			if (pmInfo != null){
				pro.put(ProjectBean.PROJECT_MANAGER_NAME, pmInfo.get(UserBean.USER_NAME));
			}

			String cId = (String) pro.get(ProjectBean.PROJECT_CUSTOMER_ID);
			pro.put(ProjectBean.PROJECT_CUSTOMER_NAME, cId);
			Map<String, Object> cInfo = (Map<String, Object>) customerData.get(cId);
			if (cInfo != null){
				pro.put(ProjectBean.PROJECT_CUSTOMER_NAME, cInfo.get(CustomerBean.NAME));
			}else{
				pro.put(ProjectBean.PROJECT_CUSTOMER_NAME, "N/A");
			}
			
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

	@Override
	public void importProjectAndSCData(Map<String, Object> params) {
		String filePath = (String) params.get("filePath");
		ExcleUtil excleUtil = new ExcleUtil(filePath);
		List<String[]> list = excleUtil.getAllData(0);
		List<Map<String, Object>> rows = new ArrayList<Map<String, Object>>();
		for (int i=0; i<list.size(); i++){
			if (i>3){
				Map<String, Object> row = new HashMap<String, Object>();
				row.put(ProjectBean.PROJECT_NAME, list.get(i)[9].trim());
				row.put(ProjectBean.PROJECT_ABBR, list.get(i)[4].trim());
				row.put(ProjectBean.PROJECT_CUSTOMER_ID, list.get(i)[8].trim());
				row.put(ProjectBean.PROJECT_MANAGER_ID, list.get(i)[5].trim());
				row.put(ProjectBean.PROJECT_TYPE, list.get(i)[12].trim());
				
				row.put(SalesContractBean.SC_CODE, list.get(i)[2].trim());
				row.put(SalesContractBean.SC_PERSON, list.get(i)[7].trim());
				row.put(SalesContractBean.SC_TYPE, list.get(i)[10].trim());
				row.put(SalesContractBean.SC_DATE, list.get(i)[14].trim());
				row.put(SalesContractBean.SC_AMOUNT, list.get(i)[23].trim());
				row.put(SalesContractBean.SC_RUNNING_STATUS, list.get(i)[34].trim());
				
				rows.add(row);
			}
		}
		
		for(Map<String, Object> row : rows){
			Map<String, Object> customerQuery = new HashMap<String, Object>();
			customerQuery.put(CustomerBean.NAME, row.get(ProjectBean.PROJECT_CUSTOMER_ID));
			Map<String, Object> customerMap = customerService.importCustomer(customerQuery);
			String customerId = (String) customerMap.get(ApiConstants.MONGO_ID);
			
			Map<String, Object> pmQuery = new HashMap<String, Object>();
			pmQuery.put(UserBean.USER_NAME, row.get(ProjectBean.PROJECT_MANAGER_ID));
			Map<String, Object> pmMap = userService.importUser(pmQuery);
			String pmId = (String) pmMap.get(ApiConstants.MONGO_ID);
			
			Map<String, Object> project = new HashMap<String, Object>();

			project.put(ProjectBean.PROJECT_NAME, row.get(ProjectBean.PROJECT_NAME));
			project.put(ProjectBean.PROJECT_ABBR, row.get(ProjectBean.PROJECT_ABBR));
			project.put(ProjectBean.PROJECT_CUSTOMER_ID, customerId);
			project.put(ProjectBean.PROJECT_MANAGER_ID, pmId);
			project.put(ProjectBean.PROJECT_TYPE, row.get(ProjectBean.PROJECT_TYPE));
			
			Project projectEntity = (Project) DataUtil.toEntity(project, Project.class);
			addProject(projectEntity);
			String proId = projectEntity.get_id();
			
			Map<String, Object> sc = new HashMap<String, Object>();
			sc.put(SalesContractBean.SC_CODE, row.get(SalesContractBean.SC_CODE));
			sc.put(SalesContractBean.SC_PERSON, row.get(SalesContractBean.SC_PERSON));
			sc.put(SalesContractBean.SC_TYPE, row.get(SalesContractBean.SC_TYPE));
			sc.put(SalesContractBean.SC_DATE, row.get(SalesContractBean.SC_DATE));
			sc.put(SalesContractBean.SC_AMOUNT, row.get(SalesContractBean.SC_AMOUNT));
			row.put(SalesContractBean.SC_RUNNING_STATUS, row.get(SalesContractBean.SC_RUNNING_STATUS));
			sc.put(SalesContractBean.SC_PROJECT_ID, proId);
			scs.addSC(sc);
		}
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
				sc.put(SalesContractBean.SC_CUSTOMER_ID, cData.get(CustomerBean.NAME));
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
		
		int year = DateUtil.getNowYearString();
		
		Integer pCodeNo = 0;
		Map<String, Object> queryMap = new HashMap<String, Object>();
		String[] limitKeys = {ProjectBean.PROJECT_CODE};
		Map<String, Object> p = dao.getLastRecordByCreatedOn(DBBean.PROJECT, queryMap, limitKeys);
		if(p != null){
			String pCode = (String)p.get(ProjectBean.PROJECT_CODE);
			String pCodeNoString = "1";
			if (pCode != null){
				pCodeNoString = pCode.substring(pCode.lastIndexOf("-")+1, pCode.length());
			}
			
			try {
				pCodeNo = Integer.parseInt(pCodeNoString);
			} catch (NumberFormatException e) {
				// TODO Auto-generated catch block
//				e.printStackTrace();  旧数据会出异常，就pCodeNo=1 开始
			}
		}
		
		pCodeNo = pCodeNo + 1;
		
        String codeNum = "000" + pCodeNo;

        codeNum = codeNum.substring(codeNum.length() - 4, codeNum.length());
        
		return prefix+year+"-"+codeNum;
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
