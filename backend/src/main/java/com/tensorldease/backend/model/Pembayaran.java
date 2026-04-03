package com.tensorldease.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "pembayaran")
@Data
public class Pembayaran {

    @Id
    @Column(name = "pembayaran_id")
    private String pembayaranId;

    @OneToOne
    @JoinColumn(name = "invoice_id", nullable = false, unique = true)
    private Invoice invoice;

    @ManyToOne
    @JoinColumn(name = "validasi_by")
    private Admin validasiBy;

    @Column(name = "jumlah_dibayar", nullable = false)
    private Double jumlahDibayar;

    @Column(name = "tanggal_pembayaran")
    private LocalDateTime tanggalPembayaran;

    @Column(name = "waktu_validasi")
    private LocalDateTime waktuValidasi;

    @Column(name = "metode_pembayaran")
    private String metodePembayaran;

    @Column(name = "bukti_pembayaran")
    private String buktiPembayaran;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        tanggalPembayaran = LocalDateTime.now();
    }
}