package com.tus.GamingSite.gameScore.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.tus.GamingSite.gameScore.model.GameScore;
import com.tus.GamingSite.gameScore.service.GameScoreService;
import java.util.List;

@RestController
@RequestMapping("/api/games")
@CrossOrigin(origins = "http://localhost:9091") 
public class GameScoreController {

    @Autowired
    private GameScoreService gameScoreService;

    // Save score with gameType
    @PostMapping("/save")
    public ResponseEntity<GameScore> saveScore(@RequestBody GameScore score) {
        return ResponseEntity.ok(
            gameScoreService.saveScore(score.getUsername(), score.getGame(), score.getScore(), score.getGameType())
        );
    }

    // Get scores by game
    @GetMapping("/{game}/scores")
    public ResponseEntity<List<GameScore>> getScoresByGame(@PathVariable String game) {
        return ResponseEntity.ok(gameScoreService.getScoresByGame(game));
    }

    // Get scores by user
    @GetMapping("/user/{username}")
    public ResponseEntity<List<GameScore>> getScoresByUser(@PathVariable String username) {
        return ResponseEntity.ok(gameScoreService.getScoresByUser(username));
    }

    // Get scores by game category
    @GetMapping("/category/{gameType}/scores")
    public ResponseEntity<List<GameScore>> getScoresByGameType(@PathVariable String gameType) {
        return ResponseEntity.ok(gameScoreService.getScoresByGameType(gameType));
    }
}
