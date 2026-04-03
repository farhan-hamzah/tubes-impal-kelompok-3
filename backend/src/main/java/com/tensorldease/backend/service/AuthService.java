package com.tensorldease.backend.service;

import com.tensorldease.backend.dto.request.LoginRequest;
import com.tensorldease.backend.dto.request.RegisterRequest;
import com.tensorldease.backend.dto.response.LoginResponse;
import com.tensorldease.backend.dto.response.UserResponse;
import com.tensorldease.backend.model.Client;
import com.tensorldease.backend.model.User;
import com.tensorldease.backend.repository.ClientRepository;
import com.tensorldease.backend.repository.UserRepository;
import com.tensorldease.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public UserResponse register(RegisterRequest request) {
        // Cek email sudah terdaftar
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email sudah digunakan!");
        }

        // Buat user baru
        User user = new User();
        user.setUserId(UUID.randomUUID().toString());
        user.setNama(request.getNama());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setNomorTelepon(request.getNomorTelepon());
        user.setUserRole(User.UserRole.CLIENT);
        user.setIsActive(true);
        userRepository.save(user);

        // Buat client
        Client client = new Client();
        client.setClientId(UUID.randomUUID().toString());
        client.setUser(user);
        clientRepository.save(client);

        return new UserResponse(
            user.getUserId(),
            user.getNama(),
            user.getEmail(),
            user.getNomorTelepon(),
            user.getUserRole().name(),
            user.getIsActive()
        );
    }

    public LoginResponse login(LoginRequest request) {
        // Cek email ada
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Email atau password salah!"));

        // Cek password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Email atau password salah!");
        }

        // Cek akun aktif
        if (!user.getIsActive()) {
            throw new RuntimeException("Akun tidak aktif!");
        }

        // Generate JWT token
        String token = jwtUtil.generateToken(
            user.getEmail(),
            user.getUserRole().name()
        );

        return new LoginResponse(
            token,
            user.getUserRole().name(),
            user.getNama(),
            user.getEmail()
        );
    }
}