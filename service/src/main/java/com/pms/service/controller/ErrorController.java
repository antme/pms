package com.pms.service.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.pms.service.exception.ApiResponseException;

@Controller
@RequestMapping("/error")
public class ErrorController extends AbstractController {

    @RequestMapping("/404")
    public void response404(HttpServletRequest request, HttpServletResponse response) {

        ApiResponseException e = new ApiResponseException("404 not found service", "404");

        responseServerError(e, request, response);
    }

    @RequestMapping("/500")
    public void response500(HttpServletRequest request, HttpServletResponse response) {
        ApiResponseException e = new ApiResponseException("500 error", "500");
        responseServerError(e, request, response);
    }

}
