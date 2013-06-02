package com.pms.service.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.pms.service.mockbean.ApiConstants;
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

}
