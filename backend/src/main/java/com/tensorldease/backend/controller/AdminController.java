package com.tensorldease.backend.controller;

import com.tensorldease.backend.dto.response.UserResponse;
import com.tensorldease.backend.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // FR-05: Lihat Daftar & Detail Client
    @GetMapping("/clients")
    public ResponseEntity<List<UserResponse>> getAllClients() {
        return ResponseEntity.ok(adminService.getAllClients());
    }

    @GetMapping("/clients/{clientId}")
    public ResponseEntity<?> getClientDetail(@PathVariable String clientId) {
        try {
            return ResponseEntity.ok(adminService.getClientDetail(clientId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}