package com.pms.service.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.pms.service.dbhelper.DBQuery;
import com.pms.service.dbhelper.DBQueryOpertion;
import com.pms.service.exception.ApiResponseException;
import com.pms.service.mockbean.ApiConstants;
import com.pms.service.mockbean.ArrivalNoticeBean;
import com.pms.service.mockbean.CustomerBean;
import com.pms.service.mockbean.DBBean;
import com.pms.service.mockbean.GroupBean;
import com.pms.service.mockbean.InvoiceBean;
import com.pms.service.mockbean.MoneyBean;
import com.pms.service.mockbean.ProjectBean;
import com.pms.service.mockbean.PurchaseBack;
import com.pms.service.mockbean.PurchaseCommonBean;
import com.pms.service.mockbean.PurchaseRequest;
import com.pms.service.mockbean.RoleBean;
import com.pms.service.mockbean.SalesContractBean;
import com.pms.service.mockbean.ShipBean;
import com.pms.service.mockbean.UserBean;
import com.pms.service.service.AbstractService;
import com.pms.service.service.IArrivalNoticeService;
import com.pms.service.service.IPurchaseContractService;
import com.pms.service.service.IPurchaseService;
import com.pms.service.service.ISupplierService;
import com.pms.service.util.ApiUtil;
import com.pms.service.util.DateUtil;
import com.pms.service.util.EmailUtil;
import com.pms.service.util.status.ResponseCodeConstants;

public class PurchaseContractServiceImpl extends AbstractService implements IPurchaseContractService {

    private static final String PURCHASE_ORDER_ID = "purchaseOrderId";
    private static final String APPROVED = PurchaseRequest.STATUS_APPROVED;
    private static final Logger logger = LogManager.getLogger(PurchaseContractServiceImpl.class);

    private IPurchaseService backService;
    
    private ISupplierService supplierService;
    
    private IArrivalNoticeService arriveService;    

    public IArrivalNoticeService getArriveService() {
        return arriveService;
    }

    public void setArriveService(IArrivalNoticeService arriveService) {
        this.arriveService = arriveService;
    }

    public ISupplierService getSupplierService() {
        return supplierService;
    }

    public void setSupplierService(ISupplierService supplierService) {
        this.supplierService = supplierService;
    }

    @Override
    public String geValidatorFileName() {
        return null;
    }
    
    public Map<String, Object> getPurchaseBack(Map<String, Object> parameters){
        Map<String, Object> results = backService.loadBack(parameters);
        backService.mergeBackRestEqCount(results);
        removeEmptyEqList(results, "pbLeftCount");
        
        return results;
    }


    @Override
    public Map<String, Object> listPurchaseContracts(Map<String, Object> parameters) {    
        mergeMyTaskQuery(parameters, DBBean.PURCHASE_CONTRACT);
        Map<String, Object> results = dao.list(parameters, DBBean.PURCHASE_CONTRACT);
        supplierService.mergeSupplierInfo(results, "supplier", new String[]{"supplierName"});
        return results;
    }

    //非直发入库中选择项目信息，入库到同方自己的仓库的项目
    public Map<String, Object> listProjectsFromApproveContractsForRepositorySelect(Map<String, Object> parameters) {
        Map<String, Object> query = new HashMap<String, Object>();
        query.put(PurchaseCommonBean.PROCESS_STATUS, PurchaseCommonBean.STATUS_APPROVED);
        if (parameters.get("type") != null && parameters.get("type") .toString().equalsIgnoreCase("out")) {
            query.put("eqcostDeliveryType", PurchaseCommonBean.EQCOST_DELIVERY_TYPE_DIRECTY);
        } else {
            query.put("eqcostDeliveryType", PurchaseCommonBean.EQCOST_DELIVERY_TYPE_REPOSITORY);
        }
        query.put(ApiConstants.LIMIT_KEYS, new String[] { "eqcostList.projectId", "supplier" });
        Map<String, Object> results = dao.list(query, DBBean.PURCHASE_CONTRACT);

        List<Map<String, Object>> contractList = (List<Map<String, Object>>) results.get(ApiConstants.RESULTS_DATA);
        Set<String> projectIds = new HashSet<String>();
        Map<String, Set<String>> projectSupplierMap = new HashMap<String, Set<String>>();

        for (Map<String, Object> contract : contractList) {
            List<Map<String, Object>> eqCostList = (List<Map<String, Object>>) contract.get("eqcostList");
            for (Map<String, Object> p : eqCostList) {
                String projectId = p.get("projectId").toString();
                projectIds.add(projectId);
                if (projectSupplierMap.get(projectId) == null) {
                    projectSupplierMap.put(projectId, new HashSet<String>());
                }
                projectSupplierMap.get(projectId).add(contract.get("supplier").toString());
            }
        }

        Map<String, Object> projectQuery = new HashMap<String, Object>();
        projectQuery.put(ApiConstants.MONGO_ID, new DBQuery(DBQueryOpertion.IN, projectIds));
        projectQuery.put(ApiConstants.LIMIT_KEYS, ProjectBean.PROJECT_NAME);

        Map<String, Object> projects = this.dao.list(projectQuery, DBBean.PROJECT);

        List<Map<String, Object>> projectList = (List<Map<String, Object>>) projects.get(ApiConstants.RESULTS_DATA);

        for (Map<String, Object> project : projectList) {
            String id = project.get(ApiConstants.MONGO_ID).toString();
            Set<String> suppliers = projectSupplierMap.get(id);
            List<Map<String, Object>> suppliersMap = new ArrayList<Map<String, Object>>();
            for (String supplierId : suppliers) {
                Map<String, Object> supp = new HashMap<String, Object>();
                supp.put(ApiConstants.MONGO_ID, supplierId);
                suppliersMap.add(supp);
            }

            Map<String, Object> supplierMap = new HashMap<String, Object>();
            supplierMap.put(ApiConstants.RESULTS_DATA, suppliersMap);
            supplierService.mergeSupplierInfo(supplierMap, ApiConstants.MONGO_ID, new String[] { "supplierName" });

            project.put("suppliers", supplierMap.get(ApiConstants.RESULTS_DATA));
        }

        return projects;
    }


    public Map<String, Object> listSalesContractsForShipSelect(Map<String, Object> params) {

        Map<String, Object> query = new HashMap<String, Object>();
        // query.put(PurchaseCommonBean.PROCESS_STATUS, PurchaseCommonBean.STATUS_OUT_REPOSITORY);
        query.put(ApiConstants.LIMIT_KEYS, new String[] { "eqcostList.scId", "eqcostList.projectId" });
        Set<Object> scIdsList = new HashSet();

        String type = (String)params.get("type");
        
        if("1".equalsIgnoreCase(type)){
            query.put("type", "in");
        }else{
            query.put("type", "out");
        }

        List<Object> scResults = this.dao.listLimitKeyValues(query, DBBean.REPOSITORY);

        // 2个LIMIT_KEYS字段以上是返回的list中的对象是MAP
        for (Object sc : scResults) {
            Map<String, Object> scMap = (Map<String, Object>) sc;
            List<Map<String, Object>> list = (List<Map<String, Object>>) scMap.get(SalesContractBean.SC_EQ_LIST);
            for (Map<String, Object> eqsc : list) {
                scIdsList.add(eqsc.get(SalesContractBean.SC_ID));
            }

        }

        Map<String, Object> scQuery = new HashMap<String, Object>();
        scQuery.put(ApiConstants.MONGO_ID, new DBQuery(DBQueryOpertion.IN, new ArrayList<Object>(scIdsList)));
        scQuery.put(ApiConstants.LIMIT_KEYS, new String[] { SalesContractBean.SC_CODE, SalesContractBean.SC_PROJECT_ID, SalesContractBean.SC_TYPE });
        Map<String, Object> scList = this.dao.list(scQuery, DBBean.SALES_CONTRACT);

        Map<String, Object> customers = this.dao.listToOneMapAndIdAsKey(null, DBBean.CUSTOMER);
        Map<String, Object> projects = this.dao.listToOneMapAndIdAsKey(null, DBBean.PROJECT);

        List<Map<String, Object>> scListItems = (List<Map<String, Object>>) scList.get(ApiConstants.RESULTS_DATA);

        for (Map<String, Object> scMap : scListItems) {
            Map<String, Object> project = (Map<String, Object>) projects.get(scMap.get(SalesContractBean.SC_PROJECT_ID));

            scMap.put(ProjectBean.PROJECT_NAME, project.get(ProjectBean.PROJECT_NAME));
            scMap.put(SalesContractBean.SC_PROJECT_ID, project.get(ApiConstants.MONGO_ID));

            Map<String, Object> customer = (Map<String, Object>) customers.get(project.get(ProjectBean.PROJECT_CUSTOMER));
            scMap.put("customerName", customer.get(CustomerBean.NAME));
            scMap.put(SalesContractBean.SC_CUSTOMER_ID, project.get(ProjectBean.PROJECT_CUSTOMER));

        }

        return scList;

    }

    //非直发入库
    public Map<String, Object> listContractsByProjectAndSupplier(Map<String, Object> params) {
        Map<String, Object> query = new HashMap<String, Object>();
        Object projectId = params.get("projectId");
        query.put("eqcostList.projectId", projectId);
        query.put("supplier", params.get("supplier"));
        
        if (params.get("type") != null && params.get("type") .toString().equalsIgnoreCase("out")) {
            query.put("eqcostDeliveryType", PurchaseCommonBean.EQCOST_DELIVERY_TYPE_DIRECTY);
        }else{
            query.put("eqcostDeliveryType", PurchaseCommonBean.EQCOST_DELIVERY_TYPE_REPOSITORY);
            params.put("type", "in");
        }
        query.put(PurchaseCommonBean.PROCESS_STATUS, PurchaseCommonBean.STATUS_APPROVED);

        Map<String, Object> results = this.dao.list(query, DBBean.PURCHASE_CONTRACT);
        List<Map<String, Object>> list = (List<Map<String, Object>>) results.get(ApiConstants.RESULTS_DATA);

        List<Map<String, Object>> eqclist = new ArrayList<Map<String, Object>>();

        for (Map<String, Object> data : list) {
            List<Map<String, Object>> pList = (List<Map<String, Object>>) data.get("eqcostList");

            for (Map<String, Object> p : pList) {
                if (p.get("projectId").equals(projectId)) {
                    eqclist.add(p);
                }
            }
        }

        Map<String, Object> requery = new HashMap<String, Object>();
        requery.put(SalesContractBean.SC_PROJECT_ID, projectId);
        requery.put("supplierId", params.get("supplier"));
        requery.put("type", params.get("type"));
        Map<String, Integer> eqCountMap = countEqByKey(requery, DBBean.REPOSITORY, "eqcostApplyAmount", null);

        Map<String, Object> lresult = new HashMap<String, Object>();
        lresult.put("data", scs.mergeEqListBasicInfo(eqclist));

        List<Map<String, Object>> eqBackMapList = (List<Map<String, Object>>) lresult.get("data");
        for (Map<String, Object> eqMap : eqBackMapList) {
            int prCount = 0;
            if (eqMap.get("eqcostApplyAmount") != null) {
                prCount = ApiUtil.getInteger(eqMap.get("eqcostApplyAmount"), 0);
            }

            if (eqCountMap.get(eqMap.get(ApiConstants.MONGO_ID)) != null) {
                eqMap.put("leftCount", prCount - eqCountMap.get(eqMap.get(ApiConstants.MONGO_ID)));
                eqMap.put("eqcostApplyAmount", prCount - eqCountMap.get(eqMap.get(ApiConstants.MONGO_ID)));
            } else {
                eqMap.put("leftCount", prCount);
                eqMap.put("eqcostApplyAmount", prCount);
            }
        }

        return lresult;

    }


    public List<Map<String, Object>> listApprovedPurchaseContractCosts(String salesContractId) {

        Map<String, Object> query = new HashMap<String, Object>();
        query.put("eqcostList.scId", salesContractId);
        query.put(PurchaseCommonBean.PROCESS_STATUS, PurchaseCommonBean.STATUS_APPROVED);
        query.put(ApiConstants.LIMIT_KEYS, new String[] { SalesContractBean.SC_EQ_LIST });

        Map<String, Object> results = this.dao.list(query, DBBean.PURCHASE_CONTRACT);
        List<Map<String, Object>> list = (List<Map<String, Object>>) results.get(ApiConstants.RESULTS_DATA);

        List<Map<String, Object>> eqclist = new ArrayList<Map<String, Object>>();

        if (list != null) {
            for (Map<String, Object> data : list) {
                List<Map<String, Object>> pList = (List<Map<String, Object>>) data.get("eqcostList");

                for (Map<String, Object> p : pList) {
                    if (p.get("scId").equals(salesContractId)) {
                        eqclist.add(p);
                    }
                }
            }
        }
        
        return scs.mergeEqListBasicInfo(eqclist);

    }

    public Map<String, Object> getPurchaseContract(Map<String, Object> parameters) {
        Map<String, Object>  result = this.dao.findOne(ApiConstants.MONGO_ID, parameters.get(ApiConstants.MONGO_ID), DBBean.PURCHASE_CONTRACT);
        result.put(SalesContractBean.SC_EQ_LIST, scs.mergeEqListBasicInfo(result.get(SalesContractBean.SC_EQ_LIST)));
        return result;
    }

    @Override
    public void deletePurchaseContract(Map<String, Object> contract) {
        List<String> ids = new ArrayList<String>();
        ids.add(contract.get(ApiConstants.MONGO_ID).toString());
        dao.deleteByIds(ids, DBBean.PURCHASE_CONTRACT);

    }

    @Override
    public Map<String, Object> updatePurchaseContract(Map<String, Object> contract) {
        Object eqList = contract.get(SalesContractBean.SC_EQ_LIST);

        String keys[] = new String[] { "eqcostApplyAmount", "orderEqcostCode", "orderEqcostName", "orderEqcostModel", "eqcostProductUnitPrice", "purchaseOrderCode",
                "salesContractCode", PURCHASE_ORDER_ID, "logisticsType", "logisticsArrivedTime", "logisticsStatus" };
        contract.put(SalesContractBean.SC_EQ_LIST, mergeSavedEqList(keys, eqList));

        return updatePurchase(contract, DBBean.PURCHASE_CONTRACT);
    }

    @Override
    public Map<String, Object> listPurchaseOrders(Map<String, Object> parameters) {
        mergeDataRoleQuery(parameters);
        mergeMyTaskQuery(parameters, DBBean.PURCHASE_ORDER);
        Map<String, Object> results = dao.list(parameters, DBBean.PURCHASE_ORDER);
        List<Map<String, Object>> list = (List<Map<String, Object>>) results.get(ApiConstants.RESULTS_DATA);

        for (Map<String, Object> data : list) {
            mergeProjectInfo(data);
        }

        return results;

    }

    public Map<String, Object> listApprovedPurchaseOrderForSelect() {
        Map<String, Object> query = new HashMap<String, Object>();
        query.put(PurchaseCommonBean.EQCOST_DELIVERY_TYPE, PurchaseCommonBean.EQCOST_DELIVERY_TYPE_DIRECTY);
        Map<String, Object> directOrders =  listOrdersForSelect(query);
        Map<String, Object> repOrders =  listApprovedPurchaseOrderForRepositorySelect();
        Map<String, Object> resutls = new HashMap<String ,Object>();
        resutls.put("directly", directOrders.get(ApiConstants.RESULTS_DATA));
        resutls.put("repository", repOrders.get(ApiConstants.RESULTS_DATA));
        return resutls;
    }

    private Map<String, Object> listOrdersForSelect(Map<String, Object> query) {
        query.put(PurchaseRequest.PROCESS_STATUS, new DBQuery(DBQueryOpertion.IN, new String[]{PurchaseCommonBean.STATUS_SUBMITED, PurchaseCommonBean.STATUS_ORDERING}));
        Map<String, Object> results = dao.list(query, DBBean.PURCHASE_ORDER);
        List<Map<String, Object>> list = (List<Map<String, Object>>) results.get(ApiConstants.RESULTS_DATA);

        for (Map<String, Object> data : list) {
            mergeOrderRestEqCount(data);
        }
        
        List<Map<String, Object>> removedList = new ArrayList<Map<String, Object>>();
        for (Map<String, Object> data : list) {
            if(data.get("isEqEmpty")!=null){
                removedList.add(data);
            }
        }
        
        for (Map<String, Object> orderMap : removedList) {
            list.remove(orderMap);
        }
        
        for (Map<String, Object> data : list) {
            data.put(SalesContractBean.SC_EQ_LIST, scs.mergeEqListBasicInfo(data.get(SalesContractBean.SC_EQ_LIST)));
        }

        return results;
    }
    
    public Map<String, Object> listApprovedPurchaseOrderForRepositorySelect(){
        Map<String, Object> query = new HashMap<String, Object>();
        query.put(PurchaseCommonBean.EQCOST_DELIVERY_TYPE, PurchaseCommonBean.EQCOST_DELIVERY_TYPE_REPOSITORY);
        return listOrdersForSelect(query);
    }
    
    
    public Map<String, Object> mergeOrderRestEqCount(Map<String, Object> order) {
        if (order.get(SalesContractBean.SC_EQ_LIST) == null) {
            order = dao.findOne(ApiConstants.MONGO_ID, order.get(ApiConstants.MONGO_ID), DBBean.PURCHASE_ORDER);
        }
        List<Map<String, Object>> eqOrderMapList = (List<Map<String, Object>>) order.get(SalesContractBean.SC_EQ_LIST);
        
        
        Map<String, Object> orderQuery = new HashMap<String, Object>();
        orderQuery.put(ApiConstants.MONGO_ID, order.get(ApiConstants.MONGO_ID));
        //订单下总数集合
        Map<String, Integer> orderEqCountMap = countEqByKey(orderQuery, DBBean.PURCHASE_ORDER, "eqcostApplyAmount", null);
        
        Map<String, Object> eqQuery = new HashMap<String, Object>();
        eqQuery.put("eqcostList.purchaseOrderId", new DBQuery(DBQueryOpertion.IN, order.get(ApiConstants.MONGO_ID)));
        //只统计此订单下的同样的设备清单
        Map<String, Object> compareMap = new HashMap<String, Object>();
        compareMap.put("purchaseOrderId", order.get(ApiConstants.MONGO_ID));
        Map<String, Integer> contractCountMap = countEqByKey(eqQuery,  DBBean.PURCHASE_CONTRACT, "eqcostApplyAmount", null, compareMap);
        
        
        //过滤掉申请小于等于0的订单
        //TODO： 也许需要支持采购合同里面可以编辑每次采购多少
        List<Map<String, Object>> removedList = new ArrayList<Map<String, Object>>();
        
        for (String key : orderEqCountMap.keySet()) {
            if (contractCountMap.get(key) != null && contractCountMap.get(key) >= orderEqCountMap.get(key)) {
                for (Map<String, Object> eqMap : eqOrderMapList) {
                    if (eqMap.get(ApiConstants.MONGO_ID).equals(key)) {
                        removedList.add(eqMap);
                        break;
                    }
                }
            }
        }
        
        for (Map<String, Object> eqMap : removedList) {
            eqOrderMapList.remove(eqMap);
        }
        
        if(eqOrderMapList.isEmpty()){
            order.put("isEqEmpty", eqOrderMapList.isEmpty());
        }

        return order;
    }
    
    

    @Override
    public void deletePurchaseOrder(Map<String, Object> contract) {
        List<String> ids = new ArrayList<String>();
        ids.add(contract.get(ApiConstants.MONGO_ID).toString());
        dao.deleteByIds(ids, DBBean.PURCHASE_ORDER);

    }

    @Override
    public Map<String, Object> updatePurchaseOrder(Map<String, Object> parameters) {
        PurchaseRequest request = (PurchaseRequest) new PurchaseRequest().toEntity(parameters);
        Object eqList = parameters.get(SalesContractBean.SC_EQ_LIST);

        if (ApiUtil.isEmpty(parameters.get(ApiConstants.MONGO_ID))) {
            if (request.getStatus() == null) {
                request.setStatus(PurchaseRequest.STATUS_DRAFT);
            }
            request.setApprovedDate(null);
            request.setPurchaseOrderCode(generateCode("CGDD", DBBean.PURCHASE_ORDER));
            parameters = request.toMap();

        }
        
        String keys[] = new String[] { "eqcostApplyAmount", "orderEqcostCode", "orderEqcostName", "orderEqcostModel", "eqcostProductUnitPrice" };
        List<Map<String, Object>> mergeSavedEqList = mergeSavedEqList(keys, eqList);

        
        parameters.put(SalesContractBean.SC_EQ_LIST, mergeSavedEqList);


        Map<String, Object> order = updatePurchase(parameters, DBBean.PURCHASE_ORDER);

        //发采购订单后 采购申请状态为采购中
        Map<String, Object> prequest = this.dao.findOne(ApiConstants.MONGO_ID, order.get(PurchaseCommonBean.PURCHASE_REQUEST_ID),
                new String[] { PurchaseCommonBean.PURCHASE_ORDER_ID, SalesContractBean.SC_EQ_LIST }, DBBean.PURCHASE_REQUEST);

        if (prequest != null) {
            prequest.put(PurchaseCommonBean.PURCHASE_ORDER_ID, order.get(ApiConstants.MONGO_ID));
            prequest.put(PurchaseCommonBean.PURCHASE_ORDER_CODE, order.get(PurchaseCommonBean.PURCHASE_ORDER_CODE));
            prequest.put(PurchaseCommonBean.PROCESS_STATUS, PurchaseCommonBean.STATUS_ORDERING);                   
            this.dao.updateById(prequest, DBBean.PURCHASE_REQUEST);
        }

        return order;
    }

    private List<Map<String, Object>> mergeSavedEqList(String keys[], Object eqList) {
        List<String> finalKeys = new ArrayList<String>();
        for (String key : keys) {
            finalKeys.add(key);
        }
        finalKeys.add(ApiConstants.MONGO_ID);
        finalKeys.add(SalesContractBean.SC_ID);
        finalKeys.add(SalesContractBean.SC_PROJECT_ID);
        finalKeys.add("eqcostBrand");
        finalKeys.add("remark");

        List<Map<String, Object>> orgin = (List<Map<String, Object>>) eqList;
        List<Map<String, Object>> maps = new ArrayList<Map<String, Object>>();

        for (Map<String, Object> old : orgin) {
            Map<String, Object> neq = new HashMap<String, Object>();
            for (String key : finalKeys) {
                neq.put(key, old.get(key));
            }
            maps.add(neq);
        }

        return maps;
    }


    public Map<String, Object> getPurchaseOrder(Map<String, Object> parameters) {
        Map<String, Object> result = this.dao.findOne(ApiConstants.MONGO_ID, parameters.get(ApiConstants.MONGO_ID), DBBean.PURCHASE_ORDER);
        List<Map<String, Object>> mergeLoadedEqList = scs.mergeEqListBasicInfo(result.get(SalesContractBean.SC_EQ_LIST));
        result.put(SalesContractBean.SC_EQ_LIST, mergeLoadedEqList);
        mergeProjectInfo(result);
        
        Map<String, Object> purchaseRequest =  this.dao.findOne(ApiConstants.MONGO_ID, result.get(PurchaseCommonBean.PURCHASE_REQUEST_ID), new String[]{SalesContractBean.SC_EQ_LIST}, DBBean.PURCHASE_REQUEST);

        List<Map<String, Object>> prEqList = (List<Map<String, Object>>) purchaseRequest.get(SalesContractBean.SC_EQ_LIST);

        for (Map<String, Object> orderEq : mergeLoadedEqList) {
            for (Map<String, Object> prEq : prEqList) {
                if (prEq.get(ApiConstants.MONGO_ID).equals(orderEq.get(ApiConstants.MONGO_ID))) {
                    orderEq.put("orderRequestCount", prEq.get(PurchaseCommonBean.EQCOST_APPLY_AMOUNT));
                    break;
                }
            }
        }
        
        
        return result;
    }

    public Map<String, Object> approvePurchaseContract(Map<String, Object> order) {
        Map<String, Object> result = processRequest(order, DBBean.PURCHASE_CONTRACT, APPROVED);

        Map<String, Object> contract = dao.findOne(ApiConstants.MONGO_ID, result.get(ApiConstants.MONGO_ID), new String[] { SalesContractBean.SC_EQ_LIST,
                PurchaseCommonBean.PURCHASE_CONTRACT_TYPE, PurchaseCommonBean.PURCHASE_CONTRACT_CODE, PurchaseCommonBean.CONTRACT_EXECUTE_CATE, PurchaseCommonBean.PURCHASE_CONTRACT_CODE,
                PurchaseCommonBean.EQCOST_DELIVERY_TYPE }, DBBean.PURCHASE_CONTRACT);

        updateOrderFinalStatus(contract);

        Map<String, Object> userQuery = new HashMap<String, Object>();
        userQuery.put(UserBean.GROUPS,
                new DBQuery(DBQueryOpertion.IN, this.dao.findOne(GroupBean.GROUP_NAME, GroupBean.DEPARTMENT_ASSISTANT_VALUE, DBBean.USER_GROUP).get(ApiConstants.MONGO_ID)));
        userQuery.put(ApiConstants.LIMIT_KEYS, UserBean.EMAIL);

        List<Object> emails = this.dao.listLimitKeyValues(userQuery, DBBean.USER);
        
        if (contract.get(PurchaseCommonBean.CONTRACT_EXECUTE_CATE) != null) {
            if (contract.get(PurchaseCommonBean.CONTRACT_EXECUTE_CATE).equals(PurchaseCommonBean.CONTRACT_EXECUTE_CATE_BEIJINGDAICAI)) {
                String subject = String.format("采购合同 - %s -审批通过", contract.get(PurchaseCommonBean.PURCHASE_CONTRACT_CODE));
                String content = String.format("采购合同 - %s -已审批通过, 附件为审批通过的设备清单,请到系统做入库处理", contract.get(PurchaseCommonBean.PURCHASE_CONTRACT_CODE));                
                EmailUtil.sendEqListEmails(subject, emails, content, contract.get(SalesContractBean.SC_EQ_LIST));
            }else if (contract.get(PurchaseCommonBean.CONTRACT_EXECUTE_CATE).equals(PurchaseCommonBean.CONTRACT_EXECUTE_BJ_REPO)) {
                createArriveNotice(contract);
                createAutoShip(contract);

                String subject = String.format("采购合同 - %s -审批通过", contract.get(PurchaseCommonBean.PURCHASE_CONTRACT_CODE));
                String content = String.format("采购合同 - %s -已审批通过, 附件为审批通过的设备清单, 系统已经自动生成发货通知,请填写完整信息后发货", contract.get(PurchaseCommonBean.PURCHASE_CONTRACT_CODE));                
                EmailUtil.sendEqListEmails(subject, emails, content, contract.get(SalesContractBean.SC_EQ_LIST));
                
                
            }else if (contract.get(PurchaseCommonBean.CONTRACT_EXECUTE_CATE).equals(PurchaseCommonBean.CONTRACT_EXECUTE_BJ_MAKE)) {
                String subject = String.format("采购合同 - %s -审批通过", contract.get(PurchaseCommonBean.PURCHASE_CONTRACT_CODE));
                String content = String.format("采购合同 - %s -已审批通过, 附件为审批通过的设备清单, 请到系统填写到货通知", contract.get(PurchaseCommonBean.PURCHASE_CONTRACT_CODE));                
                EmailUtil.sendEqListEmails(subject, emails, content, contract.get(SalesContractBean.SC_EQ_LIST));
            }
        }
        return result;
    }

    private void updateOrderFinalStatus(Map<String, Object> contract) {        
        List<Map<String, Object>> eqListMap = (List<Map<String, Object>>)contract.get(SalesContractBean.SC_EQ_LIST);

        Set<String> orderIds = new HashSet<String>();
        // 批准后更新订单状态
        for (Map<String, Object> eqMap : eqListMap) {
            String orderId = eqMap.get(PURCHASE_ORDER_ID).toString();
            orderIds.add(orderId);
            
            eqMap.put(PurchaseCommonBean.EQCOST_DELIVERY_TYPE, contract.get(PurchaseCommonBean.EQCOST_DELIVERY_TYPE));
            eqMap.put(PurchaseCommonBean.PURCHASE_CONTRACT_ID, contract.get(ApiConstants.MONGO_ID));
            eqMap.put(PurchaseCommonBean.PURCHASE_CONTRACT_CODE, contract.get(PurchaseCommonBean.PURCHASE_CONTRACT_CODE));   
            eqMap.put(PurchaseCommonBean.PURCHASE_CONTRACT_TYPE, contract.get(PurchaseCommonBean.PURCHASE_CONTRACT_TYPE));  
        }
        
        this.dao.updateById(contract, DBBean.PURCHASE_CONTRACT);

        Map<String, Object> query = new HashMap<String, Object>();
        query.put(SalesContractBean.SC_EQ_LIST + "." + PURCHASE_ORDER_ID, new DBQuery(DBQueryOpertion.IN, new ArrayList<String>(orderIds)));
        query.put(PurchaseCommonBean.PROCESS_STATUS, new DBQuery(DBQueryOpertion.IN, new String[] { PurchaseCommonBean.STATUS_APPROVED }));
        Map<String, Integer> eqCountMap = countEqByKey(query, DBBean.PURCHASE_CONTRACT, "eqcostApplyAmount", null);

        for (String orderId : orderIds) {
            int count = 0;
            Map<String, Object> orderQuery = new HashMap<String, Object>();
            orderQuery.put(ApiConstants.MONGO_ID, orderId);
            orderQuery.put(ApiConstants.LIMIT_KEYS, new String[]{SalesContractBean.SC_EQ_LIST, PurchaseCommonBean.EQCOST_DELIVERY_TYPE});
            // 最外层就一个数组, 数组下面才是设备清单
            Map<String, Object> orderMap = this.dao.findOneByQuery(orderQuery, DBBean.PURCHASE_ORDER);

            if (orderMap != null) {
                List<Map<String, Object>> orderEqlistMap = (List<Map<String, Object>>) orderMap.get(SalesContractBean.SC_EQ_LIST);

                for (Map<String, Object> eqOrderMap : orderEqlistMap) {
                    int orderCount = ApiUtil.getInteger(eqOrderMap.get("eqcostApplyAmount"), 0);
                    int countractCount = ApiUtil.getInteger(eqCountMap.get(eqOrderMap.get(ApiConstants.MONGO_ID)), 0);

                    if (countractCount >= orderCount) {
                        count++;
                    }

                    if(eqCountMap.get(eqOrderMap.get(ApiConstants.MONGO_ID))!=null){
                      //合并货物递送方式和订单等等信息到设备清单
                        eqOrderMap.put(PurchaseCommonBean.EQCOST_DELIVERY_TYPE, orderMap.get(PurchaseCommonBean.EQCOST_DELIVERY_TYPE));
                        eqOrderMap.put(PurchaseCommonBean.PURCHASE_ORDER_ID, orderMap.get(ApiConstants.MONGO_ID));
                        eqOrderMap.put(PurchaseCommonBean.PURCHASE_ORDER_CODE, orderMap.get(PurchaseCommonBean.PURCHASE_ORDER_CODE));
                        eqOrderMap.put(PurchaseCommonBean.PURCHASE_REQUEST_ID, orderMap.get(PurchaseCommonBean.PURCHASE_REQUEST_ID));
                        eqOrderMap.put(PurchaseCommonBean.PURCHASE_REQUEST_CODE, orderMap.get(PurchaseCommonBean.PURCHASE_REQUEST_CODE));
                        eqOrderMap.put(PurchaseCommonBean.PURCHASE_CONTRACT_ID, contract.get(ApiConstants.MONGO_ID));
                        eqOrderMap.put(PurchaseCommonBean.PURCHASE_CONTRACT_CODE, contract.get(PurchaseCommonBean.PURCHASE_CONTRACT_CODE));   
                        eqOrderMap.put(PurchaseCommonBean.PURCHASE_CONTRACT_TYPE, contract.get(PurchaseCommonBean.PURCHASE_CONTRACT_TYPE));  
                    }
                }
                
                orderMap.put(SalesContractBean.SC_EQ_LIST, orderEqlistMap);
                updatePurchase(orderMap, DBBean.PURCHASE_ORDER);

                if (count == orderEqlistMap.size()) {
                    Map<String, Object> ordeUpdate = new HashMap<String, Object>();
                    ordeUpdate.put(ApiConstants.MONGO_ID, orderId);
                    ordeUpdate.put(PurchaseCommonBean.PROCESS_STATUS, PurchaseCommonBean.STATUS_ORDER_FINISHED);
                    this.dao.updateById(ordeUpdate, DBBean.PURCHASE_ORDER);

                    Map<String, Object> order = this.dao.findOne(ApiConstants.MONGO_ID, orderId, new String[] { PurchaseCommonBean.PURCHASE_REQUEST_ID, PurchaseCommonBean.PURCHASE_ORDER_CODE }, DBBean.PURCHASE_ORDER);
                    if (order != null && order.get(PurchaseCommonBean.PURCHASE_REQUEST_ID) != null) {
                        Map<String, Object> purRequest = new HashMap<String, Object>();
                        purRequest.put(ApiConstants.MONGO_ID, order.get(PurchaseCommonBean.PURCHASE_REQUEST_ID));
                        purRequest.put(PurchaseCommonBean.PROCESS_STATUS, PurchaseCommonBean.STATUS_ORDER_FINISHED);
                        this.dao.updateById(ordeUpdate, DBBean.PURCHASE_REQUEST);

                    }

                } else {
                    Map<String, Object> ordeUpdate = new HashMap<String, Object>();
                    ordeUpdate.put(ApiConstants.MONGO_ID, orderId);
                    ordeUpdate.put(PurchaseCommonBean.PROCESS_STATUS, PurchaseCommonBean.STATUS_ORDERING);
                    this.dao.updateById(ordeUpdate, DBBean.PURCHASE_ORDER);
                }

            }

        }
    }


    public Map<String, Object> processRequest(Map<String, Object> request, String db, String status) {

        Map<String, Object> cc = dao.findOne(ApiConstants.MONGO_ID, request.get(ApiConstants.MONGO_ID), db);
        request.put(ApiConstants.MONGO_ID, cc.get(ApiConstants.MONGO_ID));
        request.put(PurchaseRequest.PROCESS_STATUS, status);
        request.put(PurchaseRequest.APPROVED_DATE, ApiUtil.formateDate(new Date(), "yyy-MM-dd"));

        return dao.updateById(request, db);

    }

    public Map<String, Object> rejectPurchaseContract(Map<String, Object> order) {
        return processRequest(order, DBBean.PURCHASE_CONTRACT, PurchaseRequest.STATUS_REJECTED);
    }

    public void approvePurchaseOrder(Map<String, Object> order) {
        // 此批准只批准中止申请
        processRequest(order, DBBean.PURCHASE_ORDER, PurchaseRequest.STATUS_CANCELLED);

        Map<String, Object> request = this.dao.findOne(ApiConstants.MONGO_ID, order.get(ApiConstants.MONGO_ID), new String[] { "purchaseRequestId" }, DBBean.PURCHASE_ORDER);
        if (request.get("purchaseRequestId") != null) {
            request.put(ApiConstants.MONGO_ID, request.get("purchaseRequestId"));
            cancelPurchaseRequest(request);
            approvePurchaseRequest(request);
        }

    }

    public Map<String, Object> rejectPurchaseOrder(Map<String, Object> order) {
        return processRequest(order, DBBean.PURCHASE_ORDER, PurchaseRequest.STATUS_REJECTED);
    }
    
    public Map<String, Object> cancelPurchaseOrder(Map<String, Object> request){
        return processRequest(request, DBBean.PURCHASE_ORDER, PurchaseRequest.STATUS_CANCELL_NEED_APPROVED);
    }

    /**
     * 
     * 选择已批准的备货申请，返回_id, pbCode, scCode 字段
     * 
     */
    public Map<String, Object> listBackRequestForSelect() {
        Map<String, Object> query = new HashMap<String, Object>();
//        query.put(PurchaseBack.pbStatus, PurchaseStatus.approved.toString());
        query.put(ApiConstants.LIMIT_KEYS, new String[] { PurchaseBack.pbCode, PurchaseBack.scCode });
        return dao.list(query, DBBean.PURCHASE_BACK);
    }

    public Map<String, Object> listPurchaseRequests(Map<String, Object> params) {

        mergeRefSearchQuery(params, "projectManager", "projectManager", UserBean.USER_NAME,  DBBean.USER);
        mergeRefSearchQuery(params, SalesContractBean.SC_PROJECT_ID, ProjectBean.PROJECT_NAME, ProjectBean.PROJECT_NAME, DBBean.PROJECT);
        
        if (params.get("approvePage") != null) {
            params.remove("approvePage");
            params.put(PurchaseRequest.PROCESS_STATUS, new DBQuery(DBQueryOpertion.NOT_IN, new String[] { PurchaseRequest.STATUS_DRAFT, PurchaseRequest.STATUS_CANCELLED }));
        }
        
        mergeMyTaskQuery(params, DBBean.PURCHASE_REQUEST);


        mergeDataRoleQuery(params);
        Map<String, Object> results = dao.list(params, DBBean.PURCHASE_REQUEST);
        List<Map<String, Object>> list = (List<Map<String, Object>>) results.get(ApiConstants.RESULTS_DATA);

        for (Map<String, Object> data : list) {
           mergeProjectInfo(data);
        }

        return results;
    }

    public void mergeProjectInfo(Map<String, Object> params) {

        // FIXME: code refine
        PurchaseCommonBean request = (PurchaseCommonBean) new PurchaseCommonBean().toEntity(params);

        Map<String, Object> project = dao.findOne(ApiConstants.MONGO_ID, request.getProjectId(), DBBean.PROJECT);

        if (project != null) {
            Map<String, Object> pmQuery = new HashMap<String, Object>();
            pmQuery.put(ApiConstants.LIMIT_KEYS, new String[] { UserBean.USER_NAME });
            pmQuery.put(ApiConstants.MONGO_ID, project.get(ProjectBean.PROJECT_MANAGER));

            Map<String, Object> pmData = dao.findOneByQuery(pmQuery, DBBean.USER);
            if(pmData!=null){
                project.put(ProjectBean.PROJECT_MANAGER, pmData.get(UserBean.USER_NAME));
            }

            String cId = (String) project.get(ProjectBean.PROJECT_CUSTOMER);

            Map<String, Object> customerQuery = new HashMap<String, Object>();
            customerQuery.put(ApiConstants.LIMIT_KEYS, new String[] { CustomerBean.NAME });
            customerQuery.put(ApiConstants.MONGO_ID, cId);
            Map<String, Object> customerData = dao.findOneByQuery(customerQuery, DBBean.CUSTOMER);

            project.put(ProjectBean.PROJECT_CUSTOMER, customerData.get(CustomerBean.NAME));

            params.put("customerName", project.get(ProjectBean.PROJECT_CUSTOMER));
            params.put("projectName", project.get("projectName"));
            params.put("projectManager", project.get("projectManager"));
            params.put("projectCode", project.get(ProjectBean.PROJECT_CODE));
        }

    }

    public Map<String, Object> listApprovedPurchaseRequestForSelect() {
        Map<String, Object> query = new HashMap<String, Object>();
        query.put(PurchaseCommonBean.PROCESS_STATUS, APPROVED);
        query.put(PurchaseCommonBean.PURCHASE_ORDER_ID, null);
        query.put(ApiConstants.LIMIT_KEYS, new String[] { "purchaseRequestCode" });
        return dao.list(query, DBBean.PURCHASE_REQUEST);
    }

    public Map<String, Object> updatePurchaseRequest(Map<String, Object> parameters) {
        PurchaseRequest request = (PurchaseRequest) new PurchaseRequest().toEntity(parameters);
        boolean adding = false;
        Map<String, Object> pcrequest = new HashMap<String, Object>();
        
        if (ApiUtil.isEmpty(parameters.get(ApiConstants.MONGO_ID))) {
            request.setPurchaseRequestCode(generateCode("CGSQ", DBBean.PURCHASE_ORDER));
            pcrequest = request.toMap();
            adding = true;
        }else{
            pcrequest.putAll(parameters);
        }
        String keys[] = new String[] { "eqcostApplyAmount", "orderEqcostCode", "orderEqcostName", "orderEqcostModel", "eqcostProductUnitPrice" };
        pcrequest.put(SalesContractBean.SC_EQ_LIST, mergeSavedEqList(keys, parameters.get(SalesContractBean.SC_EQ_LIST)));
        
        Map<String, Object> prequest = updatePurchase(pcrequest, DBBean.PURCHASE_REQUEST);

        if (adding) {
            updateRequestIdForBack(prequest);
        }
        return prequest;
    }
    
    

    private void updateRequestIdForBack(Map<String, Object> prequest) {
        Map<String, Object> back = this.dao.findOne(ApiConstants.MONGO_ID, prequest.get("backRequestId"), new String[] { PurchaseBack.prId }, DBBean.PURCHASE_BACK);
        back.put(PurchaseBack.prId, prequest.get(ApiConstants.MONGO_ID));
        this.dao.updateById(back, DBBean.PURCHASE_BACK);
    }
    
    

    public Map<String, Object> approvePurchaseRequest(Map<String, Object> request) {
        Map<String, Object> requestMap = this.dao.findOne(ApiConstants.MONGO_ID, request.get(ApiConstants.MONGO_ID), 
                new String[] { PurchaseCommonBean.PROCESS_STATUS }, DBBean.PURCHASE_REQUEST);      
        
//        if (requestMap.get(PurchaseCommonBean.PROCESS_STATUS) == null) {
//            return processRequest(request, DBBean.PURCHASE_REQUEST, PurchaseRequest.MANAGER_APPROVED);
//        }
//        if (requestMap.get(PurchaseCommonBean.PROCESS_STATUS).toString().equalsIgnoreCase(PurchaseCommonBean.MANAGER_APPROVED)) {
//            return processRequest(request, DBBean.PURCHASE_REQUEST, PurchaseRequest.STATUS_APPROVED);
//        } else
            
       if (requestMap.get(PurchaseCommonBean.PROCESS_STATUS).toString().equalsIgnoreCase(PurchaseCommonBean.STATUS_CANCELL_NEED_APPROVED)) {
           Map<String,Object> result = processRequest(request, DBBean.PURCHASE_REQUEST, PurchaseRequest.STATUS_CANCELLED); 
           reduceBackEqCount((String)request.get(ApiConstants.MONGO_ID));
           return result;
        } else {
            return processRequest(request, DBBean.PURCHASE_REQUEST, PurchaseCommonBean.STATUS_APPROVED);
        }
    }

    private void reduceBackEqCount(String id){
    	if(ApiUtil.isEmpty(id)) return;
    	Map<String, Object> request = dao.findOne(ApiConstants.MONGO_ID, id, DBBean.PURCHASE_REQUEST);
    	List<Map<String,Object>> list1 = (List<Map<String,Object>>) request.get(SalesContractBean.SC_EQ_LIST);
    	
    	String backId = (String)request.get(PurchaseCommonBean.BACK_REQUEST_ID);
    	Map<String, Object> back = dao.findOne(ApiConstants.MONGO_ID, backId, DBBean.PURCHASE_BACK);
    	List<Map<String,Object>> list2 = (List<Map<String,Object>>) back.get(SalesContractBean.SC_EQ_LIST);
    	
    	Map<String,Double> map1 = new HashMap<String,Double>();
    	for(Map<String,Object> eq : list1){
    		map1.put((String)eq.get(ApiConstants.MONGO_ID), ApiUtil.getDouble(eq, PurchaseCommonBean.EQCOST_APPLY_AMOUNT, 0));
    	}
    	
    	for(Map<String,Object> eq : list2){
    		String eqId = (String)eq.get(ApiConstants.MONGO_ID);
    		double backCount = ApiUtil.getDouble(eq, PurchaseBack.pbTotalCount, 0);
    		double reCount = map1.containsKey(eqId)? map1.get(eqId) : 0;
    		eq.put(PurchaseBack.pbTotalCount, backCount - reCount);
    	}
    	dao.updateById(back, DBBean.PURCHASE_BACK);
    }
    
    public Map<String, Object> cancelPurchaseRequest(Map<String, Object> request) {
        return processRequest(request, DBBean.PURCHASE_REQUEST, PurchaseRequest.STATUS_CANCELL_NEED_APPROVED);
    }
    

    public Map<String, Object> rejectPurchaseRequest(Map<String, Object> request) {
        return processRequest(request, DBBean.PURCHASE_REQUEST, PurchaseRequest.STATUS_REJECTED);
    }

    public Map<String, Object> getPurchaseRequest(Map<String, Object> parameters) {
        Map<String, Object> result = this.dao.findOne(ApiConstants.MONGO_ID, parameters.get(ApiConstants.MONGO_ID), DBBean.PURCHASE_REQUEST);
        List<Map<String, Object>> eqList = (List<Map<String, Object>>) result.get(SalesContractBean.SC_EQ_LIST);
        eqList = scs.mergeEqListBasicInfo(eqList);
        result.put(SalesContractBean.SC_EQ_LIST, eqList);
        mergeProjectInfo(result);
        Map<String, Object> backQuery = new HashMap<String, Object>();
        backQuery.put(ApiConstants.MONGO_ID, result.get(PurchaseCommonBean.BACK_REQUEST_ID));
        Map<String, Object> back = backService.mergeBackRestEqCount(backQuery);

        List<Map<String, Object>> backEqList = (List<Map<String, Object>>) back.get(SalesContractBean.SC_EQ_LIST);

        for (Map<String, Object> pr : eqList) {
            for (Map<String, Object> be : backEqList) {
                if (be.get(ApiConstants.MONGO_ID).equals(pr.get(ApiConstants.MONGO_ID))) {
                    pr.put(PurchaseBack.pbLeftCount, be.get(PurchaseBack.pbLeftCount));
                    pr.put(PurchaseBack.pbTotalCount, be.get(PurchaseBack.pbTotalCount));
                    break;
                }
            }
        }

        removeEmptyEqList(result, PurchaseBack.pbTotalCount);
        return result;
    }

    public void deletePurchaseRequest(Map<String, Object> order) {

    }

    public Map<String, Object> updatePurchase(Map<String, Object> parameters, String db) {

        if (parameters.get(PurchaseCommonBean.PROCESS_STATUS) == null) {
            parameters.put(PurchaseCommonBean.PROCESS_STATUS, PurchaseRequest.STATUS_DRAFT);
        }
        if (parameters.get(PurchaseCommonBean.SALES_COUNTRACT_ID) != null) {
            scs.mergeCommonFieldsFromSc(parameters, parameters.get(PurchaseCommonBean.SALES_COUNTRACT_ID));
        }
        if (parameters.get("requestedDate") == null && parameters.get(PurchaseCommonBean.PROCESS_STATUS) != null
                && parameters.get(PurchaseCommonBean.PROCESS_STATUS).toString().equalsIgnoreCase(PurchaseCommonBean.STATUS_NEW)) {
            parameters.put("requestedDate", DateUtil.getDateString(new Date()));
        }

        Map<String, Object> result = null;
        
        if (ApiUtil.isEmpty(parameters.get(ApiConstants.MONGO_ID))) {
            result = this.dao.add(parameters, db);
        } else {
            result = dao.updateById(parameters, db);
        }

        return result;
    }


    @Override
    public Map<String, Object> listRepositoryRequests(Map<String, Object> params) {
        mergeMyTaskQuery(params, DBBean.REPOSITORY);
        Map<String, Object> results = this.dao.list(params, DBBean.REPOSITORY);
        List<Map<String, Object>> list = (List<Map<String, Object>>) results.get(ApiConstants.RESULTS_DATA);

        Map<String, Object> query = new HashMap<String, Object>();
        query.put(ApiConstants.LIMIT_KEYS, "supplierName");

        Map<String, Object> suppliers = this.dao.listToOneMapAndIdAsKey(query, DBBean.SUPPLIER);

        for (Map<String, Object> data : list) {

            if (data.get("supplierId") != null) {
                Map<String, Object> supplier = (Map<String, Object>) suppliers.get(data.get("supplierId"));
                if (supplier != null) {
                    data.put("supplierName", supplier.get("supplierName"));
                }
            }

        }
        return results;
    }

    @Override
    public Map<String, Object> getRepositoryRequest(Map<String, Object> parameters) {
        Map<String, Object>  result = this.dao.findOne(ApiConstants.MONGO_ID, parameters.get(ApiConstants.MONGO_ID), DBBean.REPOSITORY);
        result.put(SalesContractBean.SC_EQ_LIST, scs.mergeEqListBasicInfo(result.get(SalesContractBean.SC_EQ_LIST)));
        return result;
    }

    @Override
    public void deleteRepositoryRequest(Map<String, Object> parserJsonParameters) {

    }

    @Override
    public Map<String, Object> updateRepositoryRequest(Map<String, Object> parameters) {
   
        String keys[] = new String[] { "eqcostApplyAmount", "orderEqcostCode", "orderEqcostName", "orderEqcostModel", "eqcostProductUnitPrice", "purchaseOrderCode",
                "salesContractCode", PURCHASE_ORDER_ID,  "purchaseRequestId", "purchaseRequestCode", 
                "eqcostDeliveryType", "logisticsArrivedTime", "logisticsStatus", "purchaseContractType", "purchaseContractCode", "purchaseContractId" };
        List<Map<String, Object>> mergeSavedEqList = mergeSavedEqList(keys, parameters.get("eqcostList"));
        
        double total = 0;
        for(Map<String, Object> eq: mergeSavedEqList){
            total += ApiUtil.getDouble(eq, "eqcostApplyAmount", 0);           
        }
        
        if(parameters.get(ApiConstants.MONGO_ID) == null){
            parameters.put("repositoryCode", generateCode("RKSQ", DBBean.REPOSITORY));
        }
        
        parameters.put("totalIn", (int)total);
        parameters.put(SalesContractBean.SC_EQ_LIST, mergeSavedEqList);
        
        return updatePurchase(parameters, DBBean.REPOSITORY);

    }

    @Override
    public Map<String, Object> approveRepositoryRequest(Map<String, Object> params) {
        
        if (params.get("type") != null && params.get("type").toString().equalsIgnoreCase("in")) {
            //入库仓库
            Map<String, Object> result = processRequest(params, DBBean.REPOSITORY, PurchaseRequest.STATUS_IN_REPOSITORY);
            
            
            Map<String, Object> repo = dao.findOne(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID), new String[] { SalesContractBean.SC_EQ_LIST },
                    DBBean.REPOSITORY);
            
            
            createArriveNotice(repo);                        
            return result;
        } else {
            //直发入库
            return processRequest(params, DBBean.REPOSITORY, PurchaseRequest.STATUS_IN_OUT_REPOSITORY);
        }
    }

    private void createArriveNotice(Map<String, Object> repo) {
        List<Map<String, Object>> eqListMap = (List<Map<String, Object>>)repo.get(SalesContractBean.SC_EQ_LIST);

        Map<String,  List<Map<String, Object>>> eqOrderListMap = new HashMap<String, List<Map<String, Object>>>();
        
        Set<String> orderIds = new HashSet<String>();
        // 批准后更新订单状态
        for (Map<String, Object> eqMap : eqListMap) {
            String orderId = eqMap.get(PURCHASE_ORDER_ID).toString();
            orderIds.add(orderId);

            if (eqOrderListMap.get(orderId) == null) {
                eqOrderListMap.put(orderId, new ArrayList<Map<String, Object>>());
            }

            eqMap.put(ArrivalNoticeBean.EQCOST_ARRIVAL_AMOUNT, eqMap.get(PurchaseCommonBean.EQCOST_APPLY_AMOUNT));
            List<Map<String, Object>> list = eqOrderListMap.get(orderId);
            list.add(eqMap);
            eqOrderListMap.put(orderId, list);
        }
        
        for (String orderId : orderIds) {
            Map<String, Object> arriveMap = new HashMap<String, Object>();
            arriveMap.put(ApiConstants.MONGO_ID, orderId);
            arriveMap.put(ArrivalNoticeBean.EQ_LIST, eqOrderListMap.get(orderId));
            arriveService.createByOrder(arriveMap);
        }
    }
    
    private void createAutoShip(Map<String, Object> repo) {
        List<Map<String, Object>> eqListMap = (List<Map<String, Object>>)repo.get(SalesContractBean.SC_EQ_LIST);

        Map<String,  List<Map<String, Object>>> qeListMap = new HashMap<String, List<Map<String, Object>>>();
        Map<String,Map<String, Object>> scMap = new HashMap<String, Map<String, Object>>();
        
        Set<String> scIds = new HashSet<String>();
        // 批准后更新订单状态
        for (Map<String, Object> eqMap : eqListMap) {
            String scId = eqMap.get(SalesContractBean.SC_ID).toString();
            scIds.add(scId);

            if (qeListMap.get(scId) == null) {
                qeListMap.put(scId, new ArrayList<Map<String, Object>>());
            }

            eqMap.put(ShipBean.EQCOST_SHIP_AMOUNT, eqMap.get(PurchaseCommonBean.EQCOST_APPLY_AMOUNT));
            List<Map<String, Object>> list = qeListMap.get(scId);
            list.add(eqMap);
            qeListMap.put(scId, list);
            
            scMap.put(scId, eqMap);
        }
        
        for (String scId : scIds) {
            Map<String, Object> ship = new HashMap<String, Object>();
            ship.put(ShipBean.SHIP_SALES_CONTRACT_CODE, scMap.get(scId).get(PurchaseCommonBean.SALES_CONTRACT_CODE));
            ship.put(ShipBean.SHIP_SALES_CONTRACT_ID, scMap.get(scId).get(SalesContractBean.SC_ID));
            ship.put(ShipBean.SHIP_PROJECT_ID, scMap.get(scId).get(SalesContractBean.SC_PROJECT_ID));
            ship.put(ShipBean.SHIP_STATUS, ShipBean.SHIP_STATUS_DRAFT);
            ship.put(ArrivalNoticeBean.EQ_LIST, qeListMap.get(scId));
            dao.add(ship, DBBean.SHIP);
            
        }
    }

    public Map<String, Object> listProjectsForRepositoryDirect(Map<String, Object> params) {
        
        Map<String, Object> query = new HashMap<String, Object>();
        query.put(PurchaseCommonBean.PROCESS_STATUS, PurchaseCommonBean.STATUS_APPROVED);      
        query.put("eqcostDeliveryType", PurchaseCommonBean.EQCOST_DELIVERY_TYPE_DIRECTY);
        query.put(ApiConstants.LIMIT_KEYS, new String[] { "eqcostList.scId", "eqcostList.projectId"});

        List<Object> projectIds = this.dao.listLimitKeyValues(query, DBBean.PURCHASE_CONTRACT);
        
        Set<String> proIds = new HashSet<String>();
        
        for(Object map : projectIds){
            Map<String, Object> eqMap = (HashMap<String, Object>) map;
            List<Map<String, Object>> eqListMap = (List<Map<String, Object>>) eqMap.get("eqcostList");
            for(Map<String, Object> eqItem: eqListMap){
                if(eqItem.get(SalesContractBean.SC_PROJECT_ID)!=null){
                    proIds.add(eqItem.get(SalesContractBean.SC_PROJECT_ID).toString());
                }
            }
        }
        
        Map<String, Object> pquery = new HashMap<String, Object>();
        pquery.put(ApiConstants.MONGO_ID, new DBQuery(DBQueryOpertion.IN, new ArrayList<>(proIds)));
        pquery.put(ApiConstants.LIMIT_KEYS, ProjectBean.PROJECT_NAME);

        return this.dao.list(pquery, DBBean.PROJECT);
    }

    @Override
    public Map<String, Object> rejectRepositoryRequest(Map<String, Object> parserJsonParameters) {
        return null;
    }

    public Map<String, Object> cancelRepositoryRequest(Map<String, Object> params) {
        return processRequest(params, DBBean.REPOSITORY, PurchaseRequest.STATUS_CANCELLED);
    }

    // 采购合同列表为付款
    public Map<String, Object> listSelectForPayment(Map<String, Object> params) {
        Map<String, Object> query = new HashMap<String, Object>();
        query.put(ApiConstants.LIMIT_KEYS, new String[] { "purchaseContractCode", "supplier" });
        Map<String, Object> results = dao.list(query, DBBean.PURCHASE_CONTRACT);
        
        List<Map<String, Object>> list =(List<Map<String, Object>>)results.get(ApiConstants.RESULTS_DATA); 
        
        Set<String> set = new HashSet<String>();
        for(Map<String, Object> obj : list){
        	set.add((String)obj.get("supplier"));
        }
        set.remove(null);set.remove("");
        Map<String,Object> query2 = new HashMap<String,Object>();
        query2.put(ApiConstants.MONGO_ID, new DBQuery(DBQueryOpertion.IN, new ArrayList(set)));
        Map<String,Object> suMap = dao.listToOneMapAndIdAsKey(query2, DBBean.SUPPLIER);
        
        for(Map<String, Object> obj : list){
        	String id = (String)obj.get("supplier");
        	if(suMap.containsKey(id)){
        		Map<String,Object> su = (Map)suMap.get(id);
        		obj.put("supplierName", su.get("supplierName"));
        		obj.put(MoneyBean.supplierBankName, su.get(MoneyBean.supplierBankName));
        		obj.put(MoneyBean.supplierBankAccount, su.get(MoneyBean.supplierBankAccount));
        	}
        }
        return results;
    }

    @Override
    public Map<String, Object> listPaymoney(Map<String, Object> params) {
		Map<String,Object> query = new HashMap<String,Object>();//
		if(params.get(InvoiceBean.purchaseContractId) != null){
			query.put(InvoiceBean.purchaseContractId, params.get(InvoiceBean.purchaseContractId));
		}
		query.put(ApiConstants.LIMIT, params.get(ApiConstants.LIMIT));
		query.put(ApiConstants.LIMIT_START, params.get(ApiConstants.LIMIT_START));
    	
        Map<String, Object> result = dao.list(query, DBBean.PAY_MONEY);
        mergeSupplierInfo(result);
        mergeCreatorInfo(result);
        return result;
    }
    
    private void mergeSupplierInfo(Map<String,Object> params){
        List<Map<String, Object>> list = (List<Map<String, Object>>) params.get(ApiConstants.RESULTS_DATA);

        Set<String> suIds = new HashSet<String>();
        for (Map<String, Object> obj : list) {
            suIds.add((String) obj.get(MoneyBean.supplierId));
        }
        suIds.remove(null);
        suIds.remove("");
        Map<String, Object> query = new HashMap<String, Object>();
        query.put(ApiConstants.MONGO_ID, new DBQuery(DBQueryOpertion.IN, new ArrayList(suIds)));
        Map<String, Object> map = dao.listToOneMapAndIdAsKey(query, DBBean.SUPPLIER);
        for (Map<String, Object> obj : list) {
            String id = (String) obj.get(MoneyBean.supplierId);
            if (map.get(id) != null) {
                Map<String, Object> su = (Map<String, Object>) map.get(id);
                obj.put("supplierName", su.get("supplierName"));
            }
        }
    }
    
    
    public Map<String, Object> savePaymoney(Map<String, Object> params) {
        Map<String, Object> obj = new HashMap<String, Object>();
        obj.put(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID));
        obj.put(MoneyBean.payMoneyActualMoney, ApiUtil.getDouble(params, MoneyBean.payMoneyActualMoney));
        obj.put(MoneyBean.payMoneyActualDate, params.get(MoneyBean.payMoneyActualDate));
        obj.put(MoneyBean.payMoneyComment, params.get(MoneyBean.payMoneyComment));
        obj.put(MoneyBean.supplierBankAccount, params.get(MoneyBean.supplierBankAccount));
        obj.put(MoneyBean.supplierBankName, params.get(MoneyBean.supplierBankName));
        
        String[] keys = new String[] { "supplier", "purchaseContractCode" };
        Map<String, Object> pc = dao.findOne("purchaseContractCode", params.get(MoneyBean.purchaseContractCode), keys,DBBean.PURCHASE_CONTRACT);
        if(pc == null) {
        	throw new ApiResponseException("采购合同不存在", params, "请输入正确合同编号");
        }
        obj.put(MoneyBean.purchaseContractCode, pc.get("purchaseContractCode"));
        obj.put(MoneyBean.purchaseContractId, pc.get(ApiConstants.MONGO_ID));
        obj.put(MoneyBean.supplierId, pc.get("supplier"));
        
        //如果供应商没有初始化 银行账号，则初始化
        Map<String,Object> supplier = dao.findOne(ApiConstants.MONGO_ID, pc.get("supplier"), DBBean.SUPPLIER);
        String cardName = (String)supplier.get(MoneyBean.supplierBankName);
        if(cardName == null || cardName.isEmpty()){
        	supplier.put(MoneyBean.supplierBankName, params.get(MoneyBean.supplierBankName));
        	supplier.put(MoneyBean.supplierBankAccount, params.get(MoneyBean.supplierBankAccount));
        	dao.updateById(supplier, DBBean.SUPPLIER);
        }
        
	    String oldComment = (String)dao.querySingleKeyById(MoneyBean.payMoneyComment, params.get(ApiConstants.MONGO_ID), DBBean.PAY_MONEY);
	    String comment = (String)params.get("tempComment");
	    comment = recordComment("提交",comment,oldComment);
	    obj.put("tempComment", params.get("tempComment"));
	    obj.put(MoneyBean.payMoneyComment, comment);
        return dao.save(obj, DBBean.PAY_MONEY);
    }

    @Override
    public void destoryPayMoney(Map<String, Object> params) {
        List<String> ids = new ArrayList<String>();
        ids.add(String.valueOf(params.get(ApiConstants.MONGO_ID)));
        dao.deleteByIds(ids, DBBean.PAY_MONEY);
    }
    
    @Override
    public Map<String, Object> listGetInvoice(Map<String, Object> params) {
        Map<String,Object> result = dao.list(params, DBBean.GET_INVOICE);
        mergeCreatorInfo(result);
        return result;
    }

    @Override
    public Map<String, Object> saveGetInvoice(Map<String, Object> params) {
    	Map<String,Object> invoice = new HashMap<String,Object>();
    	invoice.put(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID));
    	invoice.put(InvoiceBean.getInvoiceActualDate, params.get(InvoiceBean.getInvoiceActualDate));
    	invoice.put(InvoiceBean.getInvoiceActualInvoiceNum, params.get(InvoiceBean.getInvoiceActualInvoiceNum));
    	invoice.put(InvoiceBean.getInvoiceActualMoney, ApiUtil.getDouble(params, InvoiceBean.getInvoiceActualMoney, 0));
    	invoice.put(InvoiceBean.getInvoiceActualSheetCount, ApiUtil.getInteger(params, InvoiceBean.getInvoiceActualSheetCount, 0));
    	
    	invoice.put(InvoiceBean.getInvoiceReceivedMoneyStatus, params.get(InvoiceBean.getInvoiceReceivedMoneyStatus));
    	invoice.put(InvoiceBean.getInvoiceItemList, params.get(InvoiceBean.getInvoiceItemList));
		
		Map<String,Object> pc = dao.findOne(ApiConstants.MONGO_ID, params.get(InvoiceBean.purchaseContractId), new String[]{"purchaseContractCode","supplier","invoiceType"}, DBBean.PURCHASE_CONTRACT);
		invoice.put(InvoiceBean.purchaseContractId, pc.get(ApiConstants.MONGO_ID));
		invoice.put(InvoiceBean.purchaseContractCode, pc.get("purchaseContractCode"));
		invoice.put(InvoiceBean.invoiceType, pc.get("invoiceType"));
		invoice.put(InvoiceBean.getInvoiceSupplierId, pc.get("supplier"));
		
	    String oldComment = (String)dao.querySingleKeyById(InvoiceBean.getInvoiceComment, params.get(ApiConstants.MONGO_ID), DBBean.GET_INVOICE);
	    String comment = (String)params.get("tempComment");
	    comment = recordComment("提交",comment,oldComment);	
	    invoice.put(InvoiceBean.getInvoiceComment, comment);
        return dao.save(invoice, DBBean.GET_INVOICE);
    }

    @Override
	public Map<String, Object> viewPCForInvoice(Map<String, Object> params) {
    	String pcId = (String)params.get(InvoiceBean.purchaseContractId);
    	String[] keys = new String[]{"purchaseContractCode","requestedTotalMoney","purchaseContractType",
        		"eqcostDeliveryType","signDate","invoiceType","supplier"};
		Map<String,Object> pc = dao.findOne(ApiConstants.MONGO_ID, pcId, keys, DBBean.PURCHASE_CONTRACT);
        Map<String,Object> suppier = dao.findOne(ApiConstants.MONGO_ID, pc.get("supplier"), DBBean.SUPPLIER);
        suppier.remove(ApiConstants.MONGO_ID);
        pc.putAll(suppier);
		return pc;
	}

	@Override
    public Map<String, Object> prepareGetInvoice(Map<String, Object> params) {
		Map<String,Object> result = viewPCForInvoice(params);
		result.remove(ApiConstants.MONGO_ID);
		result.put(InvoiceBean.purchaseContractId, params.get(InvoiceBean.purchaseContractId));
		result.put(InvoiceBean.getInvoiceItemList, new ArrayList());
        return result;
    }

    @Override
    public Map<String, Object> loadGetInvoice(Map<String, Object> params) {
        Map<String,Object> invoice = dao.findOne(ApiConstants.MONGO_ID, params.get(ApiConstants.MONGO_ID), DBBean.GET_INVOICE);
        mergePcAndSupplierForInvoice(invoice);
        return invoice;
    }
    private void mergePcAndSupplierForInvoice(Map<String,Object> params){
        String[] keys = new String[]{"purchaseContractCode","requestedTotalMoney","purchaseContractType",
        		"eqcostDeliveryType","signDate","invoiceType","supplier"};
        Map<String, Object> pc = dao.findOne(ApiConstants.MONGO_ID,  params.get("purchaseContractId"),keys, DBBean.PURCHASE_CONTRACT);
        if(pc != null){
        	 Map<String, Object> supplier = dao.findOne(ApiConstants.MONGO_ID, pc.get("supplier"), DBBean.SUPPLIER);
        	 pc.remove(ApiConstants.MONGO_ID);
        	 params.putAll(pc);
        	 if(supplier != null){
        		 supplier.remove(ApiConstants.MONGO_ID);
        		 params.putAll(supplier);
        	 }
        }    	
    }
    @Override
    public Map<String, Object> updateGetInvoice(Map<String, Object> params) {
        return dao.updateById(params, DBBean.GET_INVOICE);
    }

    @Override
    public void destroyGetInvoice(Map<String, Object> params) {
        List<String> ids = new ArrayList<String>();
        ids.add(String.valueOf(params.get(ApiConstants.MONGO_ID)));
        dao.deleteByIds(ids, DBBean.GET_INVOICE);
    }

    public IPurchaseService getBackService() {
        return backService;
    }

    public void setBackService(IPurchaseService backService) {
        this.backService = backService;
    }

}
