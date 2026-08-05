package com.learningtracker.learningtracker.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.learningtracker.learningtracker.dtos.ProgressionContenuDTO;
import com.learningtracker.learningtracker.models.ProgressionContenu;
import com.learningtracker.learningtracker.models.Utilisateur;
import com.learningtracker.learningtracker.repositories.UtilisateurRepository;
import com.learningtracker.learningtracker.services.ProgressionService;

@RestController
@RequestMapping("/api/progress")
public class ProgressionController {

    // Contrôleur pour gérer la progression des utilisateurs sur les contenus
    // Fournit des endpoints pour créer/consulter la progression, calculer
    // le pourcentage global par utilisateur ou par cours, et marquer
    // un contenu comme "lu" pour l'utilisateur courant.

    @Autowired
    private ProgressionService progressionService;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ProgressionContenuDTO> createProgression(@RequestBody ProgressionContenuDTO progressionDTO) {
        // Crée ou met à jour la progression d'un contenu pour un utilisateur
        ProgressionContenu progression = new ProgressionContenu();
        progression.setIdUtilisateur(progressionDTO.getIdUtilisateur());
        progression.setIdContenu(progressionDTO.getIdContenu());
        progression.setStatut(progressionDTO.getStatut());
        progression.setProgression(progressionDTO.getProgression());

        ProgressionContenu created = progressionService.createProgression(progression);

        // Conversion entité -> DTO pour la réponse
        ProgressionContenuDTO responseDTO = new ProgressionContenuDTO();
        responseDTO.setIdUtilisateur(created.getIdUtilisateur());
        responseDTO.setIdContenu(created.getIdContenu());
        responseDTO.setStatut(created.getStatut());
        responseDTO.setProgression(created.getProgression());

        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }

    @GetMapping("/{userId}/courses/{courseId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<ProgressionContenuDTO>> getProgressByUserAndCourse(
            @PathVariable Integer userId,
            @PathVariable Integer courseId) {
        // Retourne la liste des progressions pour un utilisateur sur un cours
        List<ProgressionContenu> progressions = progressionService.getProgressByUserAndCourse(userId, courseId);

        List<ProgressionContenuDTO> dtos = progressions.stream()
                .map(p -> {
                    ProgressionContenuDTO dto = new ProgressionContenuDTO();
                    dto.setIdUtilisateur(p.getIdUtilisateur());
                    dto.setIdContenu(p.getIdContenu());
                    dto.setStatut(p.getStatut());
                    dto.setProgression(p.getProgression());
                    return dto;
                })
                .toList();

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{userId}/contents/{contentId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ProgressionContenuDTO> getProgressByContent(
            @PathVariable Integer userId,
            @PathVariable Integer contentId) {
        // Récupère la progression pour un contenu précis d'un utilisateur donné
        return progressionService.getProgress(userId, contentId)
                .map(p -> {
                    ProgressionContenuDTO dto = new ProgressionContenuDTO();
                    dto.setIdUtilisateur(p.getIdUtilisateur());
                    dto.setIdContenu(p.getIdContenu());
                    dto.setStatut(p.getStatut());
                    dto.setProgression(p.getProgression());
                    return ResponseEntity.ok(dto);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{userId}/calculate")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Double> calculateProgressionByUser(@PathVariable Integer userId) {
        // Calcule la progression globale (pourcentage) pour un utilisateur
        Double progression = progressionService.calculateProgressionByUser(userId);
        return ResponseEntity.ok(progression);
    }

    @GetMapping("/{userId}/courses/{courseId}/calculate")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Double> calculateProgressionByCourse(
            @PathVariable Integer userId,
            @PathVariable Integer courseId) {
        // Calcule la progression pour un utilisateur sur un cours spécifique
        Double progression = progressionService.calculateProgressionByCourse(userId, courseId);
        return ResponseEntity.ok(progression);
    }

    // Mark the given content as read for the currently authenticated user
    @PostMapping("/me/contents/{contentId}/mark-read")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<?> markContentAsReadForCurrentUser(@PathVariable Integer contentId) {
        // Marque le contenu comme lu pour l'utilisateur courant (via SecurityContext)
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Utilisateur user = utilisateurRepository.findByNomUtilisateur(username).orElse(null);
        if (user == null) return ResponseEntity.status(404).body("User not found");

        ProgressionContenu updated = progressionService.markContentAsRead(user.getIdUtilisateur(), contentId);
        ProgressionContenuDTO dto = new ProgressionContenuDTO();
        dto.setIdUtilisateur(updated.getIdUtilisateur());
        dto.setIdContenu(updated.getIdContenu());
        dto.setStatut(updated.getStatut());
        dto.setProgression(updated.getProgression());
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/me/contents/{contentId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<?> getProgressForCurrentUserContent(@PathVariable Integer contentId) {
        // Récupère la progression du contenu pour l'utilisateur connecté
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Utilisateur user = utilisateurRepository.findByNomUtilisateur(username).orElse(null);
        if (user == null) return ResponseEntity.status(404).body("User not found");

        return progressionService.getProgress(user.getIdUtilisateur(), contentId)
                .map(p -> {
                    ProgressionContenuDTO dto = new ProgressionContenuDTO();
                    dto.setIdUtilisateur(p.getIdUtilisateur());
                    dto.setIdContenu(p.getIdContenu());
                    dto.setStatut(p.getStatut());
                    dto.setProgression(p.getProgression());
                    return ResponseEntity.ok(dto);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/me/calculate")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Double> calculateProgressionForCurrentUser() {
        // Calcule la progression globale pour l'utilisateur connecté
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Utilisateur user = utilisateurRepository.findByNomUtilisateur(username).orElse(null);
        if (user == null) return ResponseEntity.status(404).body(0.0);
        Double progression = progressionService.calculateProgressionByUser(user.getIdUtilisateur());
        return ResponseEntity.ok(progression);
    }

    @GetMapping("/me/courses/{courseId}/calculate")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Double> calculateProgressionForCurrentUserByCourse(@PathVariable Integer courseId) {
        // Calcule la progression pour l'utilisateur connecté sur un cours donné
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Utilisateur user = utilisateurRepository.findByNomUtilisateur(username).orElse(null);
        if (user == null) return ResponseEntity.status(404).body(0.0);
        Double progression = progressionService.calculateProgressionByCourse(user.getIdUtilisateur(), courseId);
        return ResponseEntity.ok(progression);
    }
}
