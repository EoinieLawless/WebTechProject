package com.tus.GamingSite.personalStats.controller;

import com.tus.GamingSite.personalStats.service.PersonalStatsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.MockitoAnnotations.openMocks;

public class PersonalStatsControllerTest {

    @Mock
    private PersonalStatsService personalStatsService;

    @InjectMocks
    private PersonalStatsController controller;

    @BeforeEach
    void setup() {
        openMocks(this);
    }

    @Test
    void testGetPersonalStats() {
        when(personalStatsService.getMostPlayedGame("john")).thenReturn("Flappy Bird");
        when(personalStatsService.getBestScore("john")).thenReturn(120);
        when(personalStatsService.getLeaderboardRank("john")).thenReturn(2);
        when(personalStatsService.getPersonalStats("john")).thenReturn(List.of(60.0, 50.0, 40.0));
        when(personalStatsService.getGlobalStats()).thenReturn(List.of(55.0, 53.0, 48.0));

        ResponseEntity<EntityModel<Map<String, Object>>> response = controller.getPersonalStats("john");

        assertEquals(200, response.getStatusCodeValue());
        Map<String, Object> body = response.getBody().getContent();
        assertEquals("Flappy Bird", body.get("mostPlayedGame"));
        assertEquals(120, body.get("bestScore"));
        assertEquals(2, body.get("leaderboardRank"));
        assertTrue(body.containsKey("personalStats"));
        assertTrue(body.containsKey("globalStats"));
    }

    @Test
    void testGetGlobalStats() {
        when(personalStatsService.getGlobalStats()).thenReturn(List.of(55.0, 53.0, 48.0));

        ResponseEntity<EntityModel<Map<String, Object>>> response = controller.getGlobalStats();

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(List.of(55.0, 53.0, 48.0), response.getBody().getContent().get("globalStats"));
    }

    @Test
    void testGetLeaderboardRank() {
        when(personalStatsService.getLeaderboardRank("john")).thenReturn(5);

        ResponseEntity<EntityModel<Integer>> response = controller.getLeaderboardRank("john");

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(5, response.getBody().getContent());
    }
}
