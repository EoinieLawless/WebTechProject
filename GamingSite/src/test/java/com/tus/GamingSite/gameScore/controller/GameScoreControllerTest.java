package com.tus.GamingSite.gameScore.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tus.GamingSite.gameScore.dto.GameScoreDTO;
import com.tus.GamingSite.gameScore.model.GameScore;
import com.tus.GamingSite.gameScore.service.GameScoreService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class GameScoreControllerTest {

    private MockMvc mockMvc;

    @Mock
    private GameScoreService gameScoreService;

    @InjectMocks
    private GameScoreController gameScoreController;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private GameScore sampleScore;
    private GameScoreDTO sampleScoreDTO;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(gameScoreController).build();

        sampleScore = new GameScore("player1", "Flappy Bird", 10, "Precision");
        sampleScoreDTO = new GameScoreDTO("player1", "Flappy Bird", 10, "Precision");
    }

    @Test
    void testSaveScore() throws Exception {
        when(gameScoreService.saveScore(any(GameScoreDTO.class))).thenReturn(sampleScore);

        mockMvc.perform(post("/api/games/save")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleScoreDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("player1"))
                .andExpect(jsonPath("$.game").value("Flappy Bird"))
                .andExpect(jsonPath("$.score").value(10))
                .andExpect(jsonPath("$.gameType").value("Precision"));
    }

    @Test
    void testGetScoresByGame() throws Exception {
        List<GameScoreDTO> scores = Arrays.asList(sampleScoreDTO);

        when(gameScoreService.getScoresByGame("Flappy Bird")).thenReturn(scores);

        mockMvc.perform(get("/api/games/Flappy Bird/scores"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].game").value("Flappy Bird"));

    }

    @Test
    void testGetScoresByUser() throws Exception {
        List<GameScoreDTO> scores = Arrays.asList(sampleScoreDTO);

        when(gameScoreService.getScoresByUser("player1")).thenReturn(scores);

        mockMvc.perform(get("/api/games/user/player1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].username").value("player1"));

    }
}
