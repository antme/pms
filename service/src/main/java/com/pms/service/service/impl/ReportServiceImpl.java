package com.pms.service.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.pms.service.service.AbstractService;
import com.pms.service.service.IReportService;
import com.pms.service.util.ExcleUtil;

public class ReportServiceImpl extends AbstractService implements IReportService  {
	
	private static final Logger logger = LogManager.getLogger(ReportServiceImpl.class);

	@Override
	public String geValidatorFileName() {
		return null;
	}
	
	public static Map<String,Object> importPurchaseContract(Map<String,Object> params){
		String path = "D:\\excel\\采购合同数据-上海自采 (1) - 副本.xlsx";
		ExcleUtil excel = new ExcleUtil(path);
		List<String[]> list = excel.getAllData(0);
		List<Map<String,Object>> itemList = new ArrayList<Map<String,Object>>();
		for(String[] row : list){
			Map<String,Object> item = new HashMap<String,Object>();
			for(String str : row){
				//开始组装对象
				item.put("purchaseContractCode", row[0]);
				item.put("signDate", row[0]);
				item.put("", row[0]);//是否完成
				
				item.put("purchaseContractNo", row[1]);//序号
				item.put("purchaseContractCode", row[2]);//编号
				item.put("signDate", row[3]);//签订日期
				item.put("goodType", row[4]);//产品类型
				item.put("", row[5]);//供应商名称
				
				item.put("", row[6]);//联系人名称
				item.put("", row[7]);//销售合同编号
				item.put("", row[8]);//项目名称
				item.put("", row[9]);//合同金额
				item.put("", row[10]);//到货金额
				
				item.put("", row[11]);//到货%
				item.put("", row[12]);//付款金额
				item.put("", row[13]);//2010
				item.put("", row[14]);//2011
				item.put("", row[15]);//2012.1
				//
				item.put("", row[16]);//2012.2
				item.put("", row[17]);//2012.3
				item.put("", row[18]);//2012.4
				item.put("", row[19]);//2012.5
				item.put("", row[20]);//2012.6
				
				item.put("", row[21]);//2012.7
				item.put("", row[22]);//2012.8
				item.put("", row[23]);//2012.9
				item.put("", row[24]);//2012.10
				item.put("", row[21]);//2012.11
				item.put("", row[22]);//2012.12
				item.put("", row[23]);//付款百分比
				item.put("", row[24]);//已收发票金额
				item.put("", row[25]);//发票2010
				
				item.put("", row[26]);//发票2011
				item.put("", row[27]);//发票2012.
				item.put("", row[28]);//发票2012.1
				item.put("", row[29]);//发票2012.2
				item.put("", row[30]);//发票2012.3
				item.put("", row[31]);//发票2012.4
				item.put("", row[32]);//发票2012.5
				item.put("", row[33]);//发票2012.6
				item.put("", row[34]);//发票2012.7
				item.put("", row[35]);//发票2012.8
				item.put("", row[24]);//发票2012.9
				item.put("", row[26]);//发票2012.10
				item.put("", row[27]);//发票2012.11
				item.put("", row[28]);//发票2012.12
				item.put("", row[29]);//发票%
				
				item.put("", row[30]);//付款方式
				item.put("", row[31]);//备注
				item.put("", row[32]);//是否执行完
				item.put("", row[33]);//空白--------
				item.put("", row[34]);//未付款金额
				item.put("", row[35]);//未到货金额
				item.put("", row[24]);//未收发票金额		
			}
		}
		
		return null;
	}
}
