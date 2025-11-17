package com.example.demo.controller;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @GetMapping
    public String getProfile() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return "Bienvenue " + username + " ! Tu es connecté ";
    }
}