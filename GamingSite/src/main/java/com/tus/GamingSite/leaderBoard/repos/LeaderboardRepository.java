package com.tus.GamingSite.leaderBoard.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.tus.GamingSite.gameScore.model.GameScore;
import java.util.List;

public interface LeaderboardRepository extends JpaRepository<GameScore, Long> {

    // Define a list of games where the lower score is better
    List<String> gamesWithLowestScoreWins = List.of("Guess Number", "Memory Match", "Sudoku Time Attack", "Type Racer");

    // Fetch the best score per player based on whether lower or higher is better
    @Query("SELECT gs FROM GameScore gs WHERE gs.game = :game AND gs.score = (SELECT " +
           "(CASE WHEN :game IN :gamesWithLowestScoreWins THEN MIN(sub.score) ELSE MAX(sub.score) END) " +
           "FROM GameScore sub WHERE sub.username = gs.username AND sub.game = gs.game) " +
           "ORDER BY (CASE WHEN :game IN :gamesWithLowestScoreWins THEN gs.score ELSE -gs.score END)")
    List<GameScore> findBestScorePerPlayerByGame(String game);
    
    @Query("SELECT gs.username, COUNT(gs) as gamesPlayed FROM GameScore gs GROUP BY gs.username ORDER BY gamesPlayed DESC")
    List<Object[]> findMostActivePlayers();
}
