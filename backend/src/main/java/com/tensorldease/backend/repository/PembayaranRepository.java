package com.tensorldease.backend.repository;

import com.tensorldease.backend.model.Pembayaran;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PembayaranRepository extends JpaRepository<Pembayaran, String> {
    Optional<Pembayaran> findByInvoiceInvoiceId(String invoiceId);
}