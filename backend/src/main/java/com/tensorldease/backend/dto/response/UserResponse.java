package com.tensorldease.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserResponse {
    private String userId;
    private String nama;
    private String email;
    private String nomorTelepon;
    private String role;
    private Boolean isActive;
}