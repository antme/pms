package com.pms.service.cfg;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.Properties;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class ConfigurationManager {

    public static final String DB_NAME = "dbName";

    private static Logger logger = LogManager.getLogger(ConfigurationManager.class);

    private static Properties properties = new Properties();

    public static void setConfiguraion(String configFile) {

        if (properties.isEmpty()) {

            try {
                // load resource from class root path
                properties.load(ConfigurationManager.class.getResourceAsStream("/default.properties"));
            } catch (IOException e) {
                logger.fatal("Load property file failed: ".concat(configFile), e);
            }

            try {
                // load resource from class root path
                properties.load(ConfigurationManager.class.getResourceAsStream("/".concat(configFile)));
            } catch (IOException e) {
                logger.fatal("Load property file failed: ".concat(configFile), e);
            }

            try {
                properties.load(ConfigurationManager.class.getResourceAsStream("/validators/applicationResources.properties"));
            } catch (IOException e) {
                logger.fatal("Load property file failed: ".concat("/validators/applicationResources.properties"), e);
            }

        }
    }

    public static String getDbName() {
        return properties.getProperty(DB_NAME);
    }
    
    public static String getProperty(String key) {

        return properties.getProperty(key);
    }


    public static String getSystemMessage(String type) {

        if (properties.getProperty(type) != null) {
            try {
                return new String(properties.getProperty(type).getBytes("ISO-8859-1"), "UTF-8");
            } catch (UnsupportedEncodingException e) {
                // do nothing
            }
        } else {

            return String.format("please configure the error message [%s] in applicationResources.properties", type);
        }
        return null;
    }

    public static void setProperties(String key, String value) {
        properties.setProperty(key, value);
    }

}
