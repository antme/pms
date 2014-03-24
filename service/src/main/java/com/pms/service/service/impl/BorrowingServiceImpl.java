package com.pms.service.service.impl;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.pms.service.dbhelper.DBQuery;
import com.pms.service.dbhelper.DBQueryOpertion;
import com.pms.service.exception.ApiResponseException;
import com.pms.service.mockbean.ApiConstants;
import com.pms.service.mockbean.ArrivalNoticeBean;
import com.pms.service.mockbean.BorrowingBean;
import com.pms.service.mockbean.DBBean;
import com.pms.service.mockbean.ProjectBean;
import com.pms.service.mockbean.PurchaseCommonBean;
import com.pms.service.mockbean.PurchaseContract;
import com.pms.service.mockbean.ReturnBean;
import com.pms.service.mockbean.SalesContractBean;
import com.pms.service.mockbean.ShipBean;
import com.pms.service.mockbean.UserBean;
import com.pms.service.service.AbstractService;
import com.pms.service.service.IArrivalNoticeService;
import com.pms.service.service.IBorrowingService;
import com.pms.service.service.IPurchaseContractService;
import com.pms.service.service.IReturnService;
import com.pms.service.service.IShipService;
import com.pms.service.util.ApiThreadLocal;
import com.pms.service.util.ApiUtil;
import com.pms.service.util.DateUtil;
import com.pms.service.util.status.ResponseCodeConstants;

public class BorrowingServiceImpl extends AbstractService implements IBorrowingService {
	
	private IPurchaseContractService pService;
	
	private IShipService shipService;
	
	private IReturnService returnService;

	private IArrivalNoticeService arrivalService;

	   
	public IShipService getShipService() {
		return shipService;
	}

	public void setShipService(IShipService shipService) {
		this.shipService = shipService;
	}

	public IPurchaseContractService getpService() {
		return pService;
	}

	public void setpService(IPurchaseContractService pService) {
		this.pService = pService;
	}
	

	public IReturnService getReturnService() {
		return returnService;
	}

	public void setReturnService(IReturnService returnService) {
		this.returnService = returnService;
	}

	
	public IArrivalNoticeService getArrivalService() {
        return arrivalService;
    }

    public void setArrivalService(IArrivalNoticeService arrivalService) {
        this.arrivalService = arrivalService;
    }

    @Override
	public String geValidatorFileName() {
		return "borrowing";
	}
	
	public Map<String, Object> get(Map<String, Object> params) {
		Map<String, Object> result = dao.findOne(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID), DBBean.BORROWING);
//		String inProjectId = result.get(BorrowingBean.BORROW_IN_PROJECT_ID).toString();
//		String outProjectId = result.get(BorrowingBean.BORROW_OUT_PROJECT_ID).toString();
		return result;
	}

	public Map<String, Object> list(Map<String, Object> params) {

	    mergeMyTaskQuery(params, DBBean.BORROWING);
		Map<String, Object> result = dao.list(params, DBBean.BORROWING);
		
		List<Map<String, Object>> list = (List<Map<String, Object>>) result.get(ApiConstants.RESULTS_DATA);
		
		List<String> pId = new ArrayList<String>();
		for (Map<String, Object> p:list){
			if (p.containsKey(BorrowingBean.BORROW_IN_PROJECT_ID)) {
				String inId = p.get(BorrowingBean.BORROW_IN_PROJECT_ID).toString();
				if (!inId.equals("")) {
					pId.add(inId.toString());
				}
			}
			if (p.containsKey(BorrowingBean.BORROW_OUT_PROJECT_ID)) {
				String outId = p.get(BorrowingBean.BORROW_OUT_PROJECT_ID).toString();
				if (!outId.equals("")) {
					pId.add(outId.toString());
				}
			}
		}
		
		// 有项目信息需要获取
		if (!pId.isEmpty()) {
			// 获取project信息
			Map<String, Object> queryContract = new HashMap<String, Object>();
			queryContract.put(ApiConstants.MONGO_ID, new DBQuery(DBQueryOpertion.IN, pId));
			Map<String, Object> cInfoMap = dao.listToOneMapByKey(queryContract, DBBean.PROJECT, ApiConstants.MONGO_ID);
			
			List<String> pmId = new ArrayList<String>();
			
			for (Map<String, Object> p:list){
				String inProjectId = p.get(BorrowingBean.BORROW_IN_PROJECT_ID).toString();
				Map<String, Object> inProjectMap = (Map<String, Object>) cInfoMap.get(inProjectId);
				if (inProjectMap != null) {
					p.put(BorrowingBean.BORROW_IN_PROJECT_CODE, inProjectMap.get(ProjectBean.PROJECT_CODE));
					p.put(BorrowingBean.BORROW_IN_PROJECT_NAME, inProjectMap.get(ProjectBean.PROJECT_NAME));
					p.put(BorrowingBean.BORROW_IN_PROJECT_MANAGER, inProjectMap.get(ProjectBean.PROJECT_MANAGER_ID));
					pmId.add(inProjectMap.get(ProjectBean.PROJECT_MANAGER_ID).toString());
				}
				
				String outProjectId = p.get(BorrowingBean.BORROW_OUT_PROJECT_ID).toString();
				Map<String, Object> outProjectMap = (Map<String, Object>) cInfoMap.get(outProjectId);
				if (outProjectMap != null) {
					p.put(BorrowingBean.BORROW_OUT_PROJECT_CODE, outProjectMap.get(ProjectBean.PROJECT_CODE));
					p.put(BorrowingBean.BORROW_OUT_PROJECT_NAME, outProjectMap.get(ProjectBean.PROJECT_NAME));
					p.put(BorrowingBean.BORROW_OUT_PROJECT_MANAGER, outProjectMap.get(ProjectBean.PROJECT_MANAGER_ID));
					pmId.add(outProjectMap.get(ProjectBean.PROJECT_MANAGER_ID).toString());
				}
			}
			
			if (!pmId.isEmpty()) {
				// 获取项目负责人信息
				Map<String, Object> pmQueryContract = new HashMap<String, Object>();
				pmQueryContract.put(ApiConstants.MONGO_ID, new DBQuery(DBQueryOpertion.IN, pmId));
				pmQueryContract.put(ApiConstants.LIMIT_KEYS, new String[] {UserBean.USER_NAME});
				Map<String, Object> pmMap = dao.listToOneMapByKey(pmQueryContract, DBBean.USER, ApiConstants.MONGO_ID);
				
				for (Map<String, Object> p:list){
					if (p.containsKey(BorrowingBean.BORROW_IN_PROJECT_MANAGER)) {
						String inPmId = p.get(BorrowingBean.BORROW_IN_PROJECT_MANAGER).toString();
						if (!inPmId.equals("")) {
							Map<String, Object> inPmMap = (Map<String, Object>) pmMap.get(inPmId);
							if (inPmMap != null) {
								p.put(BorrowingBean.BORROW_IN_PROJECT_MANAGER, inPmMap.get(UserBean.USER_NAME));
							}
						}
					}
					
					if (p.containsKey(BorrowingBean.BORROW_OUT_PROJECT_MANAGER)) {
						String outPmId = p.get(BorrowingBean.BORROW_OUT_PROJECT_MANAGER).toString();
						if (!outPmId.equals("")) {
							Map<String, Object> outPmMap = (Map<String, Object>) pmMap.get(outPmId);
							if (outPmMap != null) {
								p.put(BorrowingBean.BORROW_OUT_PROJECT_MANAGER, outPmMap.get(UserBean.USER_NAME));
							}
						}
					}
				}
			}
		}
		
		return result;
	}

	public Map<String, Object> update(Map<String, Object> params) {

		if (ApiUtil.isEmpty(params.get(ApiConstants.MONGO_ID))) {
			return create(params);
		} else {
			return dao.updateById(params, DBBean.BORROWING);
		}
	}

	public void destroy(Map<String, Object> params) {
		List<String> ids = new ArrayList<String>();
		ids.add(String.valueOf(params.get(ApiConstants.MONGO_ID)));
		dao.deleteByIds(ids, DBBean.BORROWING);
	}

	public Map<String, Object> create(Map<String, Object> params) {
		Map<String, Object> user = dao.findOne(ApiConstants.MONGO_ID, getCurrentUserId(), DBBean.USER);
    	params.put(BorrowingBean.BORROW_APPLICANT, user.get(UserBean.USER_NAME));
    	// 借货调拨编号
    	String code = generateCode("JHDB", DBBean.BORROWING, BorrowingBean.BORROW_CODE);    	
    	params.put(BorrowingBean.BORROW_CODE, code);
		
    	return dao.add(params, DBBean.BORROWING);
	}
	
	public Map<String, Object> eqlist(Map<String, Object> params) {
		
		String saleId = (String) params.get(BorrowingBean.BORROW_IN_SALES_CONTRACT_ID);
		
		// 要采购的货物
		List<Map<String, Object>> purchaseEqList = pService.listApprovedPurchaseContractCosts(saleId);
		
		// 已到货货物
		Map<String, Object> map = arrivalService.listByScIdForBorrowing(saleId);
		List<Map<String, Object>> shipedEqList = (List<Map<String, Object>>) map.get(SalesContractBean.SC_EQ_LIST);
		Map<String, Double> shipedEqMap = new HashMap<String, Double>();
		for (Map<String, Object> p : shipedEqList){
			shipedEqMap.put((String) p.get(ApiConstants.MONGO_ID), ApiUtil.getDouble(p.get(ArrivalNoticeBean.EQCOST_ARRIVAL_AMOUNT).toString()));
		}
		
		// 结果数据
		List<Map<String, Object>> result = new ArrayList<Map<String, Object>>();
		
		for (Map<String, Object> purchaseEq : purchaseEqList) {
			String id = (String) purchaseEq.get(ApiConstants.MONGO_ID);
			Double canBorrowAmount = (Double) purchaseEq.get(PurchaseCommonBean.EQCOST_APPLY_AMOUNT);
			if (shipedEqMap.containsKey(id)) {
				canBorrowAmount -= shipedEqMap.get(id);
			}
			if (canBorrowAmount > 0) {
				Map<String, Object> borrowMap = new HashMap<String, Object>();
				borrowMap.put(ApiConstants.MONGO_ID, id);
				borrowMap.put(BorrowingBean.EQCOST_BORROW_AMOUNT, canBorrowAmount);
				borrowMap.put(BorrowingBean.EQCOST_CAN_BORROW_AMOUNT, canBorrowAmount);
				result.add(borrowMap);
			}
		}
		
		Map<String, Object> res = new HashMap<String, Object>();
		res.put(ApiConstants.RESULTS_DATA, scs.mergeEqListBasicInfo(result));
		return res;
	}

	public Map<String, Object> option(Map<String, Object> params) {
		Map<String, Object> result = null;
		if (params.containsKey(BorrowingBean.BORROW_STATUS)) {
			String status = params.get(BorrowingBean.BORROW_STATUS).toString();
			Map<String, Object> cc = dao.findOne(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID), DBBean.BORROWING);
	        params.put(ApiConstants.MONGO_ID, cc.get(ApiConstants.MONGO_ID));
	        params.put(BorrowingBean.BORROW_STATUS, status);
	        
	        if (status.equals("1")) {
	    		params.put(BorrowingBean.BORROW_DATE, ApiUtil.formateDate(new Date(), "yyy-MM-dd"));
			}

	        result =  dao.updateById(params, DBBean.BORROWING);
	        
	        // 库管批准借货申请
	        if (status.equals("2")) {
	        	Map<String, Object> borrowing = dao.findOne(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID), DBBean.BORROWING);
	        	createShip(borrowing);
	        	createReturn(borrowing);
			}
		}
        
        return result;
    }
	
	// 生成发货申请
	private Map<String, Object> createShip(Map<String, Object> params) {
		Map<String, Object> shipParams = new HashMap<String, Object>();
    	shipParams.put(ShipBean.SHIP_CODE, params.get(ShipBean.SHIP_CODE));
    	shipParams.put(ShipBean.SHIP_DEPARTMENT, params.get(ShipBean.SHIP_DEPARTMENT));
    	shipParams.put(ShipBean.SHIP_STATUS, ShipBean.SHIP_STATUS_FINAL_APPROVE);
    	shipParams.put(ShipBean.SHIP_DATE, ApiUtil.formateDate(new Date(), "yyy-MM-dd"));
    	shipParams.put(ShipBean.SHIP_WAREHOUSE, params.get(ShipBean.SHIP_WAREHOUSE));
    	shipParams.put(ShipBean.SHIP_PROJECT_ID, params.get(BorrowingBean.BORROW_IN_PROJECT_ID));
    	shipParams.put(ShipBean.SHIP_PROJECT_NAME, params.get(BorrowingBean.BORROW_IN_PROJECT_NAME));
    	shipParams.put(ShipBean.SHIP_SALES_CONTRACT_ID, params.get(BorrowingBean.BORROW_IN_SALES_CONTRACT_ID));
    	shipParams.put(ShipBean.SHIP_SALES_CONTRACT_CODE, params.get(BorrowingBean.BORROW_IN_SALES_CONTRACT_CODE));
    	shipParams.put(ShipBean.SHIP_SALES_CONTRACT_TYPE, params.get(BorrowingBean.BORROW_IN_SALES_CONTRACT_TYPE));
    	shipParams.put(ShipBean.SHIP_CUSTOMER_NAME, params.get(BorrowingBean.BORROW_IN_PROJECT_CUSTOMER));
    	shipParams.put(ShipBean.SHIP_DELIVERY_CONTACT, params.get(ShipBean.SHIP_DELIVERY_CONTACT));
    	shipParams.put(ShipBean.SHIP_DELIVERY_CONTACTWAY, params.get(ShipBean.SHIP_DELIVERY_CONTACTWAY));
    	shipParams.put(ShipBean.SHIP_DELIVERY_UNIT, params.get(ShipBean.SHIP_DELIVERY_UNIT));
    	shipParams.put(ShipBean.SHIP_DELIVERY_ADDRESS, params.get(ShipBean.SHIP_DELIVERY_ADDRESS));
    
        shipParams.put(ShipBean.SHIP_DELIVERY_START_DATE, DateUtil.getDate((String)params.get(ShipBean.SHIP_DELIVERY_START_DATE)));

        shipParams.put(ShipBean.SHIP_DELIVERY_TIME, DateUtil.getDate((String)params.get(ShipBean.SHIP_DELIVERY_TIME)));
     
    	
    	shipParams.put(ShipBean.SHIP_DELIVERY_REQUIREMENTS, params.get(ShipBean.SHIP_DELIVERY_REQUIREMENTS));
    	shipParams.put(ShipBean.SHIP_OTHER_DELIVERY_REQUIREMENTS, params.get(ShipBean.SHIP_OTHER_DELIVERY_REQUIREMENTS));
    	
    	List<Map<String, Object>> borrowedEqList = (List<Map<String, Object>>) params.get(SalesContractBean.SC_EQ_LIST);
    	for (Map<String, Object> map : borrowedEqList) {
			map.put(ShipBean.EQCOST_SHIP_AMOUNT, map.get(BorrowingBean.EQCOST_BORROW_AMOUNT));
		}
    	shipParams.put(ShipBean.SHIP_EQ_LIST, borrowedEqList);
		return shipService.create(shipParams);
	}
	
	// 生成待还货记录
	private Map<String, Object> createReturn(Map<String, Object> params) {
		Map<String, Object> returnParams = new HashMap<String, Object>();
		returnParams.put(ReturnBean.BORROW_ID, params.get(ApiConstants.MONGO_ID));
		returnParams.put(ReturnBean.BORROW_CODE, params.get(BorrowingBean.BORROW_CODE));
		returnParams.put(ReturnBean.RETURN_APPLICANT, params.get(BorrowingBean.BORROW_APPLICANT));
		
		String borrowCode = (String) params.get(BorrowingBean.BORROW_CODE);
    	String[] codeArr = borrowCode.split("-");
    	String code = "HHDB" + "-" + codeArr[1] + "-" + codeArr[2];
		returnParams.put(ReturnBean.RETURN_CODE, code);
		
		return returnService.create(returnParams);
	}
	
	public Map<String, Object> listScByProjectForBorrowing(Map<String, Object> params) {
		String pId = null;
		if (params.containsKey(SalesContractBean.SC_PROJECT_ID)) {
			pId = params.get(SalesContractBean.SC_PROJECT_ID).toString();
		}
		
		if (ApiUtil.isEmpty(pId)){
			throw new ApiResponseException(String.format("Project id is empty", params), ResponseCodeConstants.PROJECT_ID_IS_EMPTY.toString());
		}
		
		Map<String, Object> query = new HashMap<String, Object>();
		query.put(PurchaseCommonBean.PROCESS_STATUS, PurchaseCommonBean.STATUS_APPROVED);
        query.put(PurchaseContract.PURCHASE_CONTRACT_TYPE, PurchaseCommonBean.CONTRACT_EXECUTE_CATE_BEIJINGDAICAI);
        query.put("eqcostList.projectId", pId);
        query.put(ApiConstants.LIMIT_KEYS, new String[] { "eqcostList.scId" });
        Map<String, Object> purConEq = dao.list(query, DBBean.PURCHASE_CONTRACT);
        List<Map<String, Object>> purConList = (List<Map<String, Object>>) purConEq.get(ApiConstants.RESULTS_DATA);
        
        Set<Object> scIdsList = new HashSet();
        
        for (Map<String, Object> map : purConList) {
        	List<Map<String, Object>> eqList = (List<Map<String, Object>>) map.get(SalesContractBean.SC_EQ_LIST);
        	for (Map<String, Object> eq : eqList) {
        		scIdsList.add(eq.get(SalesContractBean.SC_ID));
			}
		}
		
        Map<String, Object> scQuery = new HashMap<String, Object>();
        scQuery.put(SalesContractBean.SC_PROJECT_ID, pId);
        scQuery.put(SalesContractBean.SC_RUNNING_STATUS, SalesContractBean.SC_RUNNING_STATUS_RUNNING);
        scQuery.put(ApiConstants.MONGO_ID, new DBQuery(DBQueryOpertion.IN, new ArrayList<Object>(scIdsList)));
        scQuery.put(ApiConstants.LIMIT_KEYS, new String[] {SalesContractBean.SC_CODE, SalesContractBean.SC_TYPE});
		Map<String, Object> result = dao.list(scQuery, DBBean.SALES_CONTRACT);
		
		return result;
	}
	
	public Map<String, Object> listProjectForBorrowing(Map<String, Object> params) {
		Map<String, Object> query = new HashMap<String, Object>();
		query.put(PurchaseCommonBean.PROCESS_STATUS, PurchaseCommonBean.STATUS_APPROVED);
        query.put(PurchaseContract.PURCHASE_CONTRACT_TYPE, PurchaseCommonBean.CONTRACT_EXECUTE_CATE_BEIJINGDAICAI);
        query.put(ApiConstants.LIMIT_KEYS, new String[] { "eqcostList.projectId" });
        Map<String, Object> purConEq = dao.list(query, DBBean.PURCHASE_CONTRACT);
        List<Map<String, Object>> projectResults = (List<Map<String, Object>>) purConEq.get(ApiConstants.RESULTS_DATA);
        
        Set<Object> projectIdsList = new HashSet();
        
        for (Map<String, Object> map : projectResults) {
        	List<Map<String, Object>> eqList = (List<Map<String, Object>>) map.get(SalesContractBean.SC_EQ_LIST);
        	for (Map<String, Object> eq : eqList) {
        		projectIdsList.add(eq.get(ProjectBean.PROJECT_ID));
			}
		}
        
        String[] limitKeys = { ProjectBean.PROJECT_NAME, ProjectBean.PROJECT_CODE, ProjectBean.PROJECT_MANAGER_ID, ProjectBean.PROJECT_CUSTOMER_ID };
		Map<String, Object> pQuery = new HashMap<String, Object>();
		pQuery.put(ApiConstants.LIMIT_KEYS, limitKeys);
		// 选择调入项目
		if ("in".equals(params.get("type"))) {
			pQuery.put(ProjectBean.PROJECT_MANAGER_ID, ApiThreadLocal.getCurrentUserId());
		}
		pQuery.put(ApiConstants.MONGO_ID, new DBQuery(DBQueryOpertion.IN, new ArrayList<Object>(projectIdsList)));
		Map<String, Object> result = dao.list(pQuery, DBBean.PROJECT);
		
		List<Map<String, Object>> resultList = (List<Map<String, Object>>) result.get(ApiConstants.RESULTS_DATA); 
		Set<String> uids = new HashSet<String>();
		for(Map<String, Object> p : resultList){
			String pmid = (String)p.get(ProjectBean.PROJECT_MANAGER_ID);
			String cid = (String)p.get(ProjectBean.PROJECT_CUSTOMER_ID);
			if (!ApiUtil.isEmpty(pmid)){
				uids.add(pmid);
			}
			if (!ApiUtil.isEmpty(cid)){
				uids.add(cid);
			}
		}
		
		Map<String, Object> pmQuery = new HashMap<String, Object>();
		pmQuery.put(ApiConstants.MONGO_ID, new DBQuery(DBQueryOpertion.IN, new ArrayList<Object>(uids)));
		pmQuery.put(ApiConstants.LIMIT_KEYS, new String[] {UserBean.USER_NAME, UserBean.DEPARTMENT});
		Map<String, Object> pmData = dao.listToOneMapAndIdAsKey(pmQuery, DBBean.USER);
		
		for (Map<String, Object> p : resultList){
			scs.mergeCommonProjectInfo(p, p.get(ApiConstants.MONGO_ID));
		}
		
		return result;
	}

}
