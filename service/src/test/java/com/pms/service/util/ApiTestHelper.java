package com.pms.service.util;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.google.gson.Gson;

public class ApiTestHelper {

    private static Logger logger = LogManager.getLogger(ApiTestHelper.class);

    @SuppressWarnings("unchecked")
    public static Map<String, Object> loadJsonMapTestData(Class<?> clz, String resource, String key) {

        InputStream inputStream = clz.getResourceAsStream(resource + ".properties");
        Properties properties = new Properties();
        try {
            properties.load(inputStream);
        } catch (IOException e) {

            logger.error("Load test data failed!", e);
        }

        return new Gson().fromJson(properties.getProperty(key), HashMap.class);

    }

}
