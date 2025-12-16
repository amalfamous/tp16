package com.example.banque_service.entities;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionRequest {
    private Long compteId;
    private double montant;
    private String date;
    private TypeTransaction type;
}