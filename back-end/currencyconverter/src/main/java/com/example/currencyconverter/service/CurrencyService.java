package com.example.currencyconverter.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.currencyconverter.exception.UnauthorizedException;
import com.example.currencyconverter.model.CurrencyLog;
import com.example.currencyconverter.repository.ApiKeyRepository;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class CurrencyService {
    private final com.example.currencyconverter.repository.CurrencyRepository repository;
   private final ApiKeyRepository apiKeyRepository;    
    
    public void validateApiKey(String requestKey){
        if (requestKey == null || requestKey.trim().isEmpty()){
        throw new UnauthorizedException("API key missing from HTTP Headers");
    }
    apiKeyRepository.findByKeyValueAndActiveTrue(requestKey.trim()).orElseThrow(() -> new UnauthorizedException("Invalid or inactive API key"));
    }
   
    public CurrencyLog convertAndSave(double value, String unit) {
        double converted;
        String outputUnit;

        if (unit.equalsIgnoreCase("Celsius")) {
            converted = (value * 1.8) + 32;
            outputUnit = "Fahrenheit";
        } else {
            converted = (value - 32) / 1.8;
            outputUnit = "Celsius";
        }

        CurrencyLog log = new CurrencyLog(
            null, value, unit, converted, outputUnit,
            LocalDateTime.now().toString()
        );

        return repository.save(log);
    }

    public java.util.List<CurrencyLog> getHistory() {
        return repository.findAll();
    }
    // Add this method to TemperatureService.java

public static String getSafetyWarning(double value, String unit) {
    String cleanUnit = unit.trim().toUpperCase();
    double celsiusTemp = value;

    // Convert to a standardized unit (Celsius) for uniform evaluation
    if ("FAHRENHEIT".equals(cleanUnit) || "F".equals(cleanUnit)) {
    celsiusTemp = (value - 32) * 5 / 9;
    }

    // Determine the environmental safety message
    if (celsiusTemp >= 38.0) {
    return "Warning: " + value + "°" + cleanUnit + " is dangerously HOT! Stay hydrated.";
    } else if (celsiusTemp <= 0.0) {
    return "Warning: " + value + "°" + cleanUnit + " is freezing cold! Bundle up.";
    } else {
    return "The temperature is comfortable and safe.";
    }
}
public List<CurrencyLog> getLogsByUnit(String unit) {
    return repository.findByInputUnitIgnoreCase(unit.trim());
}
}
