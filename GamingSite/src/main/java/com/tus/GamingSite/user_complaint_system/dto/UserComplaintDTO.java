package com.tus.GamingSite.user_complaint_system.dto;

import org.springframework.hateoas.RepresentationModel;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserComplaintDTO extends RepresentationModel<UserComplaintDTO> {
    private Long id;
    private String username;
    private String email;
    private String message;

    public UserComplaintDTO() {}

    public UserComplaintDTO(Long id, String username, String email, String message) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.message = message;
    }
}
