package com.learningtracker.learningtracker.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.learningtracker.learningtracker.models.Contenu;
import com.learningtracker.learningtracker.repositories.ContenuRepository;

@Service
public class ContenuService {

    // Service lié à la gestion des contenus (CRUD). Ce service encapsule
    // l'accès au repository `ContenuRepository` et fournit une API simple
    // aux contrôleurs pour créer, lire, mettre à jour et supprimer des
    // contenus. Les règles métier simples (vérifications) peuvent être
    // ajoutées ici si nécessaire.

    @Autowired
    private ContenuRepository contenuRepository;

    public Contenu createContenu(Contenu contenu) {
        return contenuRepository.save(contenu);
    }

    public Optional<Contenu> getContenuById(Integer id) {
        return contenuRepository.findById(id);
    }

    public List<Contenu> getAllContenu() {
        return contenuRepository.findAll();
    }

    public List<Contenu> getContenuByCours(Integer idCours) {
        return contenuRepository.findByCours_IdCours(idCours);
    }

    public Contenu updateContenu(Integer id, Contenu contenu) {
        return contenuRepository.findById(id).map(c -> {
            c.setTitre(contenu.getTitre());
            c.setType(contenu.getType());
            c.setUrl(contenu.getUrl());
            return contenuRepository.save(c);
        }).orElseThrow(() -> new RuntimeException("Contenu non trouvé"));
    }

    public void deleteContenu(Integer id) {
        contenuRepository.deleteById(id);
    }
}
