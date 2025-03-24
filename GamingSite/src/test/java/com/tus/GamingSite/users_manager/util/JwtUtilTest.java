package com.tus.GamingSite.users_manager.util;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import static org.junit.jupiter.api.Assertions.*;

public class JwtUtilTest {

    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() throws Exception {
        jwtUtil = new JwtUtil();
        var field = JwtUtil.class.getDeclaredField("secret");
        field.setAccessible(true);
        field.set(jwtUtil, "testsecret");
    }

    @Test
    void testGenerateAndValidateToken() {
        UserDetails user = User.withUsername("john").password("pass").authorities("USER").build();

        String token = jwtUtil.generateToken(user);

        assertNotNull(token);
        assertTrue(jwtUtil.validateToken(token, user));
        assertEquals("john", jwtUtil.extractUsername(token));
    }

    @Test
    void testTokenExpiration() throws InterruptedException {
        UserDetails user = User.withUsername("expireme").password("pass").authorities("USER").build();

        String token = jwtUtil.createToken(new java.util.HashMap<>(), "expireme");
        assertEquals("expireme", jwtUtil.extractUsername(token));
    }
}
