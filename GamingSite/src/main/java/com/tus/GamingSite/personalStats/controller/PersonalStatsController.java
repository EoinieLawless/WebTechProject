package com.tus.GamingSite.personalStats.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.tus.GamingSite.personalStats.service.PersonalStatsService;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/personalStats")
@CrossOrigin(origins = "http://localhost:9091")
public class PersonalStatsController {

    @Autowired
    private PersonalStatsService personalStatsService;

    @GetMapping("/{username}")
    public ResponseEntity<EntityModel<Map<String, Object>>> getPersonalStats(@PathVariable String username) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("mostPlayedGame", personalStatsService.getMostPlayedGame(username));
        stats.put("bestScore", personalStatsService.getBestScore(username));
        stats.put("leaderboardRank", personalStatsService.getLeaderboardRank(username));
        stats.put("personalStats", personalStatsService.getPersonalStats(username));
        stats.put("globalStats", personalStatsService.getGlobalStats());

        EntityModel<Map<String, Object>> entityModel = EntityModel.of(stats);
        
        // these are th elinks for the HATEOUS
        entityModel.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(PersonalStatsController.class)
                .getPersonalStats(username)).withSelfRel());
        entityModel.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(PersonalStatsController.class)
                .getGlobalStats()).withRel("global-stats"));
        entityModel.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(PersonalStatsController.class)
                .getLeaderboardRank(username)).withRel("leaderboard-rank"));
        
        return ResponseEntity.ok(entityModel);
    }

    @GetMapping("/global-stats")
    public ResponseEntity<EntityModel<Map<String, Object>>> getGlobalStats() {
        Map<String, Object> globalStats = new HashMap<>();
        globalStats.put("globalStats", personalStatsService.getGlobalStats());

        EntityModel<Map<String, Object>> entityModel = EntityModel.of(globalStats);
        entityModel.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(PersonalStatsController.class)
                .getGlobalStats()).withSelfRel());

        return ResponseEntity.ok(entityModel);
    }

    @GetMapping("/leaderboard-rank/{username}")
    public ResponseEntity<EntityModel<Integer>> getLeaderboardRank(@PathVariable String username) {
        Integer rank = personalStatsService.getLeaderboardRank(username);
        EntityModel<Integer> entityModel = EntityModel.of(rank);
        entityModel.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(PersonalStatsController.class)
                .getLeaderboardRank(username)).withSelfRel());

        return ResponseEntity.ok(entityModel);
    }
}
