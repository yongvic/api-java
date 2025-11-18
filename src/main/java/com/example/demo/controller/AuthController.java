package com.example.demo.controller;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // ==================== INSCRIPTION ====================
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        String email = request.getEmail() != null ? request.getEmail().trim() : null;
        String telephone = request.getTelephone() != null ? request.getTelephone().trim() : null;

        // Oblige à avoir au moins un des deux
        if ((email == null || email.isEmpty()) && (telephone == null || telephone.isEmpty())) {
            return ResponseEntity.badRequest().body("Email ou numéro de téléphone obligatoire");
        }

        // Vérification email déjà pris (seulement si fourni)
        if (email != null && !email.isEmpty()) {
            if (userRepository.findByEmail(email).isPresent()) {
                return ResponseEntity.badRequest().body("Cet email est déjà utilisé");
            }
        }

        // Vérification téléphone déjà pris (seulement si fourni)
        if (telephone != null && !telephone.isEmpty()) {
            if (userRepository.findByTelephone(telephone).isPresent()) {
                return ResponseEntity.badRequest().body("Ce numéro est déjà utilisé");
            }
        }

        User user = new User();
        user.setNom(request.getNom());
        user.setPrenom(request.getPrenom());
        user.setEmail(email);           // → NULL si pas fourni
        user.setTelephone(telephone);   // → NULL si pas fourni
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        User saved = userRepository.save(user);
        return ResponseEntity.ok(saved);
    }

    // ==================== CONNEXION ====================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        String identifier = request.getIdentifier(); // email ou téléphone

        if (identifier == null || identifier.isBlank()) {
            return ResponseEntity.badRequest().body("Email ou téléphone requis");
        }

        Optional<User> userOpt;

        // On teste d'abord si c'est un email
        if (identifier.contains("@")) {
            userOpt = userRepository.findByEmail(identifier);
        } else {
            userOpt = userRepository.findByTelephone(identifier);
        }

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Identifiant ou mot de passe incorrect");
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Identifiant ou mot de passe incorrect");
        }

        String token = jwtUtil.generateToken(user.getEmail() != null ? user.getEmail() : user.getTelephone());

        return ResponseEntity.ok(token);
    }
}