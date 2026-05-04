package com.tensorldease.backend.repository;

import com.tensorldease.backend.model.SessionToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface SessionTokenRepository extends JpaRepository<SessionToken, String> {
    Optional<SessionToken> findByToken(String token);
    @Transactional
    void deleteByToken(String token);
}