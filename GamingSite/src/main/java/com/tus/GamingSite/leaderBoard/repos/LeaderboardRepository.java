package com.tus.GamingSite.leaderBoard.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.tus.GamingSite.gameScore.model.GameScore;
import java.util.List;

public interface LeaderboardRepository extends JpaRepository<GameScore, Long> {
    
    // Fetch the highest score for each player in a game
    @Query("SELECT gs FROM GameScore gs WHERE gs.game = :game AND gs.score = (SELECT MAX(sub.score) FROM GameScore sub WHERE sub.username = gs.username AND sub.game = gs.game) ORDER BY gs.score DESC")
    List<GameScore> findHighestScorePerPlayerByGame(String game);

    // Fetch the most active players (who played the most games)
    @Query("SELECT gs.username, COUNT(gs) AS gamesPlayed FROM GameScore gs GROUP BY gs.username ORDER BY gamesPlayed DESC")
    List<Object[]> findMostActivePlayers();
}