package com.tus.GamingSite.leaderBoard.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.tus.GamingSite.leaderBoard.service.LeaderboardService;
import com.tus.GamingSite.gameScore.model.GameScore;
import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
@CrossOrigin(origins = "http://localhost:9091") 
public class LeaderboardController {

    @Autowired
    private LeaderboardService leaderboardService;

    @GetMapping("/{game}")
    public ResponseEntity<List<GameScore>> getTopPlayers(@PathVariable String game) {
        return ResponseEntity.ok(leaderboardService.getTopPlayers(game));
    }

    @GetMapping("/most-active")
    public ResponseEntity<List<String>> getMostActivePlayers() {
        return ResponseEntity.ok(leaderboardService.getMostActivePlayers());
    }
}
