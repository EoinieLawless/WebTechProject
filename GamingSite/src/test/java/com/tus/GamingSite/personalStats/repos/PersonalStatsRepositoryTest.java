package com.tus.GamingSite.personalStats.repos;

import com.tus.GamingSite.gameScore.model.GameScore;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
public class PersonalStatsRepositoryTest {

    @Autowired
    private PersonalStatsRepository repository;

    @BeforeEach
    void setup() {
        repository.saveAll(List.of(
            new GameScore("alice", "Flappy Bird", 10, "Precision"),
            new GameScore("alice", "Flappy Bird", 15, "Precision"),
            new GameScore("alice", "Math Speed", 20, "Puzzle"),
            new GameScore("bob", "Flappy Bird", 20, "Precision"),
            new GameScore("bob", "Memory Match", 30, "Puzzle"),
            new GameScore("charlie", "Type Racer", 8, "Precision")
        ));
    }

    @Test
    void testFindMostPlayedGames() {
        List<String> result = repository.findMostPlayedGames("alice");
        assertFalse(result.isEmpty());
        assertEquals("Flappy Bird", result.get(0));
    }

    @Test
    void testFindBestScore() {
        Integer score = repository.findBestScore("alice");
        assertEquals(20, score);
    }

    @Test
    void testFindLeaderboardRank() {
        Integer rank = repository.findLeaderboardRank("alice");
        assertEquals(1, rank); 
    }

    @Test
    void testFindPersonalStat() {
        Double avg = repository.findPersonalStat("alice", "Puzzle");
        assertNotNull(avg);
        assertEquals(20.0, avg);
    }

    @Test
    void testFindGlobalAverageStat() {
        Double precisionAvg = repository.findGlobalAverageStat("Precision");
        assertNotNull(precisionAvg);
        assertEquals((10 + 15 + 20 + 8) / 4.0, precisionAvg);
    }
}
