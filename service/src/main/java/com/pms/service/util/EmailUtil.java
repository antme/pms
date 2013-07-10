package com.pms.service.util;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;

import org.apache.commons.mail.Email;
import org.apache.commons.mail.EmailAttachment;
import org.apache.commons.mail.EmailException;
import org.apache.commons.mail.MultiPartEmail;
import org.apache.commons.mail.SimpleEmail;

import com.pms.service.cfg.ConfigurationManager;
import com.pms.service.mockbean.PurchaseCommonBean;
import com.pms.service.mockbean.SalesContractBean;

public class EmailUtil {

    public static void sendMail(String subject, String toEmail, String toName, String content, String file) {

        List<String> emails = new ArrayList<String>();
        emails.add(toEmail);
        sendListMail(subject, emails, content, file);
    }

    public static void sendListMail(String subject, List<String> emails, String content, String file) {

        if (!ApiUtil.isEmpty(file) && new File(file).exists()) {

            EmailAttachment attachment = new EmailAttachment();
            attachment.setPath(file);
            attachment.setDisposition(EmailAttachment.ATTACHMENT);
            attachment.setName(new File(file).getName());

            MultiPartEmail memail = new MultiPartEmail();

            try {
                memail.attach(attachment);
            } catch (EmailException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
            
            sendEmails(subject, emails, content, memail);
        } else {
            // Create the email message
            Email email = new SimpleEmail();

            sendEmails(subject, emails, content, email);
        }
    }

    private static void sendEmails(String subject, List<String> emails, String content, Email email) {
        try {
            // 设置发送主机的服务器地址
            email.setHostName(ConfigurationManager.getProperty("smtp"));
            List<InternetAddress> address = new ArrayList<InternetAddress>();
            for (String mail : emails) {
                address.add(new InternetAddress(mail));
            }
            // 设置收件人邮箱
            email.setTo(address);

            // 发件人邮箱
            email.setFrom(ConfigurationManager.getProperty("email"), "工程管理系统");

            // 如果要求身份验证，设置用户名、密码，分别为发件人在邮件服务器上注册的用户名和密码
            email.setAuthentication(ConfigurationManager.getProperty("email"), ConfigurationManager.getProperty("password"));

            // 设置邮件的主题
            email.setSubject(subject);

            // 邮件正文消息
            email.setMsg(content);
            email.send();
        } catch (EmailException | AddressException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }

    public static void sendEqListEmails(String subject, List<String> emails, String content, List<Map<String, Object>> eqList) {
        String colunmTitleHeaders[] = new String[] { "No.", "物料代码", "产品名称", "规格型号", "单位", "数量", "成本单价"};
        
        String colunmHeaders[] = new String[] { SalesContractBean.SC_EQ_LIST_NO, SalesContractBean.SC_EQ_LIST_MATERIAL_CODE, SalesContractBean.SC_EQ_LIST_PRODUCT_NAME, SalesContractBean.SC_EQ_LIST_PRODUCT_TYPE, SalesContractBean.SC_EQ_LIST_UNIT,
                PurchaseCommonBean.EQCOST_APPLY_AMOUNT, SalesContractBean.SC_EQ_LIST_BASE_PRICE };
        
        String fileDir = ConfigurationManager.getProperty("file_dir");

        File f = new File(fileDir + UUID.randomUUID().toString() + ".xls");
        if (!ApiUtil.isEmpty(emails)) {

            ExcleUtil eu = new ExcleUtil();
            eu.createFile(f);
            eu = new ExcleUtil(f);

            int i=0;
            try {
                eu.addRow(0, colunmTitleHeaders, i);
            } catch (Exception e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }

            for (Map<String, Object> map : eqList) {
                int length = colunmHeaders.length;
                String rowsData[] = new String[length];

                int index = 0;
                for (String key : colunmHeaders) {
                    if (map.get(key) == null) {
                        rowsData[index] = "";
                    } else {
                        rowsData[index] = map.get(key).toString();
                    }
                    index++;
                }

                try {
                    eu.addRow(0, rowsData, ++i);
                } catch (Exception e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }
            }

        }
        sendListMail(subject, emails, content, f.getAbsolutePath());

    }

    public static void sendEqListEmails(String subject, List<Object> emails, String content, Object object) {

        List<String> userEmails = new ArrayList<String>();
        for(Object obj : emails){
            userEmails.add(obj.toString());
        }
        List<Map<String, Object>> eqList = (List<Map<String, Object>>)object;
        
        sendEqListEmails(subject, userEmails, content, eqList);
        
    }

}
