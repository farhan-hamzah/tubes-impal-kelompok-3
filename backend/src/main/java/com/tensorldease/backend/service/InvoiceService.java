package com.tensorldease.backend.service;

import com.tensorldease.backend.dto.request.InvoiceRequest;
import com.tensorldease.backend.dto.request.ValidasiPembayaranRequest;
import com.tensorldease.backend.dto.response.InvoiceResponse;
import com.tensorldease.backend.model.*;
import com.tensorldease.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class InvoiceService {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private KontrakRepository kontrakRepository;

    @Autowired
    private PembayaranRepository pembayaranRepository;

    @Autowired
    private AdminRepository adminRepository;

    // FR-13: Buat Invoice
    public InvoiceResponse buatInvoice(InvoiceRequest request) {
        Kontrak kontrak = kontrakRepository.findById(request.getKontrakId())
            .orElseThrow(() -> new RuntimeException("Kontrak tidak ditemukan!"));

        if (!kontrak.getStatus().equals("ACTIVE")) {
            throw new RuntimeException("Kontrak tidak aktif!");
        }

        // Generate nomor invoice
        String nomorInvoice = "INV-" + java.time.LocalDate.now().getYear()
            + "-" + String.format("%03d", invoiceRepository.count() + 1);

        Invoice invoice = new Invoice();
        invoice.setInvoiceId(UUID.randomUUID().toString());
        invoice.setKontrak(kontrak);
        invoice.setClient(kontrak.getClient());
        invoice.setNomorInvoice(nomorInvoice);
        invoice.setTagihanMulai(request.getTagihanMulai());
        invoice.setTagihanAkhir(request.getTagihanAkhir());
        invoice.setJumlahTagihan(kontrak.getPaketHpc().getTarif());
        invoice.setTanggalJatuhTempo(request.getTanggalJatuhTempo());
        invoice.setStatusPembayaran("UNPAID");

        invoiceRepository.save(invoice);
        return mapToResponse(invoice);
    }

    // FR-14: Laporan semua invoice (Admin)
    public List<InvoiceResponse> getAllInvoice() {
        return invoiceRepository.findAll()
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    // FR-14: Filter by status
    public List<InvoiceResponse> getInvoiceByStatus(String status) {
        return invoiceRepository.findByStatusPembayaran(status)
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    // FR-15: Riwayat transaksi client
    public List<InvoiceResponse> getInvoiceByClient(String clientId) {
        return invoiceRepository.findByClientClientId(clientId)
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    // FR-16: Validasi Pembayaran
    public InvoiceResponse validasiPembayaran(
            ValidasiPembayaranRequest request,
            String adminId) {

        Invoice invoice = invoiceRepository.findById(request.getInvoiceId())
            .orElseThrow(() -> new RuntimeException("Invoice tidak ditemukan!"));

        if (invoice.getStatusPembayaran().equals("PAID")) {
            throw new RuntimeException("Invoice sudah dibayar!");
        }

        Admin admin = adminRepository.findById(adminId)
            .orElseThrow(() -> new RuntimeException("Admin tidak ditemukan!"));

        // Buat record pembayaran
        Pembayaran pembayaran = new Pembayaran();
        pembayaran.setPembayaranId(UUID.randomUUID().toString());
        pembayaran.setInvoice(invoice);
        pembayaran.setValidasiBy(admin);
        pembayaran.setJumlahDibayar(request.getJumlahDibayar());
        pembayaran.setMetodePembayaran(request.getMetodePembayaran());
        pembayaran.setBuktiPembayaran(request.getBuktiPembayaran());
        pembayaran.setWaktuValidasi(LocalDateTime.now());
        pembayaranRepository.save(pembayaran);

        // Update status invoice
        invoice.setStatusPembayaran("PAID");
        invoice.setTanggalPembayaran(java.time.LocalDate.now());
        invoiceRepository.save(invoice);

        return mapToResponse(invoice);
    }

    private InvoiceResponse mapToResponse(Invoice invoice) {
        return new InvoiceResponse(
            invoice.getInvoiceId(),
            invoice.getNomorInvoice(),
            invoice.getClient().getUser().getNama(),
            invoice.getKontrak().getNomorKontrak(),
            invoice.getTagihanMulai(),
            invoice.getTagihanAkhir(),
            invoice.getJumlahTagihan(),
            invoice.getTanggalJatuhTempo(),
            invoice.getTanggalPembayaran(),
            invoice.getStatusPembayaran()
        );
    }
}