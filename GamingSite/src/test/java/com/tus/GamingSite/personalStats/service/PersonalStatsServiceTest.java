package com.tus.GamingSite.personalStats.service;

import com.tus.GamingSite.personalStats.repos.PersonalStatsRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.MockitoAnnotations.openMocks;

public class PersonalStatsServiceTest {

    @Mock
    private PersonalStatsRepository repo;

    @InjectMocks
    private PersonalStatsService service;

    @BeforeEach
    void setup() {
        openMocks(this);
    }

    @Test
    void testGetMostPlayedGame_WithGames() {
        when(repo.findMostPlayedGames("john")).thenReturn(List.of("Flappy Bird", "Chess"));

        assertEquals("Flappy Bird", service.getMostPlayedGame("john"));
    }

    @Test
    void testGetMostPlayedGame_NoGames() {
        when(repo.findMostPlayedGames("emptyUser")).thenReturn(List.of());

        assertEquals("No games played", service.getMostPlayedGame("emptyUser"));
    }

    @Test
    void testGetBestScore() {
        when(repo.findBestScore("john")).thenReturn(123);
        assertEquals(123, service.getBestScore("john"));
    }

    @Test
    void testGetLeaderboardRank() {
        when(repo.findLeaderboardRank("john")).thenReturn(4);
        assertEquals(4, service.getLeaderboardRank("john"));
    }

    @Test
    void testGetGlobalStats() {
        when(repo.findGlobalAverageStat("Precision")).thenReturn(50.0);
        when(repo.findGlobalAverageStat("Puzzle")).thenReturn(45.0);
        when(repo.findGlobalAverageStat("Luck")).thenReturn(60.0);

        List<Double> result = service.getGlobalStats();
        assertEquals(List.of(50.0, 45.0, 60.0), result);
    }

    @Test
    void testGetPersonalStats_ValidGames() {
        when(repo.findMostPlayedGames("john")).thenReturn(List.of("Flappy Bird", "Math Speed", "Lucky Number Guess"));
        when(repo.findPersonalStat("john", "Precision")).thenReturn(6.0);
        when(repo.findPersonalStat("john", "Puzzle")).thenReturn(29.0);
        when(repo.findPersonalStat("john", "Luck")).thenReturn(2.0);

        List<Double> result = service.getPersonalStats("john");

        assertEquals(54.0, result.get(0), 0.1); // Precision
        assertEquals(52.0, result.get(1), 0.1); // Puzzle
        assertEquals(50.0, result.get(2), 0.1); // Luck
    }
}
