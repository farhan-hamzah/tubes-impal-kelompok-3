package com.tensorldease.backend.service;

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

    // FR-10: Buat Kontrak Retainer
    public KontrakResponse buatKontrak(KontrakRequest request) {
        Client client = clientRepository.findById(request.getClientId())
            .orElseThrow(() -> new RuntimeException("Client tidak ditemukan!"));

        Admin admin = adminRepository.findById(request.getAdminId())
            .orElseThrow(() -> new RuntimeException("Admin tidak ditemukan!"));

        PaketHpc paket = paketHpcRepository.findById(request.getPaketId())
            .orElseThrow(() -> new RuntimeException("Paket tidak ditemukan!"));

        // Hitung tanggal berakhir dan total biaya
        LocalDate tanggalBerakhir = request.getTanggalMulai()
            .plusMonths(request.getDurasibulan());
        Double totalBiaya = paket.getTarif() * request.getDurasibulan();

        // Generate nomor kontrak
        String nomorKontrak = "KTR-" + LocalDate.now().getYear() + 
            "-" + String.format("%03d", kontrakRepository.count() + 1);

        Kontrak kontrak = new Kontrak();
        kontrak.setKontrakId(UUID.randomUUID().toString());
        kontrak.setClient(client);
        kontrak.setAdmin(admin);
        kontrak.setPaketHpc(paket);
        kontrak.setNomorKontrak(nomorKontrak);
        kontrak.setTanggalMulai(request.getTanggalMulai());
        kontrak.setTanggalBerakhir(tanggalBerakhir);
        kontrak.setDurasibulan(request.getDurasibulan());
        kontrak.setTotalBiaya(totalBiaya);
        kontrak.setCatatan(request.getCatatan());

        // Set status berdasarkan tanggal mulai
        if (request.getTanggalMulai().isAfter(LocalDate.now())) {
            kontrak.setStatus("PENDING");
        } else {
            kontrak.setStatus("ACTIVE");
        }

        kontrakRepository.save(kontrak);

        return mapToResponse(kontrak);
    }

    // FR-11: Lihat semua kontrak (Admin)
    public List<KontrakResponse> getAllKontrak() {
        return kontrakRepository.findAll()
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    // FR-11: Lihat kontrak by status (Admin)
    public List<KontrakResponse> getKontrakByStatus(String status) {
        return kontrakRepository.findByStatus(status)
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    // FR-11: Lihat kontrak milik client
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