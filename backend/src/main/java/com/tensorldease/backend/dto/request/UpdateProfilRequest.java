package com.tensorldease.backend.dto.request;

import lombok.Data;

@Data
public class UpdateProfilRequest {
    private String nama;
    private String nomorTelepon;
    private String passwordLama;
    private String passwordBaru;
}