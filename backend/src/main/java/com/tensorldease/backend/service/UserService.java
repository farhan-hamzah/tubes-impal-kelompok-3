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
import com.tensorldease.backend.repository.AdminRepository;
import com.tensorldease.backend.model.Admin;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {
    @Autowired
    private AdminRepository adminRepository;

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


    public UserResponse getProfil(String id) {
        User user = userRepository.findById(id)
            .orElseGet(() -> clientRepository.findById(id)
                .map(client -> client.getUser())
                .orElseGet(() -> adminRepository.findById(id)
                    .map(admin -> admin.getUser())
                    .orElseThrow(() -> new RuntimeException("User tidak ditemukan!"))
                )
            );

        return new UserResponse(
            user.getUserId(),
            user.getNama(),
            user.getEmail(),
            user.getNomorTelepon(),
            user.getUserRole().name(),
            user.getIsActive()
        );
    }
       // FR-03: Update Profil
    public UserResponse updateProfil(String id, UpdateProfilRequest request) {
        // Coba cari by userId dulu, kalau tidak ketemu cari by clientId atau adminId
        User user = userRepository.findById(id)
            .orElseGet(() -> clientRepository.findById(id)
                .map(client -> client.getUser())
                .orElseGet(() -> adminRepository.findById(id)
                    .map(admin -> admin.getUser())
                    .orElseThrow(() -> new RuntimeException("User tidak ditemukan!"))
                )
            );

        if (request.getNama() != null && !request.getNama().isEmpty()) {
            user.setNama(request.getNama());
        }

        if (request.getNomorTelepon() != null) {
            user.setNomorTelepon(request.getNomorTelepon());
        }

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
    public void deleteAkun(String id) {
        // Coba cari by userId dulu, kalau tidak ketemu cari by clientId atau adminId
        User user = userRepository.findById(id)
            .orElseGet(() -> clientRepository.findById(id)
                .map(client -> client.getUser())
                .orElseGet(() -> adminRepository.findById(id)
                    .map(admin -> admin.getUser())
                    .orElseThrow(() -> new RuntimeException("User tidak ditemukan!"))
                )
            );

        // Cek kontrak aktif jika client
        clientRepository.findByUserUserId(user.getUserId()).ifPresent(client -> {
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

        user.setIsActive(false);
        userRepository.save(user);
    }

    // FR-06: Logout
    @Transactional
    public void logout(String token) {
        sessionTokenRepository.findByToken(token)
            .ifPresent(sessionTokenRepository::delete);
    }
}