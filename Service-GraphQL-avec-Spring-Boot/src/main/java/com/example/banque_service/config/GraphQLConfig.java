package com.example.banque_service.config;

import com.example.banque_service.entities.Compte;
import com.example.banque_service.entities.Transaction;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.graphql.execution.RuntimeWiringConfigurer;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;

@Configuration
public class GraphQLConfig {

    @Bean
    public RuntimeWiringConfigurer runtimeWiringConfigurer() {
        return wiringBuilder -> {
            wiringBuilder.type("Compte", typeWiring -> 
                typeWiring.dataFetcher("dateCreation", environment -> {
                    Compte compte = environment.getSource();
                    Date date = compte.getDateCreation();
                    if (date == null) {
                        return null;
                    }
                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
                    sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
                    return sdf.format(date);
                })
            );
            
            wiringBuilder.type("Transaction", typeWiring -> 
                typeWiring.dataFetcher("date", environment -> {
                    Transaction transaction = environment.getSource();
                    Date date = transaction.getDate();
                    if (date == null) {
                        return null;
                    }
                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
                    sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
                    return sdf.format(date);
                })
            );
        };
    }
}

