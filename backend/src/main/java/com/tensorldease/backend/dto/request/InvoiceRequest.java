package com.tensorldease.backend.dto.request;

import lombok.Data;
import java.time.LocalDate;

@Data
public class InvoiceRequest {
    private String kontrakId;
    private LocalDate tagihanMulai;
    private LocalDate tagihanAkhir;
    private LocalDate tanggalJatuhTempo;
}