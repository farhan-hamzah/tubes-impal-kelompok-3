package com.tensorldease.backend.repository;

import com.tensorldease.backend.model.RiwayatTarif;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RiwayatTarifRepository extends JpaRepository<RiwayatTarif, String> {
    List<RiwayatTarif> findByPaketHpcPaketId(String paketId);
}