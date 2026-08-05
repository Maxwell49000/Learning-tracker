package com.learningtracker.learningtracker.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.learningtracker.learningtracker.models.Utilisateur;
import com.learningtracker.learningtracker.repositories.UtilisateurRepository;

@Service
public class UtilisateurService {

    // Service pour la gestion des utilisateurs. Fournit des méthodes
    // CRUD simples (liste, recherche, création, mise à jour, suppression)
    // et délègue la persistance au `UtilisateurRepository`.

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    public List<Utilisateur> getAllUtilisateurs() {
        return utilisateurRepository.findAll();
    }

    public Optional<Utilisateur> getUtilisateurById(Integer id) {
        return utilisateurRepository.findById(id);
    }

    public Utilisateur register(Utilisateur utilisateur) {
        return utilisateurRepository.save(utilisateur);
    }

    public Utilisateur updateUtilisateur(Integer id, Utilisateur utilisateur) {
        return utilisateurRepository.findById(id).map(u -> {
            u.setNomUtilisateur(utilisateur.getNomUtilisateur());
            u.setMotDePasse(utilisateur.getMotDePasse());
            u.setRole(utilisateur.getRole());
            return utilisateurRepository.save(u);
        }).orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
    }

    public void deleteUtilisateur(Integer id) {
        utilisateurRepository.deleteById(id);
    }
}
