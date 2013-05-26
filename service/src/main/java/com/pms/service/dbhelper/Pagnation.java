package com.pms.service.dbhelper;

public class Pagnation {

    private int limit;

    private int limitStart;

    private int total;

    private int totalPages;

    public Pagnation() {

    }

    public int getLimit() {
        return limit;
    }

    public void setLimit(int limit) {
        this.limit = limit;
    }

    public int getLimitStart() {
        return limitStart;
    }

    public void setLimitStart(int limitStart) {
        this.limitStart = limitStart;
    }

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    public int getTotalPages() {

        if (this.getTotal() == 0) {
            this.totalPages = 0;
        } else {

            if (this.getLimit() > 0) {
                float pages = (float) this.getTotal() / this.getLimit();
                int temp = (int) pages;
                if (pages > temp) {
                    temp++;
                }
                this.totalPages = temp;
            } else {
                this.totalPages = 1;
            }
        }

        return totalPages;
    }

}
