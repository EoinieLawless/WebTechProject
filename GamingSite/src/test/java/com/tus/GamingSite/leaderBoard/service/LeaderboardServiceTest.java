package com.tus.GamingSite.leaderBoard.service;

import com.tus.GamingSite.gameScore.model.GameScore;
import com.tus.GamingSite.leaderBoard.repos.LeaderboardRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.MockitoAnnotations.openMocks;

public class LeaderboardServiceTest {

    @Mock
    private LeaderboardRepository leaderboardRepository;

    @InjectMocks
    private LeaderboardService leaderboardService;

    @BeforeEach
    void setup() {
        openMocks(this);
    }

    @Test
    void testGetTopPlayers_ReturnsCorrectData() {
        GameScore score = new GameScore("player1", "Guess Number", 10, "Timed");
        when(leaderboardRepository.findBestScorePerPlayerByGame(eq("Guess Number"), anyList()))
                .thenReturn(List.of(score));

        List<GameScore> result = leaderboardService.getTopPlayers("Guess Number");

        assertEquals(1, result.size());
        assertEquals("player1", result.get(0).getUsername());
    }

    @Test
    void testGetMostActivePlayers() {
        Object[] entry = new Object[]{"user1", 7};
        List<Object[]> mockResult = new java.util.ArrayList<>();
        mockResult.add(entry); 

        when(leaderboardRepository.findMostActivePlayers()).thenReturn(mockResult);

        List<String> result = leaderboardService.getMostActivePlayers();

        assertEquals(1, result.size());
        assertEquals("user1 - Games Played: 7", result.get(0));
    }

}
