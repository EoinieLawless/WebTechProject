package com.tus.GamingSite.users_manager.config;

import com.tus.GamingSite.users_manager.service.UserDetailsServiceImpl;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
public class SecurityConfigTest {

    @Autowired
    private SecurityConfig securityConfig;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private SecurityFilterChain securityFilterChain;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Test
    void testSecurityFilterChain() {
        assertNotNull(securityFilterChain);
    }

    @Test
    void testAuthenticationManager() {
        assertNotNull(authenticationManager);
    }

    @Test
    void testPasswordEncoder() {
        assertNotNull(passwordEncoder);
    }

    @Test
    void testUserDetailsService() {
        assertNotNull(userDetailsService);
    }
}
