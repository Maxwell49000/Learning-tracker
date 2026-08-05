package com.learningtracker.learningtracker.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.util.Set;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@EqualsAndHashCode(exclude = "contenus")
@Entity
@Table(name = "Cours")
public class Cours {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cours")
    private Integer idCours;
    
    @Column(name = "titre", length = 100)
    private String titre;
    
    @Column(name = "description", length = 100)
    private String description;
    
    @OneToMany(mappedBy = "cours", cascade = CascadeType.ALL, orphanRemoval = true) 
    @JsonIgnore
    private Set<Contenu> contenus;
}
