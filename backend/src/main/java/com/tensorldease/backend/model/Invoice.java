package com.tensorldease.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "invoice")
@Data
public class Invoice {

    @Id
    @Column(name = "invoice_id")
    private String invoiceId;

    @ManyToOne
    @JoinColumn(name = "kontrak_id", nullable = false)
    private Kontrak kontrak;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @Column(name = "nomor_invoice", nullable = false, unique = true)
    private String nomorInvoice;

    @Column(name = "tagihan_mulai", nullable = false)
    private LocalDate tagihanMulai;

    @Column(name = "tagihan_akhir", nullable = false)
    private LocalDate tagihanAkhir;

    @Column(name = "jumlah_tagihan", nullable = false)
    private Double jumlahTagihan;

    @Column(name = "tanggal_jatuh_tempo", nullable = false)
    private LocalDate tanggalJatuhTempo;

    @Column(name = "tanggal_pembayaran")
    private LocalDate tanggalPembayaran;

    @Column(name = "status_pembayaran")
    private String statusPembayaran = "UNPAID";

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}