package com.tus.GamingSite.user_complaint_system.service;

import com.tus.GamingSite.user_complaint_system.dto.UserComplaintDTO;
import com.tus.GamingSite.user_complaint_system.model.UserComplaint;
import com.tus.GamingSite.user_complaint_system.model.UserComplaintAgreement;
import com.tus.GamingSite.user_complaint_system.repos.UserComplaintAgreementRepository;
import com.tus.GamingSite.user_complaint_system.repos.UserComplaintRepository;
import com.tus.GamingSite.users_manager.model.User;
import com.tus.GamingSite.users_manager.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.MockitoAnnotations.openMocks;

public class UserComplaintServiceTest {

    @Mock
    private UserComplaintRepository complaintRepository;

    @Mock
    private UserComplaintAgreementRepository agreementRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserComplaintService service;

    @BeforeEach
    void setup() {
        openMocks(this);
    }

    @Test
    void testSubmitComplaint() {
        UserComplaintDTO dto = new UserComplaintDTO(null, "john", "john@email.com", "cheating report");
        UserComplaint saved = new UserComplaint("john", "john@email.com", "cheating report");
        saved.setId(1L);

        when(complaintRepository.save(any(UserComplaint.class))).thenReturn(saved);

        UserComplaintDTO result = service.submitComplaint(dto);

        assertEquals(1L, result.getId());
        assertEquals("john", result.getUsername());
    }

    @Test
    void testGetAllComplaints() {
        UserComplaint c = new UserComplaint("john", "j@email.com", "something wrong");
        c.setId(1L);

        when(complaintRepository.findAll()).thenReturn(List.of(c));

        List<UserComplaintDTO> result = service.getAllComplaints();

        assertEquals(1, result.size());
        assertEquals("john", result.get(0).getUsername());
    }

    @Test
    void testDeleteComplaint_Success() {
        UserComplaint c = new UserComplaint("john", "j@email.com", "issue");
        c.setId(1L);

        when(complaintRepository.findById(1L)).thenReturn(Optional.of(c));

        service.deleteComplaint(1L);

        verify(complaintRepository, times(1)).delete(c);
    }

    @Test
    void testAgreeWithComplaint_FirstTime() {
        User user = new User(); user.setUsername("john");
        UserComplaint complaint = new UserComplaint("alice", "a@mail.com", "msg");
        complaint.setId(2L);

        when(userRepository.findByUsername("john")).thenReturn(Optional.of(user));
        when(complaintRepository.findById(2L)).thenReturn(Optional.of(complaint));
        when(agreementRepository.existsByUserAndComplaint(user, complaint)).thenReturn(false);

        service.agreeWithComplaint(2L, "john");

        verify(agreementRepository, times(1)).save(any(UserComplaintAgreement.class));
    }

    @Test
    void testAgreeWithComplaint_AlreadyAgreed() {
        User user = new User(); user.setUsername("john");
        UserComplaint complaint = new UserComplaint("alice", "a@mail.com", "msg");

        when(userRepository.findByUsername("john")).thenReturn(Optional.of(user));
        when(complaintRepository.findById(3L)).thenReturn(Optional.of(complaint));
        when(agreementRepository.existsByUserAndComplaint(user, complaint)).thenReturn(true);

        service.agreeWithComplaint(3L, "john");

        verify(agreementRepository, never()).save(any());
    }
}
