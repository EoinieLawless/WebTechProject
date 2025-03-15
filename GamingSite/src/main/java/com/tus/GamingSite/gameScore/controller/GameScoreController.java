package com.tus.GamingSite.gameScore.controller;

import org.springframework.beans.factory.annotation.Autowired;
import com.tus.GamingSite.gameScore.dto.GameScoreDTO;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.tus.GamingSite.gameScore.model.GameScore;
import com.tus.GamingSite.gameScore.service.GameScoreService;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/games")
@CrossOrigin(origins = "http://localhost:9091") 
public class GameScoreController {

    @Autowired
    private GameScoreService gameScoreService;

    // Save score with gameType
    @PostMapping("/save")
    public ResponseEntity<EntityModel<GameScoreDTO>> saveScore(@RequestBody GameScoreDTO gameScoreDTO) {
        GameScore savedScore = gameScoreService.saveScore(gameScoreDTO);
        GameScoreDTO responseDto = new GameScoreDTO(
            savedScore.getUsername(),
            savedScore.getGame(),
            savedScore.getScore(),
            savedScore.getGameType()
        );

        // Add HATEOAS links
        EntityModel<GameScoreDTO> entityModel = EntityModel.of(responseDto);
        entityModel.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(GameScoreController.class)
                .getScoresByGame(savedScore.getGame())).withRel("game-scores"));
        entityModel.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(GameScoreController.class)
                .getScoresByUser(savedScore.getUsername())).withRel("user-scores"));

        return ResponseEntity.ok(entityModel);
    }

    @GetMapping("/{game}/scores")
    public ResponseEntity<CollectionModel<EntityModel<GameScoreDTO>>> getScoresByGame(@PathVariable String game) {
        List<EntityModel<GameScoreDTO>> entityModels = gameScoreService.getScoresByGame(game).stream()
            .map(score -> {
                EntityModel<GameScoreDTO> entityModel = EntityModel.of(score);
                entityModel.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(GameScoreController.class)
                    .getScoresByGame(score.getGame())).withSelfRel());
                return entityModel;
            })
            .collect(Collectors.toList());

        return ResponseEntity.ok(CollectionModel.of(entityModels));
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<CollectionModel<EntityModel<GameScoreDTO>>> getScoresByUser(@PathVariable String username) {
        List<EntityModel<GameScoreDTO>> entityModels = gameScoreService.getScoresByUser(username).stream()
            .map(score -> {
                EntityModel<GameScoreDTO> entityModel = EntityModel.of(score);
                entityModel.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(GameScoreController.class)
                    .getScoresByUser(score.getUsername())).withSelfRel());
                return entityModel;
            })
            .collect(Collectors.toList());

        return ResponseEntity.ok(CollectionModel.of(entityModels));
    }

    @GetMapping("/category/{gameType}/scores")
    public ResponseEntity<CollectionModel<EntityModel<GameScoreDTO>>> getScoresByGameType(@PathVariable String gameType) {
        List<EntityModel<GameScoreDTO>> entityModels = gameScoreService.getScoresByGameType(gameType).stream()
            .map(score -> {
                EntityModel<GameScoreDTO> entityModel = EntityModel.of(score);
                entityModel.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(GameScoreController.class)
                    .getScoresByGameType(score.getGameType())).withSelfRel());
                return entityModel;
            })
            .collect(Collectors.toList());

        return ResponseEntity.ok(CollectionModel.of(entityModels));
    }
}
