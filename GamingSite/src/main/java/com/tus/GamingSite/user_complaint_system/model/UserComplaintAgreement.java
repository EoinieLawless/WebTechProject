package com.tus.GamingSite.user_complaint_system.model;

import javax.persistence.*;
import lombok.Getter;
import lombok.Setter;
import com.tus.GamingSite.users_manager.model.User;

@Getter
@Setter
@Entity
@Table(name = "user_complaint_agreements")
public class UserComplaintAgreement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "complaint_id", nullable = false)
    private UserComplaint complaint;

    public UserComplaintAgreement() {}

    public UserComplaintAgreement(User user, UserComplaint complaint) {
        this.user = user;
        this.complaint = complaint;
    }
}

