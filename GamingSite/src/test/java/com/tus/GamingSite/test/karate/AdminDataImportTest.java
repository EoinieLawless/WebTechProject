package com.tus.GamingSite.test.karate;

import com.intuit.karate.junit5.Karate;

class AdminDataImportTest {
    
    @Karate.Test
    Karate testAdminDataImport() {
        return Karate.run("classpath:features/adminDataImport.feature");
    }
    
}
