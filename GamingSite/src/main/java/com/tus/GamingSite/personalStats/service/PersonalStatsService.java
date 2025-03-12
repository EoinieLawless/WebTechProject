package com.tus.GamingSite.personalStats.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.tus.GamingSite.personalStats.repos.PersonalStatsRepository;
import java.util.Arrays;
import java.util.List;

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
        return Arrays.asList(
            personalStatsRepository.findPersonalStat(username, "Precision"),
            personalStatsRepository.findPersonalStat(username, "Puzzle Solving"),
            personalStatsRepository.findPersonalStat(username, "Luck")
        );
    }

    public List<Double> getGlobalStats() {
        return Arrays.asList(
            personalStatsRepository.findGlobalAverageStat("Precision"),
            personalStatsRepository.findGlobalAverageStat("Puzzle Solving"),
            personalStatsRepository.findGlobalAverageStat("Luck")
        );
    }
}
