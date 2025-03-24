package com.tus.GamingSite.test.selenium;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.ElementClickInterceptedException;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import io.github.bonigarcia.wdm.WebDriverManager;

public class UserManagementCreateTest {

    private WebDriver driver;
    private Map<String, Object> vars;
    private WebDriverWait wait;

    @BeforeEach
    public void setUp() {
        // Set up ChromeDriver using WebDriverManager and add the necessary flag.
        WebDriverManager.chromedriver().setup();
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--remote-allow-origins=*");

        driver = new ChromeDriver(options);
        driver.manage().window().setSize(new Dimension(880, 1040));
        vars = new HashMap<>();
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    @AfterEach
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
    
    @Test
    public void testCreateDeleteNewAdmin() {
        openHomePage();
        login("admin", "admin");
        registerUser("testAdmin", "test123");
        selectRole("Admin");
        deleteUser();
    }

    @Test
    public void testCreateDeleteCustServiceRep() {
        openHomePage();
        login("admin", "admin");
        registerUser("testCustRep", "test123");
        selectRole("Customer Service Rep");
        deleteUser();
    }
    
    @Test
    public void testCreateDeleteNetManageEng() {
        openHomePage();
        login("admin", "admin");
        registerUser("testNetMan", "test123");
        selectRole("Network Management Engineer");
        deleteUser();
    }
    
    @Test
    public void testCreateDeleteSupportEng() {
        openHomePage();
        login("admin", "admin");
        registerUser("testSupEng", "test123");
        selectRole("Support Engineer");
        deleteUser();
    }

    private void openHomePage() {
        driver.get("http://localhost:9091/");
    }

    private void login(String username, String password) {
        WebElement usernameField = wait.until(ExpectedConditions.elementToBeClickable(By.id("username")));
        usernameField.click();
        usernameField.sendKeys(username);

        WebElement passwordField = wait.until(ExpectedConditions.elementToBeClickable(By.id("password")));
        passwordField.sendKeys(password);

        WebElement loginBtn = wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector(".btn")));
        loginBtn.click();

        WebElement primaryBtn = wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector(".btn-primary > .ms-2")));
        primaryBtn.click();

        WebElement successBtn = wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector(".btn-success > span")));
        successBtn.click();

        WebElement element = driver.findElement(By.cssSelector(".btn-success > span"));
        new Actions(driver).moveToElement(element).perform();

        WebElement bodyElement = driver.findElement(By.tagName("body"));
        new Actions(driver).moveToElement(bodyElement, 0, 0).perform();
    }

    private void registerUser(String username, String password) {
        WebElement usernameField = wait.until(ExpectedConditions.elementToBeClickable(By.id("username")));
        usernameField.click();
        usernameField.clear();
        usernameField.sendKeys(username);

        WebElement passwordField = wait.until(ExpectedConditions.elementToBeClickable(By.id("password")));
        passwordField.sendKeys(password);
    }

    private void selectRole(String roleName) {
        WebElement roleDropdown = wait.until(ExpectedConditions.elementToBeClickable(By.id("role")));
        roleDropdown.click();
        WebElement roleOption = roleDropdown.findElement(By.xpath("//option[. = '" + roleName + "']"));
        roleOption.click();

        WebElement saveUserBtn = wait.until(ExpectedConditions.elementToBeClickable(By.id("saveUser")));
        saveUserBtn.click();
    }

    private void deleteUser() {
        WebElement deleteUserBtn = wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector(".delete-user")));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", deleteUserBtn);
        try {
            deleteUserBtn.click();
        } catch (ElementClickInterceptedException e) {
            // Fallback to JavaScript click if normal click is intercepted
            ((JavascriptExecutor) driver).executeScript("arguments[0].click();", deleteUserBtn);
        }

        WebElement confirmDeleteBtn = wait.until(ExpectedConditions.elementToBeClickable(By.id("confirmDelete")));
        confirmDeleteBtn.click();
    }
    
}
