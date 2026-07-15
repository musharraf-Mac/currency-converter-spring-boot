package com.example.currencyconverter.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.currencyconverter.model.ApiKey;

@Repository
public interface ApiKeyRepository extends MongoRepository<ApiKey, String> {
    Optional<ApiKey> findByKeyValueAndActiveTrue(String keyValue);
}
