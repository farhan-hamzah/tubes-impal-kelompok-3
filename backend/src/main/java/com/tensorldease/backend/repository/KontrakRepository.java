package com.tensorldease.backend.repository;

import com.tensorldease.backend.model.Kontrak;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface KontrakRepository extends JpaRepository<Kontrak, String> {
    List<Kontrak> findByClientClientId(String clientId);
    List<Kontrak> findByStatus(String status);
}