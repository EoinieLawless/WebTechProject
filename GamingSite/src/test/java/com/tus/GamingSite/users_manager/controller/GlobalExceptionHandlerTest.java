package com.tus.GamingSite.users_manager.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;

@SpringBootTest
@AutoConfigureMockMvc
public class GlobalExceptionHandlerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser(authorities = "ADMIN")
    void testUsernameAlreadyExistsException() throws Exception {
        // JSON payload with escaped double quotes
        String jsonPayload = "{"
                + "\"username\": \"admin\","
                + "\"password\": \"123\","
                + "\"roles\": [\"SUPPORT_ENGINEER\"]"
                + "}";

        mockMvc.perform(MockMvcRequestBuilders.post("/api/admin/register")  // Adjust this URL based on your actual controller endpoint
                        .contentType("application/json")
                        .content(jsonPayload))  // Example payload with roles included
                .andExpect(MockMvcResultMatchers.status().isConflict());  // Expect a 409 conflict status
    }
}
