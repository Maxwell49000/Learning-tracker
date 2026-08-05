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
public class ProgressionMultiCourseIntegrationTest {

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
    void multiCourseProgressionMix() throws Exception {
        String adminToken = registerAndGetToken("mix_admin", "apass", "ADMIN");
        String userToken = registerAndGetToken("mix_user", "upass", "USER");

        HttpHeaders adminHeaders = new HttpHeaders();
        adminHeaders.setBearerAuth(adminToken);
        adminHeaders.setContentType(MediaType.APPLICATION_JSON);

        // course 1 with 2 contents
        String course1 = "{\"titre\":\"C1\",\"description\":\"d1\"}";
        rest.postForEntity("http://localhost:" + port + "/api/courses", new HttpEntity<>(course1, adminHeaders), String.class);
        // course 2 with 3 contents
        String course2 = "{\"titre\":\"C2\",\"description\":\"d2\"}";
        rest.postForEntity("http://localhost:" + port + "/api/courses", new HttpEntity<>(course2, adminHeaders), String.class);

        // discover course ids
        ResponseEntity<String> coursesResp = rest.exchange("http://localhost:" + port + "/api/courses", HttpMethod.GET, new HttpEntity<>(adminHeaders), String.class);
        JsonNode courses = mapper.readTree(coursesResp.getBody());
        int c1 = courses.get(0).has("idCours") ? courses.get(0).get("idCours").asInt() : 1;
        int c2 = courses.get(1).has("idCours") ? courses.get(1).get("idCours").asInt() : 2;

        // create contents: 2 in c1, 3 in c2
        for (int i = 1; i <= 2; i++) {
            String cont = String.format("{\"titre\":\"c1-%d\",\"type\":\"VIDEO\",\"url\":\"x\",\"idCours\":%d}", i, c1);
            rest.postForEntity("http://localhost:" + port + "/api/content", new HttpEntity<>(cont, adminHeaders), String.class);
        }
        for (int i = 1; i <= 3; i++) {
            String cont = String.format("{\"titre\":\"c2-%d\",\"type\":\"VIDEO\",\"url\":\"x\",\"idCours\":%d}", i, c2);
            rest.postForEntity("http://localhost:" + port + "/api/content", new HttpEntity<>(cont, adminHeaders), String.class);
        }

        // Assuming content IDs are assigned sequentially starting at 1 in this fresh test DB:
        // first two contents -> ids 1,2 (course c1); next three -> ids 3,4,5 (course c2)
        // mark: 1 of 2 in c1, and 2 of 3 in c2 (user id likely 2)
        rest.exchange(String.format("http://localhost:%d/api/content/%d/mark-read?userId=2", port, 1), HttpMethod.PUT,
            new HttpEntity<>(new HttpHeaders() {{ setBearerAuth(userToken); }}), String.class);
        rest.exchange(String.format("http://localhost:%d/api/content/%d/mark-read?userId=2", port, 3), HttpMethod.PUT,
            new HttpEntity<>(new HttpHeaders() {{ setBearerAuth(userToken); }}), String.class);
        rest.exchange(String.format("http://localhost:%d/api/content/%d/mark-read?userId=2", port, 4), HttpMethod.PUT,
            new HttpEntity<>(new HttpHeaders() {{ setBearerAuth(userToken); }}), String.class);

        HttpHeaders userHeaders = new HttpHeaders();
        userHeaders.setBearerAuth(userToken);

        // overall should be 60.0 (3/5)
        ResponseEntity<String> overall = rest.exchange(String.format("http://localhost:%d/api/progress/2/calculate", port), HttpMethod.GET, new HttpEntity<>(userHeaders), String.class);
        Double overallVal = mapper.readTree(overall.getBody()).asDouble();
        double overallRounded = Math.round(overallVal * 100.0) / 100.0;
        assertThat(overallRounded).isEqualTo(60.0);

        // course1 -> 1/2 -> 50.0
        ResponseEntity<String> course1ValResp = rest.exchange(String.format("http://localhost:%d/api/progress/2/courses/%d/calculate", port, c1), HttpMethod.GET, new HttpEntity<>(userHeaders), String.class);
        Double course1Val = mapper.readTree(course1ValResp.getBody()).asDouble();
        double course1Rounded = Math.round(course1Val * 100.0) / 100.0;
        assertThat(course1Rounded).isEqualTo(50.0);

        // course2 -> 2/3 -> 66.67 (rounded)
        ResponseEntity<String> course2ValResp = rest.exchange(String.format("http://localhost:%d/api/progress/2/courses/%d/calculate", port, c2), HttpMethod.GET, new HttpEntity<>(userHeaders), String.class);
        Double course2Val = mapper.readTree(course2ValResp.getBody()).asDouble();
        double course2Rounded = Math.round(course2Val * 100.0) / 100.0;
        assertThat(course2Rounded).isEqualTo(66.67);
    }
}
