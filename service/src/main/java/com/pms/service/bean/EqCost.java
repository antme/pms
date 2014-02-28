package com.pms.service.bean;

import com.pms.service.annotation.IntegerColumn;

public class EqCost extends BaseEntity {

	@IntegerColumn
	private Integer eqcostNo;

	private String eqcostMaterialCode;

	private String eqcostProductName;
	private String eqcostProductType;
	private String eqcostAmount;
	private String eqcostUnit;
	private String eqcostBrand;
	private String eqcostBasePrice;
	private String eqcostTotalAmount;
	private String eqcostDiscountRate;
	private String eqcostMemo;
	public Integer getEqcostNo() {
		return eqcostNo;
	}
	public void setEqcostNo(Integer eqcostNo) {
		this.eqcostNo = eqcostNo;
	}
	public String getEqcostMaterialCode() {
		return eqcostMaterialCode;
	}
	public void setEqcostMaterialCode(String eqcostMaterialCode) {
		this.eqcostMaterialCode = eqcostMaterialCode;
	}
	public String getEqcostProductName() {
		return eqcostProductName;
	}
	public void setEqcostProductName(String eqcostProductName) {
		this.eqcostProductName = eqcostProductName;
	}
	public String getEqcostProductType() {
		return eqcostProductType;
	}
	public void setEqcostProductType(String eqcostProductType) {
		this.eqcostProductType = eqcostProductType;
	}
	public String getEqcostAmount() {
		return eqcostAmount;
	}
	public void setEqcostAmount(String eqcostAmount) {
		this.eqcostAmount = eqcostAmount;
	}
	public String getEqcostUnit() {
		return eqcostUnit;
	}
	public void setEqcostUnit(String eqcostUnit) {
		this.eqcostUnit = eqcostUnit;
	}
	public String getEqcostBrand() {
		return eqcostBrand;
	}
	public void setEqcostBrand(String eqcostBrand) {
		this.eqcostBrand = eqcostBrand;
	}
	public String getEqcostBasePrice() {
		return eqcostBasePrice;
	}
	public void setEqcostBasePrice(String eqcostBasePrice) {
		this.eqcostBasePrice = eqcostBasePrice;
	}
	public String getEqcostTotalAmount() {
		return eqcostTotalAmount;
	}
	public void setEqcostTotalAmount(String eqcostTotalAmount) {
		this.eqcostTotalAmount = eqcostTotalAmount;
	}
	public String getEqcostDiscountRate() {
		return eqcostDiscountRate;
	}
	public void setEqcostDiscountRate(String eqcostDiscountRate) {
		this.eqcostDiscountRate = eqcostDiscountRate;
	}
	public String getEqcostMemo() {
		return eqcostMemo;
	}
	public void setEqcostMemo(String eqcostMemo) {
		this.eqcostMemo = eqcostMemo;
	}
	
	
	
}
