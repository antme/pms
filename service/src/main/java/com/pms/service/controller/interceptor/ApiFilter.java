package com.pms.service.controller.interceptor;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.web.util.NestedServletException;

import com.pms.service.annotation.InitBean;
import com.pms.service.controller.AbstractController;
import com.pms.service.exception.ApiLoginException;
import com.pms.service.exception.ApiResponseException;

public class ApiFilter extends AbstractController implements Filter {

    @Override
    public void destroy() {

    }

    private static Logger logger = LogManager.getLogger(ApiFilter.class);

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain) throws IOException, ServletException {

        try {
            loginCheck((HttpServletRequest) request);

            filterChain.doFilter(request, response);
        } catch (Exception e) {

            if (e instanceof NestedServletException) {
                Throwable t = e.getCause();

                if (t instanceof ApiResponseException) {
                    // do nothing
                } else {
                    logger.fatal("Fatal error when user try to call API ", e);
                }
            } else if (e instanceof ApiLoginException) {
                forceLogin((HttpServletRequest) request, (HttpServletResponse) response);
            } else {
                logger.fatal("Fatal error when user try to call API ", e);
            }
            responseServerError(e.getCause(), (HttpServletRequest) request, (HttpServletResponse) response);
        }

    }

    @Override
    public void init(FilterConfig arg0) throws ServletException {

    }

    protected void loginCheck(HttpServletRequest request) {
        if (InitBean.loginPath.contains(request.getPathInfo())) {
            if (request.getSession().getAttribute("userId") == null) {
                throw new ApiLoginException();
            }
        }

    }
}
