package com.tensorldease.backend.dto.request;

import lombok.Data;
import java.time.LocalDate;

@Data
public class KontrakClientRequest {
    private String clientId;
    private String paketId;
    private LocalDate tanggalMulai;
    private Integer durasibulan;
    private String catatan;
}