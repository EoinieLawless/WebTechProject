package com.tus.GamingSite.users_manager.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import com.tus.GamingSite.users_manager.model.User;
import com.tus.GamingSite.users_manager.service.UserService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserService userService;

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/register")
    public ResponseEntity<EntityModel<User>> registerUser(@RequestBody User user) {
        if (user == null || user.getRoles() == null || user.getRoles().isEmpty()) {
            return ResponseEntity.badRequest().build(); // early exit
        }

        User savedUser = userService.registerUser(user);

        if (savedUser == null) {
            return ResponseEntity.internalServerError().body(null); // stop here
        }

        return ResponseEntity.ok(
            EntityModel.of(savedUser)
                .add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(AdminController.class).getAllUsers()).withRel("all-users"))
                .add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(AdminController.class).deleteUser(savedUser.getId())).withRel("delete-user"))
        );
    }



    // Get all users (secured for ADMIN)
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/users")
    public ResponseEntity<CollectionModel<EntityModel<User>>> getAllUsers() {
        List<EntityModel<User>> users = userService.getAllUsers().stream()
                .map(user -> {
                    EntityModel<User> entityModel = EntityModel.of(user);
                    entityModel.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(AdminController.class)
                            .deleteUser(user.getId())).withRel("delete-user"));
                    return entityModel;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(CollectionModel.of(users));
    }

    // Delete a user by ID (secured for ADMIN)
    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
        return userService.deleteUser(id);
    }

}
