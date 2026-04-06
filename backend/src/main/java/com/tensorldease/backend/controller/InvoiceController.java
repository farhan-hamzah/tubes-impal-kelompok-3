package com.tensorldease.backend.controller;

import com.tensorldease.backend.dto.request.InvoiceRequest;
import com.tensorldease.backend.dto.request.ValidasiPembayaranRequest;
import com.tensorldease.backend.dto.response.InvoiceResponse;
import com.tensorldease.backend.service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class InvoiceController {

    @Autowired
    private InvoiceService invoiceService;

    // FR-13: Buat Invoice (Admin)
    @PostMapping("/admin/invoice")
    public ResponseEntity<?> buatInvoice(@RequestBody InvoiceRequest request) {
        try {
            InvoiceResponse response = invoiceService.buatInvoice(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // FR-14: Laporan semua invoice (Admin)
    @GetMapping("/admin/invoice")
    public ResponseEntity<List<InvoiceResponse>> getAllInvoice() {
        return ResponseEntity.ok(invoiceService.getAllInvoice());
    }

    // FR-14: Filter by status (Admin)
    @GetMapping("/admin/invoice/status/{status}")
    public ResponseEntity<List<InvoiceResponse>> getInvoiceByStatus(
            @PathVariable String status) {
        return ResponseEntity.ok(invoiceService.getInvoiceByStatus(status));
    }

    // FR-15: Riwayat transaksi client
    @GetMapping("/client/invoice/{clientId}")
    public ResponseEntity<List<InvoiceResponse>> getInvoiceByClient(
            @PathVariable String clientId) {
        return ResponseEntity.ok(invoiceService.getInvoiceByClient(clientId));
    }

    // FR-16: Validasi Pembayaran (Admin)
    @PostMapping("/admin/invoice/validasi/{adminId}")
    public ResponseEntity<?> validasiPembayaran(
            @PathVariable String adminId,
            @RequestBody ValidasiPembayaranRequest request) {
        try {
            InvoiceResponse response = invoiceService.validasiPembayaran(request, adminId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}