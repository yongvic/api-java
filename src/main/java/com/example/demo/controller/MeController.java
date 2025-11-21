package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/me")
public class MeController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<User> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        // Vérifie le header Authorization
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).build(); // Unauthorized
        }

        String token = authHeader.substring(7);
        String identifier = jwtUtil.validateTokenAndGetIdentifier(token);

        // Token invalide ou expiré
        if (identifier == null) {
            return ResponseEntity.status(401).build();
        }

        // Recherche par email ou téléphone
        Optional<User> userOpt = identifier.contains("@")
                ? userRepository.findByEmail(identifier)
                : userRepository.findByTelephone(identifier);

        // Utilisateur non trouvé
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).build(); // Not Found
        }

        // Retourne l'utilisateur complet (sans mot de passe bien sûr)
        return ResponseEntity.ok(userOpt.get());
    }
}