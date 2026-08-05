package com.learningtracker.learningtracker.repositories;

import com.learningtracker.learningtracker.models.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Integer> {

    Optional<Utilisateur> findByNomUtilisateur(String nomUtilisateur);

        
}
