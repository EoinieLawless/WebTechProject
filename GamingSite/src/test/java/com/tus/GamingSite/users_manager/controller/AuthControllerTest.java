package com.tus.GamingSite.users_manager.controller;

import com.tus.GamingSite.users_manager.service.UserDetailsServiceImpl;
import com.tus.GamingSite.users_manager.util.JwtUtil;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthenticationManager authenticationManager;

    @MockBean
    private UserDetailsServiceImpl userDetailsService;

    @MockBean
    private JwtUtil jwtUtil;

    @Test
    void login_Success() throws Exception {
        String username = "testuser";
        String password = "password123";
        UserDetails userDetails = User.withUsername(username)
                                      .password(password)
                                      .authorities("USER")
                                      .build();

        when(userDetailsService.loadUserByUsername(username)).thenReturn(userDetails);
        when(jwtUtil.generateToken(userDetails)).thenReturn("fake-jwt-token");

        String jsonRequest = "{ \"username\": \"" + username + "\", \"password\": \"" + password + "\" }";

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonRequest))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.jwt").value("fake-jwt-token"))
                .andExpect(jsonPath("$.username").value(username))
                .andExpect(jsonPath("$.roles[0]").value("USER"));

        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    void login_Failure_InvalidCredentials() throws Exception {
        String username = "testuser";
        String password = "wrongpassword";
        String jsonRequest = "{ \"username\": \"" + username + "\", \"password\": \"" + password + "\" }";

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Incorrect username or password"));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonRequest))
                .andExpect(status().isUnauthorized());

        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }
}
