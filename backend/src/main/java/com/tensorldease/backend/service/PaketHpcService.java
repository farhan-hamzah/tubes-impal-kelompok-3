package com.tensorldease.backend.service;

import com.tensorldease.backend.model.PaketHpc;
import com.tensorldease.backend.repository.KontrakRepository;
import com.tensorldease.backend.repository.PaketHpcRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class PaketHpcService {

    @Autowired
    private PaketHpcRepository paketHpcRepository;

    @Autowired
    private KontrakRepository kontrakRepository;

    // FR-07: Get semua paket
    public List<PaketHpc> getAllPaket() {
        return paketHpcRepository.findAll();
    }

    // FR-07: Get paket by ID
    public PaketHpc getPaketById(String paketId) {
        return paketHpcRepository.findById(paketId)
            .orElseThrow(() -> new RuntimeException("Paket tidak ditemukan!"));
    }

    // FR-08: Buat paket baru
    public PaketHpc createPaket(PaketHpc paketHpc) {
        if (paketHpcRepository.existsByNamaPaket(paketHpc.getNamaPaket())) {
            throw new RuntimeException("Nama paket sudah digunakan!");
        }
        paketHpc.setPaketId(UUID.randomUUID().toString());
        return paketHpcRepository.save(paketHpc);
    }

    // FR-08: Update paket
    public PaketHpc updatePaket(String paketId, PaketHpc request) {
        PaketHpc paket = paketHpcRepository.findById(paketId)
            .orElseThrow(() -> new RuntimeException("Paket tidak ditemukan!"));

        if (request.getNamaPaket() != null) paket.setNamaPaket(request.getNamaPaket());
        if (request.getSpesifikasiGpu() != null) paket.setSpesifikasiGpu(request.getSpesifikasiGpu());
        if (request.getJumlahCpuCore() != null) paket.setJumlahCpuCore(request.getJumlahCpuCore());
        if (request.getKapasitasRamGb() != null) paket.setKapasitasRamGb(request.getKapasitasRamGb());
        if (request.getStorage() != null) paket.setStorage(request.getStorage());
        if (request.getJumlahUnit() != null) paket.setJumlahUnit(request.getJumlahUnit());
        if (request.getTarif() != null) paket.setTarif(request.getTarif());
        if (request.getStatus() != null) paket.setStatus(request.getStatus());

        return paketHpcRepository.save(paket);
    }

    // FR-08: Hapus paket
    public void deletePaket(String paketId) {
        PaketHpc paket = paketHpcRepository.findById(paketId)
            .orElseThrow(() -> new RuntimeException("Paket tidak ditemukan!"));

        // Cek apakah paket masih dipakai di kontrak aktif
        boolean adaKontrakAktif = kontrakRepository
            .findByStatus("ACTIVE")
            .stream()
            .anyMatch(k -> k.getPaketHpc().getPaketId().equals(paketId));

        if (adaKontrakAktif) {
            throw new RuntimeException(
                "Paket tidak bisa dihapus karena masih digunakan dalam kontrak aktif!"
            );
        }

        paketHpcRepository.delete(paket);
    }
}