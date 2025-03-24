Feature: Create User

Scenario: Create a User and return userId
  Given url baseUrl + '/admin/register'
  And header Content-Type = 'application/json'
  And header Authorization = 'Bearer ' + authToken
  And request { username: 'UserCreationTest', password: 'Password123', roles: ['ADMIN'] }
  When method POST
  Then status 200
  And match response.id == '#present'
  * def userId = response.id
  * def result = { id: userId }
  * karate.log('Created user with id:', userId)
  * karate.set('result', result)
