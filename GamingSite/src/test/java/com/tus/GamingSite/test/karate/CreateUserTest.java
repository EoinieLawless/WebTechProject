package com.tus.GamingSite.test.karate;

import org.springframework.boot.test.context.SpringBootTest;

import com.intuit.karate.junit5.Karate;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
class CreateUserTest {
    
    @Karate.Test
    Karate testCreateUser() {
        return Karate.run("classpath:features/create-user.feature");
    }
}
