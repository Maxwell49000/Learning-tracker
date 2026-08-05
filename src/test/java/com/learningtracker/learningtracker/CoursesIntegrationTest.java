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
public class CoursesIntegrationTest {

    @LocalServerPort
    private int port;

    private RestTemplate rest = new RestTemplate();

    private final ObjectMapper mapper = new ObjectMapper();

    private String getToken(String username, String password, String role) throws Exception {
        // register
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("username", username);
        form.add("password", password);
        form.add("role", role);
        HttpHeaders headersForm = new HttpHeaders();
        headersForm.setContentType(org.springframework.http.MediaType.APPLICATION_FORM_URLENCODED);
        HttpEntity<MultiValueMap<String, String>> regReq = new HttpEntity<>(form, headersForm);
        rest.postForEntity("http://localhost:"+port+"/api/auth/register", regReq, String.class);

        // login
        MultiValueMap<String, String> login = new LinkedMultiValueMap<>();
        login.add("username", username);
        login.add("password", password);
        HttpEntity<MultiValueMap<String, String>> loginReq = new HttpEntity<>(login, headersForm);
        ResponseEntity<String> resp = rest.postForEntity("http://localhost:"+port+"/api/auth/login", loginReq, String.class);
        JsonNode json = mapper.readTree(resp.getBody());
        return json.get("token").asText();
    }

    @Test
    void adminCanCreateAndListCourse() throws Exception {
        String adminToken = getToken("itestadmin","adminpass","ADMIN");

        // create course
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(adminToken);
        headers.setContentType(MediaType.APPLICATION_JSON);
        String body = "{\"titre\":\"TEST COURSE\",\"description\":\"desc\"}";
        HttpEntity<String> req = new HttpEntity<>(body, headers);
        ResponseEntity<String> createResp = rest.postForEntity("http://localhost:"+port+"/api/courses", req, String.class);
        assertThat(createResp.getStatusCode()).isEqualTo(HttpStatus.CREATED);

        // list courses
        HttpEntity<Void> getReq = new HttpEntity<>(headers);
        ResponseEntity<String> listResp = rest.exchange("http://localhost:"+port+"/api/courses", HttpMethod.GET, getReq, String.class);
        assertThat(listResp.getStatusCode()).isEqualTo(HttpStatus.OK);
        JsonNode arr = mapper.readTree(listResp.getBody());
        assertThat(arr.isArray()).isTrue();
        assertThat(arr.size()).isGreaterThanOrEqualTo(1);
    }
}
