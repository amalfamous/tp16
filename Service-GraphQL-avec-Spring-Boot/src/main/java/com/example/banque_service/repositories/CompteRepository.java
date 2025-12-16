package com.example.banque_service.repositories;

import com.example.banque_service.entities.Compte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CompteRepository extends JpaRepository<Compte, Long> {

    @Query("select coalesce(sum(c.solde), 0) from Compte c")
    double sumSoldes();
}
