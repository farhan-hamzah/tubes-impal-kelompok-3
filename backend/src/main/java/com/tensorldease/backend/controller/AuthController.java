package com.tensorldease.backend.controller;

import com.tensorldease.backend.dto.request.ForgotPasswordRequest;
import com.tensorldease.backend.dto.request.LoginRequest;
import com.tensorldease.backend.dto.request.RegisterRequest;
import com.tensorldease.backend.dto.request.ResetPasswordRequest;
import com.tensorldease.backend.dto.response.LoginResponse;
import com.tensorldease.backend.dto.response.UserResponse;
import com.tensorldease.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            UserResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            LoginResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Forgot Password — token dikembalikan langsung di response
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {
        try {
            String token = authService.forgotPassword(request);
            return ResponseEntity.ok(Map.of(
                "message", "Token reset password berhasil dibuat. Gunakan token ini untuk reset password.",
                "resetToken", token,
                "expiredIn", "15 menit"
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Reset Password
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
        @Valid @RequestBody ResetPasswordRequest request) {
        try {
            authService.resetPassword(request);
            return ResponseEntity.ok("Password berhasil direset!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}