package com.tensorldease.backend.controller;

import com.tensorldease.backend.dto.request.PaymentRequest;
import com.tensorldease.backend.dto.response.PaymentResponse;
import com.tensorldease.backend.repository.InvoiceRepository;
import com.tensorldease.backend.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
// CORS ditangani global di SecurityConfig — tidak perlu @CrossOrigin di sini
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Value("${midtrans.server-key}")
    private String serverKey;

    // FIX: invoiceId sekarang dari @PathVariable, sesuai dengan panggilan frontend
    // Frontend memanggil: POST /api/payment/snap-token/{invoiceId}
    @PostMapping("/snap-token/{invoiceId}")
    public ResponseEntity<?> getSnapToken(@PathVariable String invoiceId) {
        try {
            PaymentRequest request = new PaymentRequest();
            request.setInvoiceId(invoiceId);
            PaymentResponse response = paymentService.createSnapToken(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Webhook callback dari Midtrans (notifikasi setelah bayar)
    @PostMapping("/notification")
    public ResponseEntity<String> handleNotification(@RequestBody Map<String, Object> payload) {
        try {
            String orderId          = (String) payload.get("order_id");
            String statusCode       = (String) payload.get("status_code");
            String grossAmount      = (String) payload.get("gross_amount");
            String signatureKey     = (String) payload.get("signature_key");
            String transactionStatus = (String) payload.get("transaction_status");
            String fraudStatus      = (String) payload.get("fraud_status");

            // Verifikasi signature untuk keamanan
            String rawSignature      = orderId + statusCode + grossAmount + serverKey;
            String expectedSignature = sha512(rawSignature);
            if (!expectedSignature.equals(signatureKey)) {
                return ResponseEntity.status(403).body("Invalid signature");
            }

            // Update invoice jika pembayaran sukses
            boolean isSuccess = ("capture".equals(transactionStatus) && "accept".equals(fraudStatus))
                || "settlement".equals(transactionStatus);

            if (isSuccess) {
                invoiceRepository.findByNomorInvoice(orderId).ifPresent(invoice -> {
                    invoice.setStatusPembayaran("PAID");
                    invoice.setTanggalPembayaran(LocalDate.now());
                    invoiceRepository.save(invoice);
                });
            }

            return ResponseEntity.ok("OK");
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    // Helper SHA-512 untuk verifikasi signature Midtrans
    private String sha512(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-512");
            byte[] hash = md.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}