package com.pms.service.mockbean;

public class EqCostListBean {
	public static final String EQ_LIST_SC_ID = "scId";

	public static final String EQ_LIST_NO = "eqcostNo";//序号
	public static final String EQ_LIST_MATERIAL_CODE = "eqcostMaterialCode";//物料代码
	public static final String EQ_LIST_PRODUCT_NAME = "eqcostProductName";//产品名称
	public static final String EQ_LIST_PRODUCT_TYPE = "eqcostProductType";  //规格型号
	public static final String EQ_LIST_AMOUNT = "eqcostAmount";//数量
	public static final String EQ_LIST_LEFT_AMOUNT = "eqcostLeftAmount";//剩余数量
	public static final String EQ_LIST_UNIT = "eqcostUnit";//单位
	public static final String EQ_LIST_BRAND = "eqcostBrand";//品牌
	public static final String EQ_LIST_BASE_PRICE = "eqcostBasePrice"; //成本价
	public static final String EQ_LIST_TOTAL_AMOUNT = "eqcostTotalAmount";//小计
	public static final String EQ_LIST_MEMO = "eqcostMemo";//备注
	public static final String EQ_LIST_DISCOUNT_RATE = "eqcostDiscountRate"; //折扣率
	
	//设备清单变更后的统计真实数量，固定放到设备清单某条记录中
	public static final String EQ_LIST_REAL_AMOUNT = "eqcostRealAmount";//真实数量
	
	public static final String EQ_LIST_VERSION_NO = "versionNo";//记录成本设备变更

	//新加字段
	public static final String EQ_LIST_SALES_BASE_PRICE = "eqcostSalesBasePrice"; //销售单价
	public static final String EQ_LIST_TAX_TYPE = "eqcostTaxType";//税收类型：增值税 or 非增值税
	public static final String EQ_LIST_CATEGORY = "eqcostCategory";//所属 分类
	public static final String EQ_LIST_LAST_BASE_PRICE = "eqcostLastBasePrice";//最终成本单价

	public static final String EQ_LIST_CODE_PREFIX = "HTCB-"; //每批次成本清单对应一个编号 eg.HTCB-1301-1
	public static final String EQ_LIST_CODE = "eqcostCode"; //每批次成本清单对应一个编号
	
}
