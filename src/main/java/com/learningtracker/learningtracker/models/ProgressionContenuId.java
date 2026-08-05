package com.learningtracker.learningtracker.models;

import java.io.Serializable;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class ProgressionContenuId implements Serializable {
    
    private Integer idUtilisateur;
    private Integer idContenu;
}
