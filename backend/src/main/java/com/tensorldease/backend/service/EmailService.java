package com.tensorldease.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendResetPasswordEmail(String toEmail, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("TensorLease - Reset Password");
        message.setText(
            "Halo!\n\n" +
            "Kamu menerima email ini karena ada permintaan reset password untuk akunmu.\n\n" +
            "Gunakan token berikut untuk reset password:\n\n" +
            token + "\n\n" +
            "Token ini berlaku selama 15 menit.\n\n" +
            "Jika kamu tidak merasa meminta reset password, abaikan email ini.\n\n" +
            "Salam,\nTim TensorLease"
        );
        mailSender.send(message);
    }
}