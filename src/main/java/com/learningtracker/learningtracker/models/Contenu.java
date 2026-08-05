package com.learningtracker.learningtracker.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.util.Set;

@Data
@EqualsAndHashCode(exclude = "progressions")
@Entity
@Table(name = "Contenu")
public class Contenu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_contenu")
    private Integer idContenu;
    
    @Column(name = "titre", length = 100)
    private String titre;
    
    @Column(name = "type", length = 100)
    private String type;
    
    @Column(name = "url", length = 150)
    private String url;
    
    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name = "id_cours", nullable = false)
    private Cours cours;
    
    @OneToMany(mappedBy = "contenu", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ProgressionContenu> progressions;
}
