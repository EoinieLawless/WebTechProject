package com.tus.GamingSite.users_manager.controller;

import com.tus.GamingSite.users_manager.model.Role;
import com.tus.GamingSite.users_manager.model.User;
import com.tus.GamingSite.users_manager.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.MockitoAnnotations.openMocks;

public class AdminControllerTest {

    @Mock private UserService userService;
    @InjectMocks private AdminController controller;

    @BeforeEach
    void setup() {
        openMocks(this);
    }

    @Test
    void testRegisterUser_Success() {
        User user = new User();
        user.setRoles(Set.of(Role.USER));
        user.setUsername("admin");

        when(userService.registerUser(any())).thenReturn(user);

        var response = controller.registerUser(user);

        assertEquals(200, response.getStatusCodeValue());
    }

    @Test
    void testRegisterUser_NoRoles() {
        User user = new User(); // no roles
        var response = controller.registerUser(user);
        assertEquals(400, response.getStatusCodeValue());
    }

    @Test
    void testGetAllUsers() {
        User u = new User(); u.setId(1L); u.setUsername("john");
        when(userService.getAllUsers()).thenReturn(List.of(u));

        var response = controller.getAllUsers();
        assertEquals(200, response.getStatusCodeValue());
    }

    @Test
    void testDeleteUser() {
        when(userService.deleteUser(1L)).thenReturn(ResponseEntity.ok(Map.of("message", "deleted")));

        var res = controller.deleteUser(1L);
        assertEquals("deleted", res.getBody().get("message"));
    }
}
