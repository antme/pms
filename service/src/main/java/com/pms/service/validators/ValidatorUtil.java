package com.pms.service.validators;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.ResourceBundle;
import java.util.Set;

import org.apache.commons.validator.ValidatorResources;

import com.pms.service.service.AbstractService;

public class ValidatorUtil {

    private static ResourceBundle apps = null;

    private static ValidatorResources actionResources = null;

    private static Map<String, ValidatorResources> vresources = null;
    
    public static void init(){
        intiBundle();
        getValidateActions();
        initValidatorResources();
    }


    public static ResourceBundle intiBundle() {
        if (apps == null) {
            apps = ResourceBundle.getBundle("validators.applicationResources");
        }
        return apps;
    }

    public static ValidatorResources getValidateActions() {

        if (actionResources == null) {
            InputStream in = null;
            try {
                in = AbstractService.class.getResourceAsStream("/validators/validator-actions.xml");
                actionResources = new ValidatorResources(in);
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                // Make sure we close the input stream.
                if (in != null) {
                    try {
                        in.close();
                    } catch (IOException e) {
                        // TODO Auto-generated catch block
                        e.printStackTrace();
                    }
                }
            }
        }
        
        return actionResources;
    }

    public static Map<String, ValidatorResources> initValidatorResources() {
        String[] validators = new String[] {  "user" };

        if (vresources == null) {
            vresources = new HashMap<String, ValidatorResources>();
            for (String validator : validators) {
                InputStream in = null;
                ValidatorResources resources = null;

                try {
                    String validatorPath = "/validators/validator-".concat(validator).concat(".xml");
                    in = AbstractService.class.getResourceAsStream(validatorPath);
                    resources = new ValidatorResources(in);
                } catch (Exception e) {
                    e.printStackTrace();
                } finally {
                    // Make sure we close the input stream.
                    if (in != null) {
                        try {
                            in.close();
                        } catch (IOException e) {
                            // TODO Auto-generated catch block
                            e.printStackTrace();
                        }
                    }
                }
                Set<String> set = actionResources.getValidatorActions().keySet();
                for (String key : set) {
                    resources.addValidatorAction(actionResources.getValidatorAction(key));
                }

                vresources.put(validator, resources);
            }
        }
        
        return vresources;
    }

}
