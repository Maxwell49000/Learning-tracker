package com.learningtracker.learningtracker.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.learningtracker.learningtracker.repositories.CoursRepository;
import com.learningtracker.learningtracker.models.Cours;
import java.util.List;
import java.util.Optional;

@Service
public class CoursService {

    // Service pour la gestion des cours : encapsule les opérations CRUD
    // sur l'entité `Cours`. Le contrôleur `CoursController` appelle ces
    // méthodes pour accéder à la persistence (via `CoursRepository`).
    // Ici on garde la logique métier minimale ; on peut enrichir les
    // validations ou transformations si nécessaire.

    @Autowired
    private CoursRepository coursRepository;

    public Cours createCours(Cours cours) {
        return coursRepository.save(cours);
    }

    public List<Cours> getAllCours() {
        return coursRepository.findAll();
    }

    public Optional<Cours> getCoursById(Integer id) {
        return coursRepository.findById(id);
    }

    public Cours updateCours(Integer id, Cours cours) {
        return coursRepository.findById(id).map(c -> {
            c.setTitre(cours.getTitre());
            c.setDescription(cours.getDescription());
            return coursRepository.save(c);
        }).orElseThrow(() -> new RuntimeException("Cours non trouvé"));
    }

    public void deleteCours(Integer id) {
        coursRepository.deleteById(id);
    }
}
