package com.tensorldease.backend.service;

import com.tensorldease.backend.dto.response.UserResponse;
import com.tensorldease.backend.model.Client;
import com.tensorldease.backend.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private ClientRepository clientRepository;

    // FR-05: Lihat semua client
    public List<UserResponse> getAllClients() {
        return clientRepository.findAll()
            .stream()
            .map(client -> new UserResponse(
                client.getUser().getUserId(),
                client.getUser().getNama(),
                client.getUser().getEmail(),
                client.getUser().getNomorTelepon(),
                client.getUser().getUserRole().name(),
                client.getUser().getIsActive()
            ))
            .collect(Collectors.toList());
    }

    // FR-05: Detail client
    public UserResponse getClientDetail(String clientId) {
        Client client = clientRepository.findById(clientId)
            .orElseThrow(() -> new RuntimeException("Client tidak ditemukan!"));

        return new UserResponse(
            client.getUser().getUserId(),
            client.getUser().getNama(),
            client.getUser().getEmail(),
            client.getUser().getNomorTelepon(),
            client.getUser().getUserRole().name(),
            client.getUser().getIsActive()
        );
    }
}