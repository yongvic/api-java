package com.example.demo.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String telephone;
    private String countryCode = "+237"; // défaut Cameroun
    private String password;

    // Retourne le numéro normalisé ou l'email
    public String getIdentifier() {
        if (email != null && !email.trim().isEmpty()) {
            return email.trim();
        }
        if (telephone != null && !telephone.trim().isEmpty()) {
            String cleaned = telephone.replaceAll("[^0-9]", "");
            if (!cleaned.startsWith("+")) {
                return countryCode + cleaned;
            }
            return cleaned.startsWith(countryCode.replace("+", "")) ? "+" + cleaned : countryCode + cleaned;
        }
        return null;
    }
}