package com.tensorldease.backend.repository;

import com.tensorldease.backend.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.time.LocalDate;
import java.util.Optional;


@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, String> {
    List<Invoice> findByClientClientId(String clientId);
    List<Invoice> findByStatusPembayaran(String statusPembayaran);
    Optional<Invoice> findByNomorInvoice(String nomorInvoice);
    boolean existsByKontrakKontrakIdAndTagihanMulai(String kontrakId, LocalDate tagihanMulai);
}