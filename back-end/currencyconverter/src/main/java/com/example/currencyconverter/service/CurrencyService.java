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
    private static final double USD_TO_LKR_RATE = 300.0;
    
    public void validateApiKey(String requestKey){
        if (requestKey == null || requestKey.trim().isEmpty()){
        throw new UnauthorizedException("API key missing from HTTP Headers");
    }
    apiKeyRepository.findByKeyValueAndActiveTrue(requestKey.trim()).orElseThrow(() -> new UnauthorizedException("Invalid or inactive API key"));
    }
   
    public CurrencyLog convertAndSave(double value, String unit) {
        double converted;
        String inputUnit = unit == null ? "" : unit.trim().toUpperCase();
        String outputUnit;

        if ("USD".equals(inputUnit)) {
            converted = value * USD_TO_LKR_RATE;
            outputUnit = "LKR";
        } else if ("LKR".equals(inputUnit)) {
            converted = value / USD_TO_LKR_RATE;
            outputUnit = "USD";
        } else {
            throw new IllegalArgumentException("Unsupported currency unit: " + unit);
        }

        CurrencyLog log = new CurrencyLog(
            null, value, inputUnit, converted, outputUnit,
            LocalDateTime.now().toString()
        );

        return repository.save(log);
    }

    public java.util.List<CurrencyLog> getHistory() {
        return repository.findAll();
    }
    public String getExchangeRateMessage(String unit) {
        String cleanUnit = unit == null ? "" : unit.trim().toUpperCase();

        if ("USD".equals(cleanUnit)) {
            return "1 USD = " + USD_TO_LKR_RATE + " LKR";
        }

        if ("LKR".equals(cleanUnit)) {
            return USD_TO_LKR_RATE + " LKR = 1 USD";
        }

        throw new IllegalArgumentException("Unsupported currency unit: " + unit);
    }

    public List<CurrencyLog> getLogsByUnit(String unit) {
        return repository.findByInputUnitIgnoreCase(unit.trim());
    }
}
