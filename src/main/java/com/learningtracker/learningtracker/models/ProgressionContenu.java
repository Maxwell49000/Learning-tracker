package com.learningtracker.learningtracker.models;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import org.hibernate.annotations.UpdateTimestamp;

@Data
@Entity
@Table(name = "Progression_Contenu")
@IdClass(ProgressionContenuId.class)
public class ProgressionContenu {

    @Id
    @Column(name = "id_utilisateur")
    private Integer idUtilisateur;
    
    @Id
    @Column(name = "id_contenu")
    private Integer idContenu;
    
    @Column(name = "statut", length = 150)
    private String statut;
    
    @Column(name = "progression", precision = 15, scale = 2)
    private BigDecimal progression;
    
    @UpdateTimestamp
    @Column(name = "date_maj")
    private LocalDateTime dateMaj;
    
    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name = "id_utilisateur", insertable = false, updatable = false)
    private Utilisateur utilisateur;
    
    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name = "id_contenu", insertable = false, updatable = false)
    private Contenu contenu;
}
