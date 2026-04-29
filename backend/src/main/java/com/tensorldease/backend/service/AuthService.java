package com.tensorldease.backend.service;

import com.tensorldease.backend.dto.request.ForgotPasswordRequest;
import com.tensorldease.backend.dto.request.LoginRequest;
import com.tensorldease.backend.dto.request.RegisterRequest;
import com.tensorldease.backend.dto.request.ResetPasswordRequest;
import com.tensorldease.backend.dto.response.LoginResponse;
import com.tensorldease.backend.dto.response.UserResponse;
import com.tensorldease.backend.model.Client;
import com.tensorldease.backend.model.PasswordResetToken;
import com.tensorldease.backend.model.User;
import com.tensorldease.backend.repository.ClientRepository;
import com.tensorldease.backend.repository.PasswordResetTokenRepository;
import com.tensorldease.backend.repository.UserRepository;
import com.tensorldease.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import java.time.LocalDateTime;
import java.util.UUID;
import com.tensorldease.backend.model.SessionToken;
import com.tensorldease.backend.repository.SessionTokenRepository;
import com.tensorldease.backend.model.Admin;
import com.tensorldease.backend.repository.AdminRepository;

@Service
public class AuthService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private SessionTokenRepository sessionTokenRepository;

    @Value("${app.jwt.expiration}")
    private long jwtExpiration;
    
    // Lupa Password - Request Reset
    public void forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Email tidak terdaftar!"));

        // Hapus token lama kalau ada
        passwordResetTokenRepository.deleteByUserUserId(user.getUserId());

        // Generate token unik
        String token = UUID.randomUUID().toString();

        // Simpan token ke DB
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setUser(user);
        resetToken.setToken(token);
        resetToken.setExpiredAt(LocalDateTime.now().plusMinutes(15));
        resetToken.setIsUsed(false);
        passwordResetTokenRepository.save(resetToken);

        // Kirim email
        emailService.sendResetPasswordEmail(user.getEmail(), token);
    }

    // Reset Password dengan token
    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken resetToken = passwordResetTokenRepository
            .findByToken(request.getToken())
            .orElseThrow(() -> new RuntimeException("Token tidak valid!"));

        // Cek token expired
        if (resetToken.getExpiredAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token sudah expired! Minta reset password lagi.");
        }

        // Cek token sudah dipakai
        if (resetToken.getIsUsed()) {
            throw new RuntimeException("Token sudah digunakan!");
        }

        // Update password
        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(request.getPasswordBaru()));
        userRepository.save(user);

        // Tandai token sudah dipakai
        resetToken.setIsUsed(true);
        passwordResetTokenRepository.save(resetToken);
    }

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
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Email atau password salah!"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Email atau password salah!");
        }

        if (!user.getIsActive()) {
            throw new RuntimeException("Akun tidak aktif!");
        }

        String token = jwtUtil.generateToken(
            user.getEmail(),
            user.getUserRole().name()
        );

        SessionToken sessionToken = new SessionToken();
        sessionToken.setTokenId(UUID.randomUUID().toString());
        sessionToken.setUser(user);
        sessionToken.setToken(token);
        sessionToken.setExpiredAt(LocalDateTime.now().plus(jwtExpiration, java.time.temporal.ChronoUnit.MILLIS));
        sessionTokenRepository.save(sessionToken);

        String clientId = null;
        if (user.getUserRole().name().equals("CLIENT")) {
            clientId = clientRepository.findByUserUserId(user.getUserId())
                .map(Client::getClientId)
                .orElse(null);
        }

        String adminId = null;
        if (user.getUserRole().name().equals("ADMIN")) {
            adminId = adminRepository.findByUserUserId(user.getUserId())
                .map(Admin::getAdminId)
                .orElse(null);
        }

        return new LoginResponse(
            token,
            user.getUserRole().name(),
            user.getNama(),
            user.getEmail(),
            clientId,
            adminId
        );
    }
}