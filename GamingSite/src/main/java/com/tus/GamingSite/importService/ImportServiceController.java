package com.tus.GamingSite.importService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/files")
public class ImportServiceController {

    @Autowired
    private importService csvImportService;

    @PostMapping("/import")
    public ResponseEntity<Map<String, String>> importFiles(@RequestBody Map<String, Object> request) {
        try {
            if (request.containsKey("importAll") && (boolean) request.get("importAll")) {
                csvImportService.importAll();
            } else if (request.containsKey("selectedFiles")) {
                List<String> files = (List<String>) request.get("selectedFiles");
                if (files.contains("gameScores"))
                    csvImportService.importGameScores(new File("src/main/resources/public/data/GameScoreLog.csv"));
                if (files.contains("complaints"))
                    csvImportService.importUserComplaints(new File("src/main/resources/public/data/GameScorePlayerComplaints.csv"));
                if (files.contains("users"))
                    csvImportService.importUsers(new File("src/main/resources/public/data/GameScorePlayerRegistry.csv"));
            }
            return ResponseEntity.ok(Map.of("status", "✅ Import Completed"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "❌ Failed to process import: " + e.getMessage()));
        }
    }
}
