package com.pms.service.service.impl;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.pms.service.dbhelper.DBQuery;
import com.pms.service.dbhelper.DBQueryOpertion;
import com.pms.service.exception.ApiResponseException;
import com.pms.service.mockbean.ApiConstants;
import com.pms.service.mockbean.CustomerBean;
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
		return "supplierId";
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

		if (ApiUtil.isEmpty(params.get(SupplierBean.SUPPLIER_NAME))) {
			throw new ApiResponseException("供应商名称不能为空");
		}

		if (params.get(ApiConstants.MONGO_ID) != null) {
			Map<String, Object> query = new HashMap<String, Object>();
			query.put(ApiConstants.MONGO_ID, new DBQuery(DBQueryOpertion.NOT_EQUALS, params.get(ApiConstants.MONGO_ID)));
			query.put(SupplierBean.SUPPLIER_NAME, params.get(SupplierBean.SUPPLIER_NAME));

			if (this.dao.exist(query, DBBean.SUPPLIER)) {
				throw new ApiResponseException("供应商名称不能重复");
			}

		}
		if (this.dao.exist(SupplierBean.SUPPLIER_NAME, params.get(SupplierBean.SUPPLIER_NAME), DBBean.SUPPLIER)) {

			Map<String, Object> old = this.dao.findOne(SupplierBean.SUPPLIER_NAME, params.get(SupplierBean.SUPPLIER_NAME), DBBean.SUPPLIER);
			params.put(ApiConstants.MONGO_ID, old.get(ApiConstants.MONGO_ID));
			this.dao.updateById(params, DBBean.SUPPLIER);
			return params;
		} else {
			if (params.get(ApiConstants.MONGO_ID) != null) {
				return this.dao.updateById(params, DBBean.SUPPLIER);
			} else {
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
                String[] row = list.get(i);
                eq.put("supplierName", getRowColumnValue(row, keyMap, "公司名称"));
                eq.put("supplierCate", getRowColumnValue(row, keyMap, "产品类型"));
                eq.put("supplierAddress", getRowColumnValue(row, keyMap, "地址"));
                eq.put("supplierContact", getRowColumnValue(row, keyMap, "联系人"));
                eq.put("supplierContactMobile", getRowColumnValue(row, keyMap, "手机"));
                eq.put("supplierContactPhone", getRowColumnValue(row, keyMap, "电话"));
                eq.put("supplierFax", getRowColumnValue(row, keyMap, "传真"));
                eq.put("supplierReviewTime", getRowColumnValue(row, keyMap, "评审时间"));
                eq.put("supplierRemark", getRowColumnValue(row, keyMap, "备注"));
                
                
                if(!ApiUtil.isEmpty(eq.get("supplierName"))){
                	
                    this.create(eq);

                }

            }

        } catch (Exception e) {

            throw new ApiResponseException("Import eqCostList error.", null, "模板格式错误");
        }

    }

}
