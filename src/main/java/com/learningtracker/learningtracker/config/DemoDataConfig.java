package com.learningtracker.learningtracker.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.learningtracker.learningtracker.models.Contenu;
import com.learningtracker.learningtracker.models.Cours;
import com.learningtracker.learningtracker.models.Utilisateur;
import com.learningtracker.learningtracker.repositories.ContenuRepository;
import com.learningtracker.learningtracker.repositories.CoursRepository;
import com.learningtracker.learningtracker.repositories.UtilisateurRepository;

@Configuration
public class DemoDataConfig {

    @Bean
    CommandLineRunner seedDemoData(
            @Value("${app.demo.seed:false}") boolean enabled,
            @Value("${app.demo.admin-username:}") String adminUsername,
            @Value("${app.demo.admin-password:}") String adminPassword,
            CoursRepository coursRepository,
            ContenuRepository contenuRepository,
            UtilisateurRepository utilisateurRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            if (!enabled) return;

            if (!adminUsername.isBlank() && !adminPassword.isBlank()
                    && utilisateurRepository.findByNomUtilisateur(adminUsername).isEmpty()) {
                Utilisateur admin = new Utilisateur();
                admin.setNomUtilisateur(adminUsername);
                admin.setMotDePasse(passwordEncoder.encode(adminPassword));
                admin.setRole("ADMIN");
                utilisateurRepository.save(admin);
            }

            if (coursRepository.count() > 0) return;
            addCourse(coursRepository, contenuRepository,
                    "Fondamentaux de Java",
                    "Consolidez la syntaxe, la programmation objet et les bonnes pratiques du langage.",
                    new String[][] {{"Classes et objets", "ARTICLE"}, {"Collections", "VIDEO"}, {"Exceptions", "EXERCICE"}});
            addCourse(coursRepository, contenuRepository,
                    "Concevoir une API REST",
                    "Structurez une API Spring Boot maintenable, documentée et sécurisée.",
                    new String[][] {{"Architecture en couches", "ARTICLE"}, {"Contrats HTTP", "VIDEO"}, {"Sécuriser avec JWT", "EXERCICE"}});
            addCourse(coursRepository, contenuRepository,
                    "React en pratique",
                    "Construisez des interfaces lisibles avec des composants et un état bien organisés.",
                    new String[][] {{"Composer une interface", "ARTICLE"}, {"Gérer les données", "VIDEO"}, {"Projet final", "PROJET"}});
        };
    }

    private void addCourse(CoursRepository coursRepository, ContenuRepository contenuRepository,
            String title, String description, String[][] contents) {
        Cours course = new Cours();
        course.setTitre(title);
        course.setDescription(description);
        course = coursRepository.save(course);
        for (String[] item : contents) {
            Contenu content = new Contenu();
            content.setTitre(item[0]);
            content.setType(item[1]);
            content.setCours(course);
            contenuRepository.save(content);
        }
    }
}
