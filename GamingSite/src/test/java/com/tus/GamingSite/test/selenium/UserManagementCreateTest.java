package com.tus.GamingSite.test.selenium;

import com.tus.GamingSite.GamingSiteApplication;
import org.junit.*;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.WebDriverWait;
import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.chrome.ChromeOptions;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ConfigurableApplicationContext;

import java.net.HttpURLConnection;
import java.net.URL;
import java.time.Duration;
import java.util.*;

public class UserManagementCreateTest {

    private static ConfigurableApplicationContext context;
    private WebDriver driver;
    private JavascriptExecutor js;
    private Map<String, Object> vars;
    private WebDriverWait wait;

    @BeforeClass
    public static void startSpringBootApp() throws Exception {
        context = SpringApplication.run(GamingSiteApplication.class, "--server.port=9091");
        waitForAppStartup();
    }

    @Before
    public void setUp() {
        WebDriverManager.chromedriver().setup();
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--remote-allow-origins=*");

        driver = new ChromeDriver(options);
        js = (JavascriptExecutor) driver;
        vars = new HashMap<>();
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    @After
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    @AfterClass
    public static void stopSpringBootApp() {
        if (context != null) {
            context.close();
        }
    }

    private static void waitForAppStartup() throws InterruptedException {
        int retries = 0;
        while (retries < 15) {
            try {
                HttpURLConnection conn = (HttpURLConnection) new URL("http://localhost:9091/").openConnection();
                conn.setRequestMethod("GET");
                if (conn.getResponseCode() == 200) {
                    System.out.println("✅ App is up!");
                    return;
                }
            } catch (Exception e) {
                System.out.println("⏳ Waiting for app...");
            }
            Thread.sleep(1000);
            retries++;
        }
        throw new RuntimeException("❌ App failed to start on port 9091");
    }

    @Test
    public void usercreation() {
        driver.get("http://localhost:9091/index.html");
        driver.manage().window().setSize(new Dimension(1265, 1380));

        // Login as admin
        driver.findElement(By.id("username")).sendKeys("admin");
        driver.findElement(By.id("password")).sendKeys("admin");
        driver.findElement(By.cssSelector(".btn")).click();

        // Navigate to user creation
        driver.findElement(By.cssSelector(".btn-danger:nth-child(3)")).click();

        // Fill user registration form
        driver.findElement(By.cssSelector(".mb-3:nth-child(1) > .form-control")).sendKeys("newuser");
        driver.findElement(By.cssSelector(".mb-3:nth-child(2) > .form-control")).sendKeys("newuserpass");
        driver.findElement(By.cssSelector(".btn-primary:nth-child(5)")).click();

        // Go to user management section
        driver.findElement(By.linkText("User Management")).click();

        // View user table
        driver.findElement(By.linkText("View User Table")).click();

        // Optionally: assert that new user appears in the list
        WebElement table = driver.findElement(By.tagName("table"));
        String tableText = table.getText();
        Assert.assertTrue("New user should be listed in user table", tableText.contains("newuser"));
    }

}
