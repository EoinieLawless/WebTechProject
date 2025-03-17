package com.tus.GamingSite.importService;

import com.tus.GamingSite.gameScore.model.GameScore;
import com.tus.GamingSite.gameScore.repos.GameScoreRepository;
import com.tus.GamingSite.user_complaint_system.model.UserComplaint;
import com.tus.GamingSite.user_complaint_system.repos.UserComplaintRepository;
import com.tus.GamingSite.users_manager.model.User;
import com.tus.GamingSite.users_manager.repository.UserRepository;
import org.apache.commons.csv.CSVRecord;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.File;
import java.util.Collections;
import java.util.List;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ImportServiceTest {

    @Mock
    private GameScoreRepository gameScoreRepository;

    @Mock
    private UserComplaintRepository userComplaintRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ValidationService validationService;

    @InjectMocks
    private importService importService;

    private File mockFile;

    @BeforeEach
    void setUp() {
        mockFile = mock(File.class);
        when(mockFile.exists()).thenReturn(true);
    }

    @Test
    void testImportGameScores_WithValidData() {
        when(validationService.userExists(anyString())).thenReturn(true);
        when(gameScoreRepository.existsByUsernameAndGame(anyString(), anyString())).thenReturn(false);
        
        importService.importGameScores(mockFile);

        verify(gameScoreRepository, atLeastOnce()).saveAll(anyList());
    }

    @Test
    void testImportGameScores_SkipsNonExistentUser() {
        when(validationService.userExists(anyString())).thenReturn(false);

        importService.importGameScores(mockFile);

        verify(gameScoreRepository, never()).saveAll(anyList());
    }

    @Test
    void testImportUsers_WithValidData() {
        when(userRepository.existsByUsername(anyString())).thenReturn(false);

        importService.importUsers(mockFile);

        verify(userRepository, atLeastOnce()).saveAll(anyList());
    }

    @Test
    void testImportUserComplaints_WithValidData() {
        when(userComplaintRepository.existsByUsernameAndMessage(anyString(), anyString())).thenReturn(false);

        importService.importUserComplaints(mockFile);

        verify(userComplaintRepository, atLeastOnce()).saveAll(anyList());
    }
}
