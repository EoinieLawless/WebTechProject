package com.tus.GamingSite.user_complaint_system.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.tus.GamingSite.user_complaint_system.model.UserComplaint;
import com.tus.GamingSite.user_complaint_system.service.UserComplaintService;
import java.util.List;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "http://localhost:9091") 
public class UserComplaintController {

    @Autowired
    private UserComplaintService complaintService;

    @PostMapping("/submit")
    public ResponseEntity<UserComplaint> submitComplaint(@RequestBody UserComplaint complaint) {
        return ResponseEntity.ok(complaintService.submitComplaint(complaint.getUsername(), complaint.getEmail(), complaint.getMessage()));
    }

    @GetMapping("/all")
    public ResponseEntity<List<UserComplaint>> getAllComplaints() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteComplaint(@PathVariable Long id) {
        complaintService.deleteComplaint(id);
        return ResponseEntity.ok("Complaint deleted successfully");
    }
}
