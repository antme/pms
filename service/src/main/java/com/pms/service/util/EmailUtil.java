package com.pms.service.util;

import java.util.ArrayList;
import java.util.List;

import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;

import org.apache.commons.mail.EmailException;
import org.apache.commons.mail.SimpleEmail;

import com.pms.service.cfg.ConfigurationManager;

public class EmailUtil {

    public static void sendMail(String subject, String toEmail, String content) {
        SimpleEmail email = new SimpleEmail();

        try {
            // 设置发送主机的服务器地址
            email.setHostName(ConfigurationManager.getProperty("smtp"));

            // 设置收件人邮箱
            email.addTo(toEmail);

            // 发件人邮箱
            email.setFrom(ConfigurationManager.getProperty("email"), "工程管理系统");

            // 如果要求身份验证，设置用户名、密码，分别为发件人在邮件服务器上注册的用户名和密码
            email.setAuthentication(ConfigurationManager.getProperty("email"), ConfigurationManager.getProperty("password"));

            // 设置邮件的主题
            email.setSubject(subject);

            // 邮件正文消息
            email.setMsg(content);
            email.send();
        } catch (EmailException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }

    public static void sendListMail(String subject, List<String> emails, String content) {
        SimpleEmail email = new SimpleEmail();

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
}
