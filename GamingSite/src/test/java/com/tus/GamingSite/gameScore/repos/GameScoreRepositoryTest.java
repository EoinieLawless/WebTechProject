package com.tus.GamingSite.gameScore.repos;

import com.tus.GamingSite.gameScore.model.GameScore;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(SpringExtension.class)
@DataJpaTest
class GameScoreRepositoryTest {

    @Autowired
    private GameScoreRepository gameScoreRepository;

    @Test
    void testSaveAndFindByGame() {
        GameScore gameScore = new GameScore("player1", "Flappy Bird", 10, "Precision");
        gameScoreRepository.save(gameScore);

        List<GameScore> scores = gameScoreRepository.findByGame("Flappy Bird");
        assertFalse(scores.isEmpty());
        assertEquals("Flappy Bird", scores.get(0).getGame());
    }

    @Test
    void testFindByUsername() {
        GameScore gameScore = new GameScore("player1", "Flappy Bird", 10, "Precision");
        gameScoreRepository.save(gameScore);

        List<GameScore> scores = gameScoreRepository.findByUsername("player1");
        assertFalse(scores.isEmpty());
        assertEquals("player1", scores.get(0).getUsername());
    }

    @Test
    void testExistsByUsernameAndGame() {
        GameScore gameScore = new GameScore("player1", "Flappy Bird", 10, "Precision");
        gameScoreRepository.save(gameScore);

        assertTrue(gameScoreRepository.existsByUsernameAndGame("player1", "Flappy Bird"));
        assertFalse(gameScoreRepository.existsByUsernameAndGame("player2", "Flappy Bird"));
    }
}
