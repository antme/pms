package com.pms.service.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;
import com.pms.service.dbhelper.DBQuery;
import com.pms.service.dbhelper.DBQueryOpertion;
import com.pms.service.dbhelper.DBQueryUtil;
import com.pms.service.exception.ApiResponseException;
import com.pms.service.mockbean.ApiConstants;
import com.pms.service.mockbean.ArrivalNoticeBean;
import com.pms.service.mockbean.DBBean;
import com.pms.service.mockbean.EqCostListBean;
import com.pms.service.mockbean.ProjectBean;
import com.pms.service.mockbean.PurchaseBack;
import com.pms.service.mockbean.PurchaseCommonBean;
import com.pms.service.mockbean.SalesContractBean;
import com.pms.service.mockbean.UserBean;
import com.pms.service.service.AbstractService;
import com.pms.service.service.IArrivalNoticeService;
import com.pms.service.service.IPurchaseService;
import com.pms.service.util.ApiUtil;
import com.pms.service.util.DateUtil;
import com.pms.service.util.status.ResponseCodeConstants;

public class PurchaseServiceImpl extends AbstractService implements IPurchaseService {

    private static final Logger logger = LogManager.getLogger(PurchaseServiceImpl.class);
	
    private IArrivalNoticeService arrivalNoticeService;
    
    public IArrivalNoticeService getArrivalNoticeService() {
		return arrivalNoticeService;
	}

	public void setArrivalNoticeService(IArrivalNoticeService arrivalNoticeService) {
		this.arrivalNoticeService = arrivalNoticeService;
	}

	/**
     * @param scId
     */
	public Map<String, Object> prepareBack(Map<String, Object> params) {
		Map<String,Object> request = new LinkedHashMap<String,Object>();
		request.put(PurchaseBack.pbStatus, PurchaseStatus.unsaved.toString());
		request.put(PurchaseBack.scId, params.get(PurchaseBack.scId));
		mergeSalesContract(request);
		mergeEqcost(request);
		request.put(PurchaseBack.pbDepartment, request.get("projectManagerDepartment"));
		request.remove("projectManagerDepartment");
		request.put(PurchaseBack.pbSpecialRequireRadio, new String[]{});
		return request;
	}

    /**
     * @param params._id
     */
	public Map<String, Object> loadBack(Map<String, Object> params) {
		Map<String,Object> request = dao.findOne(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID), DBBean.PURCHASE_BACK);
		mergeSalesContract(request);
		mergeEqcost(request);
		/*request.put(SalesContractBean.SC_EQ_LIST, scs.mergeLoadedEqList(request.get(SalesContractBean.SC_EQ_LIST)));
		mergeRestEqCount(request);*/
		return request;
	}

    /**
     * @param back object info
     */
	public Map<String, Object> saveBack(Map<String, Object> params) {
		Map<String,Object> newObj = new HashMap<String,Object>();
	    newObj.put(PurchaseBack.pbStatus, PurchaseStatus.saved.toString());
		return saveOrUpdate(params, newObj);
	}

	@Override
    public Map<String, Object> submitBack(Map<String, Object> params) {
        Map<String, Object> newObj = new HashMap<String, Object>();
        newObj.put(PurchaseBack.pbStatus, PurchaseStatus.submited.toString());
        newObj.put(PurchaseBack.pbSubmitDate, DateUtil.getDateString(new Date()));        
        return saveOrUpdate(params, newObj);
    }

	@Override
    public Map<String, Object> approveBack(Map<String, Object> params) {
        Map<String, Object> newObj = new HashMap<String, Object>();
        newObj.put(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID));
        newObj.put(PurchaseBack.pbStatus, PurchaseStatus.approved.toString());
        newObj.put(PurchaseBack.pbOperateDate, DateUtil.getDateString(new Date()));
        return dao.updateById(newObj, DBBean.PURCHASE_BACK);
    }
	
	@Override
    public Map<String, Object> rejectBack(Map<String, Object> params) {
        Map<String, Object> newObj = new HashMap<String, Object>();
        newObj.put(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID));
        newObj.put(PurchaseBack.pbStatus, PurchaseStatus.rejected.toString());
        newObj.put(PurchaseBack.pbOperateDate, DateUtil.getDateString(new Date()));
        return dao.updateById(newObj, DBBean.PURCHASE_BACK);
    }
	
    private Map<String, Object> saveOrUpdate(Map<String, Object> params, Map<String, Object> newObj) {
        newObj.put(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID));
        newObj.put(PurchaseBack.pbDepartment, params.get(PurchaseBack.pbDepartment));
        newObj.put(PurchaseBack.pbType, params.get(PurchaseBack.pbType));
        newObj.put(PurchaseBack.pbComment, params.get(PurchaseBack.pbComment));
        newObj.put(PurchaseBack.pbSpecialRequire, params.get(PurchaseBack.pbSpecialRequire));
        newObj.put(PurchaseBack.pbSpecialRequireRadio, params.get(PurchaseBack.pbSpecialRequireRadio));
        newObj.put(PurchaseBack.pbPlanDate, params.get(PurchaseBack.pbPlanDate));
        newObj.put(PurchaseBack.scId, params.get(PurchaseBack.scId));
        if (params.get(PurchaseBack.pbCode) == null) {
            newObj.put(PurchaseBack.pbCode, generateCode("BHSQ", DBBean.PURCHASE_BACK));
        }
        newObj.putAll(checkEqCountForBack(params));
        
        Map<String, Object> sc = dao.findOne(ApiConstants.MONGO_ID, params.get(PurchaseBack.scId), new String[] { SalesContractBean.SC_CODE,SalesContractBean.SC_PROJECT_ID }, DBBean.SALES_CONTRACT);
        newObj.put(PurchaseBack.scCode, sc.get(SalesContractBean.SC_CODE));

        scs.mergeCommonFieldsFromSc(newObj, params.get(PurchaseBack.scId));
        
        Map<String, Object> res = dao.save(newObj, DBBean.PURCHASE_BACK);
        //updateEqLeftCountInEqDB(res);     
        return res;
    }

	@Override
	public Map<String, Object> pendingBack(Map<String, Object> params) {
		Map<String,Object> obj = new HashMap<String,Object>();
		obj.put(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID));
		obj.put(PurchaseBack.pbStatus, PurchaseStatus.interruption.toString());
		//TODO: 中止了备货，调拨和采购怎么办？
		Map<String,Object> res = dao.updateById(obj, DBBean.PURCHASE_BACK);
	      
/*        Map<String, Object> resqeury = this.dao.findOne(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID), new String[]{EqCostListBean.EQ_LIST_SC_ID}, DBBean.PURCHASE_BACK);     
        updateEqLeftCountInEqDB(resqeury); */
        
        return res;
	}

	///////////////////////////allot 调拨///////////
	@Override
	public Map<String, Object> submitAllot(Map<String, Object> params) {
		Map<String,Object> obj = new HashMap<String,Object>();
		obj.put(PurchaseBack.scId, params.get(PurchaseBack.scId));
		obj.put(PurchaseBack.pbId, params.get(PurchaseBack.pbId));
		obj.put(PurchaseBack.pbCode, params.get(PurchaseBack.pbCode));
		obj.put(PurchaseBack.paStatus, PurchaseStatus.submited.toString());
		obj.put(PurchaseBack.paSubmitDate, DateUtil.getDateString(new Date()));
		obj.put(PurchaseBack.paShelfCode, params.get(PurchaseBack.paShelfCode));
		obj.put(PurchaseBack.paComment, params.get(PurchaseBack.paComment));
		obj.put(PurchaseBack.paCode, generateCode("DBSQ", DBBean.PURCHASE_ALLOCATE));
		obj.putAll(checkEqCountForAllot(params));
		
		scs.mergeCommonFieldsFromSc(obj, params.get(PurchaseBack.scId));
		Map<String, Object> result =  dao.add(obj, DBBean.PURCHASE_ALLOCATE);
		//updateEqLeftCountInEqDB(result);
		return result;
	}

	public Map<String, Object> loadAllot(Map<String, Object> params) {
		Map<String,Object> allot = dao.findOne(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID), DBBean.PURCHASE_ALLOCATE);
		mergeEqcostForAllot(allot);
		mergeSalesContract(allot);
		return allot;
	}

	public Map<String, Object> prepareAllot(Map<String, Object> params) {
		Map<String,Object> allot = new HashMap<String,Object>();
		allot.put(PurchaseBack.pbId, params.get(PurchaseBack.pbId));
		allot.put(PurchaseBack.paStatus, PurchaseStatus.unsaved.toString());
		mergeEqcostForAllot(allot);//整合scId eqCostList purchaseBack
		mergeSalesContract(allot);
		return allot;
	}
	
	public Map<String, Object> approveAllot(Map<String, Object> params) {
		Map<String,Object> obj = new HashMap<String,Object>();
		obj.put(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID));
		obj.put(PurchaseBack.paComment, params.get(PurchaseBack.paComment));
		
		obj.put(PurchaseBack.paApproveDate, DateUtil.getDateString(new Date()));
		String status = String.valueOf(params.get(PurchaseBack.paStatus));
		
		boolean error = false;
		if(isDepotManager()){
			if(PurchaseStatus.submited.toString().equals(status)){
				obj.put(PurchaseBack.paStatus, PurchaseStatus.finalApprove.toString());
			} else if(PurchaseStatus.senondApprove.toString().equals(status)){
				obj.put(PurchaseBack.paStatus, PurchaseStatus.done.toString());
			}else {
				error = true;
			}
		}else if(isSalesManager()){
			if(PurchaseStatus.finalApprove.toString().equals(status)){
				obj.put(PurchaseBack.paStatus, PurchaseStatus.senondApprove.toString());
			} else {
				error = true;
			}
		}else {
			error = true;
		}
		
		if(error){
			throw new ApiResponseException(String.format("No role to for user,[%s]",params ), "role_required");
		}
		
		Map<String,Object> res = dao.updateById(obj, DBBean.PURCHASE_ALLOCATE);
		if(PurchaseStatus.done.toString().equals(obj.get(PurchaseBack.paStatus))){
			// 批准调拨申请时生成到货通知
			createArrivalNotice(params);
		}
		
	    //Map<String, Object> resqeury = this.dao.findOne(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID), new String[]{EqCostListBean.EQ_LIST_SC_ID}, DBBean.PURCHASE_ALLOCATE);     
	    //updateEqLeftCountInEqDB(resqeury); 
	        
	    return res;
	}
	
	private void createArrivalNotice(Map<String, Object> params) {
		Map<String,Object> noticeParams = new HashMap<String,Object>();
		noticeParams.put(ArrivalNoticeBean.SHIP_TYPE, ArrivalNoticeBean.SHIP_TYPE_1);
		noticeParams.put(ArrivalNoticeBean.FOREIGN_KEY, params.get(ApiConstants.MONGO_ID));
		noticeParams.put(ArrivalNoticeBean.FOREIGN_CODE, params.get(PurchaseBack.paCode));
		arrivalNoticeService.create(noticeParams);
	}
	
	@Override
	public Map<String, Object> rejectAllot(Map<String, Object> params) {
		Map<String,Object> allot = dao.findOne(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID), DBBean.PURCHASE_ALLOCATE);
		Map<String,Object> obj = new HashMap<String,Object>();
		obj.put(ApiConstants.MONGO_ID, allot.get(ApiConstants.MONGO_ID));
		obj.put(PurchaseBack.paStatus, PurchaseStatus.rejected.toString());
		
        Map<String, Object> res = dao.updateById(obj, DBBean.PURCHASE_ALLOCATE);
/*        Map<String, Object> resqeury = this.dao.findOne(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID), new String[] { EqCostListBean.EQ_LIST_SC_ID },
                DBBean.PURCHASE_ALLOCATE);
        updateEqLeftCountInEqDB(resqeury);*/
        return res;
	}
	
	@Override
	public Map<String, Object> listAllBack(Map<String, Object> params) {
		String[] keys = new String[]{
				ApiConstants.CREATOR,PurchaseBack.pbCode,PurchaseBack.pbType,
				PurchaseBack.pbStatus,PurchaseBack.pbMoney,PurchaseBack.scId,
				PurchaseBack.pbSubmitDate, PurchaseBack.prId,PurchaseBack.poId
		};
		params.put(ApiConstants.LIMIT_KEYS, keys);
		mergeDataRoleQuery(params);
		mergeMyTaskQuery(params, DBBean.PURCHASE_BACK);
		Map<String,Object> map = dao.list(params, DBBean.PURCHASE_BACK);
		List<Map<String,Object>> list = (List<Map<String,Object>>)map.get(ApiConstants.RESULTS_DATA);
		Set<String> saleIds = new HashSet<String>();
		for(Map<String,Object> re : list){
			saleIds.add((String)re.get(PurchaseBack.scId));
		}
		saleIds.remove(null);
		Map<String,Object> baseInfoMap = scs.getBaseInfoByIds(new ArrayList(saleIds));
		for(Map<String,Object> re : list){
			re.putAll((Map)baseInfoMap.get(re.get(PurchaseBack.scId)));
		}
		
/*		//查询采购申请数据
		Map<String, Object> prQuery = new HashMap<String, Object>();
		prQuery.put(ApiConstants.LIMIT_KEYS, PurchaseCommonBean.PURCHASE_REQUEST_CODE);		
		Map<String, Object> request = this.dao.listToOneMapAndIdAsKey(prQuery, DBBean.PURCHASE_REQUEST);

        for (Map<String, Object> re : list) {
            if (re.get(PurchaseBack.prId) != null) {
                Map<String, Object> prmap = (Map<String, Object>)request.get(re.get(PurchaseBack.prId));                
                re.put(PurchaseBack.prCode, prmap.get(PurchaseCommonBean.PURCHASE_REQUEST_CODE));
            }
        }*/
		  
		return map;
	}

	private void mergeCreatorInfo(List<Map<String,Object>> list){
		Set<String> userIds = new HashSet<String>();
		for(Map<String,Object> re : list){
			userIds.add((String)re.get(ApiConstants.CREATOR));
		}
		userIds.remove(null);
		Map<String,Object> query = new HashMap<String,Object>();
		query.put(ApiConstants.LIMIT_KEYS, UserBean.USER_NAME);
		query.put(ApiConstants.MONGO_ID, new DBQuery(DBQueryOpertion.IN, userIds));
		Map<String,Object> userMap = dao.listToOneMapAndIdAsKey(query, DBBean.USER);
		for(Map<String,Object> re : list){
			Map<String,Object> user = (Map<String,Object>)userMap.get((String)re.get(ApiConstants.CREATOR));
			re.put("creatorName",user.get(UserBean.USER_NAME));
		}		
	}
	
	@Override
	public Map<String, Object> listCheckedBack(Map<String, Object> params) {
	    //返回PurchaseBack.prId,页面检测是否已发采购申请
		String[] keys = new String[]{PurchaseBack.pbCode,PurchaseBack.pbType,PurchaseBack.pbStatus,
				PurchaseBack.pbMoney,PurchaseBack.scId,PurchaseBack.pbSubmitDate, PurchaseBack.prId};
		params.put(ApiConstants.LIMIT_KEYS, keys);
		params.put(PurchaseBack.pbStatus, PurchaseStatus.submited.toString());
		mergeDataRoleQuery(params);
		mergeMyTaskQuery(params, DBBean.PURCHASE_BACK);
		Map<String,Object> map = dao.list(params, DBBean.PURCHASE_BACK);
		List<Map<String,Object>> list = (List<Map<String,Object>>)map.get(ApiConstants.RESULTS_DATA);
		Set<String> saleIds = new HashSet<String>();
		for(Map<String,Object> re : list){
			saleIds.add((String)re.get(PurchaseBack.scId));
		}
		saleIds.remove(null);
		Map<String,Object> baseInfoMap = scs.getBaseInfoByIds(new ArrayList(saleIds));
		for(Map<String,Object> re : list){
			re.putAll((Map)baseInfoMap.get(re.get(PurchaseBack.scId)));
		}
		return map;
		
	}

	@Override
	public Map<String, Object> listAllot(Map<String, Object> params) {
	    mergeDataRoleQuery(params);
	    mergeMyTaskQuery(params, DBBean.PURCHASE_ALLOCATE);
		Map<String,Object> map = dao.list(params, DBBean.PURCHASE_ALLOCATE);
		List<Map<String,Object>> list = (List<Map<String,Object>>)map.get(ApiConstants.RESULTS_DATA);
		Set<String> saleIds = new HashSet<String>();
		for(Map<String,Object> re : list){
			saleIds.add((String)re.get(PurchaseBack.scId));
		}
		saleIds.remove(null);
		if(!saleIds.isEmpty()){
			Map<String,Object> baseInfoMap = scs.getBaseInfoByIds(new ArrayList(saleIds));
			for(Map<String,Object> re : list){
				re.putAll((Map)baseInfoMap.get(re.get(PurchaseBack.scId)));
			}
		}
		return map;		
	}


	@Override
	public void destoryBack(Map<String, Object> params) {
		List<String> ids = new ArrayList<String>();
		ids.add(String.valueOf(params.get(ApiConstants.MONGO_ID)));
		dao.deleteByIds(ids, DBBean.PURCHASE_BACK);
	}

	
	private Map<String,Object> mergeSalesContract(Map<String,Object> params){
		String saleId = (String)params.get(PurchaseBack.scId);
		List<String> ids = new ArrayList<String>();
		ids.add(saleId);
		Map<String,Object> saleInfoMap = scs.getBaseInfoByIds(ids);
		params.putAll((Map)saleInfoMap.get(saleId));
		return params;
	}
	
	/**
	 * 整合清单基本信息 以及 合同下面的成本清单的剩余数量
	 * 注：对已提交的备货申请，只加载提交的货物清单信息
	 * **/
	@SuppressWarnings("unchecked")
	private void mergeEqcost(Map<String,Object> params){
		String status = String.valueOf(params.get(PurchaseBack.pbStatus));
		String scId = (String)params.get(PurchaseBack.scId);
		//1. 获取合同清单
		Map<String,Object> eqMap = scs.listMergedEqListBySC(params);
		List<Map<String,Object>> list1 = (List<Map<String,Object>>)eqMap.get(ApiConstants.RESULTS_DATA);
		
		//2. 获取当前备货清单
		List<Map<String,Object>> list2 = (List<Map<String,Object>>)params.get(PurchaseBack.eqcostList);
		
		Map<String,Map<String,Object>> map1 = new HashMap<String,Map<String,Object>>();
		Map<String,Map<String,Object>> map2 = new HashMap<String,Map<String,Object>>();

		if(list1 != null){
			for(Map<String,Object> obj : list1){
				map1.put(String.valueOf(obj.get(ApiConstants.MONGO_ID)), obj);
			}
		}
		if(list2 != null){
			for(Map<String,Object> obj : list2){
				map2.put(String.valueOf(obj.get(ApiConstants.MONGO_ID)), obj);
			}
		}
		Map<String,Integer> scCountMap = countRestEqByScId(scId);
		
		//3.1 比较：若已提交/已审核/已拒绝，则只加载已提交的清单信息	list1(list2)
		if(!PurchaseStatus.unsaved.toString().equals(status) && !PurchaseStatus.saved.toString().equals(status)){
			for(String id : map2.keySet()){
				if(map1.get(id) != null){
					map2.get(id).putAll(map1.get(id));//加载货物信息
				}
				map2.get(id).put(PurchaseBack.eqcostLeftAmount, scCountMap.get(id));
			}
			params.put(PurchaseBack.eqcostList, list2);
		} else {//3.2 比较：若未提交，加载合同下所有的清单	list2(list1)
			for(String id : map1.keySet()){
				if(map2.get(id) != null){
					map1.get(id).putAll(map2.get(id));//加载货物信息
				}else{
					map1.get(id).put(PurchaseBack.pbTotalCount, 0);
				}
				map1.get(id).put(PurchaseBack.eqcostLeftAmount, scCountMap.get(id));
			}
			params.put(PurchaseBack.eqcostList, list1);
		}
	}

	/**整合调拨清单：加载所有的备货清单列表*/
	private void mergeEqcostForAllot(Map<String,Object> params){
		//1. 备货清单
		Map<String, Object> back = dao.findOne(ApiConstants.MONGO_ID, params.get(PurchaseBack.pbId), DBBean.PURCHASE_BACK);

		params.put(PurchaseBack.scId, back.get(PurchaseBack.scId));
		params.put(PurchaseBack.scCode, back.get(PurchaseBack.scCode));
		params.put(PurchaseBack.pbCode, back.get(PurchaseBack.pbCode));
		params.put(PurchaseBack.pbDepartment, back.get(PurchaseBack.pbDepartment));
		params.put(PurchaseBack.pbPlanDate, back.get(PurchaseBack.pbPlanDate));
		params.put(PurchaseBack.pbType, back.get(PurchaseBack.pbType));
		params.put(PurchaseBack.pbSpecialRequire, back.get(PurchaseBack.pbSpecialRequire));
		params.put(PurchaseBack.pbSpecialRequireRadio, back.get(PurchaseBack.pbSpecialRequireRadio));		
		
		mergeRestEqCount(back);//整合备货剩余数量
		List<Map<String,Object>> list1 = (List<Map<String,Object>>)back.get(PurchaseBack.eqcostList);
		
		//2. 调拨清单
		List<Map<String,Object>> list2 = (List<Map<String,Object>>)params.get(PurchaseBack.eqcostList);

		//3. 合同成本清单信息
		Map<String,Object> eqMap = scs.listMergedEqListBySC(params);
		List<Map<String,Object>> list3 = (List<Map<String,Object>>)eqMap.get(ApiConstants.RESULTS_DATA);
		
		Map<String,Map<String,Object>> map1 = new HashMap<String,Map<String,Object>>();
		Map<String,Map<String,Object>> map2 = new HashMap<String,Map<String,Object>>();
		Map<String,Map<String,Object>> map3 = new HashMap<String,Map<String,Object>>();
		
		if(list1 != null){
			for(Map<String,Object> obj : list1){
				map1.put(String.valueOf(obj.get(ApiConstants.MONGO_ID)), obj);
			}
		}
		if(list2 != null){
			for(Map<String,Object> obj : list2){
				map2.put(String.valueOf(obj.get(ApiConstants.MONGO_ID)), obj);
			}
		}
		if(list3 != null){
			for(Map<String,Object> obj : list3){
				map3.put(String.valueOf(obj.get(ApiConstants.MONGO_ID)), obj);
			}
		}		
		for(String id : map1.keySet()){
			map1.get(id).putAll(map3.get(id));
			if(map2.get(id) != null){
				map1.get(id).putAll(map2.get(id));
			}else{
				map1.get(id).put(PurchaseBack.paCount, 0);
			}
			
		}
		params.put(PurchaseBack.eqcostList, list1);
	}	

	/**
	 * 备货申请：验证货物数量，计算申请总额
	 * @param params.scId params.eqcostList
	 * */
	public Map<String,Object> checkEqCountForBack(Map<String,Object> params) {
		
		//1. 获取上传的备货清单
		Map<String,Map<String,Object>> backEqMap = new HashMap<String,Map<String,Object>>();
		List<Map<String,Object>> backEqList = (List<Map<String,Object>>)params.get(PurchaseBack.eqcostList);
		if(backEqList != null){
			for(Map<String,Object> obj : backEqList){
				backEqMap.put(String.valueOf(obj.get(ApiConstants.MONGO_ID)), obj);
			}
		}
		
		//2. 获取合同剩余数量
		String scId = (String)params.get(PurchaseBack.scId);
		Map<String,Integer> scCountMap = countRestEqByScId(scId);
		
		//3. 获取合同下面的设备价格
		Map<String,Object> query = new HashMap<String,Object>();
		query.put(ApiConstants.MONGO_ID, new DBQuery(DBQueryOpertion.IN, new ArrayList<String>(backEqMap.keySet())));
		Map<String, Object> eqMap = dao.list(query, DBBean.EQ_COST);
		List<Map<String,Object>> eqList = (List<Map<String,Object>>)eqMap.get(ApiConstants.RESULTS_DATA);
		Map<String, Double> eqPriceMap = new HashMap<String, Double>();
		for(Map<String,Object> eq : eqList){
            if (eq.get(ApiConstants.MONGO_ID) != null) {
            	eqPriceMap.put(eq.get(ApiConstants.MONGO_ID).toString(), ApiUtil.getDouble(eq,EqCostListBean.EQ_LIST_BASE_PRICE, 0));
            }
		}
		
		Double money = 0.0;
		List<Map<String,Object>> itemList = new ArrayList<Map<String,Object>>();
		//3.1 检验货物有效性 ID 数量
		for(String id : backEqMap.keySet()){
			if(scCountMap.containsKey(id)){
				Double price = eqPriceMap.containsKey(id) ? eqPriceMap.get(id) : 0;
				Integer pbCount = ApiUtil.getInteger(backEqMap.get(id), PurchaseBack.pbTotalCount, 0);
				String comment =  (String)backEqMap.get(id).get(PurchaseBack.pbComment);
				
				if(pbCount > scCountMap.get(id)){
					throw new ApiResponseException(String.format("Save purchase back error [%s]", backEqMap.get(id)), ResponseCodeConstants.EQCOST_APPLY_ERROR); 
				}
				money += price*pbCount;
				Map<String,Object> item = new HashMap<String,Object>();
				item.put(ApiConstants.MONGO_ID, id);
				item.put(PurchaseBack.pbTotalCount, pbCount);
				item.put(PurchaseBack.pbComment, comment);
				itemList.add(item);
			}
		}
		Map<String,Object> result = new HashMap<String,Object>();
		result.put(PurchaseBack.eqcostList, itemList);
		result.put(PurchaseBack.pbMoney, money);
		return result;
	}
	
	/**
	 * 调拨申请申请：验证货物数量，计算申请总额
	 * @param params.pbId params.eqcostList
	 * */
	public Map<String,Object> checkEqCountForAllot(Map<String,Object> params) {
		
		//1. 获取上传的调拨设备清单
		List<Map<String,Object>> allotEqList = (List<Map<String,Object>>)params.get(PurchaseBack.eqcostList);
		Map<String,Map<String,Object>> allotEqMap = new HashMap<String,Map<String,Object>>();
		if(allotEqList != null){
			for(Map<String,Object> obj : allotEqList){
				allotEqMap.put(String.valueOf(obj.get(ApiConstants.MONGO_ID)), obj);
			}
		}
		
		//2. 获取备货剩余数量
		Map<String,Integer> backLeftCountMap = countRestEqByBackId((String)params.get(PurchaseBack.pbId));
		
		//3.1 检验货物有效性 ID 数量
		List<Map<String,Object>> itemList = new ArrayList<Map<String,Object>>();
		for(String id : allotEqMap.keySet()){
			if(backLeftCountMap.containsKey(id)){
				Integer count = ApiUtil.getInteger(allotEqMap.get(id), PurchaseBack.paCount, 0);
				String comment =  (String)allotEqMap.get(id).get(PurchaseBack.paComment);
				
				if(count > backLeftCountMap.get(id)){
					throw new ApiResponseException(String.format("Save purchase allot error [%s]", allotEqMap.get(id)), ResponseCodeConstants.EQCOST_APPLY_ERROR); 
				}
				Map<String,Object> item = new HashMap<String,Object>();
				item.put(ApiConstants.MONGO_ID, id);
				item.put(PurchaseBack.paCount, count);
				item.put(PurchaseBack.paComment, comment);
				itemList.add(item);
			}
		}
		Map<String,Object> result = new HashMap<String,Object>();
		result.put(PurchaseBack.eqcostList, itemList);
		return result;
	}
	
	
	//验证并记录申请货物清单列表，计算申请总额
	public Map<String,Object> updateEqCountForRequest(Map<String,Object> params) {
		
		//1. 获取合同清单
		Map<String, Object> eqMap = scs.listMergedEqListBySC(params);
		List<Map<String,Object>> contractEqList = (List<Map<String,Object>>)eqMap.get(ApiConstants.RESULTS_DATA);
		
		//2. 获取上传的备货清单
		List<Map<String,Object>> backEqList = (List<Map<String,Object>>)params.get(PurchaseBack.eqcostList);
		if(backEqList == null) backEqList = new ArrayList<Map<String,Object>>();//预防for异常
		Map<String,Map<String,Object>> contractEqMaps = new HashMap<String,Map<String,Object>>();
		Map<String,Map<String,Object>> backEqMap = new HashMap<String,Map<String,Object>>();
		
		for(Map<String,Object> obj : contractEqList){
			contractEqMaps.put(String.valueOf(obj.get(ApiConstants.MONGO_ID)), obj);
		}
		for(Map<String,Object> obj : backEqList){
			backEqMap.put(String.valueOf(obj.get(ApiConstants.MONGO_ID)), obj);
		}
		Double money = 0.0;
		List<Map<String,Object>> itemList = new ArrayList<Map<String,Object>>();
		//3.1 检验货物有效性 ID 数量
		for(String id : backEqMap.keySet()){
			if(contractEqMaps.get(id) != null){
				Double price = ApiUtil.getDouble(contractEqMaps.get(id), EqCostListBean.EQ_LIST_BASE_PRICE,0);				
				Double requestedTotalCount = ApiUtil.getDouble(backEqMap.get(id), PurchaseBack.pbTotalCount,0);
				String comment =  (String)backEqMap.get(id).get(PurchaseBack.pbComment);
				
//                Double leftCount = ApiUtil.getDouble(contractEqMaps.get(id), EqCostListBean.EQ_LIST_LEFT_AMOUNT,0);
//				if(requestedTotalCount > leftCount){
//					//throw new ApiResponseException("申请失败，请核实申请数量", ResponseCodeConstants.ADMIN_EDIT_DISABLED); 
//				}
				money += price*requestedTotalCount;
				Map<String,Object> item = new HashMap<String,Object>();
				item.put(ApiConstants.MONGO_ID, id);
				if(backEqMap.get(id).get(PurchaseBack.pbTotalCount) !=null){
				    item.put(PurchaseBack.pbTotalCount, requestedTotalCount);
				}
				
			    if(backEqMap.get(id).get(PurchaseBack.paCount) !=null){
                    item.put(PurchaseBack.paCount, ApiUtil.getDouble(backEqMap.get(id), PurchaseBack.paCount,0));
                }
				item.put(PurchaseBack.pbComment, comment);
				itemList.add(item);

			}
		}
		Map<String,Object> result = new HashMap<String,Object>();
		result.put(PurchaseBack.eqcostList, itemList);
		result.put(PurchaseBack.pbMoney, money);
		return result;
	}
	
	
	//验证并记录申请货物清单列表，计算申请总额
    public void updateEqLeftCountInEqDB(Map<String, Object> params) {
        Map<String, Double> countMap = new HashMap<String, Double>();

        Map<String, Object> eqQuery = new HashMap<String, Object>();
        eqQuery.put(EqCostListBean.EQ_LIST_SC_ID, params.get(EqCostListBean.EQ_LIST_SC_ID));
        eqQuery.put(EqCostListBean.EQ_LIST_REAL_AMOUNT, new DBQuery(DBQueryOpertion.NOT_NULL));
        eqQuery.put(ApiConstants.LIMIT_KEYS, new String[] {});

        Map<String, Object> eqRequests = this.dao.list(eqQuery, DBBean.EQ_COST);
        List<Map<String, Object>> eqCostList = (List<Map<String, Object>>) eqRequests.get(ApiConstants.RESULTS_DATA);

        for (Map<String, Object> eq : eqCostList) {
            countMap.put(eq.get(ApiConstants.MONGO_ID).toString(), 0.0);
        }

        updateEqListCount(countMap, DBBean.PURCHASE_BACK, params.get(EqCostListBean.EQ_LIST_SC_ID));
        updateEqListCount(countMap, DBBean.PURCHASE_ALLOCATE, params.get(EqCostListBean.EQ_LIST_SC_ID));

        for (String id : countMap.keySet()) {
            Map<String, Object> eqcost = this.dao.findOne(ApiConstants.MONGO_ID, id, new String[] { EqCostListBean.EQ_LIST_LEFT_AMOUNT, EqCostListBean.EQ_LIST_REAL_AMOUNT },
                    DBBean.EQ_COST);
            eqcost.put(EqCostListBean.EQ_LIST_LEFT_AMOUNT, ApiUtil.getDouble(eqcost, EqCostListBean.EQ_LIST_REAL_AMOUNT, 0) - countMap.get(id));
            this.dao.updateById(eqcost, DBBean.EQ_COST);
        }

    }

    private void updateEqListCount(Map<String, Double> countMap, String db, Object scId) {

        Map<String, Object> backScQuery = new HashMap<String, Object>();
        backScQuery.put(EqCostListBean.EQ_LIST_SC_ID, scId);
        String[] status = new String[] { PurchaseStatus.submited.toString(), PurchaseStatus.approved.toString() };
        
        if(db.equalsIgnoreCase(DBBean.PURCHASE_BACK)){
            backScQuery.put(PurchaseBack.pbStatus, new DBQuery(DBQueryOpertion.IN, status));

        }else{
            backScQuery.put(PurchaseBack.paStatus, new DBQuery(DBQueryOpertion.IN, status));

        }

        Map<String, Object> backRequests = this.dao.list(backScQuery, db);
        List<Map<String, Object>> backRequestList = (List<Map<String, Object>>) backRequests.get(ApiConstants.RESULTS_DATA);

        for (Map<String, Object> backRequest : backRequestList) {
            List<Map<String, Object>> backEqList = (List<Map<String, Object>>) backRequest.get(PurchaseBack.eqcostList);
            for (Map<String, Object> eqItem : backEqList) {
                String id = eqItem.get(ApiConstants.MONGO_ID).toString();
                String key = PurchaseBack.pbTotalCount;
                if(db.equalsIgnoreCase(DBBean.PURCHASE_ALLOCATE)){
                    key = PurchaseBack.paCount;
                }
                if (countMap.get(id) == null) {
                    countMap.put(id, ApiUtil.getDouble(eqItem, key, 0));
                } else {
                    countMap.put(id, countMap.get(id) + ApiUtil.getDouble(eqItem, key, 0));
                }
            }
        }
    }
	

	
	/**{_id:allotCount}*/
	public Map<String,Double> getAllotEqCountBySalesContractId(String saleId){
		Map<String,Double> result = new HashMap<String,Double>(); 
		Map<String, Object> query = new HashMap<String, Object>();
		query.put(PurchaseBack.scId, saleId);
		query.put(PurchaseBack.paStatus, PurchaseStatus.approved.toString());
		query.put(ApiConstants.LIMIT_KEYS, new String[]{PurchaseBack.eqcostList});
		Map<String,Object> map = dao.list(query, DBBean.PURCHASE_ALLOCATE);
		List<Map<String,Object>> list = (List<Map<String,Object>>)map.get(ApiConstants.RESULTS_DATA);
		for(Map<String,Object> obj : list){
			List<Map<String,Object>> eqList = (List<Map<String,Object>>)obj.get(PurchaseBack.eqcostList);
			for(Map<String,Object> eq : eqList){
				String key = (String)eq.get(ApiConstants.MONGO_ID);
				Double value = ApiUtil.getDouble(eq, PurchaseBack.paCount,0);
				if(result.containsKey(key)){
					result.put(key, result.get(key)+value);
				}else{
					result.put(key, value);
				}
			}
		}
		return result;
	}
	
    @Override
	public Map<String, Double> getBackEqCountBySalesContractId(String saleId) {
		Map<String,Double> result = new HashMap<String,Double>(); 
		Map<String, Object> query = new HashMap<String, Object>();
		query.put(PurchaseBack.scId, saleId);
		query.put(PurchaseBack.pbStatus, PurchaseStatus.approved.toString());
		query.put(ApiConstants.LIMIT_KEYS, new String[]{PurchaseBack.eqcostList});
		
		List<Object> list = dao.listLimitKeyValues(query, DBBean.PURCHASE_ALLOCATE);
		for(Object obj : list){
			Map<String, Double> eqMap = (Map<String, Double>)obj;
			for(Map.Entry<String, Double> entry: eqMap.entrySet()){
				String key = entry.getKey();
				Double value = entry.getValue();
				if(result.containsKey(key)){
					result.put(key, result.get(key)+value);
				}else{
					result.put(key, value);
				}
			}
		}
		return result;
	}
    
    @Override
    public Map<String, Object> listSCsForSelect(Map<String, Object> params) {
  
        
        Map<String,Object> query = new HashMap<String,Object>();
        query.put(ApiConstants.LIMIT_KEYS, new String[]{SalesContractBean.SC_CODE, SalesContractBean.SC_PROJECT_ID});
        query.put(SalesContractBean.SC_RUNNING_STATUS, SalesContractBean.SC_RUNNING_STATUS_RUNNING);
        
        Map<String, Object> purQuery = new HashMap<String, Object>();
        purQuery.put(ApiConstants.LIMIT_KEYS, ApiConstants.MONGO_ID);        
        query.put(ApiConstants.MONGO_ID, new DBQuery(DBQueryOpertion.NOT_IN , dao.listLimitKeyValues(purQuery, DBBean.PURCHASE_BACK)));
        
        Map<String, Object> projectQuery = new HashMap<String, Object>();
        projectQuery.put(ApiConstants.LIMIT_KEYS,ProjectBean.PROJECT_NAME);
        
        Map<String, Object> projects = this.dao.listToOneMapAndIdAsKey(projectQuery,DBBean.PROJECT);
        Map<String, Object>  scResults = dao.list(query, DBBean.SALES_CONTRACT);
        List<Map<String, Object>> scList = (List<Map<String, Object>>) scResults.get(ApiConstants.RESULTS_DATA);
        for (Map<String, Object> item : scList){
            Map<String, Object> project = (Map<String, Object>) projects.get(item.get(SalesContractBean.SC_PROJECT_ID));
            item.put(ProjectBean.PROJECT_NAME, project.get(ProjectBean.PROJECT_NAME));
        }
        return scResults;
        
        
    }

	public enum PurchaseStatus {
    	unsaved,saved,submited,approved,rejected,interruption,senondApprove,finalApprove,done;
		@Override
		public String toString() {
			String value = "undefine";
			switch(this){
				case unsaved: value="未保存"; break;
				case saved: value="草稿"; break;
				case submited: value="已提交"; break;
				case approved: value="已批准"; break;
				case rejected: value="已拒绝"; break;
				case senondApprove: value="已库审"; break;
				case finalApprove: value="已终审"; break;
				case done: value="已完成"; break;
				case interruption: value="已中止"; break;
				default: break;
			}
			return value;
		}
    }
	

	@Override
	public String geValidatorFileName() {
		return "purchase";
	}
	
	/**整合备货的剩余数量： 备货剩余数量 = 备货数量 - 已调拨申请 - 已采购申请*/
    public Map<String, Object> mergeRestEqCount(Map<String, Object> back) {
        if (back.get(SalesContractBean.SC_EQ_LIST) == null) {
            back = dao.findOne(ApiConstants.MONGO_ID, back.get(ApiConstants.MONGO_ID), DBBean.PURCHASE_BACK);
        }
        List<Map<String, Object>> eqBackMapList = (List<Map<String, Object>>) back.get(SalesContractBean.SC_EQ_LIST);
        Map<String, Integer> restCountMap = countRestEqByBackId(back.get(ApiConstants.MONGO_ID).toString());
        for (Map<String, Object> eqMap : eqBackMapList) {
            eqMap.put(PurchaseBack.pbLeftCount, restCountMap.get(eqMap.get(ApiConstants.MONGO_ID)));
        }
        
        return back;
    }

    public Map<String, Integer> countEqByKey(Map<String, Object> query, String db, String queryKey, Map<String, Integer> count) {
        query.put(ApiConstants.LIMIT_KEYS, SalesContractBean.SC_EQ_LIST);
        List<Object> list = this.dao.listLimitKeyValues(query, db);
        Map<String, Integer> eqCountMap = new HashMap<String, Integer>();

        if(count != null){
            eqCountMap = count;
        }
        if (list != null) {
            for (Object obj : list) {
                if (obj != null) {
                    List<Map<String, Object>> eqlistMap = (List<Map<String, Object>>) obj;
                    for (Map<String, Object> eqMap : eqlistMap) {
                        if (eqCountMap.get(eqMap.get(ApiConstants.MONGO_ID).toString()) != null) {
                            eqCountMap.put(eqMap.get(ApiConstants.MONGO_ID).toString(), ApiUtil.getInteger(eqMap.get(queryKey), 0) + ApiUtil.getInteger(eqCountMap.get(eqMap.get(ApiConstants.MONGO_ID).toString()), 0));
                        } else {
                            eqCountMap.put(eqMap.get(ApiConstants.MONGO_ID).toString(), ApiUtil.getInteger(eqMap.get(queryKey), 0));
                        }
                    }
                }
            }
        }
        return eqCountMap;
    }
    
    /**查询某合同下面剩余的成本设备数量: 成本数量 - 备货总和**/
    public Map<String, Integer> countRestEqByScId(String scId) {
        // 获取成本设备清单
    	Map<String,Object> eqQuery = new HashMap<String,Object>();
    	eqQuery.put(EqCostListBean.EQ_LIST_SC_ID, scId);
		Map<String, Object> eqMap = scs.listMergedEqListBySC(eqQuery);
		List<Map<String,Object>> eqList = (List<Map<String,Object>>)eqMap.get(ApiConstants.RESULTS_DATA);
		
		Map<String, Integer> scEqCountMap = new HashMap<String, Integer>();
		for(Map<String,Object> eq : eqList){
            if (eq.get(ApiConstants.MONGO_ID) != null) {
            	scEqCountMap.put(eq.get(ApiConstants.MONGO_ID).toString(), ApiUtil.getInteger(eq,EqCostListBean.EQ_LIST_REAL_AMOUNT, 0));
            }
		}
		
        //获取总备货清单
        Map<String, Object> backQuery = new HashMap<String, Object>();
        backQuery.put(PurchaseBack.scId, scId);
        backQuery.put(PurchaseBack.pbStatus, PurchaseStatus.submited.toString());//TODO: other status        
        Map<String, Integer> backEqCountMap = countEqByKey(backQuery, DBBean.PURCHASE_BACK, PurchaseBack.pbTotalCount, null);
        // 计算剩余数量
        Map<String, Integer> restEqCount = new HashMap<String, Integer>();
        for (String id : scEqCountMap.keySet()) {
            int eqCount = 0;
            int pbCount = 0;
            if (scEqCountMap.get(id) != null) {
            	eqCount = scEqCountMap.get(id);
            }
            if (backEqCountMap.get(id) != null) {
            	pbCount = backEqCountMap.get(id);
            }
            restEqCount.put(id, eqCount - pbCount);
        }
        return restEqCount;
    }
    
    /**根据备货申请id查询此备货下面剩余的数量：备货数量 -已采购申请数量 - 已调拨数量*/
    public Map<String, Integer> countRestEqByBackId(String backId) {
        
        Map<String, Object> backQuery = new HashMap<String, Object>();
        backQuery.put(ApiConstants.MONGO_ID, backId);
        //备货申请下总数集合
        Map<String, Integer> backEqCountMap = countEqByKey(backQuery, DBBean.PURCHASE_BACK, PurchaseBack.pbTotalCount, null);

        // 获取已发的采购申请的数据总和
        Map<String, Object> purchaseRequestQuery = new HashMap<String, Object>();
        purchaseRequestQuery.put(PurchaseCommonBean.BACK_REQUEST_ID, backId);
//        purchaseRequestQuery.put(PurchaseCommonBean.PROCESS_STATUS, new DBQuery(DBQueryOpertion.NOT_EQUALS, PurchaseCommonBean.STATUS_CANCELLED));
        Map<String, Integer> requestEqCountMap = countEqByKey(purchaseRequestQuery, DBBean.PURCHASE_REQUEST, PurchaseCommonBean.EQCOST_APPLY_AMOUNT, null);

        // 获取已调拨+调拨中的数据总和
        Map<String, Object> allocateQuery = new HashMap<String, Object>();
        allocateQuery.put(PurchaseBack.pbId, backId);
        Map<String, Integer> allocatEqCountMap = countEqByKey(allocateQuery, DBBean.PURCHASE_ALLOCATE, PurchaseBack.paCount, null);

        // 计算剩余数量
        Map<String, Integer> restEqCount = new HashMap<String, Integer>();

        for (String id : backEqCountMap.keySet()) {
            int prCount = 0;
            int paCount = 0;
            if (requestEqCountMap.get(id) != null) {
                prCount = requestEqCountMap.get(id);
            }
            if (allocatEqCountMap.get(id) != null) {
                paCount = allocatEqCountMap.get(id);
            }

            restEqCount.put(id, backEqCountMap.get(id) - prCount - paCount);
        }

        return restEqCount;
    }
	
}
