package com.example.demo.repository;

import com.example.demo.model.Statut;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface StatutRepository extends JpaRepository<Statut, Long> {
    Optional<Statut> findByLibelleStatut(String libelleStatut);
}