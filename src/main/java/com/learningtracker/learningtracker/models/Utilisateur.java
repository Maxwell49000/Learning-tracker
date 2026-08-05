package com.learningtracker.learningtracker.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.util.Set;

@Data
@EqualsAndHashCode(exclude = "progressions")
@Entity
@Table(name = "Utilisateur")
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_utilisateur")
    private Integer idUtilisateur;
    
    @Column(name = "nom_utilisateur", length = 100 , unique = true)
    private String nomUtilisateur;
    
    @Column(name = "mot_de_passe", length = 100)
    private String motDePasse;
    
    @Column(name = "role", length = 100)
    private String role;
    
    @OneToMany(mappedBy = "utilisateur", cascade = CascadeType.ALL, orphanRemoval= true)
    private Set<ProgressionContenu> progressions;
}
