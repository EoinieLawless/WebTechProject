package com.tus.GamingSite.importService;

import com.tus.GamingSite.gameScore.repos.GameScoreRepository;
import com.tus.GamingSite.user_complaint_system.repos.UserComplaintRepository;
import com.tus.GamingSite.users_manager.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class ImportServiceControllerTest {


    @Mock
    private importService csvImportService;

    @Mock
    private GameScoreRepository gameScoreRepository;

    @Mock
    private UserComplaintRepository userComplaintRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ImportServiceController importServiceController;
    
   

    @Test
    void testImportFiles_Success() {
        doNothing().when(csvImportService).importAll();

        ResponseEntity<Map<String, Object>> response = importServiceController.importFiles();

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Import Completed", response.getBody().get("status"));

        verify(csvImportService, times(1)).importAll();
    }

    @Test
    void testImportFiles_WithExistingDataWarning() {
        when(gameScoreRepository.count()).thenReturn(1L);

        ResponseEntity<Map<String, Object>> response = importServiceController.importFiles();

        assertTrue(response.getBody().containsKey("warning"));
        assertEquals("Existing data detected! Importing won't overwrite data.", response.getBody().get("warning"));
    }

    @Test
    void testImportFiles_WithError() {
        doThrow(new RuntimeException("File not found")).when(csvImportService).importAll();

        ResponseEntity<Map<String, Object>> response = importServiceController.importFiles();

        assertTrue(response.getBody().containsKey("error"));
        assertEquals("Failed to process import: File not found", response.getBody().get("error"));
    }
}
