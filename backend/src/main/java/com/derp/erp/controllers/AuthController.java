package com.derp.erp.controllers;

import com.derp.erp.dtos.RegisterRequest;
import com.derp.erp.models.Role;
import com.derp.erp.models.User;
import com.derp.erp.repositories.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.Set;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        if (userRepository.findByUsername(registerRequest.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: Username is already taken!");
        }

        User user = new User(registerRequest.getUsername(), passwordEncoder.encode(registerRequest.getPassword()));

        Set<Role> roles = new HashSet<>();
        String reqRole = registerRequest.getRole();

        if (reqRole == null || reqRole.isBlank()) {
            // Default to STUDENT if no role is specified
            roles.add(Role.ROLE_STUDENT);
        } else {
            switch (reqRole.toUpperCase()) {
                case "ADMIN":
                    roles.add(Role.ROLE_ADMIN);
                    break;
                case "STUDENT":
                    roles.add(Role.ROLE_STUDENT);
                    break;
                default:
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: Role not found.");
            }
        }
        user.setRoles(roles);
        User savedUser = userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser() {
        // Spring Security with HTTP Basic handles authentication prior to this point.
        // If this endpoint is reached, authentication was successful.
        // You can return user details or a success token/message here if needed.
        // For Phase 1, a simple success message is sufficient.
        return ResponseEntity.ok("Login successful");
    }

    // A simple authenticated endpoint for testing
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        // Example: Retrieve authenticated user's details from SecurityContextHolder
        // org.springframework.security.core.Authentication authentication = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        // String currentPrincipalName = authentication.getName();
        // return ResponseEntity.ok("Currently logged in user: " + currentPrincipalName);
        // For now, just a confirmation
        return ResponseEntity.ok("You are authenticated");
    }
} 