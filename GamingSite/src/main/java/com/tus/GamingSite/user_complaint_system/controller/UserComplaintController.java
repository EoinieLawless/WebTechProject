package com.tus.GamingSite.user_complaint_system.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.tus.GamingSite.user_complaint_system.dto.UserComplaintDTO;
import com.tus.GamingSite.user_complaint_system.model.UserComplaint;
import com.tus.GamingSite.user_complaint_system.model.UserComplaintAgreement;
import com.tus.GamingSite.user_complaint_system.repos.UserComplaintAgreementRepository;
import com.tus.GamingSite.user_complaint_system.repos.UserComplaintRepository;
import com.tus.GamingSite.user_complaint_system.service.UserComplaintService;
import com.tus.GamingSite.users_manager.model.User;
import com.tus.GamingSite.users_manager.repository.UserRepository;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "http://localhost:9091")
public class UserComplaintController {

    @Autowired
    private UserComplaintService complaintService;
    
    @Autowired
    private UserComplaintRepository complaintRepository;

    @Autowired
    private UserComplaintAgreementRepository agreementRepository;
    
    @Autowired
    private UserRepository userRepository;


    @PostMapping("/submit")
    public ResponseEntity<EntityModel<UserComplaintDTO>> submitComplaint(@RequestBody UserComplaintDTO complaintDTO) {
        UserComplaintDTO savedComplaint = complaintService.submitComplaint(complaintDTO);

        EntityModel<UserComplaintDTO> entityModel = EntityModel.of(savedComplaint);
        entityModel.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(UserComplaintController.class)
                .submitComplaint(complaintDTO)).withSelfRel());
        entityModel.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(UserComplaintController.class)
                .getAllComplaints()).withRel("all-complaints"));

        return ResponseEntity.ok(entityModel);
    }

    @GetMapping("/all")
    public ResponseEntity<CollectionModel<EntityModel<UserComplaintDTO>>> getAllComplaints() {
        List<EntityModel<UserComplaintDTO>> complaints = complaintService.getAllComplaints().stream()
            .map(complaint -> {
                EntityModel<UserComplaintDTO> entityModel = EntityModel.of(complaint);
                entityModel.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(UserComplaintController.class)
                        .getAllComplaints()).withSelfRel());
                entityModel.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(UserComplaintController.class)
                        .deleteComplaint(complaint.getId())).withRel("delete-complaint"));
                return entityModel;
            })
            .collect(Collectors.toList());

        return ResponseEntity.ok(CollectionModel.of(complaints));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteComplaint(@PathVariable Long id) {
        try {
            complaintService.deleteComplaint(id);

            // Explicitly define HashMap<String, String>
            Map<String, String> response = new HashMap<String, String>();
            response.put("message", "Complaint deleted successfully");

            return ResponseEntity.ok(response);
        } catch (ResponseStatusException ex) {
            Map<String, String> errorResponse = new HashMap<String, String>();
            errorResponse.put("error", ex.getReason());
            return ResponseEntity.status(ex.getStatus()).body(errorResponse);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<String, String>();
            errorResponse.put("error", "Error deleting complaint: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    

    @PostMapping("/{id}/agree")
    public ResponseEntity<Map<String, String>> agreeWithComplaint(@PathVariable Long id, @RequestParam String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        UserComplaint complaint = complaintRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Complaint not found"));

        if (agreementRepository.existsByUserAndComplaint(user, complaint)) {
            return ResponseEntity.ok(Map.of("message", "User already agreed to this complaint"));
        }

        UserComplaintAgreement agreement = new UserComplaintAgreement(user, complaint);
        agreementRepository.save(agreement);

        return ResponseEntity.ok(Map.of("message", "Agreement recorded successfully"));
    }
    
    @GetMapping("/{id}/agreed-users")
    public ResponseEntity<Map<String, List<String>>> getAgreedUsers(@PathVariable Long id) {
        UserComplaint complaint = complaintRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Complaint not found"));

        List<String> agreedUsers = agreementRepository.findByComplaint(complaint)
            .stream()
            .map(agreement -> agreement.getUser().getUsername())
            .collect(Collectors.toList());

        return ResponseEntity.ok(Map.of("agreedUsers", agreedUsers));
    }

}
