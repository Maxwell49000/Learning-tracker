package com.learningtracker.learningtracker.controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.learningtracker.learningtracker.dtos.ContenuDTO;
import com.learningtracker.learningtracker.models.Contenu;
import com.learningtracker.learningtracker.models.Cours;
import com.learningtracker.learningtracker.services.ContenuService;
import com.learningtracker.learningtracker.services.CoursService;
import com.learningtracker.learningtracker.services.ProgressionService;

@RestController
@RequestMapping("/api/content")
public class ContenuController {

    // Contrôleur REST pour gérer les contenus (vidéos, articles, etc.)
    // Endpoints fournis :
    // - GET /api/content : liste de tous les contenus
    // - GET /api/content/{id} : détail d'un contenu
    // - POST /api/content : création de contenu (ROLE_ADMIN)
    // - PUT /api/content/{id} : mise à jour de contenu (ROLE_ADMIN)
    // - DELETE /api/content/{id} : suppression (ROLE_ADMIN)
    // - PUT /api/content/{id}/mark-read : marquer comme lu pour un user
    // - GET /api/content/course/{idCours} : récupérer les contenus d'un cours

    private final ContenuService contenuService;
    private final CoursService coursService;
    private final ProgressionService progressionService;

    public ContenuController(ContenuService contenuService, CoursService coursService, ProgressionService progressionService) {
        this.contenuService = contenuService;
        this.coursService = coursService;
        this.progressionService = progressionService;
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ContenuDTO> getContenuById(@PathVariable Integer id) {
        // Récupère un contenu par son identifiant et le convertit en DTO
        return contenuService.getContenuById(id)
            .map(c -> ResponseEntity.ok(toDTO(c)))
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<ContenuDTO>> getAllContenu() {
        // Liste tous les contenus disponibles
        List<Contenu> contenus = contenuService.getAllContenu();
        List<ContenuDTO> dtos = contenus.stream().map(this::toDTO).toList();
        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ContenuDTO> createContenu(@RequestBody ContenuDTO contenuDTO) {
        // Crée un nouveau contenu lié à un cours existant
        Contenu contenu = new Contenu();
        contenu.setTitre(contenuDTO.getTitre());
        contenu.setType(contenuDTO.getType());
        contenu.setUrl(contenuDTO.getUrl());

        // Vérifie que le cours lié existe
        Cours cours = coursService.getCoursById(contenuDTO.getIdCours())
            .orElseThrow(() -> new RuntimeException("Cours non trouvé"));
        contenu.setCours(cours);

        Contenu created = contenuService.createContenu(contenu);
        return ResponseEntity.status(201).body(toDTO(created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ContenuDTO> updateContenu(@PathVariable Integer id, @RequestBody ContenuDTO contenuDTO) {
        // Met à jour un contenu existant (les champs modifiés sont appliqués)
        Contenu contenu = new Contenu();
        contenu.setTitre(contenuDTO.getTitre());
        contenu.setType(contenuDTO.getType());
        contenu.setUrl(contenuDTO.getUrl());

        if (contenuDTO.getIdCours() != null) {
            // Si on change le cours associé, vérifie son existence
            Cours cours = coursService.getCoursById(contenuDTO.getIdCours())
                    .orElseThrow(() -> new RuntimeException("Cours non trouvé"));
            contenu.setCours(cours);
        }

        Contenu updated = contenuService.updateContenu(id, contenu);
        return ResponseEntity.ok(toDTO(updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteContenu(@PathVariable Integer id) {
        // Supprime le contenu identifié par id
        contenuService.deleteContenu(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/mark-read")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<?> markContentAsRead(@PathVariable Integer id, @RequestParam Integer userId) {
        // Marque le contenu comme lu pour l'utilisateur fourni
        var progression = progressionService.markContentAsRead(userId, id);
        return ResponseEntity.ok(progression);
    }

    @GetMapping("/course/{idCours}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<ContenuDTO>> getContenuByCours(@PathVariable Integer idCours) {
        // Retourne les contenus liés à un cours donné
        List<Contenu> contenus = contenuService.getContenuByCours(idCours);
        List<ContenuDTO> dtos = contenus.stream().map(this::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    private ContenuDTO toDTO(Contenu c) {
        if (c == null) return null;
        ContenuDTO dto = new ContenuDTO();
        // Convertit l'entité Contenu en DTO pour le frontend
        dto.setIdContenu(c.getIdContenu());
        dto.setTitre(c.getTitre());
        dto.setType(c.getType());
        dto.setUrl(c.getUrl());
        if (c.getCours() != null) {
            dto.setIdCours(c.getCours().getIdCours());
        }
        return dto;
    }
}
