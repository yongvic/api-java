package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/hello")
    public String hello() {
        return "Salut Chocoa ! API fonctionne !";
    }

    @GetMapping("/")
    public String homme() {
        return "Je suis la page d'accueil de l'API.";
    }
}
