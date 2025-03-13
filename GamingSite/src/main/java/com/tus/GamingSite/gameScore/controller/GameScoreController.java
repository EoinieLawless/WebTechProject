package com.tus.GamingSite.gameScore.controller;

import org.springframework.beans.factory.annotation.Autowired;
import com.tus.GamingSite.gameScore.dto.GameScoreDTO;
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
    public ResponseEntity<GameScore> saveScore(@RequestBody GameScoreDTO gameScoreDTO) {
        return ResponseEntity.ok(gameScoreService.saveScore(gameScoreDTO));
    }

    @GetMapping("/{game}/scores")
    public ResponseEntity<List<GameScoreDTO>> getScoresByGame(@PathVariable String game) {
        return ResponseEntity.ok(gameScoreService.getScoresByGame(game));
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<List<GameScoreDTO>> getScoresByUser(@PathVariable String username) {
        return ResponseEntity.ok(gameScoreService.getScoresByUser(username));
    }

    @GetMapping("/category/{gameType}/scores")
    public ResponseEntity<List<GameScoreDTO>> getScoresByGameType(@PathVariable String gameType) {
        return ResponseEntity.ok(gameScoreService.getScoresByGameType(gameType));
    }

}
