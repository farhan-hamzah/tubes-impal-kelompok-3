package com.tensorldease.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "riwayat_tarif")
@Data
public class RiwayatTarif {

    @Id
    @Column(name = "riwayat_id")
    private String riwayatId;

    @ManyToOne
    @JoinColumn(name = "paket_id", nullable = false)
    private PaketHpc paketHpc;

    @ManyToOne
    @JoinColumn(name = "admin_id")
    private Admin admin;

    @Column(name = "tarif_lama", nullable = false)
    private Double tarifLama;

    @Column(name = "tarif_baru", nullable = false)
    private Double tarifBaru;

    @Column(name = "tanggal_perubahan")
    private LocalDateTime tanggalPerubahan;

    @Column(name = "catatan_perubahan")
    private String catatanPerubahan;

    @PrePersist
    protected void onCreate() {
        tanggalPerubahan = LocalDateTime.now();
    }
}