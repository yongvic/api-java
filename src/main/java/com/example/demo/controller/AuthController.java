package com.example.demo.controller;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.model.Country;
import com.example.demo.model.User;
import com.example.demo.repository.CountryRepository;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.StatutRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CountryRepository countryRepository;
    
    @Autowired
    private RoleRepository roleRepository; // Nécessaire si vous settez le role ici
    
    @Autowired
    private StatutRepository statutRepository; // Nécessaire si vous settez le statut ici

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // ============================
    //      REGISTER
    // ============================
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        String email = request.getEmail() != null ? request.getEmail().trim() : null;
        String telephone = request.getTelephone() != null ? request.getTelephone().trim() : null;

        // Au moins un des deux obligatoire
        if ((email == null || email.isEmpty()) && (telephone == null || telephone.isEmpty())) {
            return ResponseEntity.badRequest().body("Email ou numéro de téléphone requis");
        }

        // Vérification doublons
        if (email != null && !email.isEmpty() && userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body("Cet email est déjà utilisé");
        }
        if (telephone != null && !telephone.isEmpty() && userRepository.findByTelephone(telephone).isPresent()) {
            return ResponseEntity.badRequest().body("Ce numéro est déjà utilisé");
        }

        User user = new User();
        user.setNom(request.getNom().trim());
        user.setPrenom(request.getPrenom() != null ? request.getPrenom().trim() : null);
        user.setEmail(email);
        user.setTelephone(telephone);

        // --- CORRECTION ICI (Null Type Safety) ---
        // On capture la valeur dans une variable Integer locale
        Integer countryId = request.getCountryId();
        
        if (countryId != null) {
            Country country = countryRepository.findById(countryId)
                    .orElse(null);
            user.setCountry(country);
        }
        // -----------------------------------------

        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // AJOUT IMPORTANT : Initialiser le Rôle et le Statut ici aussi 
        // (sinon vous aurez une erreur en base de données si ces champs sont NOT NULL)
        user.setRole(roleRepository.findByName("USER").orElse(null));
        user.setStatut(statutRepository.findByLibelleStatut("ACTIF").orElse(null));

        User saved = userRepository.save(user);

        // Réponse propre sans mot de passe
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Inscription réussie !");
        response.put("userId", saved.getId());
        response.put("nom", saved.getNom());
        response.put("prenom", saved.getPrenom());

        return ResponseEntity.ok(response);
    }

    // ============================
    //          LOGIN
    // ============================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        String identifier = null;

        if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
            identifier = request.getEmail().trim();
        } else if (request.getTelephone() != null && !request.getTelephone().trim().isEmpty()) {
            identifier = request.getTelephone().trim();
        }

        if (identifier == null) {
            return ResponseEntity.badRequest().body("Email ou téléphone requis");
        }

        Optional<User> userOpt = identifier.contains("@")
                ? userRepository.findByEmail(identifier)
                : userRepository.findByTelephone(identifier);

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Identifiant ou mot de passe incorrect");
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Identifiant ou mot de passe incorrect");
        }

        String token = jwtUtil.generateToken(identifier);

        // Réponse riche
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", Map.of(
            "id", user.getId(),
            "nom", user.getNom(),
            "prenom", user.getPrenom() != null ? user.getPrenom() : "",
            "email", user.getEmail() != null ? user.getEmail() : "",
            "telephone", user.getTelephone() != null ? user.getTelephone() : "",
            "country", user.getCountry() != null ? user.getCountry().getName() : ""
        ));

        return ResponseEntity.ok(response);
    }
}