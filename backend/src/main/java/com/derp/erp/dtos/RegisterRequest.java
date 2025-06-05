package com.derp.erp.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    @NotBlank(message = "Username cannot be blank")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;

    @NotBlank(message = "Password cannot be blank")
    @Size(min = 6, max = 100, message = "Password must be between 6 and 100 characters")
    private String password;

    // Role can be optional, defaults to STUDENT if not provided, so no NotBlank here.
    // Specific role validation (e.g., must be 'ADMIN' or 'STUDENT') is handled in AuthController.
    private String role; // e.g., "ADMIN" or "STUDENT"
} 