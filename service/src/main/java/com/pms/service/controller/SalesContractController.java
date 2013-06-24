package com.pms.service.controller;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.pms.service.annotation.LoginRequired;
import com.pms.service.annotation.RoleValidConstants;
import com.pms.service.annotation.RoleValidate;
import com.pms.service.service.ISalesContractService;

@Controller
@RequestMapping("/sc")
@RoleValidate
@LoginRequired
public class SalesContractController extends AbstractController {
	
	private static Logger logger = LogManager.getLogger(SalesContractController.class);

    private ISalesContractService salesContractService;
    
    @RequestMapping("/list")
    public void listSCs(HttpServletRequest request, HttpServletResponse response) {
    	Map<String, Object> params = this.parserJsonParameters(request, true);
    	responseWithData(salesContractService.listSC(params), request, response);
    }
    
    @RequestMapping("/listforselect")
    public void listSCsForSelect(HttpServletRequest request, HttpServletResponse response) {
    	Map<String, Object> params = this.parserJsonParameters(request, true);
    	responseWithData(salesContractService.listSCsForSelect(params), request, response);
    }
    
    @RequestMapping("/eqlist")
    public void listEquipmentListBySC(HttpServletRequest request, HttpServletResponse response) {
    	Map<String, Object> params = this.parserJsonParameters(request, false);
    	responseWithData(salesContractService.listEqListBySC(params), request, response);
    }
    
    @RequestMapping("/add")
    @RoleValidate(roleID=RoleValidConstants.SALES_CONTRACT_MANAGEMENT, desc = RoleValidConstants.SALES_CONTRACT_MANAGEMENT_DESC)
    public void addSC(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        responseWithData(salesContractService.addSC(params), request, response);
    }
    
    @RequestMapping("/update")
    @RoleValidate(roleID=RoleValidConstants.SALES_CONTRACT_MANAGEMENT, desc = RoleValidConstants.SALES_CONTRACT_MANAGEMENT_DESC)
    public void updateSC(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        responseWithData(salesContractService.addSC(params), request, response);
    }
    
    @RequestMapping("/get")
    public void getSC(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        responseWithData(salesContractService.getSC(params), request, response);
    }
    
    @RequestMapping("/project/info")//根据销售合同id 获取相对应的项目信息
    public void getRelatedProjectInfo(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        responseWithData(salesContractService.getRelatedProjectInfo(params), request, response);
    }
    
    /**开票CRUD*/
    @RequestMapping("/invoice/prepare")
    @RoleValidate(roleID=RoleValidConstants.PAY_INVOICE_MANAGEMENT, desc = RoleValidConstants.PAY_INVOICE_MANAGEMENT_DESC)
    public void prepareInvoiceForSC(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        responseWithData(salesContractService.prepareInvoiceForSC(params), request, response);
    }
    
    @RequestMapping("/invoice/add")
    @RoleValidate(roleID=RoleValidConstants.PAY_INVOICE_MANAGEMENT, desc = RoleValidConstants.PAY_INVOICE_MANAGEMENT_DESC)
    public void addInvoiceForSC(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        responseWithData(salesContractService.addInvoiceForSC(params), request, response);
    }
    
    @RequestMapping("/invoice/approve")
    @RoleValidate(roleID=RoleValidConstants.PAY_INVOICE_PROCESS, desc = RoleValidConstants.PAY_INVOICE_PROCESS_DESC)
    public void approveInvoiceForSC(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        responseWithData(salesContractService.approveInvoiceForSC(params), request, response);
    }
 
    @RequestMapping("/invoice/reject")
    @RoleValidate(roleID=RoleValidConstants.PAY_INVOICE_PROCESS, desc = RoleValidConstants.PAY_INVOICE_PROCESS_DESC)
    public void rejectInvoiceForSC(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        responseWithData(salesContractService.rejectInvoiceForSC(params), request, response);
    }
    
    @RequestMapping("/invoice/load")
    public void loadInvoiceForSC(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        responseWithData(salesContractService.loadInvoiceForSC(params), request, response);
    }
    
    @RequestMapping("/invoice/list")
    public void listInvoiceForSC(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        responseWithData(salesContractService.listInvoiceForSC(params), request, response);
    }
    
    @RequestMapping("/gotmoney/add")
    @RoleValidate(roleID=RoleValidConstants.FINANCE_MANAGEMENT, desc = RoleValidConstants.FINANCE_MANAGEMENT_DESC)
    public void addGotMoneyForSC(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        responseWithData(salesContractService.addGotMoneyForSC(params), request, response);
    }
    
    @RequestMapping("/gotmoney/update")
    @RoleValidate(roleID=RoleValidConstants.FINANCE_MANAGEMENT, desc = RoleValidConstants.FINANCE_MANAGEMENT_DESC)
    public void updateGotMoneyForSC(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        responseWithData(salesContractService.addGotMoneyForSC(params), request, response);
    }
    
    @RequestMapping("/gotmoney/list")
    public void listGotMoneyForSC(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        responseWithData(salesContractService.listGotMoneyForSC(params), request, response);
    }
    
    @RequestMapping("/monthshipments/add")
    public void addMonthShipmentsForSC(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        responseWithData(salesContractService.addMonthShipmentsForSC(params), request, response);
    }
    
    @RequestMapping("/monthshipments/update")
    public void updateMonthShipmentsForSC(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        responseWithData(salesContractService.addMonthShipmentsForSC(params), request, response);
    }
    
    @RequestMapping("/monthshipments/list")
    public void listMonthShipmentsForSC(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        responseWithData(salesContractService.listMonthShipmentsForSC(params), request, response);
    }
    
    @RequestMapping("/eq/get")
    public void getSCeqById(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        responseWithData(salesContractService.getSCeqByIds(params), request, response);
    }
    
    @RequestMapping("/listbyproject")
    public void listSCByProject(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        responseWithData(salesContractService.listSCByProject(params), request, response);
    }

	public ISalesContractService getSalesContractService() {
		return salesContractService;
	}

	public void setSalesContractService(ISalesContractService salesContractService) {
		this.salesContractService = salesContractService;
	}
    
    
    
}
