package com.tus.GamingSite.users_manager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tus.GamingSite.users_manager.model.User;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);
    boolean existsByEmail(String email); // New method

}
