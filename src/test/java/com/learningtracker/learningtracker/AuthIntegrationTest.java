package com.learningtracker.learningtracker;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
public class AuthIntegrationTest {

    @LocalServerPort
    private int port;

    private RestTemplate rest = new RestTemplate();

    private final ObjectMapper mapper = new ObjectMapper();

    @Test
    void registerLoginAndMe() throws Exception {
        // register (form urlencoded)
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("username", "itestuser");
        form.add("password", "itestpass");
        form.add("role", "USER");

        HttpHeaders headersForm = new HttpHeaders();
        headersForm.setContentType(org.springframework.http.MediaType.APPLICATION_FORM_URLENCODED);
        HttpEntity<MultiValueMap<String, String>> regReq = new HttpEntity<>(form, headersForm);
        ResponseEntity<String> reg = rest.postForEntity("http://localhost:"+port+"/api/auth/register", regReq, String.class);
        assertThat(reg.getStatusCode()).isEqualTo(HttpStatus.OK);

        // login
        MultiValueMap<String, String> loginForm = new LinkedMultiValueMap<>();
        loginForm.add("username", "itestuser");
        loginForm.add("password", "itestpass");

        HttpEntity<MultiValueMap<String, String>> loginReq = new HttpEntity<>(loginForm, headersForm);
        ResponseEntity<String> login = rest.postForEntity("http://localhost:"+port+"/api/auth/login", loginReq, String.class);
        assertThat(login.getStatusCode()).isEqualTo(HttpStatus.OK);

        JsonNode loginJson = mapper.readTree(login.getBody());
        assertThat(loginJson.has("token")).isTrue();
        String token = loginJson.get("token").asText();

        // call /api/auth/me with token
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        HttpEntity<Void> entity = new HttpEntity<>(headers);
        ResponseEntity<String> me = rest.exchange("http://localhost:"+port+"/api/auth/me", HttpMethod.GET, entity, String.class);
        assertThat(me.getStatusCode()).isEqualTo(HttpStatus.OK);

        JsonNode meJson = mapper.readTree(me.getBody());
        assertThat(meJson.get("authenticated").asBoolean()).isTrue();
        assertThat(meJson.get("username").asText()).isEqualTo("itestuser");
    }
}
