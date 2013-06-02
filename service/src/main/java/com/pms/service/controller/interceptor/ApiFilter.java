package com.pms.service.controller.interceptor;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

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
import com.pms.service.dao.ICommonDao;
import com.pms.service.exception.ApiLoginException;
import com.pms.service.exception.ApiResponseException;
import com.pms.service.exception.ApiRoleValidException;
import com.pms.service.mockbean.ApiConstants;
import com.pms.service.mockbean.DBBean;
import com.pms.service.mockbean.UserBean;

public class ApiFilter extends AbstractController implements Filter {

    
    private static ICommonDao dao;
    
    @Override
    public void destroy() {

    }

    private static Logger logger = LogManager.getLogger(ApiFilter.class);

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain) throws IOException, ServletException {

        try {
            loginCheck((HttpServletRequest) request);
            roleCheck((HttpServletRequest) request);
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

    public static void initDao(ICommonDao dao){
        ApiFilter.dao = dao;
    }
    
    private void roleCheck(HttpServletRequest request) {
        if (InitBean.rolesValidationMap.get(request.getPathInfo())!=null) {
            
            if (request.getSession().getAttribute("userId") != null) {
                
                Map<String, Object> query =new HashMap<String, Object>();
                query.put("_id", request.getSession().getAttribute("userId"));
                query.put(ApiConstants.LIMIT_KEYS, new String[]{UserBean.GROUPS});
                Map<String, Object> user = dao.findOneByQuery(query, DBBean.USER);
                    
                System.out.println(user);
//                throw new ApiRoleValidException();
           
            }else{
                
                throw new ApiRoleValidException();
            }
            
        }

    }
    
    
    private void loginCheck(HttpServletRequest request) {
        if (InitBean.loginPath.contains(request.getPathInfo())) {
            if (request.getSession().getAttribute("userId") == null) {
                throw new ApiLoginException();
            }
        }

    }
}
