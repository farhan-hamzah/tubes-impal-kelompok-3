package com.tensorldease.backend.service;

import com.tensorldease.backend.dto.request.KontrakClientRequest;
import com.tensorldease.backend.dto.request.KontrakRequest;
import com.tensorldease.backend.dto.response.KontrakResponse;
import com.tensorldease.backend.model.*;
import com.tensorldease.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class KontrakService {

    @Autowired
    private KontrakRepository kontrakRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PaketHpcRepository paketHpcRepository;

    // FR-10: Buat Kontrak oleh Admin
    public KontrakResponse buatKontrak(KontrakRequest request) {
        Client client = clientRepository.findById(request.getClientId())
            .orElseThrow(() -> new RuntimeException("Client tidak ditemukan!"));

        Admin admin = adminRepository.findById(request.getAdminId())
            .orElseThrow(() -> new RuntimeException("Admin tidak ditemukan!"));

        PaketHpc paket = paketHpcRepository.findById(request.getPaketId())
            .orElseThrow(() -> new RuntimeException("Paket tidak ditemukan!"));

        return simpanKontrak(client, admin, paket,
            request.getTanggalMulai(),
            request.getDurasibulan(),
            request.getCatatan());
    }

    // Buat Kontrak oleh Client sendiri (tanpa admin)
    public KontrakResponse buatKontrakByClient(KontrakClientRequest request) {
        Client client = clientRepository.findById(request.getClientId())
            .orElseThrow(() -> new RuntimeException("Client tidak ditemukan!"));

        PaketHpc paket = paketHpcRepository.findById(request.getPaketId())
            .orElseThrow(() -> new RuntimeException("Paket tidak ditemukan!"));

        if (!paket.getStatus().equals("AKTIF")) {
            throw new RuntimeException("Paket tidak tersedia!");
        }

        if (paket.getJumlahUnit() <= 0) {
            throw new RuntimeException("Unit paket sudah habis!");
        }

        return simpanKontrak(client, null, paket,
            request.getTanggalMulai(),
            request.getDurasibulan(),
            request.getCatatan());
    }

    // Method internal untuk simpan kontrak (reusable)
    private KontrakResponse simpanKontrak(
            Client client, Admin admin, PaketHpc paket,
            LocalDate tanggalMulai, Integer durasibulan, String catatan) {

        LocalDate tanggalBerakhir = tanggalMulai.plusMonths(durasibulan);
        Double totalBiaya = paket.getTarif() * durasibulan;

        String nomorKontrak = "KTR-" + LocalDate.now().getYear()
            + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Kontrak kontrak = new Kontrak();
        kontrak.setKontrakId(UUID.randomUUID().toString());
        kontrak.setClient(client);
        kontrak.setAdmin(admin);
        kontrak.setPaketHpc(paket);
        kontrak.setNomorKontrak(nomorKontrak);
        kontrak.setTanggalMulai(tanggalMulai);
        kontrak.setTanggalBerakhir(tanggalBerakhir);
        kontrak.setDurasibulan(durasibulan);
        kontrak.setTotalBiaya(totalBiaya);
        kontrak.setCatatan(catatan);
        kontrak.setStatus(
            tanggalMulai.isAfter(LocalDate.now()) ? "PENDING" : "ACTIVE"
        );

        kontrakRepository.save(kontrak);

        // Kurangi unit paket yang tersedia
        paket.setJumlahUnit(paket.getJumlahUnit() - 1);
        paketHpcRepository.save(paket);

        return mapToResponse(kontrak);
    }

    // FR-11: Lihat semua kontrak (Admin)
    public List<KontrakResponse> getAllKontrak() {
        return kontrakRepository.findAll()
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    // FR-11: Filter by status (Admin)
    public List<KontrakResponse> getKontrakByStatus(String status) {
        return kontrakRepository.findByStatus(status)
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    // FR-11: Kontrak milik client
    public List<KontrakResponse> getKontrakByClient(String clientId) {
        return kontrakRepository.findByClientClientId(clientId)
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    // FR-11: Detail kontrak
    public KontrakResponse getKontrakById(String kontrakId) {
        Kontrak kontrak = kontrakRepository.findById(kontrakId)
            .orElseThrow(() -> new RuntimeException("Kontrak tidak ditemukan!"));
        return mapToResponse(kontrak);
    }

    private KontrakResponse mapToResponse(Kontrak kontrak) {
        return new KontrakResponse(
            kontrak.getKontrakId(),
            kontrak.getNomorKontrak(),
            kontrak.getPaketHpc().getNamaPaket(),
            kontrak.getClient().getUser().getNama(),
            kontrak.getTanggalMulai(),
            kontrak.getTanggalBerakhir(),
            kontrak.getDurasibulan(),
            kontrak.getTotalBiaya(),
            kontrak.getStatus(),
            kontrak.getCatatan()
        );
    }
}