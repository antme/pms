package com.pms.service.exception;

import com.pms.service.cfg.ConfigurationManager;

public class ApiResponseException extends RuntimeException {
    /**
     * 
     */
    private static final long serialVersionUID = 1L;

    private Object tipMsg;

    /**
     * Constructs an <code>ApiApiIllegalArgumentException</code> with no detail
     * message.
     */
    @SuppressWarnings("unused")
    private ApiResponseException() {
        super();
    }
    
    @SuppressWarnings("unused")
    public ApiResponseException(String msg) {
        super(msg);
    }

    /**
     * Constructs an <code>ApiApiIllegalArgumentException</code> with the
     * specified detail message.
     * 
     * @param s
     *            the detail message.
     */
    public ApiResponseException(String logMsg, Object tipKey) {
        super(logMsg);
        this.tipMsg = ConfigurationManager.getSystemMessage(tipKey.toString());
    }

    public ApiResponseException(String logMsg, Object tipKey, Object userMsg) {
        super(logMsg);
        this.tipMsg = userMsg;
    }

    public Object getTipMsg() {
        return tipMsg;
    }

    public void setTipMsg(Object tipMsg) {
        this.tipMsg = tipMsg;
    }

}
