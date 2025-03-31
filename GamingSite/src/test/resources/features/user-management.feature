Feature: User Management

	Background:
	  * def login = call read('classpath:features/login.feature') { username: 'admin', password: 'admin' }
	  * def token = login.jwt
	  * url baseUrl
	  * header Authorization = 'Bearer ' + token



  Scenario: Admin can register a new user
	 Given path '/admin/register'

    And request
    """
    {
      "username": "admin1",
      "password": "secret123",
      "email": "admin1@example.com",
      "roles": ["ADMIN"]
    }
    """
    When method POST
    Then status 200

  Scenario: Prevent duplicate usernames
		Given path '/admin/register'

    And request
    """
    {
      "username": "admin1",
      "password": "anotherPass",
      "email": "admin2@example.com",
      "roles": ["ADMIN"]
    }
    """
    When method POST
    Then status 409
