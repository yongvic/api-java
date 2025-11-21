package com.example.demo.dto;

import lombok.Data;

@Data
public class LoginRequest {

    private String email;               // optionnel
    private String telephone;           // optionnel
    private String countryCode = "+237"; // défaut Cameroun
    private String password;

    /**
     * Retourne l'identifiant normalisé pour la recherche en base
     * - Si email → retourne l'email en minuscule
     * - Si téléphone → retourne le numéro complet normalisé (+237690123456)
     */
    public String getIdentifier() {
        // Priorité à l'email s'il est rempli
        if (email != null && !email.trim().isEmpty()) {
            return email.trim().toLowerCase();
        }

        // Sinon, on normalise le téléphone
        if (telephone != null && !telephone.trim().isEmpty()) {
            String cleaned = telephone.replaceAll("[^0-9]", ""); // enlève espaces, tirets, etc.

            String codeWithoutPlus = countryCode.replace("+", "");

            // Si le numéro commence déjà par le code pays → on garde le +
            if (cleaned.startsWith(codeWithoutPlus)) {
                return "+" + cleaned;
            }

            // Sinon on ajoute le code pays
            return countryCode + cleaned;
        }

        return null;
    }
}