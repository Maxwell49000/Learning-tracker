package com.learningtracker.learningtracker.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.learningtracker.learningtracker.models.ProgressionContenu;
import com.learningtracker.learningtracker.models.ProgressionContenuId;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface ProgressionContenuRepository extends JpaRepository<ProgressionContenu, ProgressionContenuId> {

    Optional<ProgressionContenu> findByIdUtilisateurAndIdContenu(Integer idUtilisateur, Integer idContenu);

     List<ProgressionContenu> findByIdUtilisateurAndContenu_Cours_IdCours(Integer idUtilisateur, Integer idCours);


    List<ProgressionContenu> findByIdUtilisateur(Integer idUtilisateur);
    List<ProgressionContenu> findByIdContenu(Integer idContenu);


    
}