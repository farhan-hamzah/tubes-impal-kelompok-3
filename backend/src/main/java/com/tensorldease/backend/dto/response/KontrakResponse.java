package com.tensorldease.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDate;

@Data
@AllArgsConstructor
public class KontrakResponse {
    private String kontrakId;
    private String nomorKontrak;
    private String namaPaket;
    private String namaClient;
    private LocalDate tanggalMulai;
    private LocalDate tanggalBerakhir;
    private Integer durasibulan;
    private Double totalBiaya;
    private String status;
    private String catatan;
}