package com.learningtracker.learningtracker.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.learningtracker.learningtracker.dtos.UtilisateurDTO;
import com.learningtracker.learningtracker.models.Utilisateur;
import com.learningtracker.learningtracker.services.UtilisateurService;

@RestController
@RequestMapping("/api/users")
public class UtilisateurController {

    // Contrôleur pour la gestion des utilisateurs (admin only)
    // Endpoints :
    // - GET /api/users : liste des utilisateurs (ROLE_ADMIN)
    // - GET /api/users/{id} : détail d'un utilisateur (ROLE_ADMIN)
    // - POST /api/users/register : création d'un utilisateur (ROLE_ADMIN)
    // - PUT /api/users/{id} : mise à jour d'un utilisateur (ROLE_ADMIN)
    // - DELETE /api/users/{id} : suppression (ROLE_ADMIN)

    @Autowired
    private UtilisateurService utilisateurService;

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<UtilisateurDTO>> getAllUsers() {
        // Récupère tous les utilisateurs et les convertit en DTO
        List<Utilisateur> users = utilisateurService.getAllUtilisateurs();
        List<UtilisateurDTO> dtos = users.stream().map(this::toDTO).toList();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<UtilisateurDTO> getUserById(@PathVariable Integer id) {
        // Cherche un utilisateur par id, renvoie 200 avec DTO ou 404
        return utilisateurService.getUtilisateurById(id)
            .map(u -> ResponseEntity.ok(toDTO(u)))
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/register")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<UtilisateurDTO> register(@RequestBody UtilisateurDTO utilisateurDTO) {
        // Crée un nouvel utilisateur (utilisé par l'admin)
        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setNomUtilisateur(utilisateurDTO.getNomUtilisateur());
        utilisateur.setMotDePasse(utilisateurDTO.getMotDePasse());
        utilisateur.setRole(utilisateurDTO.getRole());
        Utilisateur registered = utilisateurService.register(utilisateur);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDTO(registered));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<UtilisateurDTO> updateUser(@PathVariable Integer id, @RequestBody UtilisateurDTO utilisateurDTO) {
        // Met à jour un utilisateur existant
        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setNomUtilisateur(utilisateurDTO.getNomUtilisateur());
        utilisateur.setMotDePasse(utilisateurDTO.getMotDePasse());
        utilisateur.setRole(utilisateurDTO.getRole());
        Utilisateur updated = utilisateurService.updateUtilisateur(id, utilisateur);
        return ResponseEntity.ok(toDTO(updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        // Supprime un utilisateur par id
        utilisateurService.deleteUtilisateur(id);
        return ResponseEntity.noContent().build();
    }

    private UtilisateurDTO toDTO(Utilisateur u) {
        if (u == null) return null;
        UtilisateurDTO dto = new UtilisateurDTO();
        dto.setIdUtilisateur(u.getIdUtilisateur());
        dto.setNomUtilisateur(u.getNomUtilisateur());
        dto.setMotDePasse(u.getMotDePasse());
        dto.setRole(u.getRole());
        return dto;
    }
}
