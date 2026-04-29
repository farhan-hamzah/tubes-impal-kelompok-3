package com.tensorldease.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import com.tensorldease.backend.model.Admin;
import com.tensorldease.backend.repository.AdminRepository;
@Entity
@Table(name = "admins")
@Data
public class Admin {

    @Id
    @Column(name = "admin_id")
    private String adminId;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
}