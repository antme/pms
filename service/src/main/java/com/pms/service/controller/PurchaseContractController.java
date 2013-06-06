package com.pms.service.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.pms.service.annotation.LoginRequired;
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

    @RequestMapping("/add")
    public void addPurchaseContract(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.addPurchaseContract(parserJsonParameters(request, false)), request, response, "save_success");
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

    
    
    
    @RequestMapping("/order/list")
    public void listPurchaseOrders(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.listPurchaseOrders(), request, response);
    }

    @RequestMapping("/order/add")
    public void addPurchaseOrder(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.updatePurchaseOrder(parserListJsonParameters(request, false)), request, response, "save_success");
    }

    @RequestMapping("/order/delete")
    public void deletePurchaseOrder(HttpServletRequest request, HttpServletResponse response) {
        pService.deletePurchaseOrder(parserJsonParameters(request, false));
        responseWithData(null, request, response);
    }

    @RequestMapping("/order/update")
    public void updatePurchaseOrder(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.updatePurchaseOrder(parserListJsonParameters(request, false)), request, response, "save_success");
    }
    
    @RequestMapping("/request/list")
    public void listPurchaseRequest(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(pService.listPurchaseRequest(), request, response);
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
