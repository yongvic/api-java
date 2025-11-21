package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.StatutRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

// --- ADD THIS LINE ---
import java.util.Optional; 
// ---------------------

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private StatutRepository statutRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public User register(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Rôles et statut par défaut
        user.setRole(roleRepository.findByName("USER")
                .orElseThrow(() -> new RuntimeException("Rôle USER non trouvé")));
        user.setStatut(statutRepository.findByLibelleStatut("ACTIF")
                .orElseThrow(() -> new RuntimeException("Statut ACTIF non trouvé")));

        return userRepository.save(user);
    }

    public String login(String identifier, String password) {
        // This logic requires that BOTH findByEmail and findByTelephone return Optional<User>
        Optional<User> userOpt = identifier.contains("@")
                ? userRepository.findByEmail(identifier)
                : userRepository.findByTelephone(identifier);

        User user = userOpt.orElseThrow(() -> new RuntimeException("Identifiant incorrect"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Mot de passe incorrect");
        }

        return jwtUtil.generateToken(identifier);
    }
}