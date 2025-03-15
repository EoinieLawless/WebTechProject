package com.tus.GamingSite.leaderBoard.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.tus.GamingSite.leaderBoard.service.LeaderboardService;
import com.tus.GamingSite.gameScore.model.GameScore;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/leaderboard")
@CrossOrigin(origins = "http://localhost:9091") 
public class LeaderboardController {

    @Autowired
    private LeaderboardService leaderboardService;

    @GetMapping("/{game}")
    public ResponseEntity<CollectionModel<EntityModel<GameScore>>> getTopPlayers(@PathVariable String game) {
        List<EntityModel<GameScore>> scores = leaderboardService.getTopPlayers(game).stream()
            .map(score -> {
                EntityModel<GameScore> entityModel = EntityModel.of(score);
                entityModel.add(WebMvcLinkBuilder.linkTo(
                        WebMvcLinkBuilder.methodOn(LeaderboardController.class)
                                .getTopPlayers(score.getGame()))
                        .withSelfRel());
                entityModel.add(WebMvcLinkBuilder.linkTo(
                        WebMvcLinkBuilder.methodOn(LeaderboardController.class)
                                .getMostActivePlayers())
                        .withRel("most-active"));
                return entityModel;
            })
            .collect(Collectors.toList());

        return ResponseEntity.ok(CollectionModel.of(scores));
    }

    @GetMapping("/most-active")
    public ResponseEntity<CollectionModel<EntityModel<String>>> getMostActivePlayers() {
        List<EntityModel<String>> activePlayers = leaderboardService.getMostActivePlayers().stream()
            .map(player -> {
                EntityModel<String> entityModel = EntityModel.of(player);
                entityModel.add(WebMvcLinkBuilder.linkTo(
                        WebMvcLinkBuilder.methodOn(LeaderboardController.class)
                                .getMostActivePlayers())
                        .withSelfRel());
                return entityModel;
            })
            .collect(Collectors.toList());

        return ResponseEntity.ok(CollectionModel.of(activePlayers));
    }
}
