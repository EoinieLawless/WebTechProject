package com.tus.GamingSite.user_complaint_system.model;

import javax.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "user_complaints")
public class UserComplaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false, length = 1000)
    private String message;

    public UserComplaint() {}

    public UserComplaint(String username, String email, String message) {
        this.username = username;
        this.email = email;
        this.message = message;
    }
}
