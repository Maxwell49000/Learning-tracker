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
public class ProgressionCalculationIntegrationTest {

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
    void calculateOverallAndCourseProgression() throws Exception {
        String adminToken = registerAndGetToken("prog_admin", "apass", "ADMIN");
        String userToken = registerAndGetToken("prog_user", "upass", "USER");

        // create course
        HttpHeaders adminHeaders = new HttpHeaders();
        adminHeaders.setBearerAuth(adminToken);
        adminHeaders.setContentType(MediaType.APPLICATION_JSON);
        String courseBody = "{\"titre\":\"PROG COURSE\",\"description\":\"desc\"}";
        HttpEntity<String> courseReq = new HttpEntity<>(courseBody, adminHeaders);
        ResponseEntity<String> courseResp = rest.postForEntity("http://localhost:" + port + "/api/courses", courseReq, String.class);
        assertThat(courseResp.getStatusCode()).isEqualTo(HttpStatus.CREATED);

        // discover course id
        ResponseEntity<String> listCourses = rest.exchange("http://localhost:" + port + "/api/courses", HttpMethod.GET, new HttpEntity<>(adminHeaders), String.class);
        JsonNode arr = mapper.readTree(listCourses.getBody());
        int courseId = arr.get(0).has("idCours") ? arr.get(0).get("idCours").asInt() : 1;

        // create two contents in the course
        String contenu1 = String.format("{\"titre\":\"C1\",\"type\":\"VIDEO\",\"url\":\"https://ex\",\"idCours\":%d}", courseId);
        String contenu2 = String.format("{\"titre\":\"C2\",\"type\":\"VIDEO\",\"url\":\"https://ex\",\"idCours\":%d}", courseId);
        rest.postForEntity("http://localhost:" + port + "/api/content", new HttpEntity<>(contenu1, adminHeaders), String.class);
        rest.postForEntity("http://localhost:" + port + "/api/content", new HttpEntity<>(contenu2, adminHeaders), String.class);

        // find contents
        ResponseEntity<String> listContenus = rest.exchange("http://localhost:" + port + "/api/content", HttpMethod.GET, new HttpEntity<>(adminHeaders), String.class);
        JsonNode contenusArr = mapper.readTree(listContenus.getBody());
        int id1 = contenusArr.get(0).has("idContenu") ? contenusArr.get(0).get("idContenu").asInt() : 1;
        int id2 = contenusArr.get(1).has("idContenu") ? contenusArr.get(1).get("idContenu").asInt() : 2;

        // mark first as read by user (user likely id=2)
        HttpHeaders userHeaders = new HttpHeaders();
        userHeaders.setBearerAuth(userToken);
        ResponseEntity<String> markResp = rest.exchange(
                String.format("http://localhost:%d/api/content/%d/mark-read?userId=2", port, id1),
                HttpMethod.PUT,
                new HttpEntity<>(userHeaders),
                String.class
        );
        assertThat(markResp.getStatusCode()).isEqualTo(HttpStatus.OK);

        // overall progression for user -> should be 50.0
        ResponseEntity<String> overall = rest.exchange(String.format("http://localhost:%d/api/progress/2/calculate", port), HttpMethod.GET, new HttpEntity<>(userHeaders), String.class);
        assertThat(overall.getStatusCode()).isEqualTo(HttpStatus.OK);
        Double overallVal = mapper.readTree(overall.getBody()).asDouble();
        assertThat(overallVal).isEqualTo(50.0);

        // progression by course -> should be 50.0
        ResponseEntity<String> byCourse = rest.exchange(String.format("http://localhost:%d/api/progress/2/courses/%d/calculate", port, courseId), HttpMethod.GET, new HttpEntity<>(userHeaders), String.class);
        assertThat(byCourse.getStatusCode()).isEqualTo(HttpStatus.OK);
        Double courseVal = mapper.readTree(byCourse.getBody()).asDouble();
        assertThat(courseVal).isEqualTo(50.0);
    }
}
