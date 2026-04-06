package com.tensorldease.backend.dto.request;

import lombok.Data;
import java.time.LocalDate;

@Data
public class KontrakRequest {
    private String clientId;
    private String adminId;
    private String paketId;
    private LocalDate tanggalMulai;
    private Integer durasibulan;
    private String catatan;
}