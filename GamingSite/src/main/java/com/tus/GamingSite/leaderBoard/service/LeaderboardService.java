package com.tus.GamingSite.leaderBoard.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.tus.GamingSite.gameScore.model.GameScore;
import com.tus.GamingSite.leaderBoard.repos.LeaderboardRepository;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LeaderboardService {

    @Autowired
    private LeaderboardRepository leaderboardRepository;

    public List<GameScore> getTopPlayers(String game) {
        List<String> gamesWithLowestScoreWins = List.of("Guess Number", "Memory Match", "Sudoku Time Attack", "Type Racer");

        return leaderboardRepository.findBestScorePerPlayerByGame(game, gamesWithLowestScoreWins);
    }

    public List<String> getMostActivePlayers() {
        return leaderboardRepository.findMostActivePlayers()
            .stream()
            .map(obj -> {
                String username = obj[0].toString();
                String gamesPlayed = String.valueOf(obj[1]); // Ensure proper string conversion
                return username + " - Games Played: " + gamesPlayed;
            })
            .collect(Collectors.toList());
    }

}
