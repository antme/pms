package com.pms.service.controller;

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
    public void deletePurchaseContract(HttpServletRequest request, HttpServletResponse response) {
        pService.deletePurchaseContract(parserJsonParameters(request, false));
        responseWithData(null, request, response);
    }

    @RequestMapping("/update")
    public void listPurchaseContract(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.updatePurchaseContract(parserJsonParameters(request, false)), request, response, "save_success");
    }
    
    
    @RequestMapping("/approve")
    public void approvePurchaseContract(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.approvePurchaseContract(parserJsonParameters(request, false)), request, response);
    }
    
    @RequestMapping("/reject")
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
    public void approvePurchaseRequest(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.approvePurchaseRequest(parserJsonParameters(request, false)), request, response);
    }
    
    @RequestMapping("/request/cancel")
    public void cancelPurchaseRequest(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.cancelPurchaseRequest(parserJsonParameters(request, false)), request, response);
    }
    
    @RequestMapping("/request/reject")
    public void rejectPurchaseRequest(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.rejectPurchaseRequest(parserJsonParameters(request, false)), request, response);
    }
    
    
    @RequestMapping("/order/list")
    public void listPurchaseOrders(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.listPurchaseOrders(), request, response);
    }

    @RequestMapping("/order/add")
    public void addPurchaseOrder(HttpServletRequest request, HttpServletResponse response) {
        pService.updatePurchaseOrder(parserListJsonParameters(request, false));
        responseWithData(null, request, response, "save_success");
    }
    
    @RequestMapping("/order/get")
    public void getPurchaseOrder(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.getPurchaseOrder(parserListJsonParameters(request, false)), request, response);
    }

    @RequestMapping("/order/delete")
    public void deletePurchaseOrder(HttpServletRequest request, HttpServletResponse response) {
        pService.deletePurchaseOrder(parserJsonParameters(request, false));
        responseWithData(null, request, response);
    }

    @RequestMapping("/order/update")
    public void updatePurchaseOrder(HttpServletRequest request, HttpServletResponse response) {
        pService.updatePurchaseOrder(parserListJsonParameters(request, false));
        responseWithData(null, request, response, "save_success");
    }

    @RequestMapping("/order/approve")
    public void approvePurchaseOrder(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.approvePurchaseOrder(parserJsonParameters(request, false)), request, response);
    }
    
    @RequestMapping("/order/reject")
    public void rejectPurchaseOrder(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.rejectPurchaseOrder(parserJsonParameters(request, false)), request, response);
    }

    public IPurchaseContractService getpService() {
        return pService;
    }

    public void setpService(IPurchaseContractService pService) {
        this.pService = pService;
    }

}
