package com.tus.GamingSite.user_complaint_system.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.tus.GamingSite.user_complaint_system.model.UserComplaint;
import com.tus.GamingSite.user_complaint_system.repos.UserComplaintRepository;
import java.util.List;

@Service
public class UserComplaintService {

    @Autowired
    private UserComplaintRepository complaintRepository;

    public UserComplaint submitComplaint(String username, String email, String message) {
        UserComplaint complaint = new UserComplaint(username, email, message);
        return complaintRepository.save(complaint);
    }

    public List<UserComplaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    public void deleteComplaint(Long id) {
        complaintRepository.deleteById(id);
    }
}
