package com.pms.service.util;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.http.Header;
import org.apache.http.HeaderElement;
import org.apache.http.HttpEntity;
import org.apache.http.HttpException;
import org.apache.http.HttpResponse;
import org.apache.http.HttpResponseInterceptor;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.GzipDecompressingEntity;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.protocol.HttpContext;
import org.apache.http.util.EntityUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.pms.service.mockbean.ApiConstants;

public class HttpClientUtil {

    private static Logger logger = LogManager.getLogger(HttpClientUtil.class);

    /**
     * 
     * Request a get request with data paramter
     * 
     * @param url
     * @param parameters
     * @return
     */
    public static String doJSONGet(String url, Map<String, Object> parameters) {
        try {
            HttpClient httpClient = new DefaultHttpClient();
            HttpResponse response = null;
            URIBuilder builder = new URIBuilder(url);

            builder.setParameter(ApiConstants.JSON_PARAMETERS_LABEL, parameters.toString());
            URI uri = builder.build();
            HttpGet httpget = new HttpGet(uri);

            response = httpClient.execute(httpget);
            HttpEntity entity = response.getEntity();
            if (entity != null) {
                return EntityUtils.toString(entity);
            }

        } catch (ClientProtocolException e) {
            logger.error("ClientProtocolException when try to get data from ".concat(url), e);
        } catch (IOException e) {
            logger.error("IOException when try to get data from ".concat(url), e);
        } catch (URISyntaxException e) {
            logger.error("URISyntaxException when try to get data from ".concat(url), e);
        }
        return null;
    }

    /**
     * 
     * Request a get request with data paramter
     * 
     * @param url
     * @param parameters
     * @return
     */
    public static String doJSONGet(String url, String value) {
        try {
            HttpClient httpClient = new DefaultHttpClient();
            HttpResponse response = null;
            URIBuilder builder = new URIBuilder(url);

            builder.setParameter(ApiConstants.JSON_PARAMETERS_LABEL, value);
            URI uri = builder.build();
            HttpGet httpget = new HttpGet(uri);
            httpget.addHeader("token", "test");
            response = httpClient.execute(httpget);
            HttpEntity entity = response.getEntity();
            if (entity != null) {
                return EntityUtils.toString(entity);
            }

        } catch (ClientProtocolException e) {
            logger.error("ClientProtocolException when try to get data from ".concat(url), e);
        } catch (IOException e) {
            logger.error("IOException when try to get data from ".concat(url), e);
        } catch (URISyntaxException e) {
            logger.error("URISyntaxException when try to get data from ".concat(url), e);
        }
        return null;
    }

    /**
     * 
     * Request a get request with data paramter
     * 
     * @param url
     * @param parameters
     * @return
     * @throws UnsupportedEncodingException
     */
    public static String doGet(String url, Map<String, Object> parameters) throws UnsupportedEncodingException {
        // url = URLEncoder.encode(url, "UTF-8");
        try {
            HttpClient httpClient = new DefaultHttpClient();
            HttpResponse response = null;
            URIBuilder builder = new URIBuilder(url);
            if (parameters != null) {
                Set<String> keys = parameters.keySet();
                for (String key : keys) {
                    builder.setParameter(key, parameters.get(key).toString());
                }
            }
            URI uri = builder.build();

            // builder.
            HttpGet httpget = new HttpGet(uri);

            response = httpClient.execute(httpget);
            HttpEntity entity = response.getEntity();
            if (entity != null) {
                return EntityUtils.toString(entity);
            }

        } catch (ClientProtocolException e) {
            logger.error("ClientProtocolException when try to get data from ".concat(url), e);
        } catch (IOException e) {
            logger.error("IOException when try to get data from ".concat(url), e);
        } catch (URISyntaxException e) {
            logger.error("URISyntaxException when try to get data from ".concat(url), e);
        }
        return null;
    }

    public static String doPost(String url, Map<String, Object> parameters) {
        HttpClient httpClient = new DefaultHttpClient();
        HttpResponse response = null;
        HttpPost method = new HttpPost(url);

        List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>();

        Set<String> keys = parameters.keySet();
        for (String key : keys) {
            nameValuePairs.add(new BasicNameValuePair(key, parameters.get(key).toString()));

        }
        UrlEncodedFormEntity rentity = null;
        try {
            rentity = new UrlEncodedFormEntity(nameValuePairs, "UTF-8");
        } catch (UnsupportedEncodingException e) {
            logger.error("UnsupportedEncodingException when try to encode data for ".concat(url), e);
        }
        try {
            method.setEntity(rentity);
            response = httpClient.execute(method);
            HttpEntity entity = response.getEntity();
            if (entity != null) {
                return EntityUtils.toString(entity);
            }

        } catch (ClientProtocolException e) {
            logger.error("ClientProtocolException when try to post data to ".concat(url), e);
        } catch (IOException e) {
            logger.error("IOException when try to post data to ".concat(url), e);
        }
        return null;
    }

    public static String doJSONPost(String url, Map<String, Object> parameters, String clientName) {
        DefaultHttpClient httpClient = new DefaultHttpClient();
        HttpResponse response = null;
        HttpPost method = new HttpPost(url);
        List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>();
        nameValuePairs.add(new BasicNameValuePair(ApiConstants.JSON_PARAMETERS_LABEL, parameters.toString()));
        UrlEncodedFormEntity rentity = null;
        try {
            rentity = new UrlEncodedFormEntity(nameValuePairs, "UTF-8");
        } catch (UnsupportedEncodingException e) {
            logger.error("UnsupportedEncodingException when try to encode data for ".concat(url), e);
        }
        
        
        httpClient.addResponseInterceptor(new HttpResponseInterceptor() {
            public void process(final HttpResponse response, final HttpContext context) throws HttpException, IOException {
                HttpEntity entity = response.getEntity();
                Header ceheader = entity.getContentEncoding();
                if (ceheader != null) {
                    for (HeaderElement element : ceheader.getElements()) {
                        if (element.getName().equalsIgnoreCase("gzip")) {
                            response.setEntity(new GzipDecompressingEntity(response.getEntity()));
                            return;
                        }
                    }
                }
            }
        });
        try {
            method.addHeader("accept-encoding", "gzip,deflate");
            method.addHeader("clientName", clientName);
            // method.addHeader("user-agent","Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0; Alexa Toolbar; Maxthon 2.0)");
            method.setEntity(rentity);
            response = httpClient.execute(method);
            HttpEntity entity = response.getEntity();
            if (entity != null) {
                return EntityUtils.toString(entity);
            }

        } catch (ClientProtocolException e) {
            logger.error("ClientProtocolException when try to post data to ".concat(url), e);
        } catch (IOException e) {
            logger.error("IOException when try to post data to ".concat(url), e);
        }
        return null;
    }

}
