package com.learningtracker.learningtracker;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.Date;

import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
public class AuthExpiredIntegrationTest {

    @LocalServerPort
    private int port;

    @Value("${jwt.secret}")
    private String secret;

    private final RestTemplate rest = new RestTemplate();

    @Test
    void expiredTokenIsRejected() {
        // build an expired JWT (expiration in the past)
        Date now = new Date();
        Date past = new Date(now.getTime() - 1000L * 60 * 60);
        String expired = Jwts.builder()
                .setSubject("someuser")
                .setIssuedAt(past)
                .setExpiration(past)
                .signWith(Keys.hmacShaKeyFor(secret.getBytes()))
                .compact();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(expired);
        HttpEntity<Void> req = new HttpEntity<>(headers);

        assertThatThrownBy(() -> rest.exchange("http://localhost:" + port + "/api/courses", HttpMethod.GET, req, String.class))
                .isInstanceOf(org.springframework.web.client.HttpClientErrorException.Forbidden.class);
    }
}
