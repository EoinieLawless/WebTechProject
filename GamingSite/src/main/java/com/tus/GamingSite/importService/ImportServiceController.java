package com.tus.GamingSite.importService;

import com.tus.GamingSite.gameScore.repos.GameScoreRepository;
import com.tus.GamingSite.user_complaint_system.repos.UserComplaintRepository;
import com.tus.GamingSite.users_manager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/files")
public class ImportServiceController {

    @Autowired
    private importService csvImportService;

    @Autowired
    private GameScoreRepository gameScoreRepository;

    @Autowired
    private UserComplaintRepository userComplaintRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/import")
    public ResponseEntity<Map<String, Object>> importFiles() {
        Map<String, Object> response = new HashMap<>();
        boolean dataExists = gameScoreRepository.count() > 0 || userComplaintRepository.count() > 0 || userRepository.count() > 0;

        if (dataExists) {
            response.put("warning", "⚠️ Existing data detected! Importing will overwrite data.");
        }

        try {
            csvImportService.importAll();
            response.put("status", "✅ Import Completed");
        } catch (Exception e) {
            response.put("error", "❌ Failed to process import: " + e.getMessage());
        }

        // Combine all imported data into one list for easier frontend processing
        response.put("importedData", gameScoreRepository.findAll());
        return ResponseEntity.ok(response);
    }
    
    
}
