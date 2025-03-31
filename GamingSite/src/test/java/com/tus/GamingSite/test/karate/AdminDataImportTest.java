package com.tus.GamingSite.test.karate;

import org.springframework.boot.test.context.SpringBootTest;

import com.intuit.karate.junit5.Karate;


@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)

class AdminDataImportTest {
    
    @Karate.Test
    Karate testAdminDataImport() {
        return Karate.run("classpath:features/adminDataImport.feature");
    }
    
}
