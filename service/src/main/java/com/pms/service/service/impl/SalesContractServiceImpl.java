package com.pms.service.service.impl;

import java.io.File;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.pms.service.bean.EqCost;
import com.pms.service.bean.Project;
import com.pms.service.bean.SalesContract;
import com.pms.service.cfg.ConfigurationManager;
import com.pms.service.dbhelper.DBQuery;
import com.pms.service.dbhelper.DBQueryOpertion;
import com.pms.service.dbhelper.DBQueryUtil;
import com.pms.service.exception.ApiResponseException;
import com.pms.service.mockbean.ApiConstants;
import com.pms.service.mockbean.ArrivalNoticeBean;
import com.pms.service.mockbean.CustomerBean;
import com.pms.service.mockbean.DBBean;
import com.pms.service.mockbean.EqCostListBean;
import com.pms.service.mockbean.InvoiceBean;
import com.pms.service.mockbean.MoneyBean;
import com.pms.service.mockbean.ProjectBean;
import com.pms.service.mockbean.PurchaseBack;
import com.pms.service.mockbean.PurchaseCommonBean;
import com.pms.service.mockbean.PurchaseContract;
import com.pms.service.mockbean.PurchaseOrder;
import com.pms.service.mockbean.PurchaseRequest;
import com.pms.service.mockbean.SalesContractBean;
import com.pms.service.mockbean.ShipBean;
import com.pms.service.mockbean.UserBean;
import com.pms.service.service.AbstractService;
import com.pms.service.service.ICustomerService;
import com.pms.service.service.IProjectService;
import com.pms.service.service.IPurchaseContractService;
import com.pms.service.service.IPurchaseService;
import com.pms.service.service.ISalesContractService;
import com.pms.service.service.IUserService;
import com.pms.service.service.impl.PurchaseServiceImpl.PurchaseStatus;
import com.pms.service.util.ApiThreadLocal;
import com.pms.service.util.ApiUtil;
import com.pms.service.util.DataUtil;
import com.pms.service.util.DateUtil;
import com.pms.service.util.ExcleUtil;
import com.pms.service.util.status.ResponseCodeConstants;

public class SalesContractServiceImpl extends AbstractService implements ISalesContractService {

	private ICustomerService customerService;

	private IProjectService projectService;

	private IUserService userService;

	private IPurchaseService purchaseService;
	
	private IPurchaseContractService purchaseContractService;
	
	
	private String orderId;


	@Override
	public String geValidatorFileName() {
		// TODO Auto-generated method stub
		return null;
	}

	private static Logger logger = LogManager.getLogger(SalesContractServiceImpl.class);

	@Override
	public Map<String, Object> listSC(Map<String, Object> params) {

		// String[] limitKeys = {SalesContractBean.SC_CODE,
		// SalesContractBean.SC_AMOUNT, SalesContractBean.SC_CUSTOMER_ID,
		// SalesContractBean.SC_DATE, SalesContractBean.SC_PROJECT_ID,
		// SalesContractBean.SC_RUNNING_STATUS,
		// SalesContractBean.SC_ARCHIVE_STATUS, SalesContractBean.SC_TYPE,
		// "status"};
		// params.put(ApiConstants.LIMIT_KEYS, limitKeys);



		if (ApiThreadLocal.getMyTask() != null) {
			mergeMyTaskQuery(params, DBBean.SALES_CONTRACT);
        } else {
            if (params.get(ProjectBean.PROJECT_STATUS) == null) {
                params.put(ProjectBean.PROJECT_STATUS, "销售正式立项");
                mergeRefSearchQuery(params, SalesContractBean.SC_PROJECT_ID, ProjectBean.PROJECT_STATUS, ProjectBean.PROJECT_STATUS, DBBean.PROJECT);
            } else {
                mergeRefSearchQuery(params, SalesContractBean.SC_PROJECT_ID, ProjectBean.PROJECT_STATUS, ProjectBean.PROJECT_STATUS, DBBean.PROJECT);
            }

            params.put("status", new DBQuery(DBQueryOpertion.NOT_IN, new String[] { SalesContractBean.SC_STATUS_DRAFT }));
        }
		
	    mergeRefSearchQuery(params, ProjectBean.PROJECT_CUSTOMER_NAME, ProjectBean.PROJECT_CUSTOMER_ID, CustomerBean.NAME, DBBean.CUSTOMER);
	    mergeRefSearchQuery(params, ProjectBean.PROJECT_MANAGER_NAME, ProjectBean.PROJECT_MANAGER_ID, UserBean.USER_NAME, DBBean.USER);
	    mergeRefSearchQuery(params, SalesContractBean.SC_PROJECT_ID, ProjectBean.PROJECT_NAME, ProjectBean.PROJECT_NAME, DBBean.PROJECT);
	    mergeRefSearchQuery(params, SalesContractBean.SC_PROJECT_ID, ProjectBean.PROJECT_CODE, ProjectBean.PROJECT_CODE, DBBean.PROJECT);
		mergeDataRoleQueryWithProjectAndScType(params);


		Map<String, Object> result = dao.list(params, DBBean.SALES_CONTRACT);

		mergeProjectInfoForSC(result);
		return result;
	}



	@Override
	public Map<String, Object> addSC(Map<String, Object> params) {
		String _id = (String) params.get(ApiConstants.MONGO_ID);
			
		Map<String, Object> contract = params;
		ApiUtil.updateDataFloatValue(contract);
		contract.remove("scGotMoneyInfo");	
	    contract.remove("scInvoiceInfo");
	    contract.remove("monthMoneyList");
	    contract.remove("scMonthShipmentsInfo");
	    contract.remove("scYearShipmentsInfo");

		
        String status = SalesContractBean.SC_STATUS_SUBMITED;

        if (contract.get("status") != null) {
            status = contract.get("status").toString();
        }


        Object projectId = params.get(SalesContractBean.SC_PROJECT_ID);

		List<Map<String, Object>> eqcostList = new ArrayList<Map<String, Object>>();
		eqcostList = (List<Map<String, Object>>) params.get(SalesContractBean.SC_EQ_LIST);
		boolean isdraft = false;

        
		if (ApiUtil.isValid(_id)) {

			// 历史数据是草稿的话，清楚历史数据
			Map<String, Object> oldContract = this.dao.findOne(ApiConstants.MONGO_ID, _id, new String[] { "status" }, DBBean.SALES_CONTRACT);
			if (oldContract.get("status") != null && oldContract.get("status").toString().equalsIgnoreCase(SalesContractBean.SC_STATUS_DRAFT)) {
				Map<String, Object> eqDeleteQuery = new HashMap<String, Object>();
				eqDeleteQuery.put(SalesContractBean.SC_ID, _id);
				this.dao.deleteByQuery(eqDeleteQuery, DBBean.EQ_COST);

				//设置ID为空，重新添加
				for (Map<String, Object> eqMap : eqcostList) {
					eqMap.put(ApiConstants.MONGO_ID, null);
				}
			}
		}
        
		contract.remove(SalesContractBean.SC_EQ_LIST);
		Map<String, Object> addedContract = null;
		
		//如果是草稿或者新增
		if (ApiUtil.isEmpty(_id) || status.equalsIgnoreCase(SalesContractBean.SC_STATUS_DRAFT)) {						
			// 草稿和新的销售合同Add
			
	        Map<String, Object> projectInfo = new HashMap<String, Object>();

	        projectInfo.put(ProjectBean.PROJECT_CODE, params.get(ProjectBean.PROJECT_CODE));
	        projectInfo.put(ProjectBean.PROJECT_ABBR, params.get(ProjectBean.PROJECT_ABBR));
	        projectInfo.put(ProjectBean.PROJECT_ADDRESS, params.get(ProjectBean.PROJECT_ADDRESS));
	        projectInfo.put(ProjectBean.PROJECT_MANAGER_ID, params.get(ProjectBean.PROJECT_MANAGER_ID));
	        projectInfo.put(ProjectBean.PROJECT_CUSTOMER_ID, params.get(ProjectBean.PROJECT_CUSTOMER_ID));
	        projectInfo.put(ProjectBean.PROJECT_NAME, params.get(ProjectBean.PROJECT_NAME));
	        projectInfo.put(ProjectBean.PROJECT_STATUS, params.get(ProjectBean.PROJECT_STATUS));
	        projectInfo.put(ProjectBean.PROJECT_TYPE, params.get(ProjectBean.PROJECT_TYPE));
	        projectInfo.put(ProjectBean.PROJECT_MEMO, params.get(ProjectBean.PROJECT_MEMO));
	 

			// 如果提交的数据没包含项目，创建项目
	        Project project = (Project) DataUtil.toEntity(projectInfo, Project.class);
	        if(projectId !=null){
	        	project.set_id(projectId.toString());
	        }
	        
	        if (!status.equalsIgnoreCase(SalesContractBean.SC_STATUS_DRAFT)) {
	            //不是草稿 立项
	            project.setIsSetuped(true);
	        }
	        projectService.addProject(project);
	        projectId = project.get_id();
	        
	        if(projectId!=null){
	            mergeCommonProjectInfo(contract, projectId);
	        }
	        

	        
	        contract.put(SalesContractBean.SC_PROJECT_ID, projectId);
			contract.put(SalesContractBean.SC_MODIFY_TIMES, 0);
			contract.put(SalesContractBean.SC_LAST_TOTAL_AMOUNT, ApiUtil.getDouble(params, SalesContractBean.SC_AMOUNT));
			String genSCCode = genNewSCCode(projectId.toString());

			if (status.equalsIgnoreCase(SalesContractBean.SC_STATUS_DRAFT)) {
				isdraft = true;
				// 继续编辑草稿
				if (!ApiUtil.isEmpty(_id)) {
					contract.put(ApiConstants.MONGO_ID, _id);
					genSCCode = contract.get(SalesContractBean.SC_CODE).toString();
					
					updateContractCodeSuffix(contract);
					addedContract = dao.updateById(contract, DBBean.SALES_CONTRACT);
				} else {					
					contract.put(SalesContractBean.SC_CODE, genSCCode);
					addedContract = dao.add(contract, DBBean.SALES_CONTRACT);
				}
			} else {
				contract.put(SalesContractBean.SC_CODE, genSCCode);

				// 第一次提交的值
				contract.put(SalesContractBean.SC_FIRST_AMOUNT, ApiUtil.getFloatParam(params, SalesContractBean.SC_AMOUNT));
				contract.put(SalesContractBean.SC_FIRST_EQUIPMENT_AMOUNT, ApiUtil.getFloatParam(params, SalesContractBean.SC_EQUIPMENT_AMOUNT));
				contract.put(SalesContractBean.SC_FIRST_SERVICE_AMOUNT, ApiUtil.getFloatParam(params, SalesContractBean.SC_SERVICE_AMOUNT));
				contract.put(SalesContractBean.SC_FIRST_EXTIMATE_GROSS_PROFIT, ApiUtil.getDouble(params, SalesContractBean.SC_EXTIMATE_GROSS_PROFIT));

				addedContract = dao.add(contract, DBBean.SALES_CONTRACT);

				if (!ApiUtil.isEmpty(projectId) && !ApiUtil.isEmpty(params.get(SalesContractBean.SC_CUSTOMER_ID))) {
					// 更新关联项目customer(新的需求，添加 SC时 选择客户)
					Map<String, Object> updateProjectCustomer = new HashMap<String, Object>();
					updateProjectCustomer.put(ApiConstants.MONGO_ID, projectId);
					updateProjectCustomer.put(ProjectBean.PROJECT_CUSTOMER_ID, params.get(SalesContractBean.SC_CUSTOMER_ID));
					dao.updateById(updateProjectCustomer, DBBean.PROJECT);
				}

			}

			// 添加成本设备清单记录
			if (eqcostList != null && !eqcostList.isEmpty()) {
				addEqCostListForContract(eqcostList,  addedContract, isdraft, true);
			}

			return addedContract;
		} else {// Update
		    if(projectId!=null){
                mergeCommonProjectInfo(contract, projectId);
            }
			contract.put(ApiConstants.MONGO_ID, _id);
			contract.put(SalesContractBean.SC_CODE, params.get(SalesContractBean.SC_CODE));

			Map<String, Object> existContractQuery = new HashMap<String, Object>();
			existContractQuery.put(ApiConstants.MONGO_ID, _id);
			existContractQuery.put(ApiConstants.LIMIT_KEYS, new String[] { SalesContractBean.SC_PROJECT_ID, SalesContractBean.SC_TYPE, SalesContractBean.SC_MODIFY_TIMES,
			        SalesContractBean.SC_AMOUNT, SalesContractBean.SC_CUSTOMER_ID, SalesContractBean.SC_MODIFY_HISTORY, SalesContractBean.SC_LAST_TOTAL_AMOUNT,
			        SalesContractBean.SC_CODE });
			Map<String, Object> existContract = dao.findOneByQuery(existContractQuery, DBBean.SALES_CONTRACT);


			// 客户改变
			String customerOld = (String) existContract.get(SalesContractBean.SC_CUSTOMER_ID);
			String customerNew = (String) contract.get(SalesContractBean.SC_CUSTOMER_ID);
			if (customerOld==null || !customerOld.equals(customerNew)) {
				String[] relatedCollections = { DBBean.SC_GOT_MONEY };// 外键关联到SC,又冗余存有
																	  // customer
				Map<String, Object> relatedCQuery = new HashMap<String, Object>();
				relatedCQuery.put(SalesContractBean.SC_ID, _id);

				updateRelatedCollectionForTheSameField(relatedCollections, relatedCQuery, SalesContractBean.SC_CUSTOMER_ID, customerNew);
				
				// 单独更新关联项目中 冗余存的 customer (因为项目中没有外键关联到 SC ， 所以要单独更新处理)
				Map<String, Object> pCustomerUpdate = new HashMap<String, Object>();
				pCustomerUpdate.put(ApiConstants.MONGO_ID, projectId);
				pCustomerUpdate.put(ProjectBean.PROJECT_CUSTOMER_ID, customerNew);
				dao.updateById(pCustomerUpdate, DBBean.PROJECT);

			}
		
			updateContractCodeSuffix(contract);
			dao.updateById(contract, DBBean.SALES_CONTRACT);

		    Map<String, Object> project = new HashMap<String, Object>();
		    project.put(ApiConstants.MONGO_ID, projectId);
		    project.put("isSetuped", true);
            dao.updateById(project, DBBean.PROJECT);

		    
			// 添加成本设备清单记录
			if (!eqcostList.isEmpty()) {
				updateTheModifyHistoryAndModifyTimesAndscLastAmount(params, eqcostList, contract, existContract);
				addEqCostListForContract(eqcostList, contract, isdraft, true);
			}
			logger.info("***************************** Save contract *****************************");
			return contract;
		}
	}
	
	
    private void updateContractCodeSuffix(Map<String, Object> contract) {

        String projectId = contract.get(SalesContractBean.SC_PROJECT_ID).toString();

        String suffix = getScSuffix(projectId.toString());

        Map<String, Object> query = new HashMap<String, Object>();
        query.put(ApiConstants.MONGO_ID, projectId);
        query.put(ApiConstants.LIMIT_KEYS, new String[] { ProjectBean.PROJECT_CODE, ProjectBean.PROJECT_TYPE });

        Map<String, Object> project = this.dao.findOneByQuery(query, DBBean.PROJECT);

        String projectCode = (String) project.get(ProjectBean.PROJECT_CODE);

        String scCode = contract.get(SalesContractBean.SC_CODE).toString();

        // FIXME:
        if (scCode.startsWith(projectCode)) {
            // 新规则才跟新
            scCode = scCode.substring(projectCode.length());
            scCode = scCode.replaceAll("-QT", "-" + suffix);
            scCode = scCode.replaceAll("-FW", "-" + suffix);
            scCode = scCode.replaceAll("-XS", "-" + suffix);
            scCode = scCode.replaceAll("-GC", "-" + suffix);

            contract.put(SalesContractBean.SC_CODE, projectCode + scCode);
        }

    }
	
	public Map<String, Object> addSCAndProject(Project project, SalesContract contract, List<EqCost> costList){
 
        if(ApiUtil.isEmpty(contract.getStatus())){
            contract.setStatus( SalesContractBean.SC_STATUS_SUBMITED);
        }
        if (contract.getStatus().equalsIgnoreCase(SalesContractBean.SC_STATUS_SUBMITED) && ApiUtil.isEmpty(project.get_id())) {
            // 如果提交的数据没包含项目，创建项目
            projectService.addProject(project);
        }
//        contract.setProjectId(project.get_id());


        
        
	    return null;
	 }

	private void updateTheModifyHistoryAndModifyTimesAndscLastAmount(Map<String, Object> params, List<Map<String, Object>> eqcostList, Map<String, Object> contract,
	        Map<String, Object> existContract) {
		String now = DateUtil.getDateString(new Date()); // yyyy-MM-dd HH:mm:ss
		List<Map<String, Object>> newEqcostList = new ArrayList<Map<String, Object>>();
		double addAmount = getEqCostAmountByEqList(eqcostList);
		Map<String, Object> modifyMap = new HashMap<String, Object>();
		modifyMap.put(SalesContractBean.SC_MODIFY_MONEY, addAmount);
		modifyMap.put(SalesContractBean.SC_MODIFY_TIME, now);
		modifyMap.put(SalesContractBean.SC_MODIFY_PERSON, ApiThreadLocal.getCurrentUserId());
		modifyMap.put(SalesContractBean.SC_MODIFY_REASON, params.get(SalesContractBean.SC_MODIFY_REASON));
		modifyMap.put(SalesContractBean.SC_MODIFY_MEMO, params.get(SalesContractBean.SC_MODIFY_MEMO));
		newEqcostList.add(modifyMap);
		List<Map<String, Object>> scModifyHistory = (List<Map<String, Object>>) existContract.get(SalesContractBean.SC_MODIFY_HISTORY);
		if (!ApiUtil.isEmpty(scModifyHistory)) {
			newEqcostList.addAll(scModifyHistory);
		}
		contract.put(SalesContractBean.SC_MODIFY_HISTORY, newEqcostList);

		int mt = ApiUtil.getIntegerParam(existContract, SalesContractBean.SC_MODIFY_TIMES);
		contract.put(SalesContractBean.SC_MODIFY_TIMES, ++mt);

		double lastTotalAmount = ApiUtil.getFloatParam(existContract, SalesContractBean.SC_LAST_TOTAL_AMOUNT) == null ? 0 : ApiUtil.getDouble(existContract,
		        SalesContractBean.SC_LAST_TOTAL_AMOUNT);
		contract.put(SalesContractBean.SC_LAST_TOTAL_AMOUNT, lastTotalAmount + addAmount);
	}

	private double getEqCostAmountByEqList(List<Map<String, Object>> eqcostList) {
		double amount = 0;
		for (Map<String, Object> eq : eqcostList) {
			double cost = ApiUtil.getFloatParam(eq, SalesContractBean.SC_EQ_LIST_TOTAL_AMOUNT);
			amount = amount + cost;
		}
		return amount;
	}

	private void addEqCostListForContract(List<Map<String, Object>> eqcostList, Map<String, Object> contract, boolean isdraft, boolean needMerge) {
		int nextVersionNo = 1;
		String cId = contract.get(ApiConstants.MONGO_ID).toString();	
		String proId = contract.get(SalesContractBean.SC_PROJECT_ID).toString();
		String scCode = contract.get(SalesContractBean.SC_CODE).toString();
		
		if (!isdraft) {
			nextVersionNo = this.getEqCostNextVersionNo(cId);
		}

		for (Map<String, Object> item : eqcostList) {

			item.put(SalesContractBean.SC_ID, cId);
			item.put(EqCostListBean.EQ_LIST_REAL_AMOUNT, ApiUtil.getFloatParam(item, EqCostListBean.EQ_LIST_AMOUNT));
			item.put(EqCostListBean.EQ_LIST_LEFT_AMOUNT, ApiUtil.getFloatParam(item, EqCostListBean.EQ_LIST_REAL_AMOUNT));
			// Make sure the number value type
			item.put(EqCostListBean.EQ_LIST_BASE_PRICE, ApiUtil.getFloatParam(item, EqCostListBean.EQ_LIST_BASE_PRICE));
			item.put(EqCostListBean.EQ_LIST_SALES_BASE_PRICE, ApiUtil.getFloatParam(item, EqCostListBean.EQ_LIST_SALES_BASE_PRICE));
			item.put(EqCostListBean.EQ_LIST_DISCOUNT_RATE, ApiUtil.getFloatParam(item, EqCostListBean.EQ_LIST_DISCOUNT_RATE));
			item.put(EqCostListBean.EQ_LIST_LAST_BASE_PRICE, ApiUtil.getFloatParam(item, EqCostListBean.EQ_LIST_LAST_BASE_PRICE));
			item.put(EqCostListBean.EQ_LIST_TOTAL_AMOUNT, ApiUtil.getFloatParam(item, EqCostListBean.EQ_LIST_TOTAL_AMOUNT));

			item.put(SalesContractBean.SC_PROJECT_ID, proId);
			item.put(SalesContractBean.SC_CODE, scCode);
			item.put(EqCostListBean.EQ_LIST_VERSION_NO, nextVersionNo);
			
			mergeCommonFieldsFromSc(item, cId);

			Map<String, Object> realItemQuery = new HashMap<String, Object>();
			realItemQuery.put(SalesContractBean.SC_ID, cId);
			if(item.get(EqCostListBean.EQ_LIST_MATERIAL_CODE) == null){
				realItemQuery.put(EqCostListBean.EQ_LIST_MATERIAL_CODE, "");
			}else{
				realItemQuery.put(EqCostListBean.EQ_LIST_MATERIAL_CODE, item.get(EqCostListBean.EQ_LIST_MATERIAL_CODE));
			}
			realItemQuery.put(EqCostListBean.EQ_LIST_PRODUCT_NAME, item.get(EqCostListBean.EQ_LIST_PRODUCT_NAME));
			realItemQuery.put(EqCostListBean.EQ_LIST_PRODUCT_TYPE, item.get(EqCostListBean.EQ_LIST_PRODUCT_TYPE));
			realItemQuery.put(EqCostListBean.EQ_LIST_UNIT, item.get(EqCostListBean.EQ_LIST_UNIT));
			realItemQuery.put(EqCostListBean.EQ_LIST_BRAND, item.get(EqCostListBean.EQ_LIST_BRAND));
			realItemQuery.put(EqCostListBean.EQ_LIST_BASE_PRICE, item.get(EqCostListBean.EQ_LIST_BASE_PRICE));
			realItemQuery.put(EqCostListBean.EQ_LIST_CATEGORY, item.get(EqCostListBean.EQ_LIST_CATEGORY));
			realItemQuery.put(EqCostListBean.EQ_LIST_SALES_BASE_PRICE, item.get(EqCostListBean.EQ_LIST_SALES_BASE_PRICE));

			realItemQuery.put(EqCostListBean.EQ_LIST_DISCOUNT_RATE, item.get(EqCostListBean.EQ_LIST_DISCOUNT_RATE));
			realItemQuery.put(EqCostListBean.EQ_LIST_TAX_TYPE, item.get(EqCostListBean.EQ_LIST_TAX_TYPE));

			realItemQuery.put(EqCostListBean.EQ_LIST_REAL_AMOUNT, new DBQuery(DBQueryOpertion.NOT_NULL));
			realItemQuery.put(ApiConstants.LIMIT_KEYS, EqCostListBean.EQ_LIST_REAL_AMOUNT);
			Map<String, Object> realItem = dao.findOneByQuery(realItemQuery, DBBean.EQ_COST);

			if (realItem == null || !needMerge) {

				String eqcostCode = genEqcostListCode(scCode, nextVersionNo);
				item.put(EqCostListBean.EQ_LIST_CODE, eqcostCode);

				if (item.get(ApiConstants.MONGO_ID) != null) {
					dao.updateById(item, DBBean.EQ_COST);
				} else {
					dao.add(item, DBBean.EQ_COST);
				}

			} else {
				String eqcostCode = genEqcostListCode(scCode, nextVersionNo);

				if (ApiUtil.isEmpty(item.get(ApiConstants.MONGO_ID))) {
					realItem.put(EqCostListBean.EQ_LIST_CODE, eqcostCode);

					float applyAmount = ApiUtil.getFloatParam(item, EqCostListBean.EQ_LIST_AMOUNT);
					float totalAmount = applyAmount + ApiUtil.getFloatParam(realItem, EqCostListBean.EQ_LIST_REAL_AMOUNT);
					// (int)Float.parseFloat(realItem.get(EqCostListBean.EQ_LIST_REAL_AMOUNT).toString());
					realItem.put(EqCostListBean.EQ_LIST_AMOUNT, totalAmount);
					realItem.put(EqCostListBean.EQ_LIST_REAL_AMOUNT, totalAmount);
					realItem.put(EqCostListBean.EQ_LIST_LEFT_AMOUNT, totalAmount);
					item.put(ApiConstants.MONGO_ID, realItem.get(ApiConstants.MONGO_ID));
					this.dao.updateById(realItem, DBBean.EQ_COST);
				}else{
					item.put(EqCostListBean.EQ_LIST_CODE, eqcostCode);
					this.dao.add(item, DBBean.EQ_COST);

				}
			}

			if (!isdraft) {
		        Map<String, Object> clone = DBQueryUtil.generateQueryFields(item);
				this.dao.add(clone, DBBean.EQ_COST_HISTORY);
			}

		}
	}

	private int getEqCostNextVersionNo(String cId) {
		int curVersionNo = 0;
		int nextVersionNo = 1;
		Map<String, Object> query = new HashMap<String, Object>();
		query.put(EqCostListBean.EQ_LIST_SC_ID, cId);
		query.put(ApiConstants.LIMIT_KEYS, new String[] { EqCostListBean.EQ_LIST_VERSION_NO });
		query.put(ApiConstants.LIMIT, 1);

		Map<String, Object> order = new LinkedHashMap<String, Object>();
		order.put(EqCostListBean.EQ_LIST_VERSION_NO, ApiConstants.DB_QUERY_ORDER_BY_DESC);
		query.put(ApiConstants.DB_QUERY_ORDER_BY, order);

		Map<String, Object> re = dao.list(query, DBBean.EQ_COST_HISTORY);
		List<Map<String, Object>> reList = (List<Map<String, Object>>) re.get(ApiConstants.RESULTS_DATA);
		if (!reList.isEmpty()) {
			Map<String, Object> item = (Map<String, Object>) reList.get(0);
			curVersionNo = ApiUtil.getInteger(item, EqCostListBean.EQ_LIST_VERSION_NO, 0);
		}
		nextVersionNo = curVersionNo + 1;
		return nextVersionNo;
	}

	@Override
	public Map<String, Object> listSCsForSelect(Map<String, Object> params) {
		Map<String, Object> query = new HashMap<String, Object>();
		query.put(ApiConstants.LIMIT_KEYS, new String[] { SalesContractBean.SC_CODE, SalesContractBean.SC_PROJECT_ID, "customer" });
		query.put(SalesContractBean.SC_CODE, new DBQuery(DBQueryOpertion.NOT_NULL));
		query.put(SalesContractBean.SC_CODE, new DBQuery(DBQueryOpertion.NOT_EQUALS, ""));
		query.put("status", new DBQuery(DBQueryOpertion.NOT_IN, new String[] { SalesContractBean.SC_STATUS_DRAFT }));

		// 项目经理只能选择属于自己的销售合同
		if (isPM()) {
			query.put(ProjectBean.PROJECT_MANAGER_ID, ApiThreadLocal.getCurrentUserId());
		}

		Map<String, Object> projectQuery = new HashMap<String, Object>();
		projectQuery.put(ApiConstants.LIMIT_KEYS, ProjectBean.PROJECT_NAME);
		Map<String, Object> customers = this.dao.listToOneMapAndIdAsKey(null, DBBean.CUSTOMER);
		Map<String, Object> projects = this.dao.listToOneMapAndIdAsKey(projectQuery, DBBean.PROJECT);
		Map<String, Object> scResults = dao.list(query, DBBean.SALES_CONTRACT);
		List<Map<String, Object>> scList = (List<Map<String, Object>>) scResults.get(ApiConstants.RESULTS_DATA);
		for (Map<String, Object> item : scList) {
			Map<String, Object> project = (Map<String, Object>) projects.get(item.get(SalesContractBean.SC_PROJECT_ID));
			Map<String, Object> customer = (Map<String, Object>) customers.get(item.get("customer"));
			if (project != null) {
				item.put(ProjectBean.PROJECT_NAME, project.get(ProjectBean.PROJECT_NAME));
			}
			if (customer != null) {
				item.put("customerName", customer.get(CustomerBean.NAME));
				item.put("customerBankName", customer.get(CustomerBean.customerBankName));
				item.put("customerBankAccount", customer.get(CustomerBean.customerBankAccount));
			}
		}
		return scResults;
	}

	public Map<String, Object> listSCsForPurchaseBackSelect(Map<String, Object> params) {

		Map<String, Object> query = new HashMap<String, Object>();
		query.put(ApiConstants.LIMIT_KEYS, new String[] { SalesContractBean.SC_CODE, SalesContractBean.SC_PROJECT_ID, "customer" });
		query.put(SalesContractBean.SC_CODE, new DBQuery(DBQueryOpertion.NOT_NULL));
		query.put(SalesContractBean.SC_CODE, new DBQuery(DBQueryOpertion.NOT_EQUALS, ""));
		query.put("status", new DBQuery(DBQueryOpertion.NOT_IN, new String[] { SalesContractBean.SC_STATUS_DRAFT }));

		// 项目经理只能选择属于自己的销售合同
		if (isPM()) {
			query.put(ProjectBean.PROJECT_MANAGER_ID, ApiThreadLocal.getCurrentUserId());
		}

		Map<String, Object> projectQuery = new HashMap<String, Object>();
		projectQuery.put(ApiConstants.LIMIT_KEYS, ProjectBean.PROJECT_NAME);
		Map<String, Object> customers = this.dao.listToOneMapAndIdAsKey(null, DBBean.CUSTOMER);
		Map<String, Object> projects = this.dao.listToOneMapAndIdAsKey(projectQuery, DBBean.PROJECT);
		Map<String, Object> scResults = dao.list(query, DBBean.SALES_CONTRACT);
		List<Map<String, Object>> scList = (List<Map<String, Object>>) scResults.get(ApiConstants.RESULTS_DATA);
		List<Map<String, Object>> finalScList = new ArrayList<Map<String, Object>>();

		for (Map<String, Object> item : scList) {

			Map<String, Integer> restCountMap = purchaseService.countBackRestEqByScId(item.get(ApiConstants.MONGO_ID).toString());

			for (String key : restCountMap.keySet()) {
				if (restCountMap.get(key) != null && restCountMap.get(key) > 0) {
					finalScList.add(item);
					break;
				}
			}
		}
		scResults.put(ApiConstants.RESULTS_DATA, finalScList);
		for (Map<String, Object> item : finalScList) {

			Map<String, Object> project = (Map<String, Object>) projects.get(item.get(SalesContractBean.SC_PROJECT_ID));
			Map<String, Object> customer = (Map<String, Object>) customers.get(item.get("customer"));
			if (project != null) {
				item.put(ProjectBean.PROJECT_NAME, project.get(ProjectBean.PROJECT_NAME));
			}
			if (customer != null) {
				item.put("customerName", customer.get(CustomerBean.NAME));
				item.put("customerBankName", customer.get(CustomerBean.customerBankName));
				item.put("customerBankAccount", customer.get(CustomerBean.customerBankAccount));
			}
		}

		return scResults;

	}

	@Override
	public Map<String, Object> listMergedEqListBySC(Map<String, Object> params) {
		// TODO Auto-generated method stub
		String cId = (String) params.get(EqCostListBean.EQ_LIST_SC_ID);
		Map<String, Object> query = new HashMap<String, Object>();
		query.put(EqCostListBean.EQ_LIST_SC_ID, cId);
		query.put(EqCostListBean.EQ_LIST_REAL_AMOUNT, new DBQuery(DBQueryOpertion.NOT_NULL));

		Map<String, Object> result = dao.list(query, DBBean.EQ_COST);
		return result;
	}

	public Map<String, Object> getBaseInfoByIds(List<String> ids) {
		String[] keys = new String[] { SalesContractBean.SC_CODE, SalesContractBean.SC_AMOUNT, SalesContractBean.SC_PROJECT_ID, SalesContractBean.SC_CUSTOMER_ID,
		        SalesContractBean.SC_CUSTOMER_ID, SalesContractBean.SC_BACK_REQUEST_COUNT, SalesContractBean.SC_INVOICE_TYPE, SalesContractBean.SC_ESTIMATE_EQ_COST0,
		        SalesContractBean.SC_ESTIMATE_EQ_COST1 };
		Map<String, Object> query = new HashMap<String, Object>();
		query.put(ApiConstants.LIMIT_KEYS, keys);
		query.put(ApiConstants.MONGO_ID, new DBQuery(DBQueryOpertion.IN, ids));
		Map<String, Object> result = dao.list(query, DBBean.SALES_CONTRACT);
		mergeProjectInfoForSC(result);
		List<Map<String, Object>> list = (List<Map<String, Object>>) result.get(ApiConstants.RESULTS_DATA);
		Map<String, Object> data = new HashMap<String, Object>();
		for (Map<String, Object> obj : list) {
			obj.put("estimateTotal", ApiUtil.getFloatParam(obj, SalesContractBean.SC_ESTIMATE_EQ_COST0) + ApiUtil.getFloatParam(obj, SalesContractBean.SC_ESTIMATE_EQ_COST1));
			data.put((String) obj.get(ApiConstants.MONGO_ID), obj);
			obj.remove(ApiConstants.MONGO_ID);
		}
		return data;
	}

	/** id:map */
	public Map<String, Object> getEqBaseInfoByScIds(String id) {
		Map<String, Object> query = new HashMap<String, Object>();
		query.put(EqCostListBean.EQ_LIST_SC_ID, id);
		return dao.listToOneMapAndIdAsKey(query, DBBean.EQ_COST);
	}

	/** id:map */
	public Map<String, Object> getEqBaseInfoByIds(String ids) {
		Map<String, Object> query = new HashMap<String, Object>();
		query.put(ApiConstants.MONGO_ID, new DBQuery(DBQueryOpertion.IN, ids));
		return dao.listToOneMapAndIdAsKey(query, DBBean.EQ_COST);
	}

	private void mergeProjectInfoForSC(Map<String, Object> result) {
		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
		if (result.containsKey(ApiConstants.RESULTS_DATA)) {
			list = (List<Map<String, Object>>) result.get(ApiConstants.RESULTS_DATA);
		} else {
			list.add(result);
		}
		for (Map<String, Object> sc : list) {
			String proId = (String) sc.get(SalesContractBean.SC_PROJECT_ID);

			mergeCommonProjectInfo(sc, proId);
		}

	}

	@Override
	public Map<String, Object> getSC(Map<String, Object> params) {
		
		String _id = (String) params.get(ApiConstants.MONGO_ID);
		Map<String, Object> sc = dao.findOne(ApiConstants.MONGO_ID, _id, DBBean.SALES_CONTRACT);
		
		Map<String, Object> projectQuery = new HashMap<String, Object>();
		projectQuery.put(ApiConstants.MONGO_ID, sc.get(SalesContractBean.SC_PROJECT_ID));
		Map<String, Object> project = this.dao.findOneByQuery(projectQuery, DBBean.PROJECT);
		if (project != null) {
			project.remove(ApiConstants.MONGO_ID);
			project.remove("status");
			sc.putAll(project);
		}
		

		// Tab 页头显示增补历史，操作人信息merge
		List<Map<String, Object>> scHistoryList = (List<Map<String, Object>>) sc.get(SalesContractBean.SC_MODIFY_HISTORY);
		if (ApiUtil.isEmpty(scHistoryList)) {
			scHistoryList = new ArrayList<Map<String, Object>>();
		}
		List<String> uIds = new ArrayList<String>();
		for (Map<String, Object> h : scHistoryList) {
			String uid = (String) h.get(SalesContractBean.SC_MODIFY_PERSON);
			if (!ApiUtil.isEmpty(uid)) {
				uIds.add(uid);
			}
		}
		Map<String, Object> query = new HashMap<String, Object>();
		query.put(ApiConstants.MONGO_ID, new DBQuery(DBQueryOpertion.IN, uIds));
		query.put(ApiConstants.LIMIT_KEYS, new String[] { UserBean.USER_NAME });
		Map<String, Object> userData = dao.listToOneMapAndIdAsKey(query, DBBean.USER);
		for (Map<String, Object> h : scHistoryList) {
			String uid = (String) h.get(SalesContractBean.SC_MODIFY_PERSON);
			Map<String, Object> userMap = (Map<String, Object>) userData.get(uid);
			if (ApiUtil.isEmpty(userMap)) {
				h.put(SalesContractBean.SC_MODIFY_PERSON, "N/A");
			} else {
				h.put(SalesContractBean.SC_MODIFY_PERSON, userMap.get(UserBean.USER_NAME));
			}
		}

		// 获取相关的 设备清单列表数据
		Map<String, Object> eqCostQuery = new HashMap<String, Object>();
		eqCostQuery.put(EqCostListBean.EQ_LIST_SC_ID, _id);
		eqCostQuery.put(EqCostListBean.EQ_LIST_REAL_AMOUNT, new DBQuery(DBQueryOpertion.NOT_NULL));
		Map<String, Object> eqList = dao.list(eqCostQuery, DBBean.EQ_COST);
		List<Map<String, Object>> eqListData = (List<Map<String, Object>>) eqList.get(ApiConstants.RESULTS_DATA);

		// 获取相关开票信息列表数据
		Map<String, Object> invoiceQuery = new HashMap<String, Object>();
		invoiceQuery.put(MoneyBean.scId, _id);
		Map<String, Object> orderByMap = new LinkedHashMap<String, Object>();
		orderByMap.put(InvoiceBean.payInvoiceActualDate, ApiConstants.DB_QUERY_ORDER_BY_ASC);
		invoiceQuery.put(ApiConstants.DB_QUERY_ORDER_BY, orderByMap);
		Map<String, Object> invoiceList = dao.list(invoiceQuery, DBBean.SC_INVOICE);
		List<Map<String, Object>> invoiceListData = (List<Map<String, Object>>) invoiceList.get(ApiConstants.RESULTS_DATA);

		// 获取相关收款信息列表数据
		Map<String, Object> gotMoneyQuery = new HashMap<String, Object>();
		gotMoneyQuery.put(MoneyBean.scId, _id);
		Map<String, Object> order = new LinkedHashMap<String, Object>();
		order.put(MoneyBean.getMoneyActualDate, ApiConstants.DB_QUERY_ORDER_BY_ASC);
		gotMoneyQuery.put(ApiConstants.DB_QUERY_ORDER_BY, order);
		Map<String, Object> gotMoneyList = dao.list(gotMoneyQuery, DBBean.SC_GOT_MONEY);
		List<Map<String, Object>> gotMoneyListData = (List<Map<String, Object>>) gotMoneyList.get(ApiConstants.RESULTS_DATA);

		Map<String, Object> gotMoneyData = new HashMap<String, Object>();

		// 月度日期数组
		List<String> monthDateList = new ArrayList<String>();
		// 对应的金额数组
		List<Double> monthMoneyList = new ArrayList<Double>();
		// 年度日期数组
		List<String> yearDateList = new ArrayList<String>();
		// 对应的金额数组
		List<Double> yearMoneyList = new ArrayList<Double>();
		for (Map<String, Object> data : gotMoneyListData) {
			if (data.containsKey(MoneyBean.getMoneyActualDate) && data.containsKey(MoneyBean.getMoneyActualMoney)) {
				String date = data.get(MoneyBean.getMoneyActualDate).toString();
				String[] datearr = date.split("-");
				String monthstr = datearr[0] + "-" + datearr[1];
				String yearstr = datearr[0];

				Double money = (Double) data.get(MoneyBean.getMoneyActualMoney);

				// month
				if (monthDateList.isEmpty()) {
					monthDateList.add(monthstr);
					monthMoneyList.add(money);
				} else {
					String preDateStr = monthDateList.get(monthDateList.size() - 1);
					if (monthstr.equals(preDateStr)) {
						Double preMoney = monthMoneyList.get(monthMoneyList.size() - 1);
						monthMoneyList.set(monthMoneyList.size() - 1, preMoney + money);
					} else {
						monthDateList.add(monthstr);
						monthMoneyList.add(money);
					}
				}
				// year
				if (yearDateList.isEmpty()) {
					yearDateList.add(yearstr);
					yearMoneyList.add(money);
				} else {
					String preDateStr = yearDateList.get(yearDateList.size() - 1);
					if (yearstr.equals(preDateStr)) {
						Double preMoney = yearMoneyList.get(yearMoneyList.size() - 1);
						yearMoneyList.set(yearMoneyList.size() - 1, preMoney + money);
					} else {
						yearDateList.add(yearstr);
						yearMoneyList.add(money);
					}
				}
			}
		}

		gotMoneyData.put("monthDateList", monthDateList);
		gotMoneyData.put("monthMoneyList", monthMoneyList);
		gotMoneyData.put("yearDateList", yearDateList);
		gotMoneyData.put("yearMoneyList", yearMoneyList);

		// 获取相关 按月发货金额
		Map<String, Object> monthShipmentsQuery = new HashMap<String, Object>();
		monthShipmentsQuery.put(SalesContractBean.SC_ID, _id);
		Map<String, Object> monthShipmentsList = dao.list(gotMoneyQuery, DBBean.SC_MONTH_SHIPMENTS);
		List<Map<String, Object>> monthShipmentsListData = (List<Map<String, Object>>) monthShipmentsList.get(ApiConstants.RESULTS_DATA);

		// 获取相关 按年发货金额
		Map<String, Object> yearShipmentsQuery = new HashMap<String, Object>();
		yearShipmentsQuery.put(SalesContractBean.SC_ID, _id);
		Map<String, Object> yearShipmentsList = dao.list(yearShipmentsQuery, DBBean.SC_YEAR_SHIPMENTS);
		List<Map<String, Object>> yearShipmentsListData = (List<Map<String, Object>>) yearShipmentsList.get(ApiConstants.RESULTS_DATA);

		sc.put(SalesContractBean.SC_EQ_LIST, eqListData);
		sc.put(SalesContractBean.SC_INVOICE_INFO, invoiceListData);
		sc.put(SalesContractBean.SC_GOT_MONEY_INFO, gotMoneyData);
		sc.put(SalesContractBean.SC_MONTH_SHIPMENTS_INFO, monthShipmentsListData);
		sc.put(SalesContractBean.SC_YEAR_SHIPMENTS_INFO, yearShipmentsListData);

		Map<String, Object> request = new LinkedHashMap<String, Object>();
		request.put(PurchaseBack.pbStatus, PurchaseStatus.saved.toString());
		request.put(PurchaseBack.scId, _id);

		sc.put("purchaseRequestList", purchaseService.loadEqBackForSC(request).get(PurchaseBack.eqcostList));
		return sc;
	}

	@Override
	public Map<String, Object> addInvoiceForSC(Map<String, Object> params) {
		Map<String, Object> invoice = new HashMap<String, Object>();
		invoice.put(InvoiceBean.scId, params.get(InvoiceBean.scId));
		invoice.put(SalesContractBean.SC_INVOICE_TYPE, params.get(SalesContractBean.SC_INVOICE_TYPE));

		invoice.put(InvoiceBean.payInvoicePlanDate, DateUtil.converUIDate(params.get(InvoiceBean.payInvoicePlanDate)));
		invoice.put(InvoiceBean.payInvoiceReceivedMoneyStatus, params.get(InvoiceBean.payInvoiceReceivedMoneyStatus));
		invoice.put(InvoiceBean.payInvoiceStatus, InvoiceBean.statusSubmit);
		invoice.put(InvoiceBean.payInvoiceSubmitDate, DateUtil.getDateString(new Date()));
		invoice.put("projectId", params.get("projectId"));
		invoice.put("contractCode", params.get("contractCode"));

		// invoice.put(InvoiceBean.payInvoiceDepartment,
		// params.get(InvoiceBean.payInvoiceDepartment));
		// invoice.put(InvoiceBean.payInvoiceComment,
		// params.get(InvoiceBean.payInvoiceComment));
		String oldComment = (String) dao.querySingleKeyById(InvoiceBean.payInvoiceComment, params.get(ApiConstants.MONGO_ID), DBBean.SC_INVOICE);
		String comment = (String) params.get("tempComment");
		comment = recordComment("提交", comment, oldComment);
		invoice.put(InvoiceBean.payInvoiceComment, comment);

		// add salesCotract's contractType into invoice, so department manager
		// can approve their invoice request
		Map<String, Object> sc = dao.findOne(ApiConstants.MONGO_ID, params.get(InvoiceBean.scId), DBBean.SALES_CONTRACT);
		invoice.put(SalesContractBean.SC_TYPE, sc.get(SalesContractBean.SC_TYPE));

		List<Map<String, Object>> items = (List<Map<String, Object>>) params.get(InvoiceBean.payInvoiceItemList);
		double total = 0.0;
		for (Map<String, Object> item : items) {
			total += ApiUtil.getFloatParam(item, InvoiceBean.itemMoney);
		}
		invoice.put(InvoiceBean.payInvoiceItemList, items);
		invoice.put(InvoiceBean.payInvoiceMoney, total);
		invoice.put(InvoiceBean.payInvoiceActualMoney, 0);
		dao.add(invoice, DBBean.SC_INVOICE);
		// TODO: 添加任务
		return invoice;
	}

	@SuppressWarnings("unchecked")
	public Map<String, Object> prepareInvoiceForSC(Map<String, Object> params) {
		Map<String, Object> result = viewSC(params);

		result.remove(ApiConstants.MONGO_ID);// _id is SalesContract's id
		result.put(InvoiceBean.scId, params.get(InvoiceBean.scId));
		result.put(InvoiceBean.payInvoiceStatus, InvoiceBean.statusUnSubmit);
		result.put(InvoiceBean.payInvoiceItemList, new ArrayList());
		result.put(InvoiceBean.payInvoiceSubmitDate, DateUtil.getDateString(new Date()));
		result.put(InvoiceBean.payInvoiceComment, "");

		return result;
	}

	@Override
	public Map<String, Object> approveInvoiceForSC(Map<String, Object> params) {
		String id = (String) params.get(ApiConstants.MONGO_ID);
		Map<String, Object> payInvoice = dao.findOne(ApiConstants.MONGO_ID, id, DBBean.SC_INVOICE);
		String oldStatus = String.valueOf(payInvoice.get(InvoiceBean.payInvoiceStatus));
		String creatorId = String.valueOf(payInvoice.get(ApiConstants.CREATOR));

		String oldComment = (String) payInvoice.get(InvoiceBean.payInvoiceComment);
		String comment = (String) params.get("tempComment");

		// check creator permission
		Map<String, Object> uInvoice = new HashMap<String, Object>();
		uInvoice.put(ApiConstants.MONGO_ID, id);
		uInvoice.put(InvoiceBean.payInvoiceComment, params.get(InvoiceBean.payInvoiceComment));
		if (InvoiceBean.statusSubmit.equals(oldStatus)) {
			uInvoice.put(InvoiceBean.payInvoiceStatus, InvoiceBean.statusManagerApprove);
			comment = recordComment("批准", comment, oldComment);
		} else if (InvoiceBean.statusManagerApprove.equals(oldStatus)) {
			uInvoice.put(InvoiceBean.payInvoiceStatus, InvoiceBean.statusFinanceManagerApprojve);
			uInvoice.put(InvoiceBean.payInvoiceManagerId, ApiThreadLocal.getCurrentUserId());
			comment = recordComment("批准", comment, oldComment);
		} else if (InvoiceBean.statusFinanceManagerApprojve.equals(oldStatus)) {
			uInvoice.put(InvoiceBean.payInvoiceActualMoney, params.get(InvoiceBean.payInvoiceActualMoney));
			uInvoice.put(InvoiceBean.payInvoiceActualDate, DateUtil.converUIDate(params.get(InvoiceBean.payInvoiceActualDate)));
			uInvoice.put(InvoiceBean.payInvoiceActualInvoiceNum, params.get(InvoiceBean.payInvoiceActualInvoiceNum));
			uInvoice.put(InvoiceBean.payInvoiceActualSheetCount, params.get(InvoiceBean.payInvoiceActualSheetCount));
			uInvoice.put(InvoiceBean.payInvoiceStatus, InvoiceBean.statusDone);
			comment = recordComment("开票结束", comment, oldComment);
		}

		uInvoice.put(InvoiceBean.payInvoiceComment, comment);
		return dao.updateById(uInvoice, DBBean.SC_INVOICE);
	}

	public Map<String, Object> rejectInvoiceForSC(Map<String, Object> params) {
		Map<String, Object> payInvoice = dao.findOne(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID), DBBean.SC_INVOICE);
		payInvoice.put(InvoiceBean.payInvoiceStatus, InvoiceBean.statusReject);

		String oldComment = (String) payInvoice.get(InvoiceBean.payInvoiceComment);
		String comment = (String) params.get("tempComment");
		comment = recordComment("拒绝", comment, oldComment);
		payInvoice.put(InvoiceBean.payInvoiceComment, comment);

		return dao.updateById(payInvoice, DBBean.SC_INVOICE);
	}

	@Override
	public Map<String, Object> loadInvoiceForSC(Map<String, Object> params) {
		Map<String, Object> obj = dao.findOne(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID), DBBean.SC_INVOICE);
		String scId = (String) obj.get(InvoiceBean.scId);

		Map<String, Object> query = new HashMap<String, Object>();
		query.put(InvoiceBean.scId, scId);
		Map<String, Object> result = viewSC(query);
		result.remove(ApiConstants.MONGO_ID);
		obj.putAll(result);
		return obj;
	}

	@Override
	public Map<String, Object> listInvoiceForSC(Map<String, Object> params) {
		Map<String, Object> query = new HashMap<String, Object>();//
		if (params.get(InvoiceBean.scId) != null) {
			query.put(InvoiceBean.scId, params.get(InvoiceBean.scId));
		}
		query.put(ApiConstants.LIMIT, params.get(ApiConstants.LIMIT));
		query.put(ApiConstants.LIMIT_START, params.get(ApiConstants.LIMIT_START));
		Map<String, Object> result = dao.list(query, DBBean.SC_INVOICE);
		mergeCreatorInfo(result);
		return result;
	}

	@Override
	public Map<String, Object> viewSC(Map<String, Object> params) {
		String scId = (String) params.get(SalesContractBean.SC_ID);
		Map<String, Object> sc = dao.findOne(ApiConstants.MONGO_ID, scId, DBBean.SALES_CONTRACT);
		Map<String, Object> customer = dao.findOne(ApiConstants.MONGO_ID, sc.get(SalesContractBean.SC_CUSTOMER_ID), DBBean.CUSTOMER);
		mergeProjectInfoForSC(sc);
		sc.put(CustomerBean.customerBankAccount, customer.get(CustomerBean.customerBankAccount));
		sc.put(CustomerBean.customerBankName, customer.get(CustomerBean.customerBankName));
		// 统计已开票金额
		double total1 = 0;
		Map<String, Object> query1 = new HashMap<String, Object>();
		query1.put(ApiConstants.LIMIT_KEYS, InvoiceBean.payInvoiceActualMoney);
		query1.put(InvoiceBean.scId, scId);
		query1.put(InvoiceBean.payInvoiceStatus, InvoiceBean.statusDone);
		List<Object> invoiceList = dao.listLimitKeyValues(query1, DBBean.SC_INVOICE);
		for (Object obj : invoiceList) {
			total1 += ApiUtil.getDouble(String.valueOf(obj));
		}

		// 统计已收款总额
		double total2 = 0;
		Map<String, Object> query2 = new HashMap<String, Object>();
		query2.put(ApiConstants.LIMIT_KEYS, MoneyBean.getMoneyActualMoney);
		query2.put(InvoiceBean.scId, scId);
		List<Object> moneyList = dao.listLimitKeyValues(query2, DBBean.SC_GOT_MONEY);
		for (Object obj : moneyList) {
			total2 += ApiUtil.getDouble(String.valueOf(obj));
		}
		sc.put("totalInvoiceMoney", total1);
		sc.put("totalGetMoney", total2);
		return sc;
	}

	public Map<String, Object> viewInvoiceForSC(Map<String, Object> params) {
		String scId = (String) params.get(InvoiceBean.scId);
		Map<String, Object> sc = dao.findOne(ApiConstants.MONGO_ID, scId, DBBean.SALES_CONTRACT);
		sc.put(SalesContractBean.SC_ID, sc.get(ApiConstants.MONGO_ID));
		mergeProjectInfoForSC(sc);
		//
		Map<String, Object> query = new HashMap<String, Object>();
		query.put(InvoiceBean.scId, scId);
		Map<String, Object> invoiceMap = dao.list(query, DBBean.SC_INVOICE);
		mergeCreatorInfo(invoiceMap);
		sc.put("invoiceList", invoiceMap.get(ApiConstants.RESULTS_DATA));

		// 统计已开票金额
		double total1 = 0;
		List<Map<String, Object>> invoiceList = (List<Map<String, Object>>) invoiceMap.get(ApiConstants.RESULTS_DATA);
		for (Map<String, Object> obj : invoiceList) {
			String status = (String) obj.get(InvoiceBean.payInvoiceStatus);
			if (InvoiceBean.statusDone.equals(status)) {
				total1 += ApiUtil.getFloatParam(obj, InvoiceBean.payInvoiceActualMoney);
			}
		}

		// 统计已收款总额
		double total2 = 0;
		Map<String, Object> moneyMap = dao.list(query, DBBean.SC_GOT_MONEY);
		List<Map<String, Object>> moneyList = (List<Map<String, Object>>) moneyMap.get(ApiConstants.RESULTS_DATA);
		for (Map<String, Object> obj : moneyList) {
			total2 += ApiUtil.getFloatParam(obj, MoneyBean.getMoneyActualMoney);
		}
		mergeCreatorInfo(moneyMap);
		sc.put("moneyList", moneyMap.get(ApiConstants.RESULTS_DATA));
		sc.put("totalInvoiceMoney", total1);
		sc.put("totalGetMoney", total2);

		return sc;
	}

	@Override
	public Map<String, Object> saveGetMoneyForSC(Map<String, Object> params) {
		Map<String, Object> obj = new HashMap<String, Object>();
		obj.put(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID));
		obj.put(MoneyBean.getMoneyActualMoney, ApiUtil.getFloatParam(params, MoneyBean.getMoneyActualMoney));
		obj.put(MoneyBean.getMoneyActualDate, DateUtil.converUIDate(params.get(MoneyBean.getMoneyActualDate)));
		obj.put(MoneyBean.customerBankAccount, params.get(MoneyBean.customerBankAccount));
		obj.put(MoneyBean.customerBankName, params.get(MoneyBean.customerBankName));

		String[] keys = new String[] { "customer", "contractCode", "projectId" };
		Map<String, Object> sc = dao.findOne(SalesContractBean.SC_CODE, params.get("contractCode"), keys, DBBean.SALES_CONTRACT);
		if (sc == null) {
			throw new ApiResponseException("销售合同不存在", params, "请输入正确合同编号");
		}

		obj.put(MoneyBean.scId, sc.get(ApiConstants.MONGO_ID));
		obj.put(MoneyBean.contractCode, sc.get("contractCode"));
		obj.put(MoneyBean.projectId, sc.get("projectId"));
		obj.put(MoneyBean.customer, sc.get("customer"));

		// 如果没有初始化 银行账号，则初始化
		Map<String, Object> customer = dao.findOne(ApiConstants.MONGO_ID, sc.get("customer"), DBBean.CUSTOMER);
		if (customer != null) {
			String cardName = (String) customer.get(MoneyBean.customerBankName);
			if (cardName == null || cardName.isEmpty()) {
				customer.put(MoneyBean.customerBankName, params.get(MoneyBean.customerBankName));
				customer.put(MoneyBean.customerBankAccount, params.get(MoneyBean.customerBankAccount));
				dao.updateById(customer, DBBean.CUSTOMER);
			}
		}
		String oldComment = (String) dao.querySingleKeyById(MoneyBean.getMoneyComment, params.get(ApiConstants.MONGO_ID), DBBean.SC_GOT_MONEY);
		String comment = (String) params.get("tempComment");
		comment = recordComment("提交", comment, oldComment);
		obj.put(MoneyBean.getMoneyComment, comment);//
		obj.put("tempComment", params.get("tempComment"));
		return dao.save(obj, DBBean.SC_GOT_MONEY);
	}

	@Override
	public void destoryGetMoney(Map<String, Object> params) {
		List<String> ids = new ArrayList<String>();
		ids.add(String.valueOf(params.get(ApiConstants.MONGO_ID)));
		dao.deleteByIds(ids, DBBean.SC_GOT_MONEY);
	}

	@Override
	public Map<String, Object> listGetMoneyForSC(Map<String, Object> params) {
		Map<String, Object> query = new HashMap<String, Object>();//
		if (params.get(MoneyBean.scId) != null) {
			query.put(InvoiceBean.scId, params.get(InvoiceBean.scId));
		}
		query.put(ApiConstants.LIMIT, params.get(ApiConstants.LIMIT));
		query.put(ApiConstants.LIMIT_START, params.get(ApiConstants.LIMIT_START));
		Map<String, Object> map = dao.list(query, DBBean.SC_GOT_MONEY);
		List<Map<String, Object>> list = (List<Map<String, Object>>) map.get(ApiConstants.RESULTS_DATA);

		Set<String> suIds = new HashSet<String>();
		for (Map<String, Object> obj : list) {
			suIds.add((String) obj.get(MoneyBean.customer));
		}
		suIds.remove(null);
		suIds.remove("");
		if (!suIds.isEmpty()) {
			Map<String, Object> query02 = new HashMap<String, Object>();
			query02.put(ApiConstants.MONGO_ID, new DBQuery(DBQueryOpertion.IN, new ArrayList(suIds)));
			Map<String, Object> map2 = dao.listToOneMapAndIdAsKey(query02, DBBean.CUSTOMER);
			for (Map<String, Object> obj : list) {
				String id = (String) obj.get(MoneyBean.customer);
				if (map2.containsKey(id)) {
					Map<String, Object> su = (Map<String, Object>) map2.get(id);
					obj.put("customerName", su.get("name"));
				}
			}
		}
		mergeCreatorInfo(map);
		return map;
	}

	@Override
	public Map<String, Object> getRelatedProjectInfo(Map<String, Object> params) {
		String scId = (String) params.get(SalesContractBean.SC_ID);
		Map<String, Object> querySC = new HashMap<String, Object>();
		querySC.put(ApiConstants.MONGO_ID, scId);
		querySC.put(ApiConstants.LIMIT_KEYS, new String[] { SalesContractBean.SC_PROJECT_ID });
		Map<String, Object> sc = dao.findOneByQuery(querySC, DBBean.SALES_CONTRACT);

		String pId = (String) sc.get(SalesContractBean.SC_PROJECT_ID);
		return dao.findOne(ApiConstants.MONGO_ID, pId, DBBean.PROJECT);
	}

	@Override
	public Map<String, Object> addMonthShipmentsForSC(Map<String, Object> params) {
		String _id = (String) params.get(ApiConstants.MONGO_ID);
		if (_id == null || _id.length() == 0) {// Add
			Map<String, Object> ms = new HashMap<String, Object>();
			ms.put(SalesContractBean.SC_SHIPMENTS_MONEY, params.get(SalesContractBean.SC_SHIPMENTS_MONEY));
			ms.put(SalesContractBean.SC_MONTH_SHIPMENTS_MONTH, params.get(SalesContractBean.SC_MONTH_SHIPMENTS_MONTH));
			ms.put(SalesContractBean.SC_ID, params.get(SalesContractBean.SC_ID));
			return dao.add(ms, DBBean.SC_MONTH_SHIPMENTS);
		} else {// Update

		}
		return null;
	}

	@Override
	public Map<String, Object> listMonthShipmentsForSC(Map<String, Object> params) {
		String scId = (String) params.get(SalesContractBean.SC_ID);
		Map<String, Object> query = new HashMap<String, Object>();
		query.put(SalesContractBean.SC_ID, scId);
		return dao.list(query, DBBean.SC_MONTH_SHIPMENTS);
	}

	/**
	 * 根据销售合同_id，获取销售合同相关的 信息：销售合同编号，客户名称 支持批量获取
	 */
	@Override
	public Map<String, Object> getSCAndCustomerInfo(Map<String, Object> params) {
		Object scId = params.get(SalesContractBean.SC_ID);
		List<String> scIds = new ArrayList<String>();
		if (scId instanceof String) {
			scIds.add(scId.toString());
		} else {
			scIds = (List<String>) scId;
		}
		Map<String, Object> query = new HashMap<String, Object>();
		query.put(ApiConstants.MONGO_ID, new DBQuery(DBQueryOpertion.IN, scIds));
		query.put(ApiConstants.LIMIT_KEYS, new String[] { SalesContractBean.SC_CODE, SalesContractBean.SC_PROJECT_ID });
		Map<String, Object> result = dao.list(query, DBBean.SALES_CONTRACT);
		List<Map<String, Object>> resultListData = (List<Map<String, Object>>) result.get(ApiConstants.RESULTS_DATA);

		List<String> pids = new ArrayList<String>();
		for (Map<String, Object> sc : resultListData) {
			String pId = (String) sc.get(SalesContractBean.SC_PROJECT_ID);
			if (!ApiUtil.isEmpty(pId)) {
				pids.add(pId);
			}
		}
		Map<String, Object> pQuery = new HashMap<String, Object>();
		pQuery.put(ApiConstants.MONGO_ID, new DBQuery(DBQueryOpertion.IN, pids));
		pQuery.put(ApiConstants.LIMIT_KEYS, new String[] { ProjectBean.PROJECT_CUSTOMER_ID });
		Map<String, Object> pResult = dao.listToOneMapAndIdAsKey(pQuery, DBBean.PROJECT);
		// List<Map<String, Object>> pResultListData = (List<Map<String,
		// Object>>) pResult.get(ApiConstants.RESULTS_DATA);
		pResult.remove(ApiConstants.RESULTS_DATA);
		pResult.remove(ApiConstants.PAGENATION);

		List<String> cids = new ArrayList<String>();
		for (Entry<String, Object> en : pResult.entrySet()) {
			Map<String, Object> p = (Map<String, Object>) en.getValue();
			String cId = (String) p.get(ProjectBean.PROJECT_CUSTOMER_ID);
			if (!ApiUtil.isEmpty(cId)) {
				cids.add(cId);
			}
		}

		Map<String, Object> cusQuery = new HashMap<String, Object>();
		cusQuery.put(ApiConstants.MONGO_ID, new DBQuery(DBQueryOpertion.IN, cids));
		cusQuery.put(ApiConstants.LIMIT_KEYS, new String[] { CustomerBean.NAME });
		Map<String, Object> cResult = dao.listToOneMapAndIdAsKey(cusQuery, DBBean.CUSTOMER);

		for (Entry<String, Object> en : pResult.entrySet()) {
			Map<String, Object> p = (Map<String, Object>) en.getValue();
			Map<String, Object> c = (Map<String, Object>) cResult.get(p.get(ProjectBean.PROJECT_CUSTOMER_ID));
			p.put(ProjectBean.PROJECT_CUSTOMER_ID, c.get(CustomerBean.NAME));
		}

		for (Map<String, Object> sc : resultListData) {
			String pId = (String) sc.get(SalesContractBean.SC_PROJECT_ID);
			Map<String, Object> p = (Map<String, Object>) pResult.get(pId);
			sc.put(ProjectBean.PROJECT_CUSTOMER_ID, p.get(ProjectBean.PROJECT_CUSTOMER_ID));
		}

		return result;
	}

	@Override
	public Map<String, Object> getSCeqByIds(Map<String, Object> params) {
		Object eqIds = params.get("eqIds");
		Map<String, Object> query = new HashMap<String, Object>();
		List<String> ids = null;
		if (eqIds instanceof String) {
			query.put(ApiConstants.MONGO_ID, (String) eqIds);
		} else {
			ids = (List<String>) eqIds;
			query.put(ApiConstants.MONGO_ID, new DBQuery(DBQueryOpertion.IN, ids));
		}
		return dao.list(query, DBBean.EQ_COST);
	}

	@Override
	public Map<String, Object> listSCByProject(Map<String, Object> params) {
		String pId = (String) params.get(SalesContractBean.SC_PROJECT_ID);
		if (ApiUtil.isEmpty(pId)) {
			throw new ApiResponseException(String.format("Project id is empty", params), ResponseCodeConstants.PROJECT_ID_IS_EMPTY.toString());
		}

		Map<String, Object> query = new HashMap<String, Object>();
		query.put(SalesContractBean.SC_PROJECT_ID, pId);
		query.put(ApiConstants.LIMIT_KEYS, new String[] { SalesContractBean.SC_CODE, SalesContractBean.SC_TYPE, SalesContractBean.SC_CUSTOMER_ID, SalesContractBean.APPLICATION_DEPARTMENT});
		Map<String, Object> result = dao.list(query, DBBean.SALES_CONTRACT);

		return result;
	}

	public void mergeCommonFieldsFromSc(Map<String, Object> data, Object scId) {
		Map<String, Object> scQuery = new HashMap<String, Object>();
		scQuery.put(ApiConstants.MONGO_ID, scId);
		scQuery.put(ApiConstants.LIMIT_KEYS, new String[] { SalesContractBean.SC_CODE, SalesContractBean.SC_PROJECT_ID, SalesContractBean.SC_TYPE, SalesContractBean.SC_CUSTOMER_ID });

		Map<String, Object> sc = this.dao.findOneByQuery(scQuery, DBBean.SALES_CONTRACT);

		data.put(SalesContractBean.SC_ID, scId);
		data.put(SalesContractBean.SC_CODE, sc.get(SalesContractBean.SC_CODE));
		data.put(SalesContractBean.SC_PROJECT_ID, sc.get(SalesContractBean.SC_PROJECT_ID));
		data.put(SalesContractBean.SC_TYPE, sc.get(SalesContractBean.SC_TYPE));
		data.put(SalesContractBean.SC_CUSTOMER_ID, sc.get(SalesContractBean.SC_CUSTOMER_ID));

		Map<String, Object> customerQuery = new HashMap<String, Object>();
		customerQuery.put(ApiConstants.MONGO_ID, sc.get(SalesContractBean.SC_CUSTOMER_ID));
		customerQuery.put(ApiConstants.LIMIT_KEYS, new String[] { CustomerBean.NAME });

		Map<String, Object> customer = this.dao.findOneByQuery(customerQuery, DBBean.CUSTOMER);
		if (ApiUtil.isValid(customer)) {
			data.put(ProjectBean.PROJECT_CUSTOMER_NAME, customer.get(CustomerBean.NAME));
		}

		mergeCommonProjectInfo(data, sc.get(SalesContractBean.SC_PROJECT_ID));

	}

	public void mergeCommonProjectInfo(Map<String, Object> data, Object projectId) {
		Map<String, Object> projectQuery = new HashMap<String, Object>();
		projectQuery.put(ApiConstants.MONGO_ID, projectId);
		projectQuery.put(ApiConstants.LIMIT_KEYS, new String[] { ProjectBean.PROJECT_CUSTOMER_ID, ProjectBean.PROJECT_MANAGER_ID, ProjectBean.PROJECT_TYPE, ProjectBean.PROJECT_CODE, ProjectBean.PROJECT_NAME });

		Map<String, Object> project = this.dao.findOneByQuery(projectQuery, DBBean.PROJECT);
		if (project != null) {
			data.put(ProjectBean.PROJECT_MANAGER_ID, project.get(ProjectBean.PROJECT_MANAGER_ID));
			data.put(ProjectBean.PROJECT_CUSTOMER_ID, project.get(ProjectBean.PROJECT_CUSTOMER_ID));
			data.put(ProjectBean.PROJECT_TYPE, project.get(ProjectBean.PROJECT_TYPE));

			data.put(ProjectBean.PROJECT_CODE, project.get(ProjectBean.PROJECT_CODE));
			data.put(ProjectBean.PROJECT_NAME, project.get(ProjectBean.PROJECT_NAME));

			if (project.get(ProjectBean.PROJECT_MANAGER_ID) != null) {
				Map<String, Object> pmQuery = new HashMap<String, Object>();
				pmQuery.put(ApiConstants.MONGO_ID, project.get(ProjectBean.PROJECT_MANAGER_ID));
				pmQuery.put(ApiConstants.LIMIT_KEYS, new String[] { UserBean.USER_NAME });

				Map<String, Object> pmInfo = this.dao.findOneByQuery(pmQuery, DBBean.USER);
				if (pmInfo != null) {
					data.put(ProjectBean.PROJECT_MANAGER_NAME, pmInfo.get(UserBean.USER_NAME));
				}
			}
			
			if (project.get(ProjectBean.PROJECT_CUSTOMER_ID) != null) {
				Map<String, Object> customerQuery = new HashMap<String, Object>();
				customerQuery.put(ApiConstants.MONGO_ID, project.get(ProjectBean.PROJECT_CUSTOMER_ID));
				customerQuery.put(ApiConstants.LIMIT_KEYS, new String[] { CustomerBean.NAME });

				Map<String, Object> cuInfo = this.dao.findOneByQuery(customerQuery, DBBean.CUSTOMER);
				if (cuInfo != null) {
					data.put(ProjectBean.PROJECT_CUSTOMER_NAME, cuInfo.get(CustomerBean.NAME));
				}
			}

			String ptype = (String) project.get(ProjectBean.PROJECT_TYPE);
			if (ptype.contains("工程")) {
				data.put(SalesContractBean.APPLICATION_DEPARTMENT, "工程部");
			} else if (ptype.contains("产品")) {
				data.put(SalesContractBean.APPLICATION_DEPARTMENT, "产品部");
			} else {
				data.put(SalesContractBean.APPLICATION_DEPARTMENT, "服务部");
			}
		}
	}

	@Override
	public Map<String, Object> listEqHistoryAndLatestEqList(Map<String, Object> params) {
		String cId = (String) params.get(ApiConstants.MONGO_ID);
		Map<String, Object> result = new HashMap<String, Object>();

		Map<String, Object> eqcostQuery = new HashMap<String, Object>();
		eqcostQuery.put(SalesContractBean.SC_ID, cId);
		Map<String, Object> eqListData = dao.list(eqcostQuery, DBBean.EQ_COST_HISTORY);
		List<Map<String, Object>> eqListDataList = (List<Map<String, Object>>) eqListData.get(ApiConstants.RESULTS_DATA);
		result.put("allEqList", eqListDataList);

		Map<String, Object> distinctEQQuery = new HashMap<String, Object>();
		distinctEQQuery.put(EqCostListBean.EQ_LIST_REAL_AMOUNT, new DBQuery(DBQueryOpertion.NOT_NULL));
		distinctEQQuery.put(SalesContractBean.SC_ID, cId);
		Map<String, Object> distinctEqListData = dao.list(distinctEQQuery, DBBean.EQ_COST);
		List<Map<String, Object>> distinctEqList = (List<Map<String, Object>>) distinctEqListData.get(ApiConstants.RESULTS_DATA);
		result.put("latestEqList", distinctEqList);
		return result;
	}

	@Override
	public Map<String, Object> listCommerceInfoHistory(Map<String, Object> params) {
		String cId = (String) params.get(ApiConstants.MONGO_ID);
		Map<String, Object> result = new HashMap<String, Object>();

		String[] keys = { SalesContractBean.SC_AMOUNT, SalesContractBean.SC_SERVICE_AMOUNT, SalesContractBean.SC_EQUIPMENT_AMOUNT, SalesContractBean.SC_ESTIMATE_EQ_COST0,
		        SalesContractBean.SC_ESTIMATE_EQ_COST1, SalesContractBean.SC_ESTIMATE_SUB_COST, SalesContractBean.SC_ESTIMATE_PM_COST,
		        SalesContractBean.SC_ESTIMATE_DEEP_DESIGN_COST, SalesContractBean.SC_ESTIMATE_DEBUG_COST, SalesContractBean.SC_ESTIMATE_OTHER_COST,
		        SalesContractBean.SC_INVOICE_TYPE };

		Map<String, Object> query = new HashMap<String, Object>();
		query.put(ApiConstants.HISTORY_DATA_ID, cId);
		query.put(ApiConstants.HISTORY_KEY, new DBQuery(DBQueryOpertion.IN, keys));
		query.put(ApiConstants.HISTORY_OLD, new DBQuery(DBQueryOpertion.NOT_NULL));

		Map<String, Object> order = new LinkedHashMap<String, Object>();
		order.put(ApiConstants.HISTORY_TIME, ApiConstants.DB_QUERY_ORDER_BY_DESC);
		query.put(ApiConstants.DB_QUERY_ORDER_BY, order);

		result = dao.list(query, DBBean.SALES_CONTRACT + "_history");

		List<Map<String, Object>> dataList = (List<Map<String, Object>>) result.get(ApiConstants.RESULTS_DATA);
		List<String> uIds = new ArrayList<String>();
		for (Map<String, Object> map : dataList) {
			String uid = (String) map.get(ApiConstants.HISTORY_OPERATOR);
			if (!ApiUtil.isEmpty(uid)) {
				uIds.add(uid);
			}
		}

		Map<String, Object> userQuery = new HashMap<String, Object>();
		userQuery.put(ApiConstants.MONGO_ID, new DBQuery(DBQueryOpertion.IN, uIds));
		userQuery.put(ApiConstants.LIMIT_KEYS, new String[] { UserBean.USER_NAME });
		Map<String, Object> users = dao.listToOneMapAndIdAsKey(userQuery, DBBean.USER);

		for (Map<String, Object> map : dataList) {
			String uid = (String) map.get(ApiConstants.HISTORY_OPERATOR);
			Map<String, Object> user = (Map<String, Object>) users.get(uid);
			if (!ApiUtil.isEmpty(user)) {
				map.put(ApiConstants.HISTORY_OPERATOR, user.get(UserBean.USER_NAME));
			} else {
				map.put(ApiConstants.HISTORY_OPERATOR, "N/A");
			}

			Long time = ApiUtil.getLongParam(map, ApiConstants.HISTORY_TIME);
			String timeString = DateUtil.getDateStringByLong(time);
			map.put(ApiConstants.HISTORY_TIME, timeString);
		}
		return result;
	}

	@Override
	public Map<String, Object> importEqCostList(Map<String, Object> params) {
		Map<String, Object> result = new LinkedHashMap<String, Object>();
		try {
			InputStream inputStream = (InputStream) params.get("inputStream");
			ExcleUtil excleUtil = new ExcleUtil(inputStream);
			List<String[]> list = excleUtil.getAllData(0);
			List<Map<String, Object>> eqList = new ArrayList<Map<String, Object>>();
			Map<String, Integer> keyMap = new LinkedHashMap<String, Integer>();

			if (list.get(0) != null) {

				// MAX 15 COLUMN
				for (int i = 0; i < list.get(0).length; i++) {
					String key = list.get(0)[i].trim();
					if (!ApiUtil.isEmpty(key)) {
						keyMap.put(key, i);
					}
				}
			}

			for (int i = 1; i < list.size(); i++) {// 硬编码从第9行开始读数据
				Map<String, Object> eq = new LinkedHashMap<String, Object>();
				String amount = list.get(i)[6].trim();
				if (amount.length() == 0) {// 读到某一行数量为空时，认为清单数据结束
					break;
				}
				String code = list.get(i)[keyMap.get("物料代码")];
				
				
				
				eq.put(EqCostListBean.EQ_LIST_NO, ApiUtil.getInteger(list.get(i)[keyMap.get("No.")].trim()));
				eq.put(EqCostListBean.EQ_LIST_MATERIAL_CODE, code.trim());
				eq.put(EqCostListBean.EQ_LIST_PRODUCT_NAME, list.get(i)[keyMap.get("产品名称")].trim());
				eq.put(EqCostListBean.EQ_LIST_PRODUCT_TYPE, list.get(i)[keyMap.get("规格型号")].trim());
				eq.put(EqCostListBean.EQ_LIST_BRAND, list.get(i)[keyMap.get("品牌")].trim());
				eq.put(EqCostListBean.EQ_LIST_UNIT, list.get(i)[keyMap.get("单位")].trim());
				eq.put(EqCostListBean.EQ_LIST_SALES_BASE_PRICE, list.get(i)[keyMap.get("销售单价")].trim());

				float dr = Float.parseFloat(String.valueOf(list.get(i)[keyMap.get("折扣率")].trim()));
				float basePrice = Float.parseFloat(String.valueOf(list.get(i)[keyMap.get("标准成本价")].trim()));
				Double eqcostAmount = ApiUtil.getDouble(list.get(i)[keyMap.get("数量")].trim());
				float lastBasePrice = dr * basePrice;

				eq.put(EqCostListBean.EQ_LIST_AMOUNT, eqcostAmount);
				eq.put(EqCostListBean.EQ_LIST_BASE_PRICE, basePrice);
				eq.put(EqCostListBean.EQ_LIST_DISCOUNT_RATE, dr * 100);
				eq.put(EqCostListBean.EQ_LIST_LAST_BASE_PRICE, lastBasePrice);
				eq.put(EqCostListBean.EQ_LIST_CATEGORY, list.get(i)[keyMap.get("物料类别")].trim());
				eq.put(EqCostListBean.EQ_LIST_TAX_TYPE, list.get(i)[keyMap.get("税收类型")].trim());
				eq.put(EqCostListBean.EQ_LIST_TOTAL_AMOUNT, lastBasePrice * eqcostAmount);
				eq.put(EqCostListBean.EQ_LIST_MEMO, list.get(i)[keyMap.get("备注")].trim());

				eqList.add(eq);
			}

			result.put(ApiConstants.RESULTS_DATA, eqList);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			result.put("status", 0);
			throw new ApiResponseException("Import eqCostList error.", null, "模板格式错误");
		}
		return result;
	}

	public Map<String, Object> importEqHistoryExcleFile(Map<String, Object> params) {
		clearData();
		Map<String, Object> result = new LinkedHashMap<String, Object>();
		try {
			InputStream inputStream = (InputStream) params.get("inputStream");
			ExcleUtil excleUtil = new ExcleUtil(inputStream);
			int numberOfSheet = excleUtil.getNumberOfSheets();
			
			System.out.println("系统将导入"+ numberOfSheet + "个销售合同清单");
	
			for (int ns = 0; ns < numberOfSheet; ns++) {
				String contractCode = excleUtil.getSheetName(ns);
				List<String[]> list = excleUtil.getAllData(ns);
				List<Map<String, Object>> eqList = new ArrayList<Map<String, Object>>();
				Map<String, Integer> keyMap = new LinkedHashMap<String, Integer>();

				int n = 0;
				String[] titles = list.get(n);

				while (!checkEqFindTitiles(titles)) {
					n = n + 1;
					titles = list.get(n);
				}
			
				for (int i = 0; i < titles.length; i++) {
					String key = titles[i].trim();
					if (!ApiUtil.isEmpty(key)) {
						keyMap.put(key, i);
					}
				}
				
				

				for (int i = n + 1; i < list.size(); i++) {// 硬编码从第9行开始读数据
					Map<String, Object> eq = new LinkedHashMap<String, Object>();

					String[] row = list.get(i);
					String eqCode = getRowColumnValue(row, keyMap, "物料代码");
					String productName = getRowColumnValue(row, keyMap, "产品名称");
					
					if(eqCode!=null && eqCode.equalsIgnoreCase("物料代码")){
						logger.error(contractCode+"中有设备清单的产品名称为空");
						continue;
					}
					//FIXME
//					productName = productName.replaceAll("_", "");
					
					if (ApiUtil.isEmpty(productName)) {
						continue;
					}
					

					int eqcostAmount = ApiUtil.getInteger(getRowColumnValue(row, keyMap, "最终数量"));
					
					if(eqcostAmount == 0){
						
						continue;
					}

					
					int index = row.length-1;
					for(String key: keyMap.keySet()){
						
						if(key.contains("未申请") && key.contains("数量")){
							index = keyMap.get(key);
							break;
						}
					}
					int remainCount = 0;
                    remainCount = ApiUtil.getInteger(row[index].trim());
                     
					
					if(remainCount < 0){
						logger.error(contractCode+ "中有成本清单可申请数小于0");
						remainCount = 0;
					}
					eq.put(EqCostListBean.EQ_LIST_REST_COUNT, remainCount);
					

					
					
					eq.put(EqCostListBean.EQ_LIST_NO,  ApiUtil.getInteger(getRowColumnValue(row, keyMap, "No.")));
					eq.put(EqCostListBean.EQ_LIST_MATERIAL_CODE, eqCode);
					eq.put(EqCostListBean.EQ_LIST_PRODUCT_NAME, productName);
					eq.put(EqCostListBean.EQ_LIST_PRODUCT_TYPE, getRowColumnValue(row, keyMap, "规格型号"));
					eq.put(EqCostListBean.EQ_LIST_BRAND, getRowColumnValue(row, keyMap, "品牌"));
					eq.put(EqCostListBean.EQ_LIST_UNIT, getRowColumnValue(row, keyMap, "单位"));

					float salesPrice = ApiUtil.getFloatParam(getRowColumnValue(row, keyMap, "销售单价"));
					
					float productPrice = ApiUtil.getFloatParam(getRowColumnValue(row, keyMap, "采购单价"));
					
			
					eq.put(EqCostListBean.EQ_LIST_SALES_BASE_PRICE, salesPrice);					

					// float dr =
					// Float.parseFloat(String.valueOf(list.get(i)[keyMap.get("折扣率")].trim()));
					String basePriceStr = getRowColumnValue(row, keyMap, "成本单价");
					float basePrice = 0;
					if (ApiUtil.isValid(basePriceStr)) {
						basePrice = Float.parseFloat(basePriceStr);
				
						if(productPrice <= 0){
							productPrice = basePrice;
							
						}
						
					} else {
						basePrice = salesPrice;
					}

					float lastBasePrice = 1 * basePrice;

				
					eq.put(PurchaseContract.EQCOST_PRODUCT_UNIT_PRICE, productPrice);

					
					
					eq.put(EqCostListBean.EQ_LIST_AMOUNT, eqcostAmount);
					eq.put(EqCostListBean.EQ_LIST_BASE_PRICE, basePrice);
					eq.put(EqCostListBean.EQ_LIST_DISCOUNT_RATE, 100);
					eq.put(EqCostListBean.EQ_LIST_LAST_BASE_PRICE, lastBasePrice);
					eq.put(EqCostListBean.EQ_LIST_CATEGORY, getRowColumnValue(row, keyMap, "物料类别"));
					eq.put(EqCostListBean.EQ_LIST_TAX_TYPE, getRowColumnValue(row, keyMap, "税收类型"));
					eq.put(EqCostListBean.EQ_LIST_TOTAL_AMOUNT, lastBasePrice * eqcostAmount);
					eq.put(EqCostListBean.EQ_LIST_MEMO, getRowColumnValue(row, keyMap, "备注"));

					eq.put(EqCostListBean.EQ_LIST_TAX_TYPE, "增值税");
					eq.put("eqcostCategory", "北京代采");
				 
							 
					if (ApiUtil.isValid(productName)) {
						// System.out.println(eq);

						eqList.add(eq);
					}else{
						logger.error("产品名称为空: " + contractCode);
					}
				}

				Map<String, Object> query = new HashMap<String, Object>();
				query.put(SalesContractBean.SC_CODE, new DBQuery(DBQueryOpertion.EQUAILS, contractCode));
				Map<String, Object> contract = this.dao.findOneByQuery(query, DBBean.SALES_CONTRACT);
				if (ApiUtil.isValid(contract)) {

					if (eqList.size() > 0) {
						addEqCostListForContract(eqList, contract, false, false);

						
						addPurchaseBack(contractCode, eqList, contract, false);
						
					} else {

						logger.error("成本清单为空: " + contractCode);
					}
				} else {
					logger.error("can not find " + contractCode);
				}
				
				
	

			}

		} catch (Exception e) {
			logger.error("", e);
			result.put("status", 0);
			throw new ApiResponseException("Import eqCostList error.", null, "模板格式错误");
		}
		return result;

	}

	public boolean checkEqFindTitiles(String[] titles) {
		boolean find = false;
	    for (int i = 0; i < titles.length; i++) {
	    	String key = titles[i].trim();
	    	if (key.contains("物料代码")) {
	    		find = true;
	    		break;
	    	}

	    }
	    return find;
    }


	public void addPurchaseBack(String contractCode, List<Map<String, Object>> eqList, Map<String, Object> contract, boolean preback) {
	    Map<String, Object> newObj = new HashMap<String, Object>();
	    newObj.put(PurchaseBack.pbStatus, PurchaseStatus.closed.toString());
	    newObj.put(PurchaseBack.pbCode, "BHSQ-" + contractCode);
	    newObj.put(PurchaseBack.scId, contract.get(ApiConstants.MONGO_ID).toString());

	    newObj.put(PurchaseBack.scCode, contract.get(SalesContractBean.SC_CODE));
	    newObj.put(PurchaseBack.pbComment, "历史数据导入");
	    
	    
	    for (Map<String, Object> eqMap : eqList) {
	    	
	    	if(!preback){
	    		eqMap.put(PurchaseBack.pbTotalCount,
	    	        ApiUtil.getInteger(eqMap.get(EqCostListBean.EQ_LIST_AMOUNT)) - ApiUtil.getInteger(eqMap.get(EqCostListBean.EQ_LIST_REST_COUNT)));
	    	}
	    }

	    removeEmptyEqList(eqList, PurchaseBack.pbTotalCount);

	    if (eqList.size() > 0) {
	    	newObj.put(PurchaseBack.eqcostList, eqList);

	    	Map<String, Object> back = purchaseService.saveOrUpdateBack(newObj, newObj);
	    	
			addPurchaseRequest(contractCode, eqList, contract, back, preback);

	    }
    }
	
	public void addPurchaseRequest(String contractCode, List<Map<String, Object>> eqList, Map<String, Object> contract, Map<String, Object> back, boolean preback) {
		Map<String, Object> newObj = new HashMap<String, Object>();
		newObj.put(PurchaseRequest.PROCESS_STATUS, PurchaseRequest.STATUS_CLOSED);
		newObj.put(PurchaseRequest.PURCHASE_REQUEST_CODE, "CGSQ-" + contractCode);
		newObj.put(PurchaseRequest.SALES_CONTRACT_ID, contract.get(ApiConstants.MONGO_ID).toString());
		newObj.put(PurchaseRequest.SALES_CONTRACT_CODE, contractCode);
		newObj.put(PurchaseRequest.BACK_REQUEST_ID, back.get(ApiConstants.MONGO_ID));		
		newObj.put(PurchaseRequest.BACK_REQUEST_CODE, back.get(PurchaseBack.pbCode));
		

		
        for (Map<String, Object> eqMap : eqList) {
        	
        	if(!preback){
        		eqMap.put(PurchaseRequest.EQCOST_APPLY_AMOUNT, ApiUtil.getInteger(eqMap.get(EqCostListBean.EQ_LIST_AMOUNT)) - ApiUtil.getInteger(eqMap.get(EqCostListBean.EQ_LIST_REST_COUNT)));
        	}else{
        		eqMap.put(PurchaseRequest.EQCOST_APPLY_AMOUNT, ApiUtil.getInteger(eqMap.get(PurchaseBack.pbTotalCount)));
        	}
            eqMap.put(PurchaseRequest.BACK_REQUEST_ID, back.get(ApiConstants.MONGO_ID));
            eqMap.put(PurchaseRequest.BACK_REQUEST_CODE, back.get(PurchaseBack.pbCode));
            eqMap.put(PurchaseRequest.SALES_CONTRACT_ID, back.get(PurchaseRequest.SALES_CONTRACT_ID));       
            eqMap.put(PurchaseRequest.SALES_CONTRACT_CODE, back.get(PurchaseRequest.SALES_CONTRACT_CODE));
            
        }

		newObj.put(SalesContractBean.SC_EQ_LIST, eqList);
		this.dao.save(newObj, DBBean.PURCHASE_REQUEST);
		purchaseContractService.updatePurchaseRequest(newObj);
		back.put(PurchaseRequest.PURCHASE_REQUEST_ID, newObj.get(ApiConstants.MONGO_ID));
		back.put(PurchaseRequest.PURCHASE_REQUEST_CODE, newObj.get(PurchaseRequest.PURCHASE_REQUEST_CODE));
		this.dao.updateById(back, DBBean.PURCHASE_BACK);
		
		addPurchaseOrder(contractCode, eqList, contract, newObj, back, preback);
	}
	
	
	public void addPurchaseOrder(String contractCode, List<Map<String, Object>> eqList, Map<String, Object> contract, Map<String, Object> request, Map<String, Object> back, boolean preback) {
		Map<String, Object> newObj = new HashMap<String, Object>();
		newObj.put(PurchaseRequest.PROCESS_STATUS, PurchaseRequest.STATUS_CLOSED);
		newObj.put(PurchaseRequest.PURCHASE_ORDER_CODE, "CGDD-" + contractCode);
		newObj.put(PurchaseRequest.SALES_CONTRACT_ID, contract.get(ApiConstants.MONGO_ID).toString());
		newObj.put(PurchaseRequest.SALES_CONTRACT_CODE, contractCode);
		newObj.put(PurchaseRequest.PURCHASE_REQUEST_ID, request.get(ApiConstants.MONGO_ID));
		newObj.put(PurchaseRequest.PURCHASE_REQUEST_CODE, request.get(PurchaseRequest.PURCHASE_REQUEST_CODE));
        newObj.put(PurchaseRequest.BACK_REQUEST_ID, back.get(ApiConstants.MONGO_ID));       
        newObj.put(PurchaseRequest.BACK_REQUEST_CODE, back.get(PurchaseBack.pbCode));
        newObj.put("eqcostDeliveryType", PurchaseRequest.EQCOST_DELIVERY_TYPE_REPOSITORY);
     
		for (Map<String, Object> eqMap : eqList) {
		 	if(!preback){
        		eqMap.put(PurchaseRequest.EQCOST_APPLY_AMOUNT, ApiUtil.getInteger(eqMap.get(EqCostListBean.EQ_LIST_AMOUNT)) - ApiUtil.getInteger(eqMap.get(EqCostListBean.EQ_LIST_REST_COUNT)));
        	}else{
        		eqMap.put(PurchaseRequest.EQCOST_APPLY_AMOUNT, ApiUtil.getInteger(eqMap.get(PurchaseBack.pbTotalCount)));
        	}
            eqMap.put(PurchaseRequest.PURCHASE_REQUEST_ID, request.get(ApiConstants.MONGO_ID));
            eqMap.put(PurchaseRequest.PURCHASE_REQUEST_CODE, request.get(PurchaseRequest.PURCHASE_REQUEST_CODE));
            eqMap.put(PurchaseRequest.BACK_REQUEST_ID, back.get(ApiConstants.MONGO_ID));       
            eqMap.put(PurchaseRequest.BACK_REQUEST_CODE, back.get(PurchaseBack.pbCode));
            eqMap.put(PurchaseRequest.SALES_CONTRACT_ID, back.get(PurchaseRequest.SALES_CONTRACT_ID));       
            eqMap.put(PurchaseRequest.SALES_CONTRACT_CODE, back.get(PurchaseRequest.SALES_CONTRACT_CODE));
		}

		newObj.put(SalesContractBean.SC_EQ_LIST, eqList);
		this.dao.add(newObj, DBBean.PURCHASE_ORDER);
		Map<String, Object> order = purchaseContractService.updatePurchaseOrder(newObj);

		orderId = order.get(ApiConstants.MONGO_ID).toString();
		request.put(PurchaseOrder.PURCHASE_REQUEST_ID, request.get(ApiConstants.MONGO_ID));
		request.put(PurchaseOrder.PURCHASE_REQUEST_CODE, request.get(PurchaseOrder.PURCHASE_REQUEST_CODE));
		this.dao.updateById(request, DBBean.PURCHASE_REQUEST);
		
		addPurchaseContract(contractCode, eqList, contract, order, preback);

	}
	
	public void addPurchaseContract(String contractCode, List<Map<String, Object>> eqList, Map<String, Object> contract, Map<String, Object> order, boolean preback) {
		Map<String, Object> newObj = new HashMap<String, Object>();
		newObj.put(PurchaseRequest.PROCESS_STATUS, PurchaseRequest.STATUS_CLOSED);
		newObj.put(PurchaseRequest.PURCHASE_CONTRACT_CODE, "CGHT-" + contractCode);
		newObj.put(PurchaseRequest.SALES_CONTRACT_ID, contract.get(ApiConstants.MONGO_ID).toString());
		newObj.put(PurchaseRequest.SALES_CONTRACT_CODE, contractCode);
		newObj.put(PurchaseRequest.PURCHASE_REQUEST_ID, order.get(PurchaseRequest.PURCHASE_REQUEST_ID));
		newObj.put(PurchaseRequest.PURCHASE_REQUEST_CODE, order.get(PurchaseRequest.PURCHASE_REQUEST_CODE));
		newObj.put(PurchaseRequest.PURCHASE_ORDER_ID, order.get(ApiConstants.MONGO_ID));
		newObj.put(PurchaseRequest.PURCHASE_ORDER_CODE, order.get(PurchaseRequest.PURCHASE_ORDER_CODE));
		newObj.put(PurchaseRequest.BACK_REQUEST_ID, order.get(PurchaseRequest.BACK_REQUEST_ID));
		newObj.put(PurchaseRequest.BACK_REQUEST_CODE, order.get(PurchaseRequest.BACK_REQUEST_CODE));
		newObj.put(PurchaseContract.EQCOST_DELIVERY_TYPE, PurchaseRequest.EQCOST_DELIVERY_TYPE_REPOSITORY);
		newObj.put(PurchaseContract.CONTRACT_EXECUTE_CATE, PurchaseContract.CONTRACT_EXECUTE_CATE_BEIJINGDAICAI);
		newObj.put(PurchaseContract.PURCHASE_CONTRACT_TYPE, PurchaseContract.CONTRACT_EXECUTE_CATE_BEIJINGDAICAI);

		newObj.put("signBy", "系统导入");
		newObj.put("supplierName", "同方北京");		
		newObj.put("supplierNameContact", "同方北京");
		newObj.put("executeStatus", "结束");
		
		float totalMoney = 0;
		for (Map<String, Object> eqMap : eqList) {
		 	if(!preback){
        		eqMap.put(PurchaseRequest.EQCOST_APPLY_AMOUNT, ApiUtil.getInteger(eqMap.get(EqCostListBean.EQ_LIST_AMOUNT)) - ApiUtil.getInteger(eqMap.get(EqCostListBean.EQ_LIST_REST_COUNT)));
        	}else{
        		eqMap.put(PurchaseRequest.EQCOST_APPLY_AMOUNT, ApiUtil.getInteger(eqMap.get(PurchaseBack.pbTotalCount)));
        	}
			eqMap.put(PurchaseRequest.PURCHASE_REQUEST_ID, order.get(PurchaseRequest.PURCHASE_REQUEST_ID));
			eqMap.put(PurchaseRequest.PURCHASE_REQUEST_CODE, order.get(PurchaseRequest.PURCHASE_REQUEST_CODE));
			eqMap.put(PurchaseRequest.BACK_REQUEST_ID, order.get(PurchaseRequest.BACK_REQUEST_ID));
			eqMap.put(PurchaseRequest.BACK_REQUEST_CODE, order.get(PurchaseRequest.BACK_REQUEST_CODE));
			eqMap.put(PurchaseRequest.SALES_CONTRACT_ID, order.get(PurchaseRequest.SALES_CONTRACT_ID));
			eqMap.put(PurchaseRequest.SALES_CONTRACT_CODE, order.get(PurchaseRequest.SALES_CONTRACT_CODE));
			eqMap.put(PurchaseRequest.PURCHASE_ORDER_ID, order.get(ApiConstants.MONGO_ID));
			eqMap.put(PurchaseRequest.PURCHASE_ORDER_CODE, order.get(PurchaseRequest.PURCHASE_ORDER_CODE));
			
			int applyAmout = ApiUtil.getInteger(eqMap.get(PurchaseContract.EQCOST_APPLY_AMOUNT));
			
			float prodcutPrice =  ApiUtil.getFloatParam(eqMap.get(PurchaseContract.EQCOST_PRODUCT_UNIT_PRICE));
			totalMoney = totalMoney + (applyAmout * prodcutPrice);
			
		}

		newObj.put(PurchaseContract.PURCHASE_CONTRACT_MONEY, totalMoney);
		newObj.put(SalesContractBean.SC_EQ_LIST, eqList);
		this.dao.add(newObj, DBBean.PURCHASE_CONTRACT);
		Map<String, Object> pc = purchaseContractService.updatePurchaseContract(newObj);

		order.put(PurchaseOrder.PURCHASE_CONTRACT_ID, pc.get(ApiConstants.MONGO_ID));
		order.put(PurchaseOrder.PURCHASE_CONTRACT_CODE, pc.get(PurchaseOrder.PURCHASE_CONTRACT_CODE));
		this.dao.updateById(order, DBBean.PURCHASE_ORDER);
		
        if(ApiUtil.isValid(newObj.get(SalesContractBean.SC_EQ_LIST))){
        	createRepositoryIn(newObj);
        }

	}
	
	

	private void createRepositoryIn(Map<String, Object> contract) {
		Map<String, Object> newObj = new HashMap<String, Object>();
		String rkCode = "RKSQ-" + contract.get(PurchaseContract.PURCHASE_CONTRACT_CODE);

		if(this.dao.exist("repositoryCode", rkCode, DBBean.REPOSITORY)){
			newObj = this.dao.findOne("repositoryCode", rkCode, DBBean.REPOSITORY);
		}
		
		newObj.put(PurchaseCommonBean.PROCESS_STATUS, PurchaseRequest.STATUS_IN_REPOSITORY);
		newObj.put("inDate", "");

		newObj.put(PurchaseContract.SUPPLIER_ID, contract.get(PurchaseContract.SUPPLIER_ID));
		newObj.put(PurchaseContract.SUPPLIER_NAME, contract.get(PurchaseContract.SUPPLIER_NAME));
		newObj.put("repositoryCode", rkCode);
		newObj.put(PurchaseContract.PURCHASE_CONTRACT_CODE, contract.get(PurchaseContract.PURCHASE_CONTRACT_CODE));
		newObj.put(PurchaseContract.PURCHASE_CONTRACT_ID, contract.get(ApiConstants.MONGO_ID));

		List<Map<String, Object>> eqList = (List<Map<String, Object>>) contract.get(SalesContractBean.SC_EQ_LIST);
		Map<String, Object> eqMap = eqList.get(0);

		newObj.put(ProjectBean.PROJECT_ID, eqMap.get(ProjectBean.PROJECT_ID));
		newObj.put(ProjectBean.PROJECT_NAME, eqMap.get(ProjectBean.PROJECT_NAME));

		newObj.put(PurchaseContract.PURCHASE_ORDER_CODE, eqMap.get(PurchaseContract.PURCHASE_ORDER_CODE));
		newObj.put(PurchaseContract.PURCHASE_ORDER_ID, eqMap.get(PurchaseContract.PURCHASE_ORDER_ID));
		newObj.put(PurchaseContract.SALES_CONTRACT_CODE, eqMap.get(PurchaseContract.SALES_CONTRACT_CODE));
		newObj.put(PurchaseContract.SALES_CONTRACT_ID, eqMap.get(PurchaseContract.SALES_CONTRACT_ID));
		newObj.put("storeHouse", "上海—北京泰德库");
		
		
		removeEmptyEqList(eqList, "eqcostApplyAmount");

		if (eqList.size() > 0) {
			newObj.put(PurchaseBack.eqcostList, eqList);
			purchaseContractService.updateRepositoryRequest(newObj);
			newObj.put("type", "in");
			purchaseContractService.approveRepositoryRequest(newObj);
		}

	}

	@Override
	public Map<String, Object> setSCRunningStatus(Map<String, Object> params) {
		Map<String, Object> query = new HashMap<String, Object>();
		query.put(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID));
		query.put(SalesContractBean.SC_RUNNING_STATUS, params.get(SalesContractBean.SC_RUNNING_STATUS));

		return dao.updateById(query, DBBean.SALES_CONTRACT);
	}

	@Override
	public Map<String, Object> setSCArchiveStatusStatus(Map<String, Object> params) {
		Map<String, Object> query = new HashMap<String, Object>();
		query.put(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID));
		query.put(SalesContractBean.SC_ARCHIVE_STATUS, params.get(SalesContractBean.SC_ARCHIVE_STATUS));

		return dao.updateById(query, DBBean.SALES_CONTRACT);
	}

	public Map<String, Object> getCustomerBySC(Map<String, Object> params) {
		Map<String, Object> customerQuery = new HashMap<String, Object>();
		customerQuery.put(ApiConstants.MONGO_ID, params.get("scId"));
		return this.dao.findOneByQuery(customerQuery, DBBean.CUSTOMER);
	}
	
	
    public void clearData() {
        Map<String, Object> query = new HashMap<String, Object>();
        query.put("status", new DBQuery(DBQueryOpertion.NOT_IN, new String[] { SalesContractBean.SC_STATUS_DRAFT }));
        query.put(SalesContractBean.SC_PROJECT_ID, new DBQuery(DBQueryOpertion.NOT_NULL));

        query.put(ApiConstants.LIMIT_KEYS, new String[] { SalesContractBean.SC_PROJECT_ID });

        List<Map<String, Object>> list = (List<Map<String, Object>>) this.dao.list(query, DBBean.SALES_CONTRACT).get(ApiConstants.RESULTS_DATA);

        for (Map<String, Object> sc : list) {
            Map<String, Object> project = new HashMap<String, Object>();
            project.put(ApiConstants.MONGO_ID, sc.get(SalesContractBean.SC_PROJECT_ID));
            project.put("isSetuped", true);
            this.dao.updateById(project, DBBean.PROJECT);
        }

    }	
	
	public void updateContractStatus(String scId) {

		Map<String, Integer> restCountMap = purchaseService.countBackRestEqByScId(scId);
		updateDataStatus(scId, DBBean.SALES_CONTRACT, SalesContractBean.SC_STATUS_CLOSED, SalesContractBean.SC_STATUS_SUBMITED, "status", restCountMap);

	}
	
	
	public String exportScExcle() {
		String colunmTitleHeaders[] = new String[] { "销售合同编号", "项目名", "项目编号" };

		String colunmHeaders[] = new String[] { SalesContractBean.SC_CODE, ProjectBean.PROJECT_NAME, ProjectBean.PROJECT_CODE };

		String fileDir = ConfigurationManager.getProperty("file_download_dir");

		File f = new File(fileDir + "销售合同.xls");

		Map<String, Object> result = dao.list(new HashMap<String, Object>(), DBBean.SALES_CONTRACT);

		mergeProjectInfoForSC(result);

		ExcleUtil.createExcelListFile(result.get(ApiConstants.RESULTS_DATA), colunmTitleHeaders, colunmHeaders, f);

		return f.getName();
	}

	public List<Map<String, Object>> mergeEqListBasicInfo(Object eqList) {
		List<Map<String, Object>> needMergeList = (List<Map<String, Object>>) eqList;

		if (needMergeList == null) {
			needMergeList = new ArrayList<Map<String, Object>>();
		}

		List<Map<String, Object>> mapLists = new ArrayList<Map<String, Object>>();
		Set<String> ids = new HashSet<String>();

		for (Map<String, Object> old : needMergeList) {
			if (old.get(ApiConstants.MONGO_ID) != null) {
				ids.add(old.get(ApiConstants.MONGO_ID).toString());
			}
		}

		Map<String, Object> query = new HashMap<String, Object>();
		query.put(ApiConstants.MONGO_ID, new DBQuery(DBQueryOpertion.IN, new ArrayList<String>(ids)));

		List<Object> scEqList = this.dao.listLimitKeyValues(query, DBBean.EQ_COST);

		for (Map<String, Object> savedEq : needMergeList) {
			for (Object obj : scEqList) {
				Map<String, Object> scEq = (Map<String, Object>) obj;
				scEq.remove("eqcostApplyAmount");
				scEq.remove("eqcostProductUnitPrice");
				scEq.remove("requestedTotalMoney");
				

				if (savedEq.get(ApiConstants.MONGO_ID).toString().equalsIgnoreCase(scEq.get(ApiConstants.MONGO_ID).toString())) {
					savedEq.putAll(scEq);
					break;
				}
			}

		}

		return needMergeList;
	}

	private String genNewSCCode(String pId){
	    Map<String, Object> query = new HashMap<String, Object>();
	    query.put(ApiConstants.MONGO_ID, pId);
	    query.put(ApiConstants.LIMIT_KEYS, new String[]{ProjectBean.PROJECT_CODE, ProjectBean.PROJECT_TYPE});
	    
	    Map<String, Object> project = this.dao.findOneByQuery(query, DBBean.PROJECT);
	    
	    String projectType  = (String)project.get(ProjectBean.PROJECT_TYPE);
	    String projectCode  = (String)project.get(ProjectBean.PROJECT_CODE);
	    
	    String prefix = getScSuffix(pId);
        
        // 草稿的销售合同项目编号可能为空
        Map<String, Object> scQuery = new HashMap<String, Object>();
        scQuery.put(SalesContractBean.SC_PROJECT_ID, pId);
        int sameSCCount = dao.count(scQuery, DBBean.SALES_CONTRACT);
        
        String scCode = projectCode + "-" + prefix;
        if(sameSCCount > 0){
            scCode = scCode + "-ADD" + sameSCCount;
        }
        
        return scCode;
        
        
	}



    public String getScSuffix(String pId) {
        Map<String, Object> query = new HashMap<String, Object>();
        query.put(ApiConstants.MONGO_ID, pId);
        query.put(ApiConstants.LIMIT_KEYS, new String[]{ProjectBean.PROJECT_CODE, ProjectBean.PROJECT_TYPE});
        
        Map<String, Object> project = this.dao.findOneByQuery(query, DBBean.PROJECT);
        
        String projectType  = (String)project.get(ProjectBean.PROJECT_TYPE);
        
        String prefix = "QT";
	    if(projectType.contains("服务")){
	        prefix = "FW";
	    }else if(projectType.contains("产品")){
	        prefix = "XS";
        }else if(projectType.contains("工程")){
            prefix = "GC";
        }
        return prefix;
    }
    
    
	
	@Deprecated
	private String genSCCode(String pId) {
		String prefix = SalesContractBean.SC_CODE_PREFIX;

		int year = DateUtil.getNowYearString();

		Map<String, Object> queryMap = new HashMap<String, Object>();
		String[] limitKeys = { SalesContractBean.SC_CODE };
		Map<String, Object> re = dao.getLastRecordByCreatedOn(DBBean.SALES_CONTRACT, queryMap, limitKeys);
		String scCode = "TDSH-XS-" + DateUtil.getStringByDate(new Date()) + "-0";
		if (re != null) {
			scCode = (String) re.get(SalesContractBean.SC_CODE);
		}

		if (scCode.indexOf("-ADD") != -1) {
			// FIXME: why 4?
			scCode = scCode.substring(0, scCode.length() - 4);
		}
		String scCodeNoString = scCode.substring(scCode.lastIndexOf("-") + 1, scCode.length());
		Integer scCodeNo = 0;
		try {
			scCodeNo = Integer.parseInt(scCodeNoString);
		} catch (NumberFormatException e) {
			// TODO Auto-generated catch block
			// e.printStackTrace(); 旧数据会出异常，就pCodeNo=1 开始
		}
		scCodeNo = scCodeNo + 1;

		String codeNum = getCodeNo(scCodeNo);

		String genCode = prefix + year + "-" + codeNum;

		// 草稿的销售合同项目编号可能为空
		Map<String, Object> scQuery = new HashMap<String, Object>();
		scQuery.put(SalesContractBean.SC_PROJECT_ID, pId);
		int sameSCCount = dao.count(scQuery, DBBean.SALES_CONTRACT);
		if (sameSCCount > 0 && !ApiUtil.isEmpty(pId)) {
			Map<String, Object> scInfo = dao.findOne(SalesContractBean.SC_PROJECT_ID, pId, new String[] { SalesContractBean.SC_CODE }, DBBean.SALES_CONTRACT);
			String code = scInfo.get(SalesContractBean.SC_CODE).toString();
			code = code.substring(0, 17);
			genCode = code + "-ADD" + sameSCCount;

		} else {
			while (this.dao.exist(SalesContractBean.SC_CODE, genCode, DBBean.SALES_CONTRACT)) {
				scCodeNo = scCodeNo + 1;
				genCode = prefix + year + "-" + getCodeNo(scCodeNo);
			}
		}

		return genCode;
	}

	private String getCodeNo(Integer scCodeNo) {
		String codeNum = "000" + scCodeNo;

		codeNum = codeNum.substring(codeNum.length() - 4, codeNum.length());
		return codeNum;
	}

	private String genEqcostListCode(String scCode, int nextVersion) {
		if (scCode.indexOf("-ADD") != -1) {
			scCode = scCode.substring(0, scCode.lastIndexOf("-"));
		}
		int index = scCode.lastIndexOf("-");
		String scInfo = null;
		if (index != -1) {
			String scInfo1 = scCode.substring(index - 2, index);
			String scInfo2 = scCode.substring(index + 1, scCode.length());
			scInfo = scInfo1 + scInfo2;
		}
		String prefix = EqCostListBean.EQ_LIST_CODE_PREFIX + scInfo + "-";

		return prefix + nextVersion;
	}

	@Override
	public Map<String, Object> importSCExcleFile(Map<String, Object> params) {
		Map<String, Object> result = new HashMap<String, Object>();
		List<String> msgs = new ArrayList<String>();

		// try {
		InputStream inputStream = (InputStream) params.get("inputStream");
		ExcleUtil excleUtil = new ExcleUtil(inputStream);
		List<String[]> list = excleUtil.getAllData(0);

		if (!list.isEmpty()) {

			Map<String, Integer> keyMap = new LinkedHashMap<String, Integer>();

			String[] columnNames = list.get(3);
			if (columnNames != null) {
				for (int i = 0; i < columnNames.length; i++) {
					String key = columnNames[i].trim();
					System.out.println(key + " ==== " + i);
					if (!ApiUtil.isEmpty(key)) {
						keyMap.put(key, i);
					}
				}
			}

			for (int i = 4; i < list.size(); i++) {// 从第5行开始读数据
				String errorMsg = "";

				String[] row = list.get(i);
				String scCode = getRowColumnValue(row, keyMap, "销售合同编号");

				String contractPerson = getRowColumnValue(row, keyMap, "签订人");
				String runningStatus = getRowColumnValue(row, keyMap, "状态");
				// String contractDate = getRowColumnValue(row, keyMap,
				// "合同签订\\n日期");
				String contractDate = null;

                if (row.length > 17 && ApiUtil.isValid(row[17])) {
                    try {
                        contractDate = DateUtil.getDateStringByLong(new Date(row[17]).getTime());
                    } catch (Exception e) {
                        logger.error("签订日期解析错误" + row[17]);
                    }

                }

				String contractDownPayment = getRowColumnValue(row, keyMap, "首付");
				String qualityMoney = getRowColumnValue(row, keyMap, "质保金");
				String contractMemo = getRowColumnValue(row, keyMap, "备注");
				String progressPayment = getRowColumnValue(row, keyMap, "进度款");
				String estimateDebugCost = getRowColumnValue(row, keyMap, "合同人工调试费");
				String contractAmount = getRowColumnValue(row, keyMap, "合同金额");
				String scLastTotalAmount = getRowColumnValue(row, keyMap, "合同金额");
				String estimateSubCost = getRowColumnValue(row, keyMap, "分包成本");
				String estimateOtherCost = getRowColumnValue(row, keyMap, "其他成本");
				String estimateGrossProfit = getRowColumnValue(row, keyMap, "预计毛利");
				String estimateGrossProfitRate = getRowColumnValue(row, keyMap, "预计毛利率");
				String invoiceType = getRowColumnValue(row, keyMap, "开票种类");
				String customerName = getRowColumnValue(row, keyMap, "客户名称");
				String pmName = getRowColumnValue(row, keyMap, "项目经理");
				String projectType = getRowColumnValue(row, keyMap, "项目类型");
				String projectName = getRowColumnValue(row, keyMap, "项目名称");
				String archiveStatus = getRowColumnValue(row, keyMap, "归档状态");

				
				if(ApiUtil.isEmpty(pmName)){
					pmName = "吴立嵘";
				}
				String yulixiang = getRowColumnValue(row, keyMap, "预立项");
				String projectCode = getRowColumnValue(row, keyMap, "项目编号");
				String excelSCType = getRowColumnValue(row, keyMap, "合同类型");
				String excelSCType2 = getRowColumnValue(row, keyMap, "产品分类");
				String projectAbbr = getRowColumnValue(row, keyMap, "项目缩写");

				if (ApiUtil.isEmpty(projectName)) {
					errorMsg = errorMsg.concat("项目名称为空 ");
				}

				if (ApiUtil.isEmpty(scCode)) {
					errorMsg = errorMsg.concat("销售合同编号为空 ");
				}

				if (ApiUtil.isEmpty(errorMsg)) {
					String estimateEqCostAddedTax = "";

					String estimateEqCostTax = "";

					if (ApiUtil.isValid(invoiceType) && invoiceType.equalsIgnoreCase("增值税发票")) {
						estimateEqCostAddedTax = getRowColumnValue(row, keyMap, "设备成本");
					} else {
						//
						// if(invoiceType.isEmpty()){
						// invoiceType = "";
						// }
						// estimateEqCostTax = getRowColumnValue(row, keyMap,
						// "设备成本");
					}

					Map<String, Object> scMap = new HashMap<String, Object>();
					scMap.put(SalesContractBean.SC_CODE, scCode);// 合同编号
					scMap.put(SalesContractBean.SC_PERSON, contractPerson);// 签订人
					scMap.put(SalesContractBean.SC_RUNNING_STATUS, runningStatus);// 执行状态

					// Date dd = new Date(contractDate); // excle
					// 里面此字段一定要正确，不然这一行就挂了
					// String formatDateString = DateUtil.getd(dd);
					scMap.put(SalesContractBean.SC_DATE, contractDate);// 签订日期
					if (ApiUtil.isValid(archiveStatus)) {
						scMap.put(SalesContractBean.SC_ARCHIVE_STATUS, archiveStatus);// 归档状态
					} else {
						scMap.put(SalesContractBean.SC_ARCHIVE_STATUS, SalesContractBean.SC_ARCHIVE_STATUS_UN_ARCHIVED);// 归档状态
					}

					if (ApiUtil.getDouble(contractDownPayment) < 1) {
						scMap.put(SalesContractBean.SC_DOWN_PAYMENT, 0);// 首付
						if (ApiUtil.isValid(contractDownPayment)) {
							// 如果有值且解析不成功，放到备注
							scMap.put(SalesContractBean.SC_DOWN_PAYMENT_MEMO, contractDownPayment);// 首付备注
						}
					} else {
						scMap.put(SalesContractBean.SC_DOWN_PAYMENT, ApiUtil.getDouble(contractDownPayment));// 首付
						scMap.put(SalesContractBean.SC_DOWN_PAYMENT_MEMO, "");// 首付备注
					}

					if (ApiUtil.getDouble(qualityMoney) < 1) {
						scMap.put(SalesContractBean.SC_QUALITY_MONEY, 0);// 质保金
						if (ApiUtil.isValid(qualityMoney)) {
							// 如果有值且解析不成功，放到备注
							scMap.put(SalesContractBean.SC_QUALITY_MONEY_MEMO, qualityMoney);// 质保金备注
						}
					} else {
						scMap.put(SalesContractBean.SC_QUALITY_MONEY, ApiUtil.getDouble(qualityMoney));// 质保金
						scMap.put(SalesContractBean.SC_QUALITY_MONEY_MEMO, "");// 质保金备注
					}

					scMap.put(SalesContractBean.SC_MEMO, contractMemo);// 备注
					scMap.put(SalesContractBean.SC_AMOUNT, ApiUtil.getDouble(contractAmount));// 合同金额
					scMap.put(SalesContractBean.SC_LAST_TOTAL_AMOUNT, ApiUtil.getDouble(scLastTotalAmount));// 合同金额
					scMap.put(SalesContractBean.SC_ESTIMATE_EQ_COST0, ApiUtil.getDouble(estimateEqCostAddedTax));// 预估设备成本（增）
					scMap.put(SalesContractBean.SC_ESTIMATE_EQ_COST1, ApiUtil.getDouble(estimateEqCostTax));// 预估设备成本（非增）

					scMap.put(SalesContractBean.SC_ESTIMATE_SUB_COST, ApiUtil.getDouble(estimateSubCost));// 预估分包成本
					scMap.put(SalesContractBean.SC_ESTIMATE_OTHER_COST, ApiUtil.getDouble(estimateOtherCost));// 预估其他成本
					scMap.put(SalesContractBean.SC_EXTIMATE_GROSS_PROFIT, estimateGrossProfit);// 预估毛利

					double gpRate = ApiUtil.getDoubleMultiply100(estimateGrossProfitRate);
					String gpRateString = gpRate + "%";
					scMap.put(SalesContractBean.SC_EXTIMATE_GROSS_PROFIT_RATE, gpRateString);// 预估毛利率

					scMap.put(SalesContractBean.SC_INVOICE_TYPE, SalesContractBean.SC_INVOICE_TYPE_1);// 发票类型

					Map<String, Object> customerQuery = new HashMap<String, Object>();
					customerQuery.put(CustomerBean.NAME, customerName); // 客户名称
					Map<String, Object> customerMap = customerService.importCustomer(customerQuery);
					String customerId = (String) customerMap.get(ApiConstants.MONGO_ID);
					scMap.put(SalesContractBean.SC_CUSTOMER_ID, customerId);// 客户

					Map<String, Object> pmQuery = new HashMap<String, Object>();
					pmQuery.put(UserBean.USER_NAME, pmName);
					Map<String, Object> pm = userService.importPM(pmQuery);
					String pmId = (String) pm.get(ApiConstants.MONGO_ID); // 新建PM

					if ("销售".equals(projectType)) {
						projectType = ProjectBean.PROJECT_TYPE_PRODUCT;
					}
					
					if(ApiUtil.isEmpty(projectType)){
//					    projectType = "产品";
					}

					String lxType = ProjectBean.PROJECT_STATUS_OFFICIAL;
					if (yulixiang != null && yulixiang.length() != 0) {
						lxType = ProjectBean.PROJECT_STATUS_PRE;
					}

					Map<String, Object> importProject = new HashMap<String, Object>();
					importProject.put(ProjectBean.PROJECT_MANAGER_ID, pmId);
					importProject.put(ProjectBean.PROJECT_TYPE, projectType);
					importProject.put(ProjectBean.PROJECT_NAME, projectName);
					importProject.put(ProjectBean.PROJECT_CUSTOMER_ID, customerId);

					importProject.put(ProjectBean.PROJECT_STATUS, lxType);
					importProject.put(ProjectBean.PROJECT_CODE, projectCode);
					importProject.put(ProjectBean.PROJECT_ABBR, projectAbbr);

					Map<String, Object> pro = projectService.importProject(importProject);
					String projectId = (String) pro.get(ApiConstants.MONGO_ID);
					scMap.put(SalesContractBean.SC_PROJECT_ID, projectId);// 关联项目

					if (SalesContractBean.SC_TYPE_FW.equals(excelSCType) || SalesContractBean.SC_TYPE_RD.equals(excelSCType)) {
						scMap.put(SalesContractBean.SC_TYPE, excelSCType);// 合同类型
					} else {

						String dbScType = excelSCType + "(" + excelSCType2 + ")";
						scMap.put(SalesContractBean.SC_TYPE, dbScType);// 合同类型
					}

					// String progressPaymentAmount =
					// double jdk = ApiUtil.getDouble(list.get(i)[20].trim());
					// List<Map<String, Object>> jdkList = new
					// ArrayList<Map<String, Object>>();
					// Map<String, Object> jdkMap = new HashMap<String,
					// Object>();
					// jdkMap.put(SalesContractBean.SC_PROGRESS_PAYMENT_NO, 1);
					// jdkMap.put(SalesContractBean.SC_PROGRESS_PAYMENT_AMOUNT,
					// jdk);
					// jdkMap.put(SalesContractBean.SC_PROGRESS_PAYMENT_MEMO,
					// "");
					// jdkList.add(jdkMap);
					scMap.put(SalesContractBean.SC_PROGRESS_PAYMENT, progressPayment);// 进度款

					scMap.put(SalesContractBean.SC_ESTIMATE_PM_COST, 0d);// 预估项目管理成本
					scMap.put(SalesContractBean.SC_ESTIMATE_DEEP_DESIGN_COST, 0d);// 预估深化设计成本
					scMap.put(SalesContractBean.SC_ESTIMATE_DEBUG_COST, 0d);// 预估调试费用
					scMap.put(SalesContractBean.SC_ESTIMATE_TAX, 0d);// 预估税收
					scMap.put(SalesContractBean.SC_TOTAL_ESTIMATE_COST, 0d);// 成本总计

					if (dao.exist(SalesContractBean.SC_CODE, scCode, DBBean.SALES_CONTRACT)) {

						Map<String, Object> oldSc = this.dao.findOne(SalesContractBean.SC_CODE, scCode, DBBean.SALES_CONTRACT);
						scMap.put(ApiConstants.MONGO_ID, oldSc.get(ApiConstants.MONGO_ID));
						logger.info("update sc for " + scCode + "  " + oldSc.get(ApiConstants.MONGO_ID));
						dao.updateById(scMap, DBBean.SALES_CONTRACT);
					} else {
						logger.info("insert sc for " + scCode);
						dao.add(scMap, DBBean.SALES_CONTRACT);
					}
					// importFinInfo(list.get(i));
				} else {
					errorMsg = String.format("第%s行：", i + 1).concat(errorMsg);
					msgs.add(errorMsg);
				}
			}
		}
		logger.error(msgs);
		// } catch (Exception e) {
		//
		// logger.error(e);
		// // TODO Auto-generated catch block
		// result.put("status", 0);
		// throw new ApiResponseException("Import eqCostList error.", null,
		// "模板格式错误");
		// }

		if (msgs.size() > 0) {
			throw new ApiResponseException(String.format("【%s】条纪录未导入：【%s】", msgs.size(), msgs));
		}

		result.put("status", 1);
		return result;
	}
	
	
	@Override
	public Map<String, Object> importfinance(Map<String, Object> params) {
		Map<String, Object> result = new HashMap<String, Object>();
		List<String> msgs = new ArrayList<String>();
		this.dao.deleteByQuery(new HashMap<String, Object>(), DBBean.SC_INVOICE);
		this.dao.deleteByQuery(new HashMap<String, Object>(), DBBean.SC_GOT_MONEY);

		// try {
		InputStream inputStream = (InputStream) params.get("inputStream");
		ExcleUtil excleUtil = new ExcleUtil(inputStream);
		List<String[]> list = excleUtil.getAllData(0);

		if (!list.isEmpty()) {

			for (int i = 4; i < list.size(); i++) {// 从第5行开始读数据
				String errorMsg = "";

				String[] row = list.get(i);
				String scCode = row[1].trim();
				String kaipiao = row[2].trim();
				String shoukuan = row[3].trim();
				
				if(ApiUtil.isEmpty(scCode)){
					continue;
				}

				if (dao.exist(SalesContractBean.SC_CODE, scCode, DBBean.SALES_CONTRACT)) {

					insertFinInfo(ApiUtil.getDouble(kaipiao), ApiUtil.getDouble(shoukuan), "", scCode);

				} else {
					logger.info("insert sc for " + scCode);
					errorMsg = "销售合同不存在" + scCode;
					errorMsg = String.format("第%s行：", i + 1).concat(errorMsg);
					msgs.add(errorMsg);
				}
				// importFinInfo(list.get(i));

			}
		}

		logger.error(msgs);

		if (msgs.size() > 0) {
			throw new ApiResponseException(String.format("【%s】条纪录未导入：【%s】", msgs.size(), msgs));
		}

		result.put("status", 1);
		return result;
	}
	
	
	public Map<String, Object> importSCExcleFile2(Map<String, Object> params) {

		Map<String, Object> result = new LinkedHashMap<String, Object>();
		try {
			InputStream inputStream = (InputStream) params.get("inputStream");
			ExcleUtil excleUtil = new ExcleUtil(inputStream);

			List<String[]> list = excleUtil.getAllData(0);
			Map<String, Integer> keyMap = new LinkedHashMap<String, Integer>();

			String[] titles = list.get(0);

			for (int i = 0; i < titles.length; i++) {
				String key = titles[i].trim();
				if (!ApiUtil.isEmpty(key)) {
					keyMap.put(key, i);
				}
			}

			for (int i = 1; i < list.size(); i++) {

				String[] row = list.get(i);
				String contractCode = getRowColumnValue(row, keyMap, "销售合同编号");

				if (ApiUtil.isValid(contractCode)) {
					Map<String, Object> query = new HashMap<String, Object>();
					query.put(SalesContractBean.SC_CODE, new DBQuery(DBQueryOpertion.EQUAILS, contractCode));
					Map<String, Object> contract = this.dao.findOneByQuery(query, DBBean.SALES_CONTRACT);
					if (ApiUtil.isValid(contract)) {

						List<Map<String, Object>> eqList = new ArrayList<Map<String, Object>>();

						Map<String, Object> backparams = new HashMap<String, Object>();
						backparams.put(SalesContractBean.SC_ID, contract.get(ApiConstants.MONGO_ID));

						eqList = (List<Map<String, Object>>) purchaseService.prepareBack(backparams).get(SalesContractBean.SC_EQ_LIST);
						if (eqList != null && eqList.size() > 0) {

							addPurchaseBack(contractCode, eqList, contract, true);
							createShip(contractCode, orderId);
						} else {

							logger.error("成本清单为空: " + contractCode);
						}
					} else {
						logger.error("can not find " + contractCode);
					}
				} else {
					logger.error("销售合同为空: " + contractCode);
				}
			}

		} catch (Exception e) {
			logger.error("", e);
			result.put("status", 0);
			throw new ApiResponseException("Import eqCostList error.", null, "模板格式错误");
		}
		return result;

	}
	
	
	public Map<String, Object> importrep(Map<String, Object> params) {

		
		this.dao.deleteByQuery(new HashMap<String, Object>(), "eqRepository");
		Map<String, Object> result = new LinkedHashMap<String, Object>();
		try {
			InputStream inputStream = (InputStream) params.get("inputStream");
			ExcleUtil excleUtil = new ExcleUtil(inputStream);
			List<String[]> list = excleUtil.getAllData(0);
			Map<String, Integer> keyMap = new LinkedHashMap<String, Integer>();

			if (list.get(0) != null) {

				// MAX 15 COLUMN
				for (int i = 0; i < list.get(0).length; i++) {
					String key = list.get(0)[i].trim();
					if (!ApiUtil.isEmpty(key)) {
						keyMap.put(key, i);
					}
				}
			}

			for (int i = 1; i < list.size(); i++) {// 硬编码从第9行开始读数据
				Map<String, Object> eq = new LinkedHashMap<String, Object>();
				String[] row = list.get(i);
				String code = getRowColumnValue(row, keyMap, "物品代码"); 

				eq.put(EqCostListBean.EQ_LIST_MATERIAL_CODE, code.trim());
				eq.put(EqCostListBean.EQ_LIST_PRODUCT_NAME,  getRowColumnValue(row, keyMap, "物品名称"));
				
				eq.put("eqcostProductType1", getRowColumnValue(row, keyMap, "型号1"));
				eq.put("eqcostProductType2", getRowColumnValue(row, keyMap, "型号2"));
				eq.put("eqcostProductType3", getRowColumnValue(row, keyMap, "型号3"));
				
				eq.put(EqCostListBean.EQ_LIST_UNIT, getRowColumnValue(row, keyMap, "单位"));
				eq.put(EqCostListBean.EQ_LIST_SALES_BASE_PRICE, getRowColumnValue(row, keyMap, "单价"));

				Double eqcostAmount = ApiUtil.getDouble(getRowColumnValue(row, keyMap, "期末|数量"));


				eq.put(EqCostListBean.EQ_LIST_AMOUNT, eqcostAmount);
				
				eq.put("repShipCode", getRowColumnValue(row, keyMap, "货位代码"));
				
				eq.put(EqCostListBean.EQ_LIST_TOTAL_AMOUNT,  ApiUtil.getDouble(getRowColumnValue(row, keyMap, "期末|金额")));
				eq.put("repCode", getRowColumnValue(row, keyMap, "库房代码"));
				
				
				this.dao.add(eq, "eqRepository");

			}

		} catch (Exception e) {
			// TODO Auto-generated catch block
			result.put("status", 0);
			throw new ApiResponseException("Import eqCostList error.", null, "模板格式错误");
		}
		return result;

	}
	
	
	@Override
	public Map<String, Object> listEqRep(Map<String, Object> params) {

		Map<String, Object> result = dao.list(params, "eqRepository");

		return result;
	}

	
	private void createShip(String contracCode, String orderId){
		
		Map<String, Object> arrivalMapQuery = new HashMap<String, Object>();		
		arrivalMapQuery.put(ArrivalNoticeBean.FOREIGN_KEY, orderId);
		List<Map<String, Object>> arrivalMap = (List<Map<String, Object>>) this.dao.list(arrivalMapQuery, DBBean.ARRIVAL_NOTICE).get(ApiConstants.RESULTS_DATA);

		for (Map<String, Object> arrival : arrivalMap) {
			List<Map<String, Object>> arrivalEqlist = (List<Map<String, Object>>) arrival.get(SalesContractBean.SC_EQ_LIST);
			mergeEqListBasicInfo(arrivalEqlist);
			for (Map<String, Object> arrivalEqMap : arrivalEqlist) {
				arrivalEqMap.put(ShipBean.EQCOST_SHIP_AMOUNT, arrivalEqMap.get(ArrivalNoticeBean.EQCOST_ARRIVAL_AMOUNT));
				arrivalEqMap.put(ShipBean.SHIP_EQ_ACTURE_AMOUNT, arrivalEqMap.get(ArrivalNoticeBean.EQCOST_ARRIVAL_AMOUNT));
			}



			Map<String, Object> newObj = new HashMap<String, Object>();
			newObj.put(ShipBean.SHIP_STATUS, ShipBean.SHIP_STATUS_CLOSE);
			newObj.put(ShipBean.SHIP_TYPE, "上海—北京泰德库");
			newObj.put(SalesContractBean.SC_ID, arrival.get(SalesContractBean.SC_ID));
			newObj.put(SalesContractBean.SC_CODE, arrival.get(SalesContractBean.SC_CODE));
			mergeCommonFieldsFromSc(newObj, arrival.get(SalesContractBean.SC_ID));

			newObj.put(ShipBean.SHIP_CODE, "FHSQ-" + arrival.get(SalesContractBean.SC_CODE));
			newObj.put("comments", "历史数据导入");
			newObj.put(SalesContractBean.SC_EQ_LIST, arrival.get(SalesContractBean.SC_EQ_LIST));
			this.dao.add(newObj, DBBean.SHIP);

		}
	}


	private void insertFinInfo(double invoiceMoney, double payMoney, String date, String scCode) {

		Map<String, Object> sc = dao.findOne(SalesContractBean.SC_CODE, scCode, DBBean.SALES_CONTRACT);

		Map<String, Object> invoice = new LinkedHashMap<String, Object>();
		invoice.put(InvoiceBean.payInvoiceMoney, invoiceMoney);
		invoice.put(InvoiceBean.payInvoiceActualMoney, invoiceMoney);
		invoice.put(InvoiceBean.payInvoiceActualDate, date);
		invoice.put(InvoiceBean.payInvoicePlanDate, date);
		invoice.put(InvoiceBean.payInvoiceSubmitDate, date);

		invoice.put(InvoiceBean.payInvoiceReceivedMoneyStatus, "历史数据导入");// TODO:
																		 // 正确？删除？
		invoice.put(InvoiceBean.payInvoiceStatus, InvoiceBean.statusDone);
		String comment = recordComment("提交", "期初数据导入", null);
		invoice.put(InvoiceBean.payInvoiceComment, comment);
		invoice.put(InvoiceBean.payInvoiceItemList, new ArrayList());

		invoice.put(InvoiceBean.scId, sc.get(ApiConstants.MONGO_ID));
		invoice.put("contractCode", scCode);
		invoice.put(SalesContractBean.SC_TYPE, sc.get(SalesContractBean.SC_TYPE));
		invoice.put(SalesContractBean.SC_INVOICE_TYPE, sc.get(SalesContractBean.SC_INVOICE_TYPE));

		mergeCommonFieldsFromSc(invoice, sc.get(ApiConstants.MONGO_ID));
		if(invoiceMoney > 0){
			dao.add(invoice, DBBean.SC_INVOICE);
		}

		// //////////////////////////////////////
		Map<String, Object> moneyObj = new LinkedHashMap<String, Object>();
		moneyObj.put("tempComment", "历史数据导入");
		moneyObj.put(MoneyBean.getMoneyActualDate, date);
		moneyObj.put(MoneyBean.getMoneyActualMoney, payMoney);
		moneyObj.put(MoneyBean.contractCode, scCode);
		
		if(payMoney > 0){
			saveGetMoneyForSC(moneyObj);
		}

	}

	public ICustomerService getCustomerService() {
		return customerService;
	}

	public void setCustomerService(ICustomerService customerService) {
		this.customerService = customerService;
	}

	public IProjectService getProjectService() {
		return projectService;
	}

	public void setProjectService(IProjectService projectService) {
		this.projectService = projectService;
	}

	public IUserService getUserService() {
		return userService;
	}

	public void setUserService(IUserService userService) {
		this.userService = userService;
	}

	public IPurchaseService getPurchaseService() {
		return purchaseService;
	}

	public void setPurchaseService(IPurchaseService purchaseService) {
		this.purchaseService = purchaseService;
	}

	public IPurchaseContractService getPurchaseContractService() {
		return purchaseContractService;
	}

	public void setPurchaseContractService(IPurchaseContractService purchaseContractService) {
		this.purchaseContractService = purchaseContractService;
	}
	
	

}
