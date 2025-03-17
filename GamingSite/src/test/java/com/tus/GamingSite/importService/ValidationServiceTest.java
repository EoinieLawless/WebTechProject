package com.tus.GamingSite.importService;

import com.tus.GamingSite.users_manager.model.Role;
import com.tus.GamingSite.users_manager.model.User;
import com.tus.GamingSite.users_manager.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ValidationServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ValidationService validationService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setUsername("testUser");
    }

    @Test
    void testUserExists_ReturnsTrue() {
        when(userRepository.existsByUsername("testUser")).thenReturn(true);

        assertTrue(validationService.userExists("testUser"));
    }

    @Test
    void testUserExists_ReturnsFalse() {
        when(userRepository.existsByUsername("testUser")).thenReturn(false);

        assertFalse(validationService.userExists("testUser"));
    }

    @Test
    void testEnsureUserHasRole_AssignsDefaultRole() {
        validationService.ensureUserHasRole(testUser);

        assertNotNull(testUser.getRoles());
        assertTrue(testUser.getRoles().contains(Role.USER));
    }

    @Test
    void testEnsureUserHasRole_DoesNotOverrideExistingRole() {
        testUser.setRoles(Set.of(Role.ADMIN));
        validationService.ensureUserHasRole(testUser);

        assertTrue(testUser.getRoles().contains(Role.ADMIN));
        assertFalse(testUser.getRoles().contains(Role.USER));
    }
}
