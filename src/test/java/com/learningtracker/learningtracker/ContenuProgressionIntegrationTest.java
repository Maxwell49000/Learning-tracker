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
import org.springframework.web.client.RestTemplate;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
public class ContenuProgressionIntegrationTest {

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
    void contenuCreateMarkReadAndProgression() throws Exception {
        // create admin and user
        String adminToken = registerAndGetToken("itestadmin2", "adminpass2", "ADMIN");
        String userToken = registerAndGetToken("itestuser2", "userpass2", "USER");

        // create a course (admin)
        HttpHeaders adminHeaders = new HttpHeaders();
        adminHeaders.setBearerAuth(adminToken);
        adminHeaders.setContentType(MediaType.APPLICATION_JSON);
        String courseBody = "{\"titre\":\"COURSE FOR CONTENT\",\"description\":\"desc\"}";
        HttpEntity<String> courseReq = new HttpEntity<>(courseBody, adminHeaders);
        ResponseEntity<String> courseResp = rest.postForEntity("http://localhost:" + port + "/api/courses", courseReq, String.class);
        assertThat(courseResp.getStatusCode()).isEqualTo(HttpStatus.CREATED);

        // read created course id from list (simple approach)
        HttpEntity<Void> adminGet = new HttpEntity<>(adminHeaders);
        ResponseEntity<String> listCourses = rest.exchange("http://localhost:" + port + "/api/courses", HttpMethod.GET, adminGet, String.class);
        JsonNode arr = mapper.readTree(listCourses.getBody());
        assertThat(arr.isArray()).isTrue();
        int courseId = arr.get(0).has("idCours") ? arr.get(0).get("idCours").asInt() : 1;

        // create contenu (admin)
        String contenuJson = String.format("{\"titre\":\"Chapitre Test\",\"type\":\"VIDEO\",\"url\":\"https://ex\",\"idCours\":%d}", courseId);
        HttpEntity<String> contenuReq = new HttpEntity<>(contenuJson, adminHeaders);
        ResponseEntity<String> contenuResp = rest.postForEntity("http://localhost:" + port + "/api/content", contenuReq, String.class);
        assertThat(contenuResp.getStatusCode()).isEqualTo(HttpStatus.CREATED);

        // get contents and find contentId
        ResponseEntity<String> listContenus = rest.exchange("http://localhost:" + port + "/api/content", HttpMethod.GET, adminGet, String.class);
        JsonNode contenusArr = mapper.readTree(listContenus.getBody());
        assertThat(contenusArr.isArray()).isTrue();
        int contenuId = contenusArr.get(0).has("idContenu") ? contenusArr.get(0).get("idContenu").asInt() : 1;

        // mark as read (user)
        HttpHeaders userHeaders = new HttpHeaders();
        userHeaders.setBearerAuth(userToken);
        HttpEntity<Void> markReq = new HttpEntity<>(userHeaders);
        // user was registered second in this test -> likely id = 2 in clean test DB
        ResponseEntity<String> markResp = rest.exchange(
            String.format("http://localhost:%d/api/content/%d/mark-read?userId=2", port, contenuId),
                HttpMethod.PUT,
                markReq,
                String.class
        );
        assertThat(markResp.getStatusCode()).isEqualTo(HttpStatus.OK);

        // check progression GET by content
        HttpEntity<Void> userGet = new HttpEntity<>(userHeaders);
        ResponseEntity<String> progResp = rest.exchange(
            String.format("http://localhost:%d/api/progress/2/contents/%d", port, contenuId),
            HttpMethod.GET,
            userGet,
            String.class
        );
        assertThat(progResp.getStatusCode()).isEqualTo(HttpStatus.OK);
        JsonNode p = mapper.readTree(progResp.getBody());
        assertThat(p.get("idUtilisateur").asInt()).isEqualTo(2);
        assertThat(p.get("idContenu").asInt()).isEqualTo(contenuId);
    }
}
