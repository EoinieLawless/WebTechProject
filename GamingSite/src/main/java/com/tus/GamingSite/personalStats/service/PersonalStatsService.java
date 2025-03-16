package com.tus.GamingSite.personalStats.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.tus.GamingSite.personalStats.repos.PersonalStatsRepository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PersonalStatsService {

    @Autowired
    private PersonalStatsRepository personalStatsRepository;

    public String getMostPlayedGame(String username) {
        List<String> games = personalStatsRepository.findMostPlayedGames(username);
        return games.isEmpty() ? "No games played" : games.get(0);
    }


    public Integer getBestScore(String username) {
        return personalStatsRepository.findBestScore(username);
    }

    public Integer getLeaderboardRank(String username) {
        return personalStatsRepository.findLeaderboardRank(username);
    }

    public List<Double> getPersonalStats(String username) {
        // Define game thresholds & rules in a single map
        Map<String, Double> gameThresholds = Map.of(
            "Flappy Bird", 4.0, "Aim Trainer", 15.0, "Type Racer", 12.0,
            "Memory Match", 21.0, "Math Speed", 30.0, "Sudoku Time Attack", 15.0,
            "Lucky Number Guess", 2.0, "Higher or Lower", 3.0
        );

        // Define whether higher or lower is better
        Map<String, Boolean> gameHigherIsBetter = Map.of(
            "Flappy Bird", true, "Aim Trainer", true, "Lucky Number Guess", true,
            "Type Racer", false, "Memory Match", false, "Math Speed", false,
            "Sudoku Time Attack", false, "Higher or Lower", false
        );

        // **Fix: Map game names to their correct game types**
        Map<String, String> gameTypeMapping = Map.of(
            "Flappy Bird", "Precision", "Aim Trainer", "Precision",
            "Type Racer", "Precision", "Memory Match", "Puzzle",
            "Math Speed", "Puzzle", "Sudoku Time Attack", "Puzzle",
            "Lucky Number Guess", "Luck", "Higher or Lower", "Luck"
        );

        // Default stats at 50
        double[] stats = {50.0, 50.0, 50.0}; // [Precision, Puzzle Solving, Luck]
        Map<String, Integer> statIndexMapping = Map.of("Precision", 0, "Puzzle", 1, "Luck", 2);

        // Get all games the user has played
        List<String> playedGames = personalStatsRepository.findMostPlayedGames(username);

        for (String game : playedGames) {
            if (gameThresholds.containsKey(game)) {
                String gameType = gameTypeMapping.get(game);  // Get correct game type
                int statIndex = statIndexMapping.get(gameType);  // Get correct index for stats array
                Double avgScore = personalStatsRepository.findPersonalStat(username, gameType); // Use gameType, not gameName!
                double threshold = gameThresholds.get(game);
                boolean higherIsBetter = gameHigherIsBetter.get(game);

                if (avgScore != null) {
                    double newStat = higherIsBetter 
                        ? 50.0 + ((avgScore - threshold) * 2) // Higher is better
                        : 50.0 - ((avgScore - threshold) * 2); // Lower is better
                    
                    stats[statIndex] = Math.max(0, Math.min(100, newStat)); 
                }
            }
        }

        return Arrays.asList(stats[0], stats[1], stats[2]);
    }



    public List<Double> getGlobalStats() {
        return Arrays.asList(
            personalStatsRepository.findGlobalAverageStat("Precision"),
            personalStatsRepository.findGlobalAverageStat("Puzzle"),
            personalStatsRepository.findGlobalAverageStat("Luck")
        );
    }
}
