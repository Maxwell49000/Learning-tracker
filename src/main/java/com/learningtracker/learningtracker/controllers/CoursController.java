package com.learningtracker.learningtracker.controllers;

import java.util.List;

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

import com.learningtracker.learningtracker.dtos.CoursDTO;
import com.learningtracker.learningtracker.models.Cours;
import com.learningtracker.learningtracker.services.CoursService;

@RestController
@RequestMapping("/api/courses")
public class CoursController {

    // Contrôleur REST pour gérer les opérations CRUD sur les cours
    // Endpoints exposés :
    // - POST /api/courses : création (ROLE_ADMIN)
    // - GET /api/courses : liste de tous les cours (USER|ADMIN)
    // - GET /api/courses/{id} : détail d'un cours (USER|ADMIN)
    // - PUT /api/courses/{id} : mise à jour (ROLE_ADMIN)
    // - DELETE /api/courses/{id} : suppression (ROLE_ADMIN)

    private final CoursService coursService;

    public CoursController(CoursService coursService) {
        this.coursService = coursService;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<CoursDTO> createCours(@RequestBody CoursDTO coursDTO) {
        // Crée une entité Cours à partir du DTO reçu et la sauvegarde
        Cours cours = new Cours();
        cours.setTitre(coursDTO.getTitre());
        cours.setDescription(coursDTO.getDescription());
        Cours created = coursService.createCours(cours);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDTO(created));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<CoursDTO>> getAllCours() {
        // Récupère tous les cours et les convertit en DTO pour la réponse
        List<Cours> coursList = coursService.getAllCours();
        List<CoursDTO> dtos = coursList.stream().map(this::toDTO).toList();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<CoursDTO> getCoursByID(@PathVariable Integer id) {
        // Cherche le cours par id, renvoie 200 avec DTO ou 404 si absent
        return coursService.getCoursById(id)
            .map(c -> ResponseEntity.ok(toDTO(c)))
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<CoursDTO> updateCours(@PathVariable Integer id, @RequestBody CoursDTO coursDTO) {
        // Met à jour le cours existant identifié par id
        Cours cours = new Cours();
        cours.setTitre(coursDTO.getTitre());
        cours.setDescription(coursDTO.getDescription());
        Cours updated = coursService.updateCours(id, cours);
        return ResponseEntity.ok(toDTO(updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteCours(@PathVariable Integer id) {
        // Supprime le cours et renvoie 204 No Content
        coursService.deleteCours(id);
        return ResponseEntity.noContent().build();
    }

    private CoursDTO toDTO(Cours c) {
        if (c == null) return null;
        CoursDTO dto = new CoursDTO();
        dto.setIdCours(c.getIdCours());
        dto.setTitre(c.getTitre());
        dto.setDescription(c.getDescription());
        return dto;
    }
}
