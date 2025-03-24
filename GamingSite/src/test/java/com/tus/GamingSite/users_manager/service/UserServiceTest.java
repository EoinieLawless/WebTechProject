package com.tus.GamingSite.users_manager.service;

import com.tus.GamingSite.users_manager.model.Role;
import com.tus.GamingSite.users_manager.model.User;
import com.tus.GamingSite.users_manager.repository.UserRepository;
import com.tus.GamingSite.users_manager.exceptions.UsernameAlreadyExistsException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.MockitoAnnotations.openMocks;

public class UserServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;

    @InjectMocks private UserService userService;

    @BeforeEach
    void setup() {
        openMocks(this);
    }

    @Test
    void testRegisterUser_Success() {
    	User u = new User();
    	u.setUsername("john");
    	u.setPassword("pass");
    	u.setEmail("john@email.com");
    	u.setRoles(Set.of(Role.USER));

        when(userRepository.existsByUsername("john")).thenReturn(false);
        when(passwordEncoder.encode("pass")).thenReturn("encoded");
        when(userRepository.save(any())).thenReturn(u);

        User saved = userService.registerUser(u);
        assertEquals("john", saved.getUsername());
    }

    @Test
    void testRegisterUser_AlreadyExists() {
        User u = new User(); u.setUsername("john");
        when(userRepository.existsByUsername("john")).thenReturn(true);

        assertThrows(UsernameAlreadyExistsException.class, () -> userService.registerUser(u));
    }

    @Test
    void testDeleteUser_AdminCannotBeDeleted() {
        User admin = new User(); admin.setRoles(Set.of(Role.ADMIN));
        when(userRepository.findById(1L)).thenReturn(Optional.of(admin));

        assertThrows(ResponseStatusException.class, () -> userService.deleteUser(1L));
    }

    @Test
    void testDeleteUser_ValidUser() {
        User u = new User(); u.setRoles(Set.of(Role.USER));
        when(userRepository.findById(2L)).thenReturn(Optional.of(u));

        ResponseEntity<Map<String, String>> response = userService.deleteUser(2L);
        assertEquals("User deleted successfully", response.getBody().get("message"));
    }

    @Test
    void testUpdateUser_AdminBlocked() {
        User admin = new User(); admin.setRoles(Set.of(Role.ADMIN));
        when(userRepository.findById(1L)).thenReturn(Optional.of(admin));

        assertThrows(ResponseStatusException.class, () -> userService.updateUser(1L, new User()));
    }
}
