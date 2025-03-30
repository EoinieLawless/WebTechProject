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

import java.io.File;

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
        when(mockFile.exists()).thenReturn(false);  // Simulate missing file
    }

    @Test
    void testImportGameScores_WithMissingFile_SkipsLogic() {
        importService.importGameScores(mockFile);
        verify(gameScoreRepository, never()).saveAll(anyList());
    }

    @Test
    void testImportUserComplaints_WithMissingFile_SkipsLogic() {
        importService.importUserComplaints(mockFile);
        verify(userComplaintRepository, never()).saveAll(anyList());
    }

    @Test
    void testImportUsers_WithMissingFile_SkipsLogic() {
        importService.importUsers(mockFile);
        verify(userRepository, never()).saveAll(anyList());
    }
}
