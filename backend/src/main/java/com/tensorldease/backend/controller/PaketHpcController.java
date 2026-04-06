package com.tensorldease.backend.controller;

import com.tensorldease.backend.model.PaketHpc;
import com.tensorldease.backend.service.PaketHpcService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class PaketHpcController {

    @Autowired
    private PaketHpcService paketHpcService;

    // FR-07: Lihat Katalog (Client & Admin)
    @GetMapping("/api/paket")
    public ResponseEntity<List<PaketHpc>> getAllPaket() {
        return ResponseEntity.ok(paketHpcService.getAllPaket());
    }

    @GetMapping("/api/paket/{paketId}")
    public ResponseEntity<?> getPaketById(@PathVariable String paketId) {
        try {
            return ResponseEntity.ok(paketHpcService.getPaketById(paketId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // FR-08: Kelola Paket (Admin only)
    @PostMapping("/api/admin/paket")
    public ResponseEntity<?> createPaket(@RequestBody PaketHpc paketHpc) {
        try {
            return ResponseEntity.ok(paketHpcService.createPaket(paketHpc));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/api/admin/paket/{paketId}")
    public ResponseEntity<?> updatePaket(
            @PathVariable String paketId,
            @RequestBody PaketHpc paketHpc) {
        try {
            return ResponseEntity.ok(paketHpcService.updatePaket(paketId, paketHpc));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/api/admin/paket/{paketId}")
    public ResponseEntity<?> deletePaket(@PathVariable String paketId) {
        try {
            paketHpcService.deletePaket(paketId);
            return ResponseEntity.ok("Paket berhasil dihapus");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}