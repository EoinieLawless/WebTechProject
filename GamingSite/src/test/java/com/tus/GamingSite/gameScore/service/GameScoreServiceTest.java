package com.tus.GamingSite.gameScore.service;

import com.tus.GamingSite.gameScore.dto.GameScoreDTO;
import com.tus.GamingSite.gameScore.model.GameScore;
import com.tus.GamingSite.gameScore.repos.GameScoreRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GameScoreServiceTest {

    @Mock
    private GameScoreRepository gameScoreRepository;

    @InjectMocks
    private GameScoreService gameScoreService;

    private GameScore sampleScore;
    private GameScoreDTO sampleScoreDTO;

    @BeforeEach
    void setUp() {
        sampleScore = new GameScore("player1", "Flappy Bird", 10, "Precision");
        sampleScoreDTO = new GameScoreDTO("player1", "Flappy Bird", 10, "Precision");
    }

    @Test
    void testSaveScore() {
        when(gameScoreRepository.save(any(GameScore.class))).thenReturn(sampleScore);

        GameScore savedScore = gameScoreService.saveScore(sampleScoreDTO);
        assertNotNull(savedScore);
        assertEquals("player1", savedScore.getUsername());
        assertEquals("Flappy Bird", savedScore.getGame());
        assertEquals(10, savedScore.getScore());
    }

    @Test
    void testGetScoresByGame() {
        when(gameScoreRepository.findByGame("Flappy Bird"))
                .thenReturn(Arrays.asList(sampleScore));

        List<GameScoreDTO> scores = gameScoreService.getScoresByGame("Flappy Bird");
        assertFalse(scores.isEmpty());
        assertEquals(1, scores.size());
        assertEquals("Flappy Bird", scores.get(0).getGame());
    }

    @Test
    void testGetScoresByUser() {
        when(gameScoreRepository.findByUsername("player1"))
                .thenReturn(Arrays.asList(sampleScore));

        List<GameScoreDTO> scores = gameScoreService.getScoresByUser("player1");
        assertFalse(scores.isEmpty());
        assertEquals("player1", scores.get(0).getUsername());
    }

    @Test
    void testGetScoresByGameType() {
        when(gameScoreRepository.findByGameType("Precision"))
                .thenReturn(Arrays.asList(sampleScore));

        List<GameScoreDTO> scores = gameScoreService.getScoresByGameType("Precision");
        assertFalse(scores.isEmpty());
        assertEquals("Precision", scores.get(0).getGameType());
    }
}
