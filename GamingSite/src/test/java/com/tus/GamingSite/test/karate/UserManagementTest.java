package com.tus.GamingSite.test.karate;

import com.intuit.karate.junit5.Karate;

class UserManagementTest {
    
    @Karate.Test
    Karate testUsers() {
    	return Karate.run("classpath:features/user-management.feature");
    }
}
