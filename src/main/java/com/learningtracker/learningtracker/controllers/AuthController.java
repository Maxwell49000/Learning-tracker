package com.learningtracker.learningtracker.controllers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.learningtracker.learningtracker.models.Utilisateur;
import com.learningtracker.learningtracker.repositories.UtilisateurRepository;
import com.learningtracker.learningtracker.security.JwtUtil;

@RestController
@RequestMapping("/api/auth")
// Contrôleur REST pour l'authentification
// - POST /login : authentifie et retourne un JWT
// - POST /register : création d'un utilisateur (hash du mot de passe)
// - GET /validate : validation d'un JWT (header Authorization)
// - GET /me : informations sur l'utilisateur courant
public class AuthController {

    @Value("${app.registration.allow-privileged-role:false}")
    private boolean allowPrivilegedRegistration;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/test")
    public Map<String, String> test() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "OK");
        response.put("message", "API Auth fonctionne !");
        return response;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String username, @RequestParam String password) {
        try {
            // Authentifier l'utilisateur avec AuthenticationManager
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
            );

            // Récupère les informations de l'utilisateur authentifié
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            // Génération d'un token JWT basé sur les UserDetails
            String token = jwtUtil.generateToken(userDetails);

            // Réponse JSON contenant le token et le nom d'utilisateur
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("username", userDetails.getUsername());
            return ResponseEntity.ok(response);
        } catch (AuthenticationException ex) {
            // Mauvaises identifiants
            Map<String, String> err = new HashMap<>();
            err.put("message", "Authentication failed: " + ex.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err);
        } catch (Exception ex) {
            // Erreur serveur inattendue
            Map<String, String> err = new HashMap<>();
            err.put("message", "Authentication error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(err);
        }
    }

    @PostMapping("/register")
    public Map<String, String> register(@RequestParam String username, @RequestParam String password, 
                                       @RequestParam(defaultValue = "USER") String role) {
        // Construction de l'entité Utilisateur et hash du mot de passe
        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setNomUtilisateur(username);
        utilisateur.setMotDePasse(passwordEncoder.encode(password));  // hash
        String requestedRole = role == null ? "USER" : role.trim().toUpperCase();
        utilisateur.setRole(allowPrivilegedRegistration ? requestedRole : "USER");

        // Persistance en base
        utilisateurRepository.save(utilisateur);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Utilisateur créé avec succès");
        response.put("username", username);
        return response;
    }

    @GetMapping("/validate")
    public Map<String, Boolean> validateToken(@RequestHeader("Authorization") String token) {
        // Attend un header Authorization: "Bearer <token>"
        String jwt = token.substring(7);
        boolean isValid = jwtUtil.validateToken(jwt);

        Map<String, Boolean> response = new HashMap<>();
        response.put("valid", isValid);
        return response;
    }

    @GetMapping("/me")
    public Map<String, Object> getCurrentUser() {
        // Récupère l'utilisateur courant depuis le SecurityContext
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> response = new HashMap<>();

        if (authentication != null && authentication.isAuthenticated()) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            response.put("username", userDetails.getUsername());
            response.put("authorities", userDetails.getAuthorities());
            response.put("authenticated", true);
        } else {
            response.put("authenticated", false);
        }

        return response;
    }
}
