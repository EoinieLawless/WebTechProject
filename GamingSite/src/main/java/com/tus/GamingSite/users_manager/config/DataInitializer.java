package com.tus.GamingSite.users_manager.config;

import com.tus.GamingSite.users_manager.model.Role;
import com.tus.GamingSite.users_manager.model.User;
import com.tus.GamingSite.users_manager.repository.UserRepository;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    private String declareAdmin = "admin";
    
    @Override
    public void run(String... args) throws Exception {
        // Check if an admin user already exists
        if (userRepository.findByUsername(declareAdmin).isEmpty()) {
            User admin = new User();
            admin.setUsername(declareAdmin);
            // Change the default password as needed for your environment
            admin.setPassword(passwordEncoder.encode(declareAdmin));
            admin.setRoles(Set.of(Role.ADMIN));
            
            userRepository.save(admin);
        }
    }
}
