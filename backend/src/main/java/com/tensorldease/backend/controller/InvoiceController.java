package com.tensorldease.backend.controller;

import com.tensorldease.backend.dto.request.InvoiceRequest;
import com.tensorldease.backend.dto.request.ValidasiPembayaranRequest;
import com.tensorldease.backend.dto.response.InvoiceResponse;
import com.tensorldease.backend.service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class InvoiceController {

    @Autowired
    private InvoiceService invoiceService;

    @PostMapping("/admin/invoice")
    public ResponseEntity<?> buatInvoice(@RequestBody InvoiceRequest request) {
        try {
            return ResponseEntity.ok(invoiceService.buatInvoice(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/admin/invoice")
    public ResponseEntity<List<InvoiceResponse>> getAllInvoice() {
        return ResponseEntity.ok(invoiceService.getAllInvoice());
    }

    @GetMapping("/admin/invoice/status/{status}")
    public ResponseEntity<List<InvoiceResponse>> getInvoiceByStatus(@PathVariable String status) {
        return ResponseEntity.ok(invoiceService.getInvoiceByStatus(status));
    }

    @GetMapping("/client/invoice/{clientId}")
    public ResponseEntity<List<InvoiceResponse>> getInvoiceByClient(@PathVariable String clientId) {
        return ResponseEntity.ok(invoiceService.getInvoiceByClient(clientId));
    }

    // Endpoint upload bukti pembayaran transfer manual oleh client
    @PostMapping("/client/invoice/upload-bukti/{invoiceId}")
    public ResponseEntity<?> uploadBukti(
            @PathVariable String invoiceId,
            @RequestBody Map<String, String> body) {
        try {
            String bukti = body.get("buktiPembayaran");
            if (bukti == null || bukti.isEmpty()) {
                return ResponseEntity.badRequest().body("Bukti pembayaran tidak boleh kosong!");
            }
            return ResponseEntity.ok(invoiceService.uploadBuktiPembayaran(invoiceId, bukti));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Validasi manual oleh Admin — hanya bisa jika client sudah upload bukti
    @PostMapping("/admin/invoice/validasi/{adminId}")
    public ResponseEntity<?> validasiPembayaran(
            @PathVariable String adminId,
            @RequestBody ValidasiPembayaranRequest request) {
        try {
            return ResponseEntity.ok(invoiceService.validasiPembayaran(request, adminId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}