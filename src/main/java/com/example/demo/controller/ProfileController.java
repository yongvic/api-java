package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getProfile() {
        String identifier = SecurityContextHolder.getContext().getAuthentication().getName();

        if (identifier == null) {
            return ResponseEntity.status(401).body("Non authentifié");
        }

        Optional<User> userOpt = identifier.contains("@")
                ? userRepository.findByEmail(identifier)
                : userRepository.findByTelephone(identifier);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Utilisateur non trouvé");
        }

        User user = userOpt.get();

        return ResponseEntity.ok(new ProfileResponse(
                user.getId(),
                user.getNom(),
                user.getPrenom(),
                user.getEmail(),
                user.getTelephone(),
                user.getCountry() != null ? user.getCountry().getName() : null,
                user.getCountry() != null ? user.getCountry().getFlagEmoji() : null,
                user.getBalance(),
                user.getCreatedAt()
        ));
    }

    record ProfileResponse(
            Long id,
            String nom,
            String prenom,
            String email,
            String telephone,
            String pays,
            String drapeau,
            java.math.BigDecimal balance,
            java.time.LocalDateTime membreDepuis
    ) {}
}