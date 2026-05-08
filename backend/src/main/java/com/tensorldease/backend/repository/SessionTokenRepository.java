package com.tensorldease.backend.repository;

import com.tensorldease.backend.model.SessionToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface SessionTokenRepository extends JpaRepository<SessionToken, String> {
    Optional<SessionToken> findByToken(String token);
    void deleteByToken(String token);
}