package com.tensorldease.backend.controller;

import com.tensorldease.backend.dto.request.KontrakRequest;
import com.tensorldease.backend.dto.response.KontrakResponse;
import com.tensorldease.backend.service.KontrakService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class KontrakController {

    @Autowired
    private KontrakService kontrakService;

    // FR-10: Buat kontrak (Admin)
    @PostMapping("/admin/kontrak")
    public ResponseEntity<?> buatKontrak(@RequestBody KontrakRequest request) {
        try {
            KontrakResponse response = kontrakService.buatKontrak(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // FR-11: Lihat semua kontrak (Admin)
    @GetMapping("/admin/kontrak")
    public ResponseEntity<List<KontrakResponse>> getAllKontrak() {
        return ResponseEntity.ok(kontrakService.getAllKontrak());
    }

    // FR-11: Filter kontrak by status (Admin)
    @GetMapping("/admin/kontrak/status/{status}")
    public ResponseEntity<List<KontrakResponse>> getKontrakByStatus(
            @PathVariable String status) {
        return ResponseEntity.ok(kontrakService.getKontrakByStatus(status));
    }

    // FR-11: Detail kontrak
    @GetMapping("/kontrak/{kontrakId}")
    public ResponseEntity<?> getKontrakById(@PathVariable String kontrakId) {
        try {
            return ResponseEntity.ok(kontrakService.getKontrakById(kontrakId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // FR-11: Kontrak milik client
    @GetMapping("/client/kontrak/{clientId}")
    public ResponseEntity<List<KontrakResponse>> getKontrakByClient(
            @PathVariable String clientId) {
        return ResponseEntity.ok(kontrakService.getKontrakByClient(clientId));
    }
}