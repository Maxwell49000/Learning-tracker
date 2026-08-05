package com.learningtracker.learningtracker.controllers;

import com.learningtracker.learningtracker.models.Utilisateur;
import com.learningtracker.learningtracker.repositories.UtilisateurRepository;
import com.learningtracker.learningtracker.security.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.authentication.AuthenticationManager;

import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthControllerUnitTest {

    @InjectMocks
    private AuthController authController;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private UtilisateurRepository utilisateurRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Test
    void test_health_check() {
        Map<String, String> resp = authController.test();
        assertEquals("OK", resp.get("status"));
        assertTrue(resp.get("message").contains("Auth fonctionne"));
    }

    @Test
    void login_generates_token_and_returns_username() {
        Authentication authentication = mock(Authentication.class);
        UserDetails userDetails = mock(UserDetails.class);

        when(authenticationManager.authenticate(any())).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(userDetails.getUsername()).thenReturn("alice");
        when(jwtUtil.generateToken(userDetails)).thenReturn("jwt-token");

        ResponseEntity<?> resp = authController.login("alice", "pwd");

        assertEquals(200, resp.getStatusCode().value());
        @SuppressWarnings("unchecked")
        Map<String, String> body = (Map<String, String>) resp.getBody();
        assertEquals("jwt-token", body.get("token"));
        assertEquals("alice", body.get("username"));
        verify(authenticationManager).authenticate(any());
    }

    @Test
    void register_saves_encoded_password_and_role_uppercase() {
        when(passwordEncoder.encode("pwd")).thenReturn("encoded");

        Map<String, String> resp = authController.register("bob", "pwd", "user");

        assertEquals("Utilisateur créé avec succès", resp.get("message"));
        ArgumentCaptor<Utilisateur> captor = ArgumentCaptor.forClass(Utilisateur.class);
        verify(utilisateurRepository).save(captor.capture());
        Utilisateur saved = captor.getValue();
        assertEquals("bob", saved.getNomUtilisateur());
        assertEquals("encoded", saved.getMotDePasse());
        assertEquals("USER", saved.getRole());
    }

    @Test
    void validate_token_uses_jwtUtil() {
        when(jwtUtil.validateToken("t")).thenReturn(true);
        Map<String, Boolean> resp = authController.validateToken("Bearer t");
        assertTrue(resp.get("valid"));
    }

}
