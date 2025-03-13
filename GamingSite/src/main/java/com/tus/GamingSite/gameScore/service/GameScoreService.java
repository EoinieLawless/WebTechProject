package com.tus.GamingSite.gameScore.service;

import org.springframework.beans.factory.annotation.Autowired;
import com.tus.GamingSite.gameScore.dto.GameScoreDTO;
import org.springframework.stereotype.Service;
import com.tus.GamingSite.gameScore.model.GameScore;
import com.tus.GamingSite.gameScore.repos.GameScoreRepository;
import java.util.List;

@Service
public class GameScoreService {

    @Autowired
    private GameScoreRepository gameScoreRepository;

    public GameScore saveScore(GameScoreDTO gameScoreDTO) {
        GameScore newScore = new GameScore(
            gameScoreDTO.getUsername(),
            gameScoreDTO.getGame(),
            gameScoreDTO.getScore(),
            gameScoreDTO.getGameType()
        );
        return gameScoreRepository.save(newScore);
    }

    public List<GameScoreDTO> getScoresByGame(String game) {
        return gameScoreRepository.findByGame(game).stream()
            .map(score -> new GameScoreDTO(score.getUsername(), score.getGame(), score.getScore(), score.getGameType()))
            .toList();
    }

    public List<GameScoreDTO> getScoresByUser(String username) {
        return gameScoreRepository.findByUsername(username).stream()
            .map(score -> new GameScoreDTO(score.getUsername(), score.getGame(), score.getScore(), score.getGameType()))
            .toList();
    }

    public List<GameScoreDTO> getScoresByGameType(String gameType) {
        return gameScoreRepository.findByGameType(gameType).stream()
            .map(score -> new GameScoreDTO(score.getUsername(), score.getGame(), score.getScore(), score.getGameType()))
            .toList();
    }
}
