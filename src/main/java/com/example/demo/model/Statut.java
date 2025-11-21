package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "statut")
public class Statut {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_statut")
    private Long id;

    @Column(name = "libelle_statut", nullable = false, unique = true)
    private String libelleStatut;

    private String description;
}