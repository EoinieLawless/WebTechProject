package com.tus.GamingSite.user_complaint_system.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tus.GamingSite.user_complaint_system.model.UserComplaintAgreement;
import com.tus.GamingSite.users_manager.model.User;
import com.tus.GamingSite.user_complaint_system.model.UserComplaint;
import java.util.List;

public interface UserComplaintAgreementRepository extends JpaRepository<UserComplaintAgreement, Long> {
    List<UserComplaintAgreement> findByComplaint(UserComplaint complaint);
    boolean existsByUserAndComplaint(User user, UserComplaint complaint);
}
