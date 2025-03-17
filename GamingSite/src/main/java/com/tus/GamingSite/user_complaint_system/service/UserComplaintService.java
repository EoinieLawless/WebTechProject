package com.tus.GamingSite.user_complaint_system.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.tus.GamingSite.user_complaint_system.dto.UserComplaintDTO;
import com.tus.GamingSite.user_complaint_system.model.UserComplaint;
import com.tus.GamingSite.user_complaint_system.model.UserComplaintAgreement;
import com.tus.GamingSite.user_complaint_system.repos.UserComplaintRepository;
import com.tus.GamingSite.user_complaint_system.repos.UserComplaintAgreementRepository;
import com.tus.GamingSite.users_manager.model.User;
import com.tus.GamingSite.users_manager.repository.UserRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserComplaintService {

    @Autowired
    private UserComplaintRepository complaintRepository;

    @Autowired
    private UserComplaintAgreementRepository agreementRepository;

    @Autowired
    private UserRepository userRepository;

    public UserComplaintDTO submitComplaint(UserComplaintDTO complaintDTO) {
        UserComplaint complaint = new UserComplaint(complaintDTO.getUsername(), complaintDTO.getEmail(), complaintDTO.getMessage());
        UserComplaint savedComplaint = complaintRepository.save(complaint);
        return convertToDTO(savedComplaint);
    }

    public List<UserComplaintDTO> getAllComplaints() {
        return complaintRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public void deleteComplaint(Long id) {
        UserComplaint complaint = complaintRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Complaint not found"));

        try {
            complaintRepository.delete(complaint);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error deleting complaint: " + e.getMessage());
        }
    }

    public void agreeWithComplaint(Long complaintId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        UserComplaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Complaint not found"));

        boolean alreadyAgreed = agreementRepository.existsByUserAndComplaint(user, complaint);
        if (!alreadyAgreed) {
            UserComplaintAgreement agreement = new UserComplaintAgreement(user, complaint);
            agreementRepository.save(agreement);
        }
    }




    private UserComplaintDTO convertToDTO(UserComplaint complaint) {
        return new UserComplaintDTO(complaint.getId(), complaint.getUsername(), complaint.getEmail(), complaint.getMessage());
    }
}
