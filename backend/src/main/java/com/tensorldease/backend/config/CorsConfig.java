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

        // Gunakan setAllowedOriginPatterns, bukan setAllowedOrigins
        // agar kompatibel dengan allowCredentials=true + wildcard subdomain
        config.setAllowedOriginPatterns(List.of(
            "http://localhost:5173",
            "https://tensorlease.vercel.app",
            "https://tensorlease-*.vercel.app",           // cover semua preview & git URL
            "https://*-farhan-hamzahs-projects.vercel.app" // cover semua project URL kamu
        ));

        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}