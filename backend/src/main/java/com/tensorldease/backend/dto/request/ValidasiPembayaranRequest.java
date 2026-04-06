package com.tensorldease.backend.dto.request;

import lombok.Data;

@Data
public class ValidasiPembayaranRequest {
    private String invoiceId;
    private Double jumlahDibayar;
    private String metodePembayaran;
    private String buktiPembayaran;
}