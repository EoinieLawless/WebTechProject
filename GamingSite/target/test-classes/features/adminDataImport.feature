Feature: Admin Data Import

  Background:
    * url baseUrl
    * header Authorization = 'Bearer ' + authToken

  Scenario: Admin imports CSV files
    Given path '/admin/files/import'
    When method post
    Then status 200
    And match response.status == 'Import Completed'
