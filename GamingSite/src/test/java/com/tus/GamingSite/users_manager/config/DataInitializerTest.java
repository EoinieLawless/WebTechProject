package com.tus.GamingSite.users_manager.config;

import com.tus.GamingSite.users_manager.model.Role;
import com.tus.GamingSite.users_manager.model.User;
import com.tus.GamingSite.users_manager.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class DataInitializerTest {

    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private DataInitializer dataInitializer;

    @BeforeEach
    void setup() {
        userRepository = mock(UserRepository.class);
        passwordEncoder = mock(PasswordEncoder.class);
        dataInitializer = new DataInitializer();

        ReflectionTestUtils.setField(dataInitializer, "userRepository", userRepository);
        ReflectionTestUtils.setField(dataInitializer, "passwordEncoder", passwordEncoder);
    }

    @Test
    void testRun_AdminAlreadyExists() throws Exception {

        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(new User()));

        dataInitializer.run();

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testRun_AdminCreatedWhenMissing() throws Exception {
    	
        when(userRepository.findByUsername("admin")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("admin")).thenReturn("encodedPassword");

        dataInitializer.run();

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());

        User savedUser = userCaptor.getValue();
        assertEquals("admin", savedUser.getUsername());
        assertEquals("admin@example.com", savedUser.getEmail());
        assertEquals("encodedPassword", savedUser.getPassword());
        assertTrue(savedUser.getRoles().contains(Role.ADMIN));
    }
}
