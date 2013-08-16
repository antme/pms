package com.pms.service.controller;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.pms.service.annotation.LoginRequired;
import com.pms.service.annotation.RoleValidConstants;
import com.pms.service.annotation.RoleValidate;
import com.pms.service.service.IPurchaseContractService;

@RoleValidate
@LoginRequired
@Controller
@RequestMapping("/purcontract")
public class PurchaseContractController extends AbstractController {

    private IPurchaseContractService pService;

    @RequestMapping("/list")
    public void listPurchaseContracts(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.listPurchaseContracts(parserJsonParameters(request, false)), request, response);
    }
    
    //非直发采购数据
    @RequestMapping("/repository/contract/list")
    public void listProjectsFromApproveContractsForRepositorySelect(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.listProjectsAndSuppliersFromContractsForRepositorySelect(parserJsonParameters(request, true)), request, response);
    }

    @RequestMapping("/get/byproject_supplier")
    public void listContractsByProjectAndSupplier(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.listEqListByProjectAndSupplierForRepository(parserJsonParameters(request, false)), request, response);
    }
    
    
    @RequestMapping("/repository/select_sc_forship")
    public void listSalesContractsForShipSelect(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.listSalesContractsForShipSelect(parserJsonParameters(request, false)), request, response);
    }

    
    @RequestMapping("/back/load")
    public void getPurchaseBack(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.getPurchaseBack(parserJsonParameters(request, false)), request, response);
    }
    
    @RequestMapping("/get")
    public void getPurchaseContract(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.getPurchaseContract(parserJsonParameters(request, false)), request, response, "save_success");
    }

    @RequestMapping("/add")
    @RoleValidate(roleID=RoleValidConstants.PURCHASE_CONTRACT_MANAGEMENT, desc = RoleValidConstants.PURCHASE_CONTRACT_MANAGEMENT_DESC)
    public void addPurchaseContract(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.updatePurchaseContract(parserJsonParameters(request, false)), request, response, "save_success");
    }
    
    @RequestMapping("/po")
    @RoleValidate(roleID=RoleValidConstants.PURCHASE_CONTRACT_MANAGEMENT, desc = RoleValidConstants.PURCHASE_CONTRACT_MANAGEMENT_DESC)
    public void addPurchaseContractPo(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.updatePurchaseContractPo(parserJsonParameters(request, false)), request, response, "save_success");
    }
 
    @RequestMapping("/delete")
    @RoleValidate(roleID=RoleValidConstants.PURCHASE_CONTRACT_MANAGEMENT, desc = RoleValidConstants.PURCHASE_CONTRACT_MANAGEMENT_DESC)
    public void deletePurchaseContract(HttpServletRequest request, HttpServletResponse response) {
        pService.deletePurchaseContract(parserJsonParameters(request, false));
        responseWithData(null, request, response);
    }

    @RequestMapping("/update")
    @RoleValidate(roleID=RoleValidConstants.PURCHASE_CONTRACT_MANAGEMENT, desc = RoleValidConstants.PURCHASE_CONTRACT_MANAGEMENT_DESC)
    public void updatePurchaseContract(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.updatePurchaseContract(parserJsonParameters(request, false)), request, response, "save_success");
    }
    
    
    @RequestMapping("/approve")
    @RoleValidate(roleID=RoleValidConstants.PURCHASE_CONTRACT_PROCESS, desc = RoleValidConstants.PURCHASE_CONTRACT_PROCESS_DESC)
    public void approvePurchaseContract(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.approvePurchaseContract(parserJsonParameters(request, false)), request, response);
    }
    
    @RequestMapping("/reject")
    @RoleValidate(roleID=RoleValidConstants.PURCHASE_CONTRACT_PROCESS, desc = RoleValidConstants.PURCHASE_CONTRACT_PROCESS_DESC)
    public void rejectPurchaseContract(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.rejectPurchaseContract(parserJsonParameters(request, false)), request, response);
    }

    
    @RequestMapping("/back/select/list")
    public void listBackRequestForSelect(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.listBackRequestForSelect(), request, response);
    }
    
    
    @RequestMapping("/request/list")
    public void listPurchaseRequestByAssistant(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.listPurchaseRequests(parserJsonParameters(request, false)), request, response);
    }
    
    @RequestMapping("/request/add")
    @RoleValidate(roleID=RoleValidConstants.PURCHASE_REQUEST_MANAGEMENT, desc = RoleValidConstants.PURCHASE_REQUEST_MANAGEMENT_DESC)
    public void addPurchaseRequest(HttpServletRequest request, HttpServletResponse response) {
        pService.updatePurchaseRequest(parserJsonParameters(request, false));
        responseWithData(null, request, response, "save_success");
    }
    
    @RequestMapping("/request/select/list")
    public void listPurchaseRequestForSelect(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.listApprovedPurchaseRequestForSelect(), request, response);
    }
    
    @RequestMapping("/request/get")
    public void getPurchaseRequest(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.getPurchaseRequest(parserJsonParameters(request, false)), request, response);
    }

    @RequestMapping("/request/delete")
    @RoleValidate(roleID=RoleValidConstants.PURCHASE_REQUEST_MANAGEMENT, desc = RoleValidConstants.PURCHASE_REQUEST_MANAGEMENT_DESC)
    public void deletePurchaseRequest(HttpServletRequest request, HttpServletResponse response) {
        pService.deletePurchaseRequest(parserJsonParameters(request, false));
        responseWithData(null, request, response);
    }
    
    @RequestMapping("/request/update")
    @RoleValidate(roleID=RoleValidConstants.PURCHASE_REQUEST_MANAGEMENT, desc = RoleValidConstants.PURCHASE_REQUEST_MANAGEMENT_DESC)
    public void updatePurchaseRequest(HttpServletRequest request, HttpServletResponse response) {
        pService.updatePurchaseRequest(parserJsonParameters(request, false));
        responseWithData(null, request, response, "save_success");
    }
    
    @RequestMapping("/request/approve")
    @RoleValidate(roleID=RoleValidConstants.PURCHASE_REQUEST_PROCESS, desc = RoleValidConstants.PURCHASE_REQUEST_PROCESS_DESC)
    public void approvePurchaseRequest(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.approvePurchaseRequest(parserJsonParameters(request, false)), request, response);
    }
    
    @RequestMapping("/request/cancel")
    @RoleValidate(roleID=RoleValidConstants.PURCHASE_REQUEST_MANAGEMENT, desc = RoleValidConstants.PURCHASE_REQUEST_MANAGEMENT_DESC)
    public void cancelPurchaseRequest(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.cancelPurchaseRequest(parserJsonParameters(request, false)), request, response);
    }
    
    @RequestMapping("/request/reject")
    @RoleValidate(roleID=RoleValidConstants.PURCHASE_REQUEST_PROCESS, desc = RoleValidConstants.PURCHASE_REQUEST_PROCESS_DESC)
    public void rejectPurchaseRequest(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.rejectPurchaseRequest(parserJsonParameters(request, false)), request, response);
    }
    
    
    @RequestMapping("/order/list")
    public void listPurchaseOrders(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.listPurchaseOrders(parserJsonParameters(request, false)), request, response);
    }
    
    @RequestMapping("/order/select")
    public void listOrdersForSelect(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.listApprovedPurchaseOrderForSelect(), request, response);
    }

    @RequestMapping("/order/add")
    @RoleValidate(roleID=RoleValidConstants.PURCHASE_ORDER_MANAGEMENT, desc = RoleValidConstants.PURCHASE_ORDER_MANAGEMENT_DESC)
    public void addPurchaseOrder(HttpServletRequest request, HttpServletResponse response) {
        pService.updatePurchaseOrder(parserJsonParameters(request, false));
        responseWithData(null, request, response, "save_success");
    }
    
    @RequestMapping("/order/get")
    public void getPurchaseOrder(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.getPurchaseOrder(parserJsonParameters(request, false)), request, response);
    }

    @RequestMapping("/order/delete")
    @RoleValidate(roleID=RoleValidConstants.PURCHASE_ORDER_MANAGEMENT, desc = RoleValidConstants.PURCHASE_ORDER_MANAGEMENT_DESC)
    public void deletePurchaseOrder(HttpServletRequest request, HttpServletResponse response) {
        pService.deletePurchaseOrder(parserJsonParameters(request, false));
        responseWithData(null, request, response);
    }

    @RequestMapping("/order/update")
    @RoleValidate(roleID=RoleValidConstants.PURCHASE_ORDER_MANAGEMENT, desc = RoleValidConstants.PURCHASE_ORDER_MANAGEMENT_DESC)
    public void updatePurchaseOrder(HttpServletRequest request, HttpServletResponse response) {
        pService.updatePurchaseOrder(parserJsonParameters(request, false));
        responseWithData(null, request, response, "save_success");
    }

    @RequestMapping("/order/approve")
    @RoleValidate(roleID=RoleValidConstants.PURCHASE_ORDER_PROCESS, desc = RoleValidConstants.PURCHASE_ORDER_PROCESS_DESC)
    public void approvePurchaseOrder(HttpServletRequest request, HttpServletResponse response) {
        pService.approvePurchaseOrder(parserJsonParameters(request, false));
        responseWithData(null, request, response);
    }
    
    @RequestMapping("/order/cancel")
    @RoleValidate(roleID=RoleValidConstants.PURCHASE_ORDER_MANAGEMENT, desc = RoleValidConstants.PURCHASE_ORDER_MANAGEMENT_DESC)
    public void cancelPurchaseOrder(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.cancelPurchaseOrder(parserJsonParameters(request, false)), request, response);
    }
    
    @RequestMapping("/order/reject")
    @RoleValidate(roleID=RoleValidConstants.PURCHASE_ORDER_PROCESS, desc = RoleValidConstants.PURCHASE_ORDER_PROCESS_DESC)
    public void rejectPurchaseOrder(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.rejectPurchaseOrder(parserJsonParameters(request, false)), request, response);
    }
    
    @RequestMapping("/repository/list")
    public void listRepositoryRequests(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.listRepositoryRequests(parserJsonParameters(request, false)), request, response);
    }

    @RequestMapping("/repository/add")
    @RoleValidate(roleID=RoleValidConstants.REPOSITORY_MANAGEMENT, desc = RoleValidConstants.REPOSITORY_MANAGEMENT_DESC)
    public void addRepositoryRequest(HttpServletRequest request, HttpServletResponse response) {
        pService.updateRepositoryRequest(parserJsonParameters(request, false));
        responseWithData(null, request, response, "save_success");
    }
    
    @RequestMapping("/repository/get")
    public void getRepositoryRequest(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.getRepositoryRequest(parserJsonParameters(request, false)), request, response);
    }

    @RequestMapping("/repository/delete")
    @RoleValidate(roleID=RoleValidConstants.REPOSITORY_MANAGEMENT, desc = RoleValidConstants.REPOSITORY_MANAGEMENT_DESC)
    public void deleteRepositoryRequest(HttpServletRequest request, HttpServletResponse response) {
        pService.deleteRepositoryRequest(parserJsonParameters(request, false));
        responseWithData(null, request, response);
    }

    @RequestMapping("/repository/update")
    @RoleValidate(roleID=RoleValidConstants.REPOSITORY_MANAGEMENT, desc = RoleValidConstants.REPOSITORY_MANAGEMENT_DESC)
    public void updateRepositoryRequest(HttpServletRequest request, HttpServletResponse response) {
        pService.updateRepositoryRequest(parserJsonParameters(request, false));
        responseWithData(null, request, response, "save_success");
    }

    @RequestMapping("/repository/approve")
    @RoleValidate(roleID=RoleValidConstants.REPOSITORY_MANAGEMENT_PROCESS, desc = RoleValidConstants.REPOSITORY_MANAGEMENT_PROCESS_DESC)
    public void approveRepositoryRequest(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.approveRepositoryRequest(parserJsonParameters(request, false)), request, response);
    }
    
    //直发出入库确认
    @RequestMapping("/repository/confirm")
    @RoleValidate(roleID=RoleValidConstants.REPOSITORY_MANAGEMENT_PROCESS, desc = RoleValidConstants.REPOSITORY_MANAGEMENT_PROCESS_DESC)
    public void confirmRepositoryRequest(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.approveRepositoryRequest(parserJsonParameters(request, false)), request, response);
    }
    
    @RequestMapping("/repository/reject")
    @RoleValidate(roleID=RoleValidConstants.REPOSITORY_MANAGEMENT_PROCESS, desc = RoleValidConstants.REPOSITORY_MANAGEMENT_PROCESS_DESC)
    public void rejectRepositoryRequest(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.rejectRepositoryRequest(parserJsonParameters(request, false)), request, response);
    }
    
    @RequestMapping("/repository/direct/project/list")
    public void listProjectsForRepositoryDirect(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.listProjectsForRepositoryDirect(parserJsonParameters(request, false)), request, response);
    }

    @RequestMapping("/repository/cancel")
    public void cancelRepositoryRequest(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.cancelRepositoryRequest(parserJsonParameters(request, false)), request, response);
    }

    @RequestMapping("/listforselect")
    public void listSelectForPayment(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.listSelectForPayment(parserJsonParameters(request, false)), request, response);
    }
    
    @RequestMapping("/paymoney/list")
    public void listPaymoney(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.listPaymoney(parserJsonParameters(request, false)), request, response);
    }

    @RequestMapping("/paymoney/save")
    @RoleValidate(roleID=RoleValidConstants.PAY_MONEY_MANAGEMENT, desc = RoleValidConstants.PAY_MONEY_MANAGEMENT_DESC)
    public void addPaymoney(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.savePaymoney(parserJsonParameters(request, false)), request, response, "save_success");
    }
    
    @RequestMapping("/paymoney/destroy")
    @RoleValidate(roleID=RoleValidConstants.PAY_MONEY_MANAGEMENT, desc = RoleValidConstants.PAY_MONEY_MANAGEMENT_DESC)
    public void destoryPayMoney(HttpServletRequest request, HttpServletResponse response) {
    	pService.destoryPayMoney(parserJsonParameters(request,  false));
    	responseWithData(new HashMap(), request, response);
    }  
    
    @RequestMapping("/invoice/list")
    public void listGetInvoice(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.listGetInvoice(parserJsonParameters(request, false)), request, response);
    }

    @RequestMapping("/invoice/viewpc")
    //@RoleValidate(roleID=RoleValidConstants.GET_INVOICE_MANAGEMENT, desc = RoleValidConstants.GET_INVOICE_MANAGEMENT_DESC)
    public void viewPCForInvoice(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.viewPCForInvoice(parserJsonParameters(request, false)), request, response);
    }
    
    @RequestMapping("/invoice/prepare")
    @RoleValidate(roleID=RoleValidConstants.GET_INVOICE_MANAGEMENT, desc = RoleValidConstants.GET_INVOICE_MANAGEMENT_DESC)
    public void prepareGetInvoice(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.prepareGetInvoice(parserJsonParameters(request, false)), request, response);
    }
 
    @RequestMapping("/invoice/load")
    //@RoleValidate(roleID=RoleValidConstants.GET_INVOICE_MANAGEMENT, desc = RoleValidConstants.GET_INVOICE_MANAGEMENT_DESC)
    public void loadGetInvoice(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.loadGetInvoice(parserJsonParameters(request, false)), request, response);
    }
    
    @RequestMapping("/invoice/save")
    @RoleValidate(roleID=RoleValidConstants.GET_INVOICE_MANAGEMENT, desc = RoleValidConstants.GET_INVOICE_MANAGEMENT_DESC)
    public void addGetInvoice(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.saveGetInvoice(parserJsonParameters(request, false)), request, response, "save_success");
    }
    
    @RequestMapping("/invoice/destroy")
    @RoleValidate(roleID=RoleValidConstants.GET_INVOICE_MANAGEMENT, desc = RoleValidConstants.GET_INVOICE_MANAGEMENT_DESC)
    public void destoryBack(HttpServletRequest request, HttpServletResponse response) {
    	pService.destroyGetInvoice(parserJsonParameters(request,  false));
    	responseWithData(new HashMap(), request, response);
    }    
    
    

    @RequestMapping("/importpc")
    //@RoleValidate(roleID=RoleValidConstants.SALES_CONTRACT_ADD, desc = RoleValidConstants.SALES_CONTRACT_ADD_DESC)
    public void importContractHistoryData(HttpServletRequest request, HttpServletResponse response){
        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;   
        MultipartFile uploadFile = multipartRequest.getFile("scFile");        
        Map<String,Object> result = new HashMap<String,Object>();
        try {

			result = pService.importContractHistoryData(uploadFile.getInputStream());
		} catch (IOException e) {
			e.printStackTrace();
		}
        
    	responseWithData(result, request, response);
    }  
    
    public IPurchaseContractService getpService() {
        return pService;
    }

    public void setpService(IPurchaseContractService pService) {
        this.pService = pService;
    }

}
