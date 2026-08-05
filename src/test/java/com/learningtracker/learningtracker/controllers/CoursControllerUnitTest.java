package com.learningtracker.learningtracker.controllers;

import com.learningtracker.learningtracker.dtos.CoursDTO;
import com.learningtracker.learningtracker.models.Cours;
import com.learningtracker.learningtracker.services.CoursService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CoursControllerUnitTest {

    @InjectMocks
    private CoursController coursController;

    @Mock
    private CoursService coursService;

    @Test
    void create_cours_returns_created_dto() {
        CoursDTO dto = new CoursDTO();
        dto.setTitre("C1");
        dto.setDescription("D");

        Cours created = new Cours();
        created.setTitre("C1");
        created.setDescription("D");
        when(coursService.createCours(any())).thenReturn(created);

        ResponseEntity<CoursDTO> resp = coursController.createCours(dto);
        assertEquals(201, resp.getStatusCode().value());
        assertEquals("C1", resp.getBody().getTitre());
    }

    @Test
    void get_all_cours_returns_list() {
        Cours c = new Cours();
        c.setTitre("X");
        when(coursService.getAllCours()).thenReturn(List.of(c));

        ResponseEntity<List<CoursDTO>> resp = coursController.getAllCours();
        assertEquals(1, resp.getBody().size());
        assertEquals("X", resp.getBody().get(0).getTitre());
    }
}
