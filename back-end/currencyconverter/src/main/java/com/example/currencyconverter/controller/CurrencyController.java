package com.example.currencyconverter.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.currencyconverter.model.CurrencyLog;
import com.example.currencyconverter.service.CurrencyService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/temperatures")
@RequiredArgsConstructor
public class CurrencyController {

    private final CurrencyService service;    

    @PostMapping("/convert")
    public CurrencyLog convertTemperature(@RequestHeader("X-API-KEY") String apiKey, @RequestParam double value,  @RequestParam String unit)  {        
                                    
        service.validateApiKey(apiKey);
        return service.convertAndSave(value, unit);
    }

    @GetMapping("/history")
    public List<CurrencyLog>getHistory(@RequestHeader("X-API-KEY") String apiKey) {
        service.validateApiKey(apiKey);
        return service.getHistory();
    }
    @GetMapping("/safety-check")
    public String checkTemperatureSafety(
        @RequestParam double value,
        @RequestParam String unit
         ) {
            return CurrencyService.getSafetyWarning(value, unit);
         }
    @GetMapping("/history/filter")
    public java.util.List<CurrencyLog> getFilteredLogs(@RequestParam String unit){
        return service.getLogsByUnit(unit);
    }
}