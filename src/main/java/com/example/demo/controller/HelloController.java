package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/") // ← Racine de l'API
public class HelloController {

    @GetMapping("/hello")
    public String hello() {
        return "Salut Chocoa ! API fonctionne parfaitement ! 🚀";
    }

    @GetMapping
    public String home() {
        return """
                {
                  "message": "Bienvenue sur l'API Investore !",
                  "version": "1.0",
                  "status": "OK",
                  "endpoints": {
                    "register": "/api/auth/register",
                    "login": "/api/auth/login",
                    "countries": "/api/countries",
                    "profile": "/api/me (protégé)"
                  }
                }
                """;
    }
}