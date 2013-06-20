package com.pms.service.controller;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

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
        responseWithData(pService.listPurchaseContracts(), request, response);
    }
    
    @RequestMapping("/repository/contract/list")
    public void listContractsForRepositorySelect(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.listContractsForRepositorySelect(), request, response);
    }
    
    @RequestMapping("/project/contract/list")
    public void listContractsByProjectId(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.listContractsByProjectId(parserJsonParameters(request, false)), request, response);
    }
    
    @RequestMapping("/project/contract/suppliers/list")
    public void listContractsSuppliersByProjectId(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.listContractsSuppliersByProjectId(parserJsonParameters(request, false)), request, response);
    }
    
    @RequestMapping("/get/byproject_supplier")
    public void listContractsByProjectAndSupplier(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.listContractsByProjectAndSupplier(parserJsonParameters(request, false)), request, response);
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
 
    @RequestMapping("/delete")
    @RoleValidate(roleID=RoleValidConstants.PURCHASE_CONTRACT_MANAGEMENT, desc = RoleValidConstants.PURCHASE_CONTRACT_MANAGEMENT_DESC)
    public void deletePurchaseContract(HttpServletRequest request, HttpServletResponse response) {
        pService.deletePurchaseContract(parserJsonParameters(request, false));
        responseWithData(null, request, response);
    }

    @RequestMapping("/update")
    @RoleValidate(roleID=RoleValidConstants.PURCHASE_CONTRACT_MANAGEMENT, desc = RoleValidConstants.PURCHASE_CONTRACT_MANAGEMENT_DESC)
    public void listPurchaseContract(HttpServletRequest request, HttpServletResponse response) {
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
    
    @RequestMapping("/back/get")
    public void getBackRequestForSelect(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.getBackRequestForSelect(parserJsonParameters(request, false)), request, response);
    }
    

    
    @RequestMapping("/request/list")
    public void listPurchaseRequestByAssistant(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.listPurchaseRequests(), request, response);
    }
    
    @RequestMapping("/request/add")
    @RoleValidate(roleID=RoleValidConstants.PURCHASE_REQUEST_MANAGEMENT, desc = RoleValidConstants.PURCHASE_REQUEST_MANAGEMENT_DESC)
    public void addPurchaseRequest(HttpServletRequest request, HttpServletResponse response) {
        pService.updatePurchaseRequest(parserListJsonParameters(request, false));
        responseWithData(null, request, response, "save_success");
    }
    
    @RequestMapping("/request/select/list")
    public void listPurchaseRequestForSelect(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.listApprovedPurchaseRequestForSelect(), request, response);
    }
    
    @RequestMapping("/request/get")
    public void getPurchaseRequest(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.getPurchaseRequest(parserListJsonParameters(request, false)), request, response);
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
        pService.updatePurchaseRequest(parserListJsonParameters(request, false));
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
        responseWithData(pService.listPurchaseOrders(), request, response);
    }
    
    @RequestMapping("/order/select/list")
    public void listOrdersForSelect(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.listApprovedPurchaseOrderForSelect(), request, response);
    }

    @RequestMapping("/order/add")
    @RoleValidate(roleID=RoleValidConstants.PURCHASE_ORDER_MANAGEMENT, desc = RoleValidConstants.PURCHASE_ORDER_MANAGEMENT_DESC)
    public void addPurchaseOrder(HttpServletRequest request, HttpServletResponse response) {
        pService.updatePurchaseOrder(parserListJsonParameters(request, false));
        responseWithData(null, request, response, "save_success");
    }
    
    @RequestMapping("/order/get")
    public void getPurchaseOrder(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.getPurchaseOrder(parserListJsonParameters(request, false)), request, response);
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
        pService.updatePurchaseOrder(parserListJsonParameters(request, false));
        responseWithData(null, request, response, "save_success");
    }

    @RequestMapping("/order/approve")
    @RoleValidate(roleID=RoleValidConstants.PURCHASE_ORDER_PROCESS, desc = RoleValidConstants.PURCHASE_ORDER_PROCESS_DESC)
    public void approvePurchaseOrder(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.approvePurchaseOrder(parserJsonParameters(request, false)), request, response);
    }
    
    @RequestMapping("/order/reject")
    @RoleValidate(roleID=RoleValidConstants.PURCHASE_ORDER_PROCESS, desc = RoleValidConstants.PURCHASE_ORDER_PROCESS_DESC)
    public void rejectPurchaseOrder(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.rejectPurchaseOrder(parserJsonParameters(request, false)), request, response);
    }
    
    @RequestMapping("/repository/list")
    public void listRepositoryRequests(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.listRepositoryRequests(), request, response);
    }

    @RequestMapping("/repository/add")
    public void addRepositoryRequest(HttpServletRequest request, HttpServletResponse response) {
        pService.addRepositoryRequest(parserListJsonParameters(request, false));
        responseWithData(null, request, response, "save_success");
    }
    
    @RequestMapping("/repository/get")
    public void getRepositoryRequest(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.getRepositoryRequest(parserListJsonParameters(request, false)), request, response);
    }

    @RequestMapping("/repository/delete")
    public void deleteRepositoryRequest(HttpServletRequest request, HttpServletResponse response) {
        pService.deleteRepositoryRequest(parserJsonParameters(request, false));
        responseWithData(null, request, response);
    }

    @RequestMapping("/repository/update")
    public void updateRepositoryRequest(HttpServletRequest request, HttpServletResponse response) {
        pService.updateRepositoryRequest(parserListJsonParameters(request, false));
        responseWithData(null, request, response, "save_success");
    }

    @RequestMapping("/repository/approve")
    public void approveRepositoryRequest(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.approveRepositoryRequest(parserJsonParameters(request, false)), request, response);
    }
    
    @RequestMapping("/repository/reject")
    public void rejectRepositoryRequest(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.rejectRepositoryRequest(parserJsonParameters(request, false)), request, response);
    }

    @RequestMapping("/listforselect/paymoney")
    public void listSelectForPayment(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.listSelectForPayment(parserListJsonParameters(request, false)), request, response);
    }
    
    @RequestMapping("/paymoney/list")
    public void listPaymoney(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.listPaymoney(parserJsonParameters(request, false)), request, response);
    }

    @RequestMapping("/paymoney/add")
    @RoleValidate(roleID=RoleValidConstants.FINANCE_MANAGEMENT, desc = RoleValidConstants.FINANCE_MANAGEMENT_DESC)
    public void addPaymoney(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.addPaymoney(parserJsonParameters(request, false)), request, response, "save_success");
    }
    
    @RequestMapping("/paymoney/update")
    @RoleValidate(roleID=RoleValidConstants.FINANCE_MANAGEMENT, desc = RoleValidConstants.FINANCE_MANAGEMENT_DESC)
    public void updatePaymoney(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.updatePaymoney(parserJsonParameters(request, false)), request, response);
    }
    @RequestMapping("/invoice/list")
    public void listGetInvoice(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.listGetInvoice(parserJsonParameters(request, false)), request, response);
    }

    @RequestMapping("/invoice/add")
    @RoleValidate(roleID=RoleValidConstants.FINANCE_MANAGEMENT, desc = RoleValidConstants.FINANCE_MANAGEMENT_DESC)
    public void addGetInvoice(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.addGetInvoice(parserJsonParameters(request, false)), request, response, "save_success");
    }
    
    @RequestMapping("/invoice/update")
    @RoleValidate(roleID=RoleValidConstants.FINANCE_MANAGEMENT, desc = RoleValidConstants.FINANCE_MANAGEMENT_DESC)
    public void updateGetInvoice(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.updateGetInvoice(parserJsonParameters(request, false)), request, response);
    }
    
    @RequestMapping("/invoice/destroy")
    @RoleValidate(roleID=RoleValidConstants.FINANCE_MANAGEMENT, desc = RoleValidConstants.FINANCE_MANAGEMENT_DESC)
    public void destoryBack(HttpServletRequest request, HttpServletResponse response) {
    	pService.destroyGetInvoice(parserJsonParameters(request,  false));
    	responseWithData(new HashMap(), request, response);
    }    
    
    public IPurchaseContractService getpService() {
        return pService;
    }

    public void setpService(IPurchaseContractService pService) {
        this.pService = pService;
    }

}
