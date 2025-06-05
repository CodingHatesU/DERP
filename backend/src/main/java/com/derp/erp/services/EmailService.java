package com.derp.erp.services;

import com.derp.erp.models.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Async
    public void sendWelcomeEmail(User user) {
        logger.info("Attempting to send welcome email to: {}", user.getUsername());
        try {
            // Simulate network delay or email sending process
            Thread.sleep(3000); // 3 seconds delay
            logger.info("Successfully sent welcome email to: {}. Thread: {}", user.getUsername(), Thread.currentThread().getName());
        } catch (InterruptedException e) {
            logger.error("Email sending to {} was interrupted", user.getUsername(), e);
            Thread.currentThread().interrupt(); // Preserve interrupt status
        }
    }
} 