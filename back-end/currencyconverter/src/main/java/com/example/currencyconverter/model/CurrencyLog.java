package com.example.currencyconverter.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection="currencyLog")
@Data
@AllArgsConstructor
@NoArgsConstructor

public class CurrencyLog {
    @Id
    private String id;
    private double inputAmount;
    private String inputUnit;
    private double outputAmount;
    private String outputUnit;

    private String timestamp;
}
