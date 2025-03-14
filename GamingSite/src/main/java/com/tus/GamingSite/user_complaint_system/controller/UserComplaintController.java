package com.tus.GamingSite.user_complaint_system.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.tus.GamingSite.user_complaint_system.dto.UserComplaintDTO;
import com.tus.GamingSite.user_complaint_system.service.UserComplaintService;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "http://localhost:9091")
public class UserComplaintController {

    @Autowired
    private UserComplaintService complaintService;

    @PostMapping("/submit")
    public ResponseEntity<UserComplaintDTO> submitComplaint(@RequestBody UserComplaintDTO complaintDTO) {
        UserComplaintDTO savedComplaint = complaintService.submitComplaint(complaintDTO);
        return ResponseEntity.ok(savedComplaint);
    }

    @GetMapping("/all")
    public ResponseEntity<List<UserComplaintDTO>> getAllComplaints() {
        List<UserComplaintDTO> complaintDTOs = complaintService.getAllComplaints();
        return ResponseEntity.ok(complaintDTOs);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteComplaint(@PathVariable Long id) {
        complaintService.deleteComplaint(id);
        return ResponseEntity.ok("Complaint deleted successfully");
    }
}
