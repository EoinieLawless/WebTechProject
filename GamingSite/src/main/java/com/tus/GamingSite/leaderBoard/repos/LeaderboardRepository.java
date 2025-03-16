package com.tus.GamingSite.leaderBoard.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.tus.GamingSite.gameScore.model.GameScore;
import java.util.List;

public interface LeaderboardRepository extends JpaRepository<GameScore, Long> {

    List<String> gamesWithLowestScoreWins = List.of("Guess Number", "Memory Match", "Sudoku Time Attack", "Type Racer");

    @Query("SELECT gs FROM GameScore gs WHERE gs.game = :game AND gs.score = (SELECT " +
    	       "(CASE WHEN gs.game IN (:games) THEN MIN(sub.score) ELSE MAX(sub.score) END) " +
    	       "FROM GameScore sub WHERE sub.username = gs.username AND sub.game = gs.game) " +
    	       "ORDER BY (CASE WHEN gs.game IN (:games) THEN gs.score ELSE -gs.score END)")
    	List<GameScore> findBestScorePerPlayerByGame(String game, @Param("games") List<String> games);
    
    @Query("SELECT gs.username, CAST(COUNT(gs) AS int) as gamesPlayed FROM GameScore gs GROUP BY gs.username ORDER BY gamesPlayed DESC")
    List<Object[]> findMostActivePlayers();

}
