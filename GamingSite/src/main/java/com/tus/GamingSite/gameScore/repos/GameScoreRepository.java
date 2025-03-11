package com.tus.GamingSite.gameScore.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tus.GamingSite.gameScore.model.GameScore;
import java.util.List;

public interface GameScoreRepository extends JpaRepository<GameScore, Long> {
    List<GameScore> findByGame(String game);
    List<GameScore> findByUsername(String username);
    List<GameScore> findByGameType(String gameType);
}
