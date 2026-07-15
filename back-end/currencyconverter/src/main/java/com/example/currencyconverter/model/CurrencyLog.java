package com.example.currencyconverter.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document
@Data
@AllArgsConstructor
@NoArgsConstructor

public class CurrencyLog {
    @Id
    private String id;
    private double inputTemperature;
    private String inputUnit;
    private double outputTemperature;
    private String outputUnit;

    private String timestamp;
}
