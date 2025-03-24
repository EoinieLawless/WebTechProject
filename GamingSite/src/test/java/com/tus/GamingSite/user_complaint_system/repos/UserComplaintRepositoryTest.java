package com.tus.GamingSite.user_complaint_system.repos;

import com.tus.GamingSite.user_complaint_system.model.UserComplaint;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
public class UserComplaintRepositoryTest {

    @Autowired
    private UserComplaintRepository repository;

    @Test
    void testExistsByUsernameAndMessage() {
        UserComplaint c = new UserComplaint("john", "j@mail.com", "something wrong");
        repository.save(c);

        boolean exists = repository.existsByUsernameAndMessage("john", "something wrong");

        assertTrue(exists);
    }
}
