package com.tus.GamingSite.leaderBoard.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.tus.GamingSite.leaderBoard.service.LeaderboardService;
import com.tus.GamingSite.gameScore.model.GameScore;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/leaderboard")
@CrossOrigin(origins = "http://localhost:9091") 
public class LeaderboardController {

    @Autowired
    private LeaderboardService leaderboardService;

    @GetMapping("/{game}")
    public ResponseEntity<?> getTopPlayers(@PathVariable String game) {
        try {
            List<GameScore> scores = leaderboardService.getTopPlayers(game);

            if (scores.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("error", "No scores found for this game"));
            }

            List<EntityModel<GameScore>> entityModels = scores.stream()
                .map(score -> {
                    EntityModel<GameScore> entityModel = EntityModel.of(score);
                    entityModel.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(LeaderboardController.class)
                            .getTopPlayers(score.getGame())).withSelfRel());
                    return entityModel;
                })
                .collect(Collectors.toList());

            return ResponseEntity.ok(CollectionModel.of(entityModels));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Collections.singletonMap("error", "Error retrieving leaderboard: " + e.getMessage()));
        }
    }


    @GetMapping("/most-active")
    public ResponseEntity<?> getMostActivePlayers() {
        try {
            List<String> players = leaderboardService.getMostActivePlayers();

            if (players.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("error", "No active players found"));
            }

            return ResponseEntity.ok(players);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Collections.singletonMap("error", "Error retrieving most active players: " + e.getMessage()));
        }
    }

}
