package com.tus.GamingSite.gameScore.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.tus.GamingSite.gameScore.model.GameScore;
import com.tus.GamingSite.gameScore.repos.GameScoreRepository;
import java.util.List;

@Service
public class GameScoreService {

    @Autowired
    private GameScoreRepository gameScoreRepository;

    public GameScore saveScore(String username, String game, int score, String gameType) {
        GameScore newScore = new GameScore(username, game, score, gameType);
        return gameScoreRepository.save(newScore);
    }

    public List<GameScore> getScoresByGame(String game) {
        return gameScoreRepository.findByGame(game);
    }

    public List<GameScore> getScoresByUser(String username) {
        return gameScoreRepository.findByUsername(username);
    }
    
    public List<GameScore> getScoresByGameType(String gameType) {
        return gameScoreRepository.findByGameType(gameType);
    }
}
