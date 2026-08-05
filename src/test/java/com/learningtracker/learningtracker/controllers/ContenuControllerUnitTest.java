package com.learningtracker.learningtracker.controllers;

import com.learningtracker.learningtracker.dtos.ContenuDTO;
import com.learningtracker.learningtracker.models.Contenu;
import com.learningtracker.learningtracker.models.Cours;
import com.learningtracker.learningtracker.services.ContenuService;
import com.learningtracker.learningtracker.services.CoursService;
import com.learningtracker.learningtracker.services.ProgressionService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ContenuControllerUnitTest {

    @InjectMocks
    private ContenuController contenuController;

    @Mock
    private ContenuService contenuService;

    @Mock
    private CoursService coursService;

    @Mock
    private ProgressionService progressionService;

    @Test
    void get_all_contenu_maps_to_dto() {
        Cours cours = new Cours();
        cours.setIdCours(5);
        Contenu c = new Contenu();
        c.setCours(cours);
        c.setTitre("T");
        when(contenuService.getAllContenu()).thenReturn(List.of(c));

        ResponseEntity<List<ContenuDTO>> resp = contenuController.getAllContenu();
        assertEquals(1, resp.getBody().size());
        assertEquals(5, resp.getBody().get(0).getIdCours());
    }

    @Test
    void create_contenu_calls_services_and_returns_created() {
        ContenuDTO dto = new ContenuDTO();
        dto.setTitre("T");
        dto.setType("video");
        dto.setUrl("u");
        dto.setIdCours(2);

        Cours cours = new Cours();
        cours.setIdCours(2);
        when(coursService.getCoursById(2)).thenReturn(Optional.of(cours));

        Contenu created = new Contenu();
        created.setTitre("T");
        created.setUrl("u");
        created.setType("video");
        created.setCours(cours);
        when(contenuService.createContenu(any())).thenReturn(created);

        ResponseEntity<ContenuDTO> resp = contenuController.createContenu(dto);
        assertEquals(201, resp.getStatusCode().value());
        assertEquals("T", resp.getBody().getTitre());
    }

}
