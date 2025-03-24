package com.tus.GamingSite.leaderBoard.repos;

import com.tus.GamingSite.gameScore.model.GameScore;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
public class LeaderboardRepositoryTest {

    @Autowired
    private LeaderboardRepository leaderboardRepository;

    @BeforeEach
    void setUp() {
        leaderboardRepository.saveAll(List.of(
            new GameScore("alice", "Guess Number", 5, "Puzzle"),
            new GameScore("alice", "Guess Number", 10, "Puzzle"),
            new GameScore("bob", "Guess Number", 3, "Puzzle"),
            new GameScore("charlie", "Guess Number", 7, "Puzzle"),
            new GameScore("alice", "Chess", 200, "precision"),
            new GameScore("bob", "Chess", 300, "precision"),
            new GameScore("charlie", "Chess", 250, "precision"),
            new GameScore("bob", "Guess Number", 8, "Puzzle")
        ));
    }

    @Test
    void testFindBestScorePerPlayerByGame_LowestScoreWins() {
        List<GameScore> result = leaderboardRepository.findBestScorePerPlayerByGame(
            "Guess Number",
            LeaderboardRepository.gamesWithLowestScoreWins
        );

        assertFalse(result.isEmpty());
        assertEquals(3, result.size()); // One per user

        GameScore bestBob = result.stream().filter(gs -> gs.getUsername().equals("bob")).findFirst().orElse(null);
        assertNotNull(bestBob);
        assertEquals(3, bestBob.getScore());
    }

    @Test
    void testFindBestScorePerPlayerByGame_HighestScoreWins() {
        List<GameScore> result = leaderboardRepository.findBestScorePerPlayerByGame(
            "Chess",
            LeaderboardRepository.gamesWithLowestScoreWins
        );

        assertFalse(result.isEmpty());
        assertEquals(3, result.size());

        GameScore bestBob = result.stream().filter(gs -> gs.getUsername().equals("bob")).findFirst().orElse(null);
        assertNotNull(bestBob);
        assertEquals(300, bestBob.getScore());
    }

    @Test
    void testFindMostActivePlayers() {
        List<Object[]> result = leaderboardRepository.findMostActivePlayers();

        assertFalse(result.isEmpty());

        Object[] topPlayer = result.get(0);
        String username = (String) topPlayer[0];
        int count = (int) topPlayer[1];

        assertEquals("bob", username);
        assertEquals(3, count); // bob has 3 records in total
    }
}
