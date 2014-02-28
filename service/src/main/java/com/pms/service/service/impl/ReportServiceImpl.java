package com.pms.service.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.google.gson.Gson;
import com.pms.service.mockbean.ApiConstants;
import com.pms.service.mockbean.DBBean;
import com.pms.service.mockbean.GetInvoiceBean;
import com.pms.service.mockbean.MoneyBean;
import com.pms.service.mockbean.ProjectBean;
import com.pms.service.mockbean.PurchaseContract;
import com.pms.service.mockbean.SalesContractBean;
import com.pms.service.mockbean.SupplierBean;
import com.pms.service.service.AbstractService;
import com.pms.service.service.IReportService;
import com.pms.service.util.ApiUtil;
import com.pms.service.util.ExcleUtil;

public class ReportServiceImpl extends AbstractService implements IReportService  {
	
	private static final Logger logger = LogManager.getLogger(ReportServiceImpl.class);

	@Override
	public String geValidatorFileName() {
		return null;
	}
	
	public Map<String, Object> importPurchaseContract(Map<String, Object> params) {
		String path = "D:\\excel\\采购合同数据-上海自采 (1) - 副本.xlsx";
		ExcleUtil excel = new ExcleUtil(path);
		List<String[]> list = excel.getAllData(0);
		List<Map<String, Object>> itemList = new ArrayList<Map<String, Object>>();
		List<Map<String, Object>> payList = new ArrayList<Map<String, Object>>();
		List<Map<String, Object>> invoiceList = new ArrayList<Map<String, Object>>();
		
		list.remove(0);list.remove(0);
		String[] row = list.get(0);
		//for(String[] row : list){
			Map<String, Object> item = new LinkedHashMap<String, Object>();
			// 1.
			item.put("isFinish", row[0]);// 是否完成
			item.put("purchaseContractNo", ApiUtil.getInteger(row[1]));// 序号
			item.put("purchaseContractCode", row[2]);// 编号
			item.put("signDate", row[3]);// 签订日期
			item.put("goodType", row[4]);// 产品类型
	
			item.put(SupplierBean.SUPPLIER_NAME, row[5]);// 供应商名称
			item.put("supplierNameContact", row[6]);// 联系人名称
			item.put(PurchaseContract.SUPPLIER_ID, getSupplierId(row[5], row[6]));
	
			item.put("contractCode", row[7]);// 销售合同编号
			item.put("scId", getSalesContactId(row[7]));
	
			item.put("projectName", row[8]);// 项目名称
			String projectId = getProjectId(row[8]);
			item.put("projectId", projectId);
	
			item.put("purchaseContractMoney", ApiUtil.getDouble(row[9]));// 合同金额
			item.put("purchaseContractReceivedGoodMoney", ApiUtil.getDouble(row[10]));// 到货金额1.1
			item.put("purchaseContractReceivedGoodPercent", ApiUtil.getDouble(row[11]));// 到货%1.2
			item.put("purchaseContractPayMoney", ApiUtil.getDouble(row[12]));// 付款金额2.1
	
			// 2. PayMoney object
			int begin = 13;
			for (int i = 0; i < 14; i++) {
				Map<String, Object> obj = new HashMap<String, Object>();
				obj.put("projectId", projectId);
				obj.put(MoneyBean.payMoneyActualMoney, ApiUtil.getDouble(row[begin + i]));
				if (i == 0) {
					obj.put(MoneyBean.payMoneyActualDate, "2010/01/01");
				} else if (i == 1) {
					obj.put(MoneyBean.payMoneyActualDate, "2011/01/01");
				} else {
					int mm = i - 1;
					String dt = "2012/" + mm + "/01";
					obj.put(MoneyBean.payMoneyActualDate, dt);
				}
				payList.add(obj);
			}
	
			// 3.
			item.put("purchaseContractPayMoneyPercent", ApiUtil.getDouble(row[27]));// 付款百分比2.2
			item.put("purchaseContractReceivedInvoiceMoney", ApiUtil.getDouble(row[28]));// 已收发票金额3.1
	
			// 4.Invoice Object
			begin = 29;
			for (int i = 0; i < 14; i++) {
				Map<String, Object> obj = new HashMap<String, Object>();
				obj.put("projectId", projectId);
				obj.put(GetInvoiceBean.getInvoiceMoney, ApiUtil.getDouble(row[begin + i]));
				if (i == 0) {
					obj.put(GetInvoiceBean.getInvoiceDate, "2010/01/01");
				} else if (i == 1) {
					obj.put(GetInvoiceBean.getInvoiceDate, "2011/01/01");
				} else {
					int mm = i - 1;
					String dt = "2012/" + mm + "/01";
					obj.put(GetInvoiceBean.getInvoiceDate, dt);
				}
				invoiceList.add(obj);
			}
	
			// 5.
			item.put("purchaseContractReceivedInvoicePercent", ApiUtil.getDouble(row[43]));// 发票%3.2
			item.put("purchaseContractPayType", row[44]);// 付款方式
			item.put("comment", row[45]);// 备注
			item.put("purchaseContractIsExecuteFinish", row[46]);// 是否执行完
			// item.put("", row[47]);//空白--------
			item.put("purchaseContractUnPayMoney", ApiUtil.getDouble(row[48]));// 未付款金额2.2
			item.put("purchaseContractUnReceivedGoodMoney", ApiUtil.getDouble(row[49]));// 未到货金额1.3
			item.put("purchaseContractUnReceivedInvoiceMoney", ApiUtil.getDouble(row[50]));// 未收发票金额3.3
	
			itemList.add(item);
		//}
		System.out.println(new Gson().toJson(itemList));
		System.out.println(new Gson().toJson(payList));
		System.out.println(new Gson().toJson(invoiceList));
		return null;
	}

	private String getProjectId(String name){
		Map<String,Object> obj = dao.findOne(ProjectBean.PROJECT_NAME, name, new String[]{ApiConstants.MONGO_ID}, DBBean.PROJECT);
		if(obj == null){
			return "testid";
		}
		return (String) obj.get(ApiConstants.MONGO_ID);
	}

	private String getSupplierId(String supplierName, String supplierContact){
		Map<String,Object> obj = dao.findOne(SupplierBean.SUPPLIER_NAME, supplierName, DBBean.SUPPLIER);
		if(obj == null){
			return "testid";
		}
		return (String) obj.get(ApiConstants.MONGO_ID);
	}
	
	private String getSalesContactId(String code){
		Map<String,Object> obj = dao.findOne(SalesContractBean.SC_CODE, code,DBBean.SALES_CONTRACT);
		if(obj == null){
			return "testid";
		}
		return (String) obj.get(ApiConstants.MONGO_ID);
	}	

}
