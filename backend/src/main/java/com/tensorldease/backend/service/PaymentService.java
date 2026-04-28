package com.tensorldease.backend.service;

import com.midtrans.httpclient.error.MidtransError;
import com.midtrans.service.MidtransSnapApi;
import com.tensorldease.backend.dto.request.PaymentRequest;
import com.tensorldease.backend.dto.response.PaymentResponse;
import com.tensorldease.backend.model.Invoice;
import com.tensorldease.backend.repository.InvoiceRepository;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class PaymentService {

    @Autowired
    private MidtransSnapApi snapApi;

    @Autowired
    private InvoiceRepository invoiceRepository;

    public PaymentResponse createSnapToken(PaymentRequest request) {
        Invoice invoice = invoiceRepository.findById(request.getInvoiceId())
            .orElseThrow(() -> new RuntimeException("Invoice tidak ditemukan!"));

        if (invoice.getStatusPembayaran().equals("PAID")) {
            throw new RuntimeException("Invoice sudah dibayar!");
        }

        // Build Midtrans request body
        Map<String, Object> params = new HashMap<>();

        // Transaction details — order_id harus unik, pakai nomorInvoice
        Map<String, Object> transactionDetails = new HashMap<>();
        transactionDetails.put("order_id", invoice.getNomorInvoice());
        transactionDetails.put("gross_amount", invoice.getJumlahTagihan().longValue());
        params.put("transaction_details", transactionDetails);

        // Customer details
        Map<String, String> customerDetails = new HashMap<>();
        customerDetails.put("first_name", invoice.getClient().getUser().getNama());
        customerDetails.put("email", invoice.getClient().getUser().getEmail());
        params.put("customer_details", customerDetails);

        try {
            JSONObject result = snapApi.createTransaction(params);
            return new PaymentResponse(
                result.getString("token"),
                result.getString("redirect_url")
            );
        } catch (MidtransError e) {
            throw new RuntimeException("Gagal membuat token Midtrans: " + e.getMessage());
        }
    }
}