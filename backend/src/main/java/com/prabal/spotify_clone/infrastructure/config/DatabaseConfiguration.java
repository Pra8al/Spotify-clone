package com.prabal.spotify_clone.infrastructure.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableJpaRepositories({"org.prabal.*"})
@EnableTransactionManagement
@EnableJpaAuditing
public class DatabaseConfiguration {
}
