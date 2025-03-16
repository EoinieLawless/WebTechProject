package com.tus.GamingSite.importService;

import com.tus.GamingSite.gameScore.model.GameScore;
import com.tus.GamingSite.gameScore.repos.GameScoreRepository;
import com.tus.GamingSite.user_complaint_system.model.UserComplaint;
import com.tus.GamingSite.user_complaint_system.repos.UserComplaintRepository;
import com.tus.GamingSite.users_manager.model.User;
import com.tus.GamingSite.users_manager.model.Role;
import com.tus.GamingSite.users_manager.repository.UserRepository;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class importService {

    @Autowired
    private GameScoreRepository gameScoreRepository;

    @Autowired
    private UserComplaintRepository userComplaintRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ValidationService validationService;

    private final String BASE_PATH = "src/main/resources/public/data/";

    public void importAll() {
    	importUsers(new File(BASE_PATH + "GameScorePlayerRegistry.csv"));
        importGameScores(new File(BASE_PATH + "GameScoreLog.csv"));
        importUserComplaints(new File(BASE_PATH + "GameScorePlayerComplaints.csv"));
    }

    public void importGameScores(File file) {
        if (!file.exists()) {
            System.err.println("File not found: " + file.getAbsolutePath());
            return;
        }

        try (BufferedReader reader = new BufferedReader(new FileReader(file, StandardCharsets.UTF_8));
             CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT.builder().setHeader().setSkipHeaderRecord(true).build())) {

            List<GameScore> scores = new ArrayList<>();
            for (CSVRecord record : csvParser) {
                String username = record.get("USERNAME");
                String game = record.get("GAME");

              
                if (!validationService.userExists(username)) {
                    System.err.println("Skipping score for non-existent user: " + username);
                    continue; 
                }

                if (gameScoreRepository.existsByUsernameAndGame(username, game)) {
                    System.out.println("Skipping existing score for user: " + username);
                    continue;
                }

                GameScore score = new GameScore(
                        username,
                        game,
                        Integer.parseInt(record.get("SCORE")),
                        record.get("GAME_TYPE")
                );
                scores.add(score);
            }
            gameScoreRepository.saveAll(scores);
            System.out.println("Game Scores imported successfully.");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void importUserComplaints(File file) {
        if (!file.exists()) {
            System.err.println("File not found: " + file.getAbsolutePath());
            return;
        }

        try (BufferedReader reader = new BufferedReader(new FileReader(file, StandardCharsets.UTF_8));
             CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT.builder().setHeader().setSkipHeaderRecord(true).build())) {

            List<UserComplaint> complaints = new ArrayList<>();
            for (CSVRecord record : csvParser) {
                String username = record.get("USERNAME");
                String message = record.get("MESSAGE");

                if (userComplaintRepository.existsByUsernameAndMessage(username, message)) {
                    System.out.println("Skipping existing complaint for user: " + username);
                    continue;
                }

                UserComplaint complaint = new UserComplaint(
                        username,
                        record.get("EMAIL"),
                        message
                );
                complaints.add(complaint);
            }
            userComplaintRepository.saveAll(complaints);
            System.out.println("User Complaints imported successfully.");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void importUsers(File file) {
        if (!file.exists()) {
            System.err.println("File not found: " + file.getAbsolutePath());
            return;
        }

        try (BufferedReader reader = new BufferedReader(new FileReader(file, StandardCharsets.UTF_8));
             CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT.builder().setHeader().setSkipHeaderRecord(true).build())) {

            List<User> users = new ArrayList<>();
            for (CSVRecord record : csvParser) {
                String username = record.get("USERNAME");

                if (userRepository.existsByUsername(username)) {
                    System.out.println("Skipping existing user: " + username);
                    continue;
                }

                User user = new User();
                user.setUsername(username);
                user.setEmail(record.get("EMAIL"));
                user.setPassword(record.get("PASSWORD"));

  
                String roleStr = record.get("ROLE").toUpperCase();
                try {
                    Role role = Role.valueOf(roleStr);
                    user.setRoles(Set.of(role));
                } catch (IllegalArgumentException e) {
                    System.out.println("Invalid role for user: " + username + ". Assigning default USER role.");
                    user.setRoles(Set.of(Role.USER));
                }

                users.add(user);
            }
            userRepository.saveAll(users);
            System.out.println("Users imported successfully.");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}

