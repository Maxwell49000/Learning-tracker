package com.learningtracker.learningtracker.dtos;

public class ContenuDTO {
    private Integer idContenu;
    private String titre;
    private String type;
    private String url;
    private Integer idCours;

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Integer getIdCours() {
        return idCours;
    }

    public void setIdCours(Integer idCours) {
        this.idCours = idCours;
    }

    public Integer getIdContenu() {
        return idContenu;
    }

    public void setIdContenu(Integer idContenu) {
        this.idContenu = idContenu;
    }
}
