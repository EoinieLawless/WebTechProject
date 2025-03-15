package com.tus.GamingSite.gameScore.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.hateoas.RepresentationModel;

@Getter
@Setter
public class GameScoreDTO extends RepresentationModel<GameScoreDTO> {
    private String username;
    private String game;
    private int score;
    private String gameType;

    public GameScoreDTO() {}

    public GameScoreDTO(String username, String game, int score, String gameType) {
        this.username = username;
        this.game = game;
        this.score = score;
        this.gameType = gameType;
    }
}
