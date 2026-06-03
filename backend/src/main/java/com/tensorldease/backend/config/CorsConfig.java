package com.tensorldease.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // setAllowedOriginPatterns support wildcard (*) per-segment only.
        // "tensorlease-git-main-farhan-hamzahs-projects.vercel.app" adalah
        // satu segment penuh, jadi harus di-list eksplisit atau pakai "*.vercel.app"
        config.setAllowedOriginPatterns(List.of(
            "http://localhost:5173",
            "http://localhost:3000",
            "https://tensorlease.vercel.app",
            "https://tensorlease-git-main-farhan-hamzahs-projects.vercel.app", // exact URL dari screenshot
            "https://*.vercel.app"  // cover semua preview deploy Vercel sekaligus
        ));

        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        config.setAllowedHeaders(List.of("*"));
        config.setExposedHeaders(List.of("Authorization")); // agar frontend bisa baca JWT header
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}