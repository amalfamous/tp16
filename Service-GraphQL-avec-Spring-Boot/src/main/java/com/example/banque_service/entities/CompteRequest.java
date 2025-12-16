package com.example.banque_service.entities;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompteRequest {
    private Double solde;
    private String dateCreation;
    private TypeCompte type;
}

