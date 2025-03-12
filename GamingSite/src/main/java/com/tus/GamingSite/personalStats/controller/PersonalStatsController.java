package com.tus.GamingSite.personalStats.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.tus.GamingSite.personalStats.service.PersonalStatsService;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/personalStats")
@CrossOrigin(origins = "http://localhost:9091")
public class PersonalStatsController {

    @Autowired
    private PersonalStatsService personalStatsService;

    @GetMapping("/{username}")
    public ResponseEntity<Map<String, Object>> getPersonalStats(@PathVariable String username) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("mostPlayedGame", personalStatsService.getMostPlayedGame(username));
        stats.put("bestScore", personalStatsService.getBestScore(username));
        stats.put("leaderboardRank", personalStatsService.getLeaderboardRank(username));
        stats.put("personalStats", personalStatsService.getPersonalStats(username));
        stats.put("globalStats", personalStatsService.getGlobalStats());
        return ResponseEntity.ok(stats);
    }
}
