package com.example.banque_service.controllers;

import com.example.banque_service.entities.Compte;
import com.example.banque_service.entities.CompteRequest;
import com.example.banque_service.entities.Transaction;
import com.example.banque_service.entities.TransactionRequest;
import com.example.banque_service.entities.TypeTransaction;
import com.example.banque_service.repositories.CompteRepository;
import com.example.banque_service.repositories.TransactionRepository;
import lombok.AllArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.Date;
import java.util.List;
import java.util.Map;

@Controller
@AllArgsConstructor
public class CompteControllerGraphQL {
    private CompteRepository compteRepository;
    private TransactionRepository transactionRepository;

    // ============ MUTATIONS ============

    @MutationMapping
    public Transaction addTransaction(@Argument("transaction") TransactionRequest transaction) {
        Compte compte = compteRepository.findById(transaction.getCompteId())
                .orElseThrow(() -> new RuntimeException("Compte not found"));

        Transaction nouvelleTransaction = new Transaction();
        nouvelleTransaction.setMontant(transaction.getMontant());
        
        // Convertir la String date en Date
        try {
            if (transaction.getDate() != null && !transaction.getDate().isEmpty()) {
                // Parser la date ISO 8601
                Date date = new Date(java.time.Instant.parse(transaction.getDate()).toEpochMilli());
                nouvelleTransaction.setDate(date);
            } else {
                nouvelleTransaction.setDate(new Date());
            }
        } catch (Exception e) {
            // Si le parsing échoue, utiliser la date actuelle
            nouvelleTransaction.setDate(new Date());
        }
        
        nouvelleTransaction.setType(transaction.getType());
        nouvelleTransaction.setCompte(compte);

        return transactionRepository.save(nouvelleTransaction);
    }

    @MutationMapping
    public Compte saveCompte(@Argument("compte") CompteRequest compte) {
        if (compte == null) {
            throw new RuntimeException("CompteRequest cannot be null");
        }
        
        Compte nouveauCompte = new Compte();
        nouveauCompte.setSolde(compte.getSolde());
        nouveauCompte.setType(compte.getType());
        
        // Définir la date de création
        if (compte.getDateCreation() != null && !compte.getDateCreation().isEmpty()) {
            try {
                // Parser la date ISO 8601 si fournie
                Date dateCreation = new Date(java.time.Instant.parse(compte.getDateCreation()).toEpochMilli());
                nouveauCompte.setDateCreation(dateCreation);
            } catch (Exception e) {
                // Si le parsing échoue, utiliser la date actuelle
                nouveauCompte.setDateCreation(new Date());
            }
        } else {
            // Si aucune date n'est fournie, utiliser la date actuelle
            nouveauCompte.setDateCreation(new Date());
        }
        
        return compteRepository.save(nouveauCompte);
    }

    // ============ QUERIES ============

    @QueryMapping
    public List<Compte> allComptes() {
        return compteRepository.findAll();
    }

    @QueryMapping
    public Compte compteById(@Argument Long id) {
        return compteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compte " + id + " not found"));
    }

    @QueryMapping
    public List<Transaction> compteTransactions(@Argument Long id) {
        Compte compte = compteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compte not found"));
        return transactionRepository.findByCompte(compte);
    }

    @QueryMapping
    public List<Transaction> allTransactions() {
        return transactionRepository.findAll();
    }

    @QueryMapping
    public Map<String, Object> totalSolde() {
        long count = compteRepository.count();
        double sum = compteRepository.sumSoldes();
        double average = count > 0 ? sum / count : 0;

        return Map.of(
                "count", count,
                "sum", sum,
                "average", average
        );
    }

    @QueryMapping
    public Map<String, Object> transactionStats() {
        long count = transactionRepository.count();
        double sumDepots = transactionRepository.sumByType(TypeTransaction.DEPOT);
        double sumRetraits = transactionRepository.sumByType(TypeTransaction.RETRAIT);

        return Map.of(
                "count", count,
                "sumDepots", sumDepots,
                "sumRetraits", sumRetraits
        );
    }
}