package com.learningtracker.learningtracker.controllers;

import com.learningtracker.learningtracker.dtos.ProgressionContenuDTO;
import com.learningtracker.learningtracker.models.ProgressionContenu;
import com.learningtracker.learningtracker.services.ProgressionService;
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
public class ProgressionControllerUnitTest {

    @InjectMocks
    private ProgressionController progressionController;

    @Mock
    private ProgressionService progressionService;

    @Test
    void create_progression_returns_created() {
        ProgressionContenuDTO dto = new ProgressionContenuDTO();
        dto.setIdUtilisateur(2);
        dto.setIdContenu(3);
        dto.setProgression(java.math.BigDecimal.valueOf(100.0));

        ProgressionContenu created = new ProgressionContenu();
        created.setIdUtilisateur(2);
        created.setIdContenu(3);
        created.setProgression(java.math.BigDecimal.valueOf(100.0));
        created.setStatut("DONE");

        when(progressionService.createProgression(any())).thenReturn(created);

        ResponseEntity<ProgressionContenuDTO> resp = progressionController.createProgression(dto);
        assertEquals(201, resp.getStatusCode().value());
        assertEquals(2, resp.getBody().getIdUtilisateur());
    }

    @Test
    void calculate_calls_service_and_returns_value() {
        when(progressionService.calculateProgressionByUser(2)).thenReturn(50.0);
        ResponseEntity<Double> resp = progressionController.calculateProgressionByUser(2);
        assertEquals(50.0, resp.getBody());
    }
}
