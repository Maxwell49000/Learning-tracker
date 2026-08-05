package com.learningtracker.learningtracker.services;

import com.learningtracker.learningtracker.models.ProgressionContenu;
import com.learningtracker.learningtracker.repositories.ProgressionContenuRepository;
import com.learningtracker.learningtracker.repositories.ContenuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ProgressionService {

    // Service qui gère la progression des utilisateurs sur les contenus.
    // Responsabilités :
    // - créer/mette à jour des enregistrements de progression
    // - marquer un contenu comme lu
    // - calculer le pourcentage de progression global ou par cours
    // Ce service utilise à la fois le repository de progression et le
    // repository de contenus pour effectuer les calculs nécessaires.

    @Autowired
    private ProgressionContenuRepository progressionRepository;

    @Autowired
    private ContenuRepository contenuRepository;

    public ProgressionContenu updateProgress(Integer idUtilisateur, Integer idContenu, 
                                             BigDecimal progression, String statut) {
        ProgressionContenu pc = progressionRepository.findByIdUtilisateurAndIdContenu(idUtilisateur, idContenu)
                .orElseGet(() -> {
                    ProgressionContenu newPc = new ProgressionContenu();
                    newPc.setIdUtilisateur(idUtilisateur);
                    newPc.setIdContenu(idContenu);
                    return newPc;
                });

        if (progression != null) pc.setProgression(progression);
        if (statut != null) pc.setStatut(statut);
        pc.setDateMaj(LocalDateTime.now());

        return progressionRepository.save(pc);
    }

    public ProgressionContenu markContentAsRead(Integer idUtilisateur, Integer idContenu) {
        ProgressionContenu pc = progressionRepository.findByIdUtilisateurAndIdContenu(idUtilisateur, idContenu)
                .orElseGet(() -> {
                    ProgressionContenu newPc = new ProgressionContenu();
                    newPc.setIdUtilisateur(idUtilisateur);
                    newPc.setIdContenu(idContenu);
                    return newPc;
                });

        pc.setStatut("READ");
        pc.setProgression(BigDecimal.valueOf(100));
        pc.setDateMaj(LocalDateTime.now());

        return progressionRepository.save(pc);
    }

    public Optional<ProgressionContenu> getProgress(Integer idUtilisateur, Integer idContenu) {
        return progressionRepository.findByIdUtilisateurAndIdContenu(idUtilisateur, idContenu);
    }

    public List<ProgressionContenu> getProgressByUserAndCourse(Integer idUtilisateur, Integer idCours) {
        return progressionRepository.findByIdUtilisateurAndContenu_Cours_IdCours(idUtilisateur, idCours);
    }

    public ProgressionContenu createProgression(ProgressionContenu progression) {
        return progressionRepository.save(progression);
    }

    public Double calculateProgressionByUser(Integer userId) {
        // Compter les progressions terminées
        List<ProgressionContenu> progressions = progressionRepository.findByIdUtilisateur(userId);
        long completed = progressions.stream()
                .filter(p -> "READ".equals(p.getStatut()) || "TERMINE".equals(p.getStatut()))
                .count();
        
        // Compter le nombre TOTAL de contenus
        long totalContents = contenuRepository.count();
        
        if (totalContents == 0) {
            return 0.0;
        }
        
        return (completed * 100.0) / totalContents;
    }

    public Double calculateProgressionByCourse(Integer userId, Integer courseId) {
        // Compter les progressions terminées dans ce cours
        List<ProgressionContenu> progressions = getProgressByUserAndCourse(userId, courseId);
        long completed = progressions.stream()
                .filter(p -> "READ".equals(p.getStatut()) || "TERMINE".equals(p.getStatut()))
                .count();
        
        // Compter le nombre TOTAL de contenus dans ce cours
        long totalContents = contenuRepository.findByCours_IdCours(courseId).size();
        
        if (totalContents == 0) {
            return 0.0;
        }
        
        return (completed * 100.0) / totalContents;
    }

    public ProgressionContenu updateProgressionWithCalculation(Integer userId, Integer contentId, 
                                                               BigDecimal progression, String statut) {
        ProgressionContenu pc = progressionRepository.findByIdUtilisateurAndIdContenu(userId, contentId)
                .orElseGet(() -> {
                    ProgressionContenu newPc = new ProgressionContenu();
                    newPc.setIdUtilisateur(userId);
                    newPc.setIdContenu(contentId);
                    return newPc;
                });

        if (progression != null) pc.setProgression(progression);
        if (statut != null) pc.setStatut(statut);
        pc.setDateMaj(LocalDateTime.now());

        return progressionRepository.save(pc);
    }
}
