Feature: Admin creates a user

Background:
  * def login = call read('classpath:features/login.feature') { username: 'admin', password: 'admin' }
  * def token = login.jwt
  * url baseUrl
  * header Authorization = 'Bearer ' + token

Scenario: Register new user
  Given path '/admin/register'
  And request { username: 'newuser', password: 'pass', email: 'new@user.com' }
  When method post
  Then status 200
