package com.tensorldease.backend.controller;

import com.tensorldease.backend.dto.request.UpdateProfilRequest;
import com.tensorldease.backend.dto.response.UserResponse;
import com.tensorldease.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService;

    // FR-03: Update Profil
    @PutMapping("/update/{userId}")
    public ResponseEntity<?> updateProfil(
            @PathVariable String userId,
            @Valid @RequestBody UpdateProfilRequest request) {
        try {
            UserResponse response = userService.updateProfil(userId, request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // FR-04: Hapus Akun
    @DeleteMapping("/delete/{userId}")
    public ResponseEntity<?> deleteAkun(@PathVariable String userId) {
        try {
            userService.deleteAkun(userId);
            return ResponseEntity.ok("Akun berhasil dihapus");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // FR-06: Logout
    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            userService.logout(token);
            return ResponseEntity.ok("Logout berhasil");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}