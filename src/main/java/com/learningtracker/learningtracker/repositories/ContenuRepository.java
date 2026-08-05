package com.learningtracker.learningtracker.repositories;

import com.learningtracker.learningtracker.models.Contenu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ContenuRepository extends JpaRepository<Contenu, Integer> {

    List<Contenu> findByCours_IdCours(Integer idCours);
    
}
