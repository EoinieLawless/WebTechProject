package com.tus.GamingSite.users_manager.service;

import com.tus.GamingSite.users_manager.model.Role;
import com.tus.GamingSite.users_manager.model.User;
import com.tus.GamingSite.users_manager.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.lang.reflect.Field;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.MockitoAnnotations.openMocks;

public class UserDetailsServiceImplTest {

    private UserRepository userRepository;
    private UserDetailsServiceImpl userDetailsService;

    @BeforeEach
    void setup() throws Exception {
        userRepository = mock(UserRepository.class);
        userDetailsService = new UserDetailsServiceImpl();

        Field field = UserDetailsServiceImpl.class.getDeclaredField("userRepository");
        field.setAccessible(true);
        field.set(userDetailsService, userRepository);
    }

    @Test
    void testLoadUserByUsername_Success() {
    	User u = new User();
    	u.setUsername("john");
    	u.setPassword("pass");
    	u.setEmail("john@email.com");
    	u.setRoles(Set.of(Role.USER));

        when(userRepository.findByUsername("john")).thenReturn(Optional.of(u));

        UserDetails userDetails = userDetailsService.loadUserByUsername("john");
        assertEquals("john", userDetails.getUsername());
    }

    @Test
    void testLoadUserByUsername_NotFound() {
        when(userRepository.findByUsername("missing")).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () -> userDetailsService.loadUserByUsername("missing"));
    }
}
