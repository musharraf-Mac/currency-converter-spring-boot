package com.example.currencyconverter.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection="api_keys")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class ApiKey {
    @Id
    private String id;
    private String keyValue;
    private String clientName;
    private boolean active;

}
