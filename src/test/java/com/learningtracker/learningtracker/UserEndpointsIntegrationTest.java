package com.learningtracker.learningtracker;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.learningtracker.learningtracker.repositories.UtilisateurRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
public class UserEndpointsIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

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
    void adminCanManageUsersAndUserCannotAccess() throws Exception {
        String adminToken = registerAndGetToken("user_admin", "apass", "ADMIN");
        String userToken = registerAndGetToken("user_normal", "upass", "USER");

        HttpHeaders adminHeaders = new HttpHeaders();
        adminHeaders.setBearerAuth(adminToken);
        adminHeaders.setContentType(MediaType.APPLICATION_JSON);

        // create new user via admin endpoint
        String newUserJson = "{\"nomUtilisateur\":\"created_user\",\"motDePasse\":\"pwd\",\"role\":\"USER\"}";
        HttpEntity<String> createReq = new HttpEntity<>(newUserJson, adminHeaders);
        ResponseEntity<String> createResp = rest.postForEntity("http://localhost:" + port + "/api/users/register", createReq, String.class);
        assertThat(createResp.getStatusCode()).isEqualTo(HttpStatus.CREATED);

        // find created user's id from repository
        Integer createdId = utilisateurRepository.findByNomUtilisateur("created_user").map(u -> u.getIdUtilisateur()).orElse(null);
        assertThat(createdId).isNotNull();

        // get all users (admin)
        ResponseEntity<String> all = rest.exchange("http://localhost:" + port + "/api/users", HttpMethod.GET, new HttpEntity<>(adminHeaders), String.class);
        assertThat(all.getStatusCode()).isEqualTo(HttpStatus.OK);

        // update user
        String updateJson = "{\"nomUtilisateur\":\"created_user\",\"motDePasse\":\"newpwd\",\"role\":\"USER\"}";
        ResponseEntity<String> updateResp = rest.exchange("http://localhost:" + port + "/api/users/" + createdId, HttpMethod.PUT, new HttpEntity<>(updateJson, adminHeaders), String.class);
        assertThat(updateResp.getStatusCode()).isEqualTo(HttpStatus.OK);

        // delete user
        ResponseEntity<String> delResp = rest.exchange("http://localhost:" + port + "/api/users/" + createdId, HttpMethod.DELETE, new HttpEntity<>(adminHeaders), String.class);
        assertThat(delResp.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);

        // regular user must not access admin users list
        HttpHeaders userHeaders = new HttpHeaders();
        userHeaders.setBearerAuth(userToken);
        assertThatThrownBy(() -> rest.exchange("http://localhost:" + port + "/api/users", HttpMethod.GET, new HttpEntity<>(userHeaders), String.class))
                .isInstanceOf(org.springframework.web.client.HttpClientErrorException.Forbidden.class);
    }
}
