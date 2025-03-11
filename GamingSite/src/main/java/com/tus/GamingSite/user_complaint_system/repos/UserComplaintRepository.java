package com.tus.GamingSite.user_complaint_system.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tus.GamingSite.user_complaint_system.model.UserComplaint;
import java.util.List;

public interface UserComplaintRepository extends JpaRepository<UserComplaint, Long> {
    List<UserComplaint> findAll();
}
