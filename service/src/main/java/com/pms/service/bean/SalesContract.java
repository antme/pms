package com.pms.service.bean;


public class SalesContract extends SCBaseEntity {


	private String contractCode;
	private String contractPerson;

	private String contractType;
	private String contractDate;

	// 首付
	private String contractDownPayment;
	// 首付 备注
	private String contractDownPaymentMemo;

	// 进度款
	private String progressPayment;

	// 质保金
	private String qualityMoney;
	// 质保金 备注
	private String qualityMoneyMemo;

	private String archiveStatus;
	private String runningStatus;
	private String contractAmount;
	private String equipmentAmount;
	private String serviceAmount;
	private String invoiceType;
	private String estimateGrossProfitRate;
	private String estimateGrossProfit;
	private String estimateEqCostAddedTax;
	private String estimateEqCostTax;
	private String estimateSubCost;
	private String estimatePMCost;
	private String estimateDeepDesignCost;
	private String estimateDebugCost;
	private String debugCostType;
	private String estimateTax;
	private String taxType;

	private String estimateOtherCost;
	private String totalEstimateCost;
	
	private String status;
	


	public String getContractCode() {
		return contractCode;
	}

	public void setContractCode(String contractCode) {
		this.contractCode = contractCode;
	}

	public String getContractPerson() {
		return contractPerson;
	}

	public void setContractPerson(String contractPerson) {
		this.contractPerson = contractPerson;
	}

	public String getContractType() {
		return contractType;
	}

	public void setContractType(String contractType) {
		this.contractType = contractType;
	}

	public String getContractDate() {
		return contractDate;
	}

	public void setContractDate(String contractDate) {
		this.contractDate = contractDate;
	}

	public String getContractDownPayment() {
		return contractDownPayment;
	}

	public void setContractDownPayment(String contractDownPayment) {
		this.contractDownPayment = contractDownPayment;
	}

	public String getContractDownPaymentMemo() {
		return contractDownPaymentMemo;
	}

	public void setContractDownPaymentMemo(String contractDownPaymentMemo) {
		this.contractDownPaymentMemo = contractDownPaymentMemo;
	}

	public String getProgressPayment() {
		return progressPayment;
	}

	public void setProgressPayment(String progressPayment) {
		this.progressPayment = progressPayment;
	}

	public String getQualityMoney() {
		return qualityMoney;
	}

	public void setQualityMoney(String qualityMoney) {
		this.qualityMoney = qualityMoney;
	}

	public String getQualityMoneyMemo() {
		return qualityMoneyMemo;
	}

	public void setQualityMoneyMemo(String qualityMoneyMemo) {
		this.qualityMoneyMemo = qualityMoneyMemo;
	}

	public String getArchiveStatus() {
		return archiveStatus;
	}

	public void setArchiveStatus(String archiveStatus) {
		this.archiveStatus = archiveStatus;
	}

	public String getRunningStatus() {
		return runningStatus;
	}

	public void setRunningStatus(String runningStatus) {
		this.runningStatus = runningStatus;
	}

	public String getContractAmount() {
		return contractAmount;
	}

	public void setContractAmount(String contractAmount) {
		this.contractAmount = contractAmount;
	}

	public String getEquipmentAmount() {
		return equipmentAmount;
	}

	public void setEquipmentAmount(String equipmentAmount) {
		this.equipmentAmount = equipmentAmount;
	}

	public String getServiceAmount() {
		return serviceAmount;
	}

	public void setServiceAmount(String serviceAmount) {
		this.serviceAmount = serviceAmount;
	}

	public String getInvoiceType() {
		return invoiceType;
	}

	public void setInvoiceType(String invoiceType) {
		this.invoiceType = invoiceType;
	}

	public String getEstimateGrossProfitRate() {
		return estimateGrossProfitRate;
	}

	public void setEstimateGrossProfitRate(String estimateGrossProfitRate) {
		this.estimateGrossProfitRate = estimateGrossProfitRate;
	}

	public String getEstimateGrossProfit() {
		return estimateGrossProfit;
	}

	public void setEstimateGrossProfit(String estimateGrossProfit) {
		this.estimateGrossProfit = estimateGrossProfit;
	}

	public String getEstimateEqCostAddedTax() {
		return estimateEqCostAddedTax;
	}

	public void setEstimateEqCostAddedTax(String estimateEqCostAddedTax) {
		this.estimateEqCostAddedTax = estimateEqCostAddedTax;
	}

	public String getEstimateEqCostTax() {
		return estimateEqCostTax;
	}

	public void setEstimateEqCostTax(String estimateEqCostTax) {
		this.estimateEqCostTax = estimateEqCostTax;
	}

	public String getEstimateSubCost() {
		return estimateSubCost;
	}

	public void setEstimateSubCost(String estimateSubCost) {
		this.estimateSubCost = estimateSubCost;
	}

	public String getEstimatePMCost() {
		return estimatePMCost;
	}

	public void setEstimatePMCost(String estimatePMCost) {
		this.estimatePMCost = estimatePMCost;
	}

	public String getEstimateDeepDesignCost() {
		return estimateDeepDesignCost;
	}

	public void setEstimateDeepDesignCost(String estimateDeepDesignCost) {
		this.estimateDeepDesignCost = estimateDeepDesignCost;
	}

	public String getEstimateDebugCost() {
		return estimateDebugCost;
	}

	public void setEstimateDebugCost(String estimateDebugCost) {
		this.estimateDebugCost = estimateDebugCost;
	}

	public String getDebugCostType() {
		return debugCostType;
	}

	public void setDebugCostType(String debugCostType) {
		this.debugCostType = debugCostType;
	}

	public String getEstimateTax() {
		return estimateTax;
	}

	public void setEstimateTax(String estimateTax) {
		this.estimateTax = estimateTax;
	}

	public String getTaxType() {
		return taxType;
	}

	public void setTaxType(String taxType) {
		this.taxType = taxType;
	}

	public String getEstimateOtherCost() {
		return estimateOtherCost;
	}

	public void setEstimateOtherCost(String estimateOtherCost) {
		this.estimateOtherCost = estimateOtherCost;
	}

	public String getTotalEstimateCost() {
		return totalEstimateCost;
	}

	public void setTotalEstimateCost(String totalEstimateCost) {
		this.totalEstimateCost = totalEstimateCost;
	}

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
	
	

}
