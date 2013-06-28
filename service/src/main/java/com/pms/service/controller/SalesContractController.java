package com.pms.service.controller;

import java.util.HashMap;
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

    /**
     * 新建销售合同
     * @param request
     * @param response
     */
    @RequestMapping("/add")
    @RoleValidate(roleID=RoleValidConstants.SALES_CONTRACT_ADD, desc = RoleValidConstants.SALES_CONTRACT_ADD_DESC)
    public void addSC(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        responseWithData(salesContractService.addSC(params), request, response);
    }
    
    /**
     * 编辑修改
     * @param request
     * @param response
     */
    @RequestMapping("/update")
    @RoleValidate(roleID=RoleValidConstants.SALES_CONTRACT_UPDATE, desc = RoleValidConstants.SALES_CONTRACT_UPDATE_DESC)
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
    @RoleValidate(roleID=RoleValidConstants.PAY_INVOICE_ADD, desc = RoleValidConstants.PAY_INVOICE_ADD_DESC)
    public void prepareInvoiceForSC(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        responseWithData(salesContractService.prepareInvoiceForSC(params), request, response);
    }
    
    @RequestMapping("/invoice/add")
    @RoleValidate(roleID=RoleValidConstants.PAY_INVOICE_ADD, desc = RoleValidConstants.PAY_INVOICE_ADD_DESC)
    public void addInvoiceForSC(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        responseWithData(salesContractService.addInvoiceForSC(params), request, response);
    }
    
    @RequestMapping("/invoice/managerapprove")
    @RoleValidate(roleID=RoleValidConstants.PAY_INVOICE_MANAGER_PROCESS, desc = RoleValidConstants.PAY_INVOICE_MANAGER_PROCESS_DESC)
    public void managerApproveInvoiceForSC(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        responseWithData(salesContractService.approveInvoiceForSC(params), request, response);
    }

    @RequestMapping("/invoice/managerreject")
    @RoleValidate(roleID=RoleValidConstants.PAY_INVOICE_MANAGER_PROCESS, desc = RoleValidConstants.PAY_INVOICE_MANAGER_PROCESS_DESC)
    public void managerRejectInvoiceForSC(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        responseWithData(salesContractService.managerRejectInvoiceForSC(params), request, response);
    }
    
    @RequestMapping("/invoice/financeapprove")
    @RoleValidate(roleID=RoleValidConstants.PAY_INVOICE_FIN_PROCESS, desc = RoleValidConstants.PAY_INVOICE_FIN_PROCESS_DESC)
    public void financeApproveInvoiceForSC(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        responseWithData(salesContractService.approveInvoiceForSC(params), request, response);
    }
    
    @RequestMapping("/invoice/financereject")
    @RoleValidate(roleID=RoleValidConstants.PAY_INVOICE_FIN_PROCESS, desc = RoleValidConstants.PAY_INVOICE_FIN_PROCESS)
    public void financeRejectInvoiceForSC(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        responseWithData(salesContractService.finRejectInvoiceForSC(params), request, response);
    }
    
    @RequestMapping("/invoice/done")
    @RoleValidate(roleID=RoleValidConstants.PAY_INVOICE_DONE, desc = RoleValidConstants.PAY_INVOICE_DONE_DESC)
    public void doneInvoiceForSC(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        responseWithData(salesContractService.approveInvoiceForSC(params), request, response);
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
    
    @RequestMapping("/eqhistory")
    public void listEqHistoryAndLatestEqList(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> params = parserJsonParameters(request, false);
        responseWithData(salesContractService.listEqHistoryAndLatestEqList(params), request, response);
    }

	public ISalesContractService getSalesContractService() {
		return salesContractService;
	}

	public void setSalesContractService(ISalesContractService salesContractService) {
		this.salesContractService = salesContractService;
	}
    
	//收款-----------
    @RequestMapping("/getmoney/list")
    public void listGetmoney(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(salesContractService.listGetMoneyForSC(parserJsonParameters(request, false)), request, response);
    }

    @RequestMapping("/getmoney/save")
    @RoleValidate(roleID=RoleValidConstants.FINANCE_MANAGEMENT, desc = RoleValidConstants.FINANCE_MANAGEMENT_DESC)
    public void saveGetmoney(HttpServletRequest request, HttpServletResponse response) {
        responseWithData(salesContractService.saveGetMoneyForSC(parserJsonParameters(request, false)), request, response, "save_success");
    }
    
    @RequestMapping("/getmoney/destroy")
    @RoleValidate(roleID=RoleValidConstants.FINANCE_MANAGEMENT, desc = RoleValidConstants.FINANCE_MANAGEMENT_DESC)
    public void destoryGetMoney(HttpServletRequest request, HttpServletResponse response) {
    	Map<String,Object> money = parserJsonParameters(request,  false);
    	salesContractService.destoryGetMoney(money);
    	responseWithData(new HashMap(), request, response);
    }  
    //....
    
}
