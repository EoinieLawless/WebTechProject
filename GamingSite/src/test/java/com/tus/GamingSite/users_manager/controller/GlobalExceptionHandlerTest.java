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
        String jsonPayload = "{"
                + "\"username\": \"TestNameHandler\","
                + "\"password\": \"123\","
                + "\"email\": \"admin@example.com\","
                + "\"roles\": [\"USER\"]"
                + "}";

        // First call - successful
        mockMvc.perform(MockMvcRequestBuilders.post("/api/admin/register")
                .contentType("application/json")
                .content(jsonPayload))
                .andExpect(MockMvcResultMatchers.status().isOk());

        // Second call - should now trigger the exception
        mockMvc.perform(MockMvcRequestBuilders.post("/api/admin/register")
                .contentType("application/json")
                .content(jsonPayload))
                .andExpect(MockMvcResultMatchers.status().isConflict());
    }


}
