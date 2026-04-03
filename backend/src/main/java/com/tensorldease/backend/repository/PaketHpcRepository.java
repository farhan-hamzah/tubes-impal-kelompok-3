package com.tensorldease.backend.repository;

import com.tensorldease.backend.model.PaketHpc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PaketHpcRepository extends JpaRepository<PaketHpc, String> {
    List<PaketHpc> findByStatus(String status);
    Boolean existsByNamaPaket(String namaPaket);
}