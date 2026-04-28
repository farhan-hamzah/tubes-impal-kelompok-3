package com.tensorldease.backend.service;

import com.tensorldease.backend.dto.request.UpdateProfilRequest;
import com.tensorldease.backend.dto.response.UserResponse;
import com.tensorldease.backend.model.User;
import com.tensorldease.backend.repository.ClientRepository;
import com.tensorldease.backend.repository.KontrakRepository;
import com.tensorldease.backend.repository.SessionTokenRepository;
import com.tensorldease.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private KontrakRepository kontrakRepository;

    @Autowired
    private SessionTokenRepository sessionTokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // FR-03: Update Profil
    public UserResponse updateProfil(String userId, UpdateProfilRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User tidak ditemukan!"));

        if (request.getNama() != null && !request.getNama().isEmpty()) {
            user.setNama(request.getNama());
        }

        if (request.getNomorTelepon() != null) {
            user.setNomorTelepon(request.getNomorTelepon());
        }

        // Ganti password kalau ada
        if (request.getPasswordBaru() != null && !request.getPasswordBaru().isEmpty()) {
            if (request.getPasswordLama() == null ||
                !passwordEncoder.matches(request.getPasswordLama(), user.getPassword())) {
                throw new RuntimeException("Password lama tidak sesuai!");
            }
            if (request.getPasswordBaru().length() < 8) {
                throw new RuntimeException("Password baru minimal 8 karakter!");
            }
            user.setPassword(passwordEncoder.encode(request.getPasswordBaru()));
        }

        userRepository.save(user);

        return new UserResponse(
            user.getUserId(),
            user.getNama(),
            user.getEmail(),
            user.getNomorTelepon(),
            user.getUserRole().name(),
            user.getIsActive()
        );
    }

    // FR-04: Hapus Akun (soft delete)
    public void deleteAkun(String userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User tidak ditemukan!"));

        // Cek apakah client punya kontrak ACTIVE atau PENDING
        clientRepository.findByUserUserId(userId).ifPresent(client -> {
            boolean adaKontrakBerjalan = kontrakRepository
                .existsByClientClientIdAndStatusIn(
                    client.getClientId(),
                    List.of("ACTIVE", "PENDING")
                );
            if (adaKontrakBerjalan) {
                throw new RuntimeException(
                    "Akun tidak dapat dihapus karena masih memiliki kontrak aktif!"
                );
            }
        });

        // Soft delete: nonaktifkan akun, bukan hapus dari DB
        user.setIsActive(false);
        userRepository.save(user);
    }

    // FR-06: Logout
    public void logout(String token) {
        sessionTokenRepository.findByToken(token)
            .ifPresent(sessionTokenRepository::delete);
    }
}