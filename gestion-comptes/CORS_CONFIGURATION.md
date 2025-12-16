# Configuration CORS pour Spring Boot Backend

## Problème
Le backend Spring Boot rejette les requêtes cross-origin depuis `http://localhost:3000` avec une erreur 403 Forbidden.

## Solution
Ajoutez cette classe de configuration CORS dans votre projet Spring Boot backend.

### Fichier à créer : `CorsConfig.java`

Placez ce fichier dans le package de configuration de votre backend Spring Boot (par exemple : `com.example.banque_service.config`)

```java
package com.example.banque_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/graphql")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/graphql", configuration);
        return source;
    }
}
```

### Alternative : Configuration via application.properties

Si vous préférez utiliser les propriétés, ajoutez dans `application.properties` :

```properties
spring.graphql.cors.allowed-origins=http://localhost:3000
spring.graphql.cors.allowed-methods=GET,POST,OPTIONS
spring.graphql.cors.allowed-headers=*
spring.graphql.cors.allow-credentials=true
```

### Après avoir ajouté la configuration

1. Redémarrez votre backend Spring Boot
2. Les requêtes depuis `http://localhost:3000` devraient maintenant être autorisées

