package com.learningtracker.learningtracker.controllers;

import com.learningtracker.learningtracker.dtos.UtilisateurDTO;
import com.learningtracker.learningtracker.models.Utilisateur;
import com.learningtracker.learningtracker.services.UtilisateurService;
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
public class UtilisateurControllerUnitTest {

    @InjectMocks
    private UtilisateurController utilisateurController;

    @Mock
    private UtilisateurService utilisateurService;

    @Test
    void get_all_users_maps_to_dto() {
        Utilisateur u = new Utilisateur();
        u.setNomUtilisateur("u1");
        when(utilisateurService.getAllUtilisateurs()).thenReturn(List.of(u));

        ResponseEntity<List<UtilisateurDTO>> resp = utilisateurController.getAllUsers();
        assertEquals(1, resp.getBody().size());
        assertEquals("u1", resp.getBody().get(0).getNomUtilisateur());
    }

    @Test
    void get_user_by_id_returns_not_found_when_empty() {
        when(utilisateurService.getUtilisateurById(5)).thenReturn(Optional.empty());
        ResponseEntity<UtilisateurDTO> resp = utilisateurController.getUserById(5);
        assertEquals(404, resp.getStatusCode().value());
    }
}

