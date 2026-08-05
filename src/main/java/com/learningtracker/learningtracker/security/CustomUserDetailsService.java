package com.learningtracker.learningtracker.security;

import java.util.Collections;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.learningtracker.learningtracker.models.Utilisateur;
import com.learningtracker.learningtracker.repositories.UtilisateurRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    // Service qui adapte l'entité `Utilisateur` au model `UserDetails` de Spring Security.
    // Il est utilisé par l'AuthenticationManager pour charger les informations
    // d'un utilisateur à partir de son nom d'utilisateur (username).

    private final UtilisateurRepository utilisateurRepository;

    public CustomUserDetailsService(UtilisateurRepository utilisateurRepository) {
        this.utilisateurRepository = utilisateurRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Recherche l'utilisateur en base, lance UsernameNotFoundException si absent
        Utilisateur utilisateur = utilisateurRepository.findByNomUtilisateur(username)
                .orElseThrow(() -> new UsernameNotFoundException(
                    "Utilisateur non trouvé: " + username));

        // Normalise le rôle et construit les authorities attendues par Spring
        String normalizedRole = utilisateur.getRole() == null ? "" : utilisateur.getRole().trim().toUpperCase();
        return new User(
            utilisateur.getNomUtilisateur(),
            utilisateur.getMotDePasse(),  // mot de passe hashé récupéré depuis la BDD
            Collections.singleton(new SimpleGrantedAuthority("ROLE_" + normalizedRole))
        );
    }
}
