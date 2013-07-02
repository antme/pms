package com.pms.service.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.pms.service.mockbean.ApiConstants;
import com.pms.service.mockbean.CustomerBean;
import com.pms.service.mockbean.DBBean;
import com.pms.service.service.AbstractService;
import com.pms.service.service.ISupplierService;

public class SupplierServiceImpl extends AbstractService implements ISupplierService {

	@Override
	public String geValidatorFileName() {
		return "supplier";
	}

	public Map<String, Object> list(Map<String, Object> params) {
		return dao.list(null, DBBean.SUPPLIER);
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
		return dao.add(params, DBBean.SUPPLIER);
	}
	
    public Map<String, Object> importSupplier(Map<String, Object> params) {
        Map<String, Object> supplier = dao.findOne("supplierName", params.get("supplierName"), DBBean.SUPPLIER);
        if (supplier == null) {
            supplier = dao.add(supplier, DBBean.SUPPLIER);
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
                    data.put(mergeKey, mergeKey);
                } else {
                    data.put(mergeKey, "");
                }
            }
        }
    }

}
