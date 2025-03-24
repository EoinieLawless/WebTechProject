package com.tus.GamingSite.user_complaint_system.controller;

import com.tus.GamingSite.user_complaint_system.dto.UserComplaintDTO;
import com.tus.GamingSite.user_complaint_system.service.UserComplaintService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.MockitoAnnotations.openMocks;

public class UserComplaintControllerTest {

    @Mock
    private UserComplaintService complaintService;

    @InjectMocks
    private UserComplaintController controller;

    @BeforeEach
    void setup() {
        openMocks(this);
    }

    @Test
    void testSubmitComplaint() {
        UserComplaintDTO dto = new UserComplaintDTO(null, "john", "john@mail.com", "lag issue");
        UserComplaintDTO saved = new UserComplaintDTO(1L, "john", "john@mail.com", "lag issue");

        when(complaintService.submitComplaint(dto)).thenReturn(saved);

        ResponseEntity<?> response = controller.submitComplaint(dto);

        assertEquals(200, response.getStatusCodeValue());
    }

    @Test
    void testGetAllComplaints() {
        UserComplaintDTO dto = new UserComplaintDTO(1L, "john", "j@mail.com", "message");

        when(complaintService.getAllComplaints()).thenReturn(List.of(dto));

        ResponseEntity<?> response = controller.getAllComplaints();

        assertEquals(200, response.getStatusCodeValue());
    }

    @Test
    void testDeleteComplaint_Success() {
        doNothing().when(complaintService).deleteComplaint(1L);

        ResponseEntity<?> response = controller.deleteComplaint(1L);

        assertEquals(200, response.getStatusCodeValue());
        Map<?, ?> body = (Map<?, ?>) response.getBody();
        assertEquals("Complaint deleted successfully", body.get("message"));
    }
}
