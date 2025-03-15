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

    // Get best score per player in a specific game
    public List<GameScore> getTopPlayers(String game) {
        return leaderboardRepository.findBestScorePerPlayerByGame(game);
    }

    // Get most active players by the number of games played
    public List<String> getMostActivePlayers() {
        return leaderboardRepository.findMostActivePlayers()
                .stream()
                .map(obj -> obj[0].toString() + " - Games Played: " + obj[1].toString())
                .collect(Collectors.toList());
    }
}
