package com.learningtracker.learningtracker.dtos;

import java.math.BigDecimal;

public class ProgressionContenuDTO {
    private Integer idUtilisateur;
    private Integer idContenu;
    private String statut;
    private BigDecimal progression;

    public Integer getIdUtilisateur() { 
        return idUtilisateur; 
    }
    
    public void setIdUtilisateur(Integer idUtilisateur) { 
        this.idUtilisateur = idUtilisateur; 
    }

    public Integer getIdContenu() { 
        return idContenu; 
    }
    
    public void setIdContenu(Integer idContenu) { 
        this.idContenu = idContenu; 
    }

    public String getStatut() { 
        return statut; 
    }
    
    public void setStatut(String statut) { 
        this.statut = statut; 
    }

    public BigDecimal getProgression() { 
        return progression; 
    }
    
    public void setProgression(BigDecimal progression) { 
        this.progression = progression; 
    }
}
