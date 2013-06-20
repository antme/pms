package com.pms.service.mockbean;

import java.math.BigDecimal;

public class PurchaseRequest extends PurchaseCommonBean {

    private BigDecimal requestedTotalMoney;

    private int requestedNumbers;

    private float moneyOfContract;

    private int requestTotalOfCountract;

    private float allRequestedNumbersOfCountract;

    private float totalRequestedMoneyOfContract;

    private float numbersPercentOfContract;

    private float moneyPercentOfContract;

    public BigDecimal getRequestedTotalMoney() {
        return requestedTotalMoney;
    }

    public void setRequestedTotalMoney(BigDecimal requestedTotalMoney) {
        this.requestedTotalMoney = requestedTotalMoney;
    }

    public int getRequestedNumbers() {
        return requestedNumbers;
    }

    public void setRequestedNumbers(int requestedNumbers) {
        this.requestedNumbers = requestedNumbers;
    }

    public float getMoneyOfContract() {
        return moneyOfContract;
    }

    public void setMoneyOfContract(float moneyOfContract) {
        this.moneyOfContract = moneyOfContract;
    }

    public int getRequestTotalOfCountract() {
        return requestTotalOfCountract;
    }

    public void setRequestTotalOfCountract(int requestTotalOfCountract) {
        this.requestTotalOfCountract = requestTotalOfCountract;
    }

    public float getAllRequestedNumbersOfCountract() {
        return allRequestedNumbersOfCountract;
    }

    public void setAllRequestedNumbersOfCountract(float allRequestedNumbersOfCountract) {
        this.allRequestedNumbersOfCountract = allRequestedNumbersOfCountract;
    }

    public float getTotalRequestedMoneyOfContract() {
        return totalRequestedMoneyOfContract;
    }

    public void setTotalRequestedMoneyOfContract(float totalRequestedMoneyOfContract) {
        this.totalRequestedMoneyOfContract = totalRequestedMoneyOfContract;
    }

    public float getNumbersPercentOfContract() {
        return numbersPercentOfContract;
    }

    public void setNumbersPercentOfContract(float numbersPercentOfContract) {
        this.numbersPercentOfContract = numbersPercentOfContract;
    }

    public float getMoneyPercentOfContract() {
        return moneyPercentOfContract;
    }

    public void setMoneyPercentOfContract(float moneyPercentOfContract) {
        this.moneyPercentOfContract = moneyPercentOfContract;
    }



}
