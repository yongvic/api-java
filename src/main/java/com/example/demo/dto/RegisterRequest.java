// src/main/java/com/example/demo/dto/RegisterRequest.java
package com.example.demo.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String nom;
    private String prenom;
    private String email;
    private String countryCode = "+228"; // défaut Togo
    private String telephone;
    private Integer countryId;
    private String password;

    // Méthode pratique pour savoir quel identifiant est utilisé
    public String getIdentifier() {
        if (email != null && !email.isBlank()) return email;
        if (telephone != null && !telephone.isBlank()) return telephone;
        return null;
    }
}