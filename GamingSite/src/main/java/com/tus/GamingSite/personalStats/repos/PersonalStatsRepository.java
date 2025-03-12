package com.tus.GamingSite.personalStats.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.tus.GamingSite.gameScore.model.GameScore;
import java.util.List;

public interface PersonalStatsRepository extends JpaRepository<GameScore, Long> {

    // Get the most played game of a user
	@Query("SELECT gs.game FROM GameScore gs WHERE gs.username = :username GROUP BY gs.game ORDER BY COUNT(gs) DESC")
	List<String> findMostPlayedGames(String username);

    // Get the best score of a user
    @Query("SELECT MAX(gs.score) FROM GameScore gs WHERE gs.username = :username")
    Integer findBestScore(String username);

    // Get the leaderboard rank of a user (based on best score)
    @Query("SELECT COUNT(DISTINCT gs.username) + 1 FROM GameScore gs WHERE gs.score > (SELECT MAX(sub.score) FROM GameScore sub WHERE sub.username = :username)")
    Integer findLeaderboardRank(String username);

    // Get personal stat scores (Precision, Puzzle Solving, Luck) based on game types
    @Query("SELECT AVG(gs.score) FROM GameScore gs WHERE gs.username = :username AND gs.gameType = :gameType")
    Double findPersonalStat(String username, String gameType);

    // Get global average stats for all players
    @Query("SELECT AVG(gs.score) FROM GameScore gs WHERE gs.gameType = :gameType")
    Double findGlobalAverageStat(String gameType);
}
