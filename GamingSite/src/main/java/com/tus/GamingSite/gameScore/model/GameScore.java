package com.tus.GamingSite.gameScore.model;

import javax.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "game_scores")
public class GameScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String game;

    @Column(nullable = false)
    private int score;

    public GameScore() {}

    public GameScore(String username, String game, int score) {
        this.username = username;
        this.game = game;
        this.score = score;
    }
}
