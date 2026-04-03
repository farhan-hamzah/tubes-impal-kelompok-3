package com.tensorldease.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "paket_hpc")
@Data
public class PaketHpc {

    @Id
    @Column(name = "paket_id")
    private String paketId;

    @ManyToOne
    @JoinColumn(name = "admin_id")
    private Admin admin;

    @Column(name = "nama_paket", nullable = false, unique = true)
    private String namaPaket;

    @Column(name = "spesifikasi_gpu", nullable = false)
    private String spesifikasiGpu;

    @Column(name = "jumlah_cpu_core", nullable = false)
    private Integer jumlahCpuCore;

    @Column(name = "kapasitas_ram_gb", nullable = false)
    private Integer kapasitasRamGb;

    private String storage;

    @Column(name = "jumlah_unit", nullable = false)
    private Integer jumlahUnit;

    private String status = "AKTIF";

    @Column(nullable = false)
    private Double tarif;

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