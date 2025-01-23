package com.social.a406.util;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import java.util.concurrent.ThreadLocalRandom;

@Component
public class VerifyEmailUtil {

    @Value("${spring.mail.username}")
    private String serviceEmailAddress;

    @Autowired
    private JavaMailSender mailSender;

    private static final String EMAIL_SUBJECT = "[Fillit] Email Verification Code";
    private static final String EMAIL_LOGO_URL = "https://fillit-db.s3.us-east-2.amazonaws.com/etc/%EB%A1%9C%EA%B3%A0_(1).png";
    private static final String EMAIL_HTML_TEMPLATE =
            "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;'>"
                    + "<div style='text-align: center;'>"
                    + "<img src='%s' alt='FiLLit Logo' style='max-width: 150px; height: auto; margin-bottom: 20px;'/>"
                    + "</div>"
                    + "<h2 style='color: #3498db; text-align: center;'>FiLLiT Email Verification</h2>"
                    + "<p style='font-size: 16px; color: #333;'>Hello!</p>"
                    + "<p style='font-size: 16px; color: #333;'>Please enter the verification code below:</p>"
                    + "<div style='padding: 15px; background-color: #f3f3f3; text-align: center; border-radius: 5px; font-size: 24px; font-weight: bold; color: #2c3e50;'>%s</div>"
                    + "<p style='font-size: 14px; color: #999; text-align: center;'>This code is valid for <b style='color: #e74c3c;'>5 minutes</b>.</p>"
                    + "<hr style='border: none; border-top: 1px solid #ddd;'>"
                    + "<p style='font-size: 12px; color: #777; text-align: center;'>Return to FiLLit to change your password</p>"
                    + "</div>";

    public static String generateVerificationCode() {
        int code = 100000 + ThreadLocalRandom.current().nextInt(900000); // 100000 ~ 999999
        return String.valueOf(code);
    }

    public String sendEmail(String to, String verifyCode) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(EMAIL_SUBJECT);
            helper.setFrom(serviceEmailAddress);

            String htmlContent = String.format(EMAIL_HTML_TEMPLATE, EMAIL_LOGO_URL, verifyCode);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            return "Successfully sent email verification code.";

        } catch (Exception e) {
            throw new MailSendException("Failed to send email verification code", e);
        }
    }
}
