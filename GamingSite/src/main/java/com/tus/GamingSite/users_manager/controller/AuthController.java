package com.tus.GamingSite.users_manager.controller;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.tus.GamingSite.users_manager.model.Role;
import com.tus.GamingSite.users_manager.model.User;
import com.tus.GamingSite.users_manager.service.UserService;
import com.tus.GamingSite.users_manager.service.UserDetailsServiceImpl;
import com.tus.GamingSite.users_manager.util.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private UserService userService; // Added to handle registration

    @Autowired
    private JwtUtil jwtUtil;

    // DTO for login requests
    public static class AuthRequest {
        public String username;
        public String password;
    }

    // DTO for login responses
    public static class AuthResponse {
        public String jwt;
        public String username;
        public List<String> roles;

        public AuthResponse(String jwt, String username, List<String> roles) {
            this.jwt = jwt;
            this.username = username;
            this.roles = roles;
        }
    }

    // DTO for registration requests
    public static class RegisterRequest {
        public String username;
        public String password;
        public String email;
    }

    // User Login Endpoint
    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody AuthRequest authRequest) throws Exception {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.username, authRequest.password)
            );
        } catch (BadCredentialsException e) {
            throw new Exception("Incorrect username or password", e);
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.username);
        final String jwt = jwtUtil.generateToken(userDetails);

        // Extract roles as a List<String>
        List<String> roles = userDetails.getAuthorities().stream()
            .map(authority -> authority.getAuthority())
            .collect(Collectors.toList());

        return ResponseEntity.ok(new AuthResponse(jwt, userDetails.getUsername(), roles));
    }

    // User Registration Endpoint
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        // Validate required fields
        if (registerRequest.username == null || registerRequest.username.isEmpty() ||
            registerRequest.password == null || registerRequest.password.isEmpty() ||
            registerRequest.email == null || registerRequest.email.isEmpty()) {
            return ResponseEntity.badRequest().body("Username, password, and email are required.");
        }

        // Create a new User object
        User newUser = new User();
        newUser.setUsername(registerRequest.username);
        newUser.setPassword(registerRequest.password);
        newUser.setEmail(registerRequest.email);
        newUser.setRoles(Set.of(Role.USER)); // Always assign USER role

        try {
            User savedUser = userService.registerUser(newUser);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatus()).body(e.getReason());
        }
    }
}
