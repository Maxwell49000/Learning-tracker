package com.learningtracker.learningtracker;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
public class AdminEndpointsIntegrationTest {

    @LocalServerPort
    private int port;

    private final RestTemplate rest = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    private String registerAndGetToken(String username, String password, String role) throws Exception {
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("username", username);
        form.add("password", password);
        form.add("role", role);
        HttpHeaders formHeaders = new HttpHeaders();
        formHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        HttpEntity<MultiValueMap<String, String>> regReq = new HttpEntity<>(form, formHeaders);
        rest.postForEntity("http://localhost:" + port + "/api/auth/register", regReq, String.class);

        HttpEntity<MultiValueMap<String, String>> loginReq = new HttpEntity<>(form, formHeaders);
        ResponseEntity<String> loginResp = rest.postForEntity("http://localhost:" + port + "/api/auth/login", loginReq, String.class);
        JsonNode loginJson = mapper.readTree(loginResp.getBody());
        return loginJson.get("token").asText();
    }

    @Test
    void adminCanCreateUpdateDeleteCourse() throws Exception {
        String adminToken = registerAndGetToken("admin_itest", "adminpass", "ADMIN");

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(adminToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        // create
        String courseBody = "{\"titre\":\"ADMIN COURSE\",\"description\":\"desc\"}";
        HttpEntity<String> req = new HttpEntity<>(courseBody, headers);
        ResponseEntity<String> createResp = rest.postForEntity("http://localhost:" + port + "/api/courses", req, String.class);
        assertThat(createResp.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        JsonNode created = mapper.readTree(createResp.getBody());
        int id = created.has("idCours") ? created.get("idCours").asInt() : 1;

        // update
        String updateBody = "{\"idCours\":" + id + ",\"titre\":\"ADMIN COURSE UPDATED\",\"description\":\"d2\"}";
        HttpEntity<String> updateReq = new HttpEntity<>(updateBody, headers);
        ResponseEntity<String> updateResp = rest.exchange("http://localhost:" + port + "/api/courses/" + id, HttpMethod.PUT, updateReq, String.class);
        assertThat(updateResp.getStatusCode()).isEqualTo(HttpStatus.OK);

        // delete
        ResponseEntity<String> delResp = rest.exchange("http://localhost:" + port + "/api/courses/" + id, HttpMethod.DELETE, new HttpEntity<>(headers), String.class);
        assertThat(delResp.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
    }

    @Test
    void userCannotAccessAdminEndpoints() throws Exception {
        String userToken = registerAndGetToken("user_itest", "userpass", "USER");
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(userToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        String courseBody = "{\"titre\":\"ADMIN COURSE\",\"description\":\"desc\"}";
        HttpEntity<String> req = new HttpEntity<>(courseBody, headers);

        assertThatThrownBy(() -> rest.postForEntity("http://localhost:" + port + "/api/courses", req, String.class))
                .isInstanceOf(HttpClientErrorException.Forbidden.class);
    }
}
