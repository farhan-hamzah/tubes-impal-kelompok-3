package com.tensorldease.backend.scheduler;

import com.tensorldease.backend.model.Invoice;
import com.tensorldease.backend.model.Kontrak;
import com.tensorldease.backend.repository.InvoiceRepository;
import com.tensorldease.backend.repository.KontrakRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Component
public class InvoiceScheduler {

    @Autowired
    private KontrakRepository kontrakRepository;

    @Autowired
    private InvoiceRepository invoiceRepository;

    // Aktifkan kontrak PENDING yang tanggal mulainya sudah lewat — jalan setiap hari jam 00:01
    @Scheduled(cron = "0 1 0 * * *")
    public void aktivasiKontrak() {
        List<Kontrak> kontrakPending = kontrakRepository.findByStatus("PENDING");
        for (Kontrak kontrak : kontrakPending) {
            if (!kontrak.getTanggalMulai().isAfter(LocalDate.now())) {
                kontrak.setStatus("ACTIVE");
                kontrakRepository.save(kontrak);
            }
        }
    }

    // Generate invoice bulanan — jalan setiap tanggal 1, jam 00:05
    @Scheduled(cron = "0 5 0 1 * *")
    public void generateInvoiceBulanan() {
        LocalDate sekarang = LocalDate.now();
        LocalDate periodeAwal = sekarang.withDayOfMonth(1);
        LocalDate periodeAkhir = sekarang.withDayOfMonth(sekarang.lengthOfMonth());

        List<Kontrak> kontrakAktif = kontrakRepository.findByStatus("ACTIVE");

        for (Kontrak kontrak : kontrakAktif) {
            // Skip jika invoice periode ini sudah ada (idempotent)
            boolean sudahAda = invoiceRepository
                .existsByKontrakKontrakIdAndTagihanMulai(
                    kontrak.getKontrakId(), periodeAwal
                );
            if (sudahAda) continue;

            String nomorInvoice = "INV-" + sekarang.getYear()
                + "-" + sekarang.getMonthValue()
                + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();

            Invoice invoice = new Invoice();
            invoice.setInvoiceId(UUID.randomUUID().toString());
            invoice.setKontrak(kontrak);
            invoice.setClient(kontrak.getClient());
            invoice.setNomorInvoice(nomorInvoice);
            invoice.setTagihanMulai(periodeAwal);
            invoice.setTagihanAkhir(periodeAkhir);
            invoice.setJumlahTagihan(kontrak.getPaketHpc().getTarif());
            invoice.setTanggalJatuhTempo(periodeAwal.plusDays(14));
            invoice.setStatusPembayaran("UNPAID");

            invoiceRepository.save(invoice);
        }
    }
}