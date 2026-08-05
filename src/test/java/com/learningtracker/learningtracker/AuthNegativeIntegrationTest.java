package com.learningtracker.learningtracker;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;

import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
public class AuthNegativeIntegrationTest {

    @LocalServerPort
    private int port;

    private final RestTemplate rest = new RestTemplate();

    @Test
    void invalidTokenIsRejected() {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth("invalid.token.here");
        HttpEntity<Void> req = new HttpEntity<>(headers);

        assertThatThrownBy(() -> rest.exchange("http://localhost:" + port + "/api/courses", HttpMethod.GET, req, String.class))
            .isInstanceOf(HttpClientErrorException.Forbidden.class);
    }

    @Test
    void missingTokenIsRejectedForProtectedEndpoint() {
        HttpEntity<Void> req = new HttpEntity<>(new HttpHeaders());
        // /api/content GET requires auth
        assertThatThrownBy(() -> rest.exchange("http://localhost:" + port + "/api/content", HttpMethod.POST, req, String.class))
            .isInstanceOf(HttpClientErrorException.Forbidden.class);
    }
}
