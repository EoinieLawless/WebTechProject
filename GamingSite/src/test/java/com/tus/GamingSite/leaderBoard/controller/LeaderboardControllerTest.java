package com.tus.GamingSite.leaderBoard.controller;

import com.tus.GamingSite.gameScore.model.GameScore;
import com.tus.GamingSite.leaderBoard.service.LeaderboardService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.http.ResponseEntity;
import java.util.List;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.MockitoAnnotations.openMocks;

public class LeaderboardControllerTest {

    @Mock
    private LeaderboardService leaderboardService;

    @InjectMocks
    private LeaderboardController controller;

    @BeforeEach
    void setup() {
        openMocks(this);
    }

    @Test
    void testGetTopPlayers_Found() {
        GameScore score = new GameScore("player1", "Chess", 200, "Classic");
        when(leaderboardService.getTopPlayers("Chess")).thenReturn(List.of(score));

        ResponseEntity<?> response = controller.getTopPlayers("Chess");

        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
    }

    @Test
    void testGetTopPlayers_NotFound() {
        when(leaderboardService.getTopPlayers("UnknownGame")).thenReturn(Collections.emptyList());

        ResponseEntity<?> response = controller.getTopPlayers("UnknownGame");

        assertEquals(404, response.getStatusCodeValue());
        assertTrue(response.getBody().toString().contains("No scores found"));
    }

    @Test
    void testGetTopPlayers_Exception() {
        when(leaderboardService.getTopPlayers("Boom")).thenThrow(new RuntimeException("DB Down"));

        ResponseEntity<?> response = controller.getTopPlayers("Boom");

        assertEquals(500, response.getStatusCodeValue());
        assertTrue(response.getBody().toString().contains("Error retrieving leaderboard"));
    }

    @Test
    void testGetMostActivePlayers_Found() {
        List<String> players = List.of("player1 - Games Played: 10");
        when(leaderboardService.getMostActivePlayers()).thenReturn(players);

        ResponseEntity<?> response = controller.getMostActivePlayers();

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(players, response.getBody());
    }

    @Test
    void testGetMostActivePlayers_NotFound() {
        when(leaderboardService.getMostActivePlayers()).thenReturn(Collections.emptyList());

        ResponseEntity<?> response = controller.getMostActivePlayers();

        assertEquals(404, response.getStatusCodeValue());
        assertTrue(response.getBody().toString().contains("No active players"));
    }

    @Test
    void testGetMostActivePlayers_Exception() {
        when(leaderboardService.getMostActivePlayers()).thenThrow(new RuntimeException("Backend Down"));

        ResponseEntity<?> response = controller.getMostActivePlayers();

        assertEquals(500, response.getStatusCodeValue());
        assertTrue(response.getBody().toString().contains("Error retrieving most active players"));
    }
}
