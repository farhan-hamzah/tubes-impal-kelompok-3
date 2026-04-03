package com.tensorldease.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "kontrak")
@Data
public class Kontrak {

    @Id
    @Column(name = "kontrak_id")
    private String kontrakId;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @ManyToOne
    @JoinColumn(name = "admin_id", nullable = false)
    private Admin admin;

    @ManyToOne
    @JoinColumn(name = "paket_id", nullable = false)
    private PaketHpc paketHpc;

    @Column(name = "nomor_kontrak", nullable = false, unique = true)
    private String nomorKontrak;

    @Column(name = "tanggal_mulai", nullable = false)
    private LocalDate tanggalMulai;

    @Column(name = "tanggal_berakhir", nullable = false)
    private LocalDate tanggalBerakhir;

    @Column(name = "durasi_bulan", nullable = false)
    private Integer durasibulan;

    @Column(name = "total_biaya", nullable = false)
    private Double totalBiaya;

    private String status = "PENDING";

    private String catatan;

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