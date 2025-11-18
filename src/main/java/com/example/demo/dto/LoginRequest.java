package com.example.demo.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;      // optionnel
    private String telephone;  // optionnel
    private String password;

    public String getIdentifier() {
        if (email != null && !email.isBlank()) return email;
        if (telephone != null && !telephone.isBlank()) return telephone;
        return null;
    }
}