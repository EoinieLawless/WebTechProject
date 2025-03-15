package com.tus.GamingSite.user_complaint_system.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.tus.GamingSite.user_complaint_system.dto.UserComplaintDTO;
import com.tus.GamingSite.user_complaint_system.model.UserComplaint;
import com.tus.GamingSite.user_complaint_system.repos.UserComplaintRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserComplaintService {

    @Autowired
    private UserComplaintRepository complaintRepository;

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



    private UserComplaintDTO convertToDTO(UserComplaint complaint) {
        return new UserComplaintDTO(complaint.getId(), complaint.getUsername(), complaint.getEmail(), complaint.getMessage());
    }
}
