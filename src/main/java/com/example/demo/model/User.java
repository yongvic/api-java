package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String prenom;

    @Column(unique = true, nullable = true)  // nullable = true car on peut avoir que le tel
    private String email;

    @Column(unique = true, nullable = true)  // nullable = true car on peut avoir que l'email
    private String telephone; // Format final : +237690123456

    @Column(nullable = false)
    private String password;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // Constructeur vide obligatoire pour JPA
    public User() {}

    // Méthode pour normaliser le numéro avec le code pays
    public void setTelephone(String countryCode, String number) {
        if (number == null || number.trim().isEmpty()) {
            this.telephone = null;
            return;
        }

        String cleaned = number.replaceAll("[^0-9]", ""); // enlève espaces, tirets, etc.

        // Si l'utilisateur a déjà mis le bon code pays, on garde
        String codeWithoutPlus = countryCode.replace("+", "");
        if (cleaned.startsWith(codeWithoutPlus)) {
            this.telephone = "+" + cleaned;
        } else {
            this.telephone = countryCode + cleaned;
        }
    }

    // Surcharge pratique si tu veux passer directement un numéro déjà normalisé
    public void setTelephone(String fullNumber) {
        if (fullNumber == null || fullNumber.trim().isEmpty()) {
            this.telephone = null;
        } else {
            this.telephone = fullNumber.trim();
        }
    }
}