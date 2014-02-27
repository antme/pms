package com.pms.service.service.impl;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.pms.service.exception.ApiResponseException;
import com.pms.service.mockbean.ApiConstants;
import com.pms.service.mockbean.DBBean;
import com.pms.service.mockbean.EqCostListBean;
import com.pms.service.mockbean.SupplierBean;
import com.pms.service.service.AbstractService;
import com.pms.service.service.ISupplierService;
import com.pms.service.util.ApiUtil;
import com.pms.service.util.ExcleUtil;

public class SupplierServiceImpl extends AbstractService implements ISupplierService {


    @Override
	public String geValidatorFileName() {
		return "supplier";
	}

	public Map<String, Object> list(Map<String, Object> params) {
		return dao.list(params, DBBean.SUPPLIER);
	}

	public Map<String, Object> update(Map<String, Object> params) {
		return dao.updateById(params, DBBean.SUPPLIER);
	}

	public void destroy(Map<String, Object> params) {
		List<String> ids = new ArrayList<String>();
		ids.add(String.valueOf(params.get(ApiConstants.MONGO_ID)));
		dao.deleteByIds(ids, DBBean.SUPPLIER);
	}

    public Map<String, Object> create(Map<String, Object> params) {

        if (this.dao.exist(SupplierBean.SUPPLIER_NAME, params.get(SupplierBean.SUPPLIER_NAME), DBBean.SUPPLIER)) {
            Map<String, Object> old = this.dao.findOne(SupplierBean.SUPPLIER_NAME, params.get(SupplierBean.SUPPLIER_NAME), DBBean.SUPPLIER);
            params.put(ApiConstants.MONGO_ID, old.get(ApiConstants.MONGO_ID));
            this.dao.updateById(params, DBBean.SUPPLIER);
            return params;
        } else {
            if(params.get(ApiConstants.MONGO_ID)!=null){
                return this.dao.updateById(params, DBBean.SUPPLIER);
            }else{
                params.put(SupplierBean.SUPPLIER_CODE, generateCode("GYS", DBBean.SUPPLIER, SupplierBean.SUPPLIER_CODE));
                return dao.add(params, DBBean.SUPPLIER);
            }
        }
    }
	
    public Map<String, Object> importSupplier(String supplierName) {
        Map<String, Object> supplier = dao.findOne(SupplierBean.SUPPLIER_NAME, supplierName, DBBean.SUPPLIER);
        if (supplier == null) {
            Map<String, Object> map = new HashMap<String, Object>();
            map.put(SupplierBean.SUPPLIER_NAME, supplierName);
            supplier = create(map);
        }
        return supplier;
    }
    
    
    public void mergeSupplierInfo(Map<String, Object> data, String refKey, String[] mergeKeys) {

        Map<String, Object> suppliers = this.dao.listToOneMapAndIdAsKey(null, DBBean.SUPPLIER);

        if (data.get(ApiConstants.RESULTS_DATA) != null) {

            List<Map<String, Object>> list = (List<Map<String, Object>>) data.get(ApiConstants.RESULTS_DATA);
            for (Map<String, Object> dataToMerge : list) {
                Object supplier = suppliers.get(dataToMerge.get(refKey));
                for (String mergeKey : mergeKeys) {
                    if (supplier != null) {
                        Map<String, Object> s = (Map<String, Object>) supplier;
                        dataToMerge.put(mergeKey, s.get(mergeKey));
                    } else {
                        dataToMerge.put(mergeKey, "");
                    }
                }
            }

        } else {
            Object supplier = suppliers.get(data.get(refKey));
            for (String mergeKey : mergeKeys) {
                if (supplier != null) {
                    Map<String, Object> s = (Map<String, Object>) supplier;
                    data.put(mergeKey, s.get(mergeKey));
                } else {
                    data.put(mergeKey, "");
                }
            }
        }
    }
    
    public void upload(Map<String, Object> params) {

        try {
            InputStream inputStream = (InputStream) params.get("inputStream");
            ExcleUtil excleUtil = new ExcleUtil(inputStream);
            List<String[]> list = excleUtil.getAllData(0);
            Map<String, Integer> keyMap = new LinkedHashMap<String, Integer>();

            if (list.get(1) != null) {

                // MAX 15 COLUMN
                for (int i = 0; i < list.get(1).length; i++) {
                    String key = list.get(1)[i].trim();
                    if (!ApiUtil.isEmpty(key)) {
                        keyMap.put(key, i);
                    }
                }
            }

            for (int i = 2; i < list.size(); i++) {// 硬编码从第9行开始读数据
                Map<String, Object> eq = new LinkedHashMap<String, Object>();
                String amount = list.get(i)[6].trim();
                if (amount.length() == 0) {// 读到某一行数量为空时，认为清单数据结束
                    break;
                }
                eq.put("supplierName", list.get(i)[keyMap.get("公司名称")].trim());
                eq.put("supplierCate", list.get(i)[keyMap.get("产品类型")].trim());
                eq.put("supplierAddress", list.get(i)[keyMap.get("地址")].trim());
                eq.put("supplierContact", list.get(i)[keyMap.get("联系人")].trim());
                eq.put("supplierContactMobile", list.get(i)[keyMap.get("手机")].trim());
                eq.put("supplierContactPhone", list.get(i)[keyMap.get("电话")].trim());
                eq.put("supplierFax", list.get(i)[keyMap.get("传真")].trim());
                eq.put("supplierReviewTime", list.get(i)[keyMap.get("评审时间")].trim());
                eq.put("supplierRemark", list.get(i)[keyMap.get("备注")].trim());
                this.create(eq);

            }

        } catch (Exception e) {

            throw new ApiResponseException("Import eqCostList error.", null, "模板格式错误");
        }

    }

}
