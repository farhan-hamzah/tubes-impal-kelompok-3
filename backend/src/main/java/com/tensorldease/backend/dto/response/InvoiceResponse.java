package com.tensorldease.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDate;

@Data
@AllArgsConstructor
public class InvoiceResponse {
    private String invoiceId;
    private String nomorInvoice;
    private String namaClient;
    private String nomorKontrak;
    private LocalDate tagihanMulai;
    private LocalDate tagihanAkhir;
    private Double jumlahTagihan;
    private LocalDate tanggalJatuhTempo;
    private LocalDate tanggalPembayaran;
    private String statusPembayaran;
}