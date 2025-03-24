Feature: User Login

Scenario: Authenticate and get JWT token
  # The parameters 'baseUrl', 'username' and 'password' are passed in from karate-config.js
  Given url baseUrl + '/auth/login'
  And request { username: "admin", password: "admin" }
  When method post
  Then status 200
  * def jwt = response.jwt
