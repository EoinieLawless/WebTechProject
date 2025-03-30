Feature: Create User

  Background:
    * url baseUrl
    * header Authorization = 'Bearer ' + authToken

  Scenario: Create a new user successfully
    Given path '/admin/register'
    And request
    """
    {
      "username": "testuser123456789",
      "password": "TestPass123",
      "email": "testuser123@example.com",
      "roles": ["USER"]
    }
    """
    When method post
    Then status 200
