package com.pms.service.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.pms.service.dbhelper.DBQuery;
import com.pms.service.dbhelper.DBQueryOpertion;
import com.pms.service.exception.ApiResponseException;
import com.pms.service.mockbean.ApiConstants;
import com.pms.service.mockbean.CustomerBean;
import com.pms.service.mockbean.DBBean;
import com.pms.service.mockbean.SupplierBean;
import com.pms.service.mockbean.UserBean;
import com.pms.service.service.AbstractService;
import com.pms.service.service.ICustomerService;
import com.pms.service.service.IUserService;
import com.pms.service.util.ApiUtil;
import com.pms.service.util.DataEncrypt;
import com.pms.service.util.status.ResponseCodeConstants;

public class CustomerServiceImpl extends AbstractService implements ICustomerService {

	private static final Logger logger = LogManager.getLogger(CustomerServiceImpl.class);

	@Override
	public String geValidatorFileName() {
		return "customer";
	}

	@Override
	public Map<String, Object> create(Map<String, Object> params) {

		if (this.dao.exist(CustomerBean.NAME, params.get(CustomerBean.NAME), DBBean.CUSTOMER)) {
			throw new ApiResponseException("客户名称不能重复");
		}
		if (ApiUtil.isEmpty(params.get(CustomerBean.NAME))) {
			throw new ApiResponseException("客户名称不能为空");
		}
		params.put(CustomerBean.CODE, generateCode("KH", DBBean.CUSTOMER, CustomerBean.CODE));

		return dao.add(params, DBBean.CUSTOMER);
	}

	public Map<String, Object> get(Map<String, Object> params) {

		return this.dao.findOneByQuery(params, DBBean.CUSTOMER);
	}

	@Override
	public Map<String, Object> update(Map<String, Object> params) {
		if (ApiUtil.isEmpty(params.get(CustomerBean.NAME))) {
			throw new ApiResponseException("客户名称不能为空");
		}

		Map<String, Object> query = new HashMap<String, Object>();
		query.put(ApiConstants.MONGO_ID, new DBQuery(DBQueryOpertion.NOT_EQUALS, params.get(ApiConstants.MONGO_ID)));
		query.put(CustomerBean.NAME, params.get(CustomerBean.NAME));

		if (this.dao.exist(query, DBBean.CUSTOMER)) {
			throw new ApiResponseException("客户名称不能重复");
		}

		return dao.updateById(params, DBBean.CUSTOMER);
	}

	@Override
	public void destroy(Map<String, Object> params) {
		List<String> ids = new ArrayList<String>();
		ids.add(String.valueOf(params.get(ApiConstants.MONGO_ID)));
		dao.deleteByIds(ids, DBBean.CUSTOMER);
	}

	@Override
	public Map<String, Object> list(Map<String, Object> params) {
		return dao.list(params, DBBean.CUSTOMER);
	}

	public Map<String, Object> importCustomer(Map<String, Object> params) {

		Map<String, Object> customer = dao.findOne(CustomerBean.NAME, params.get(CustomerBean.NAME), DBBean.CUSTOMER);
		if (customer == null) {
			customer = create(params);
		}
		return customer;
	}

}
