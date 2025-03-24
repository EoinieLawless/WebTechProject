Feature: Get IMSIs by Failure Cause

Background:
  * def config = karate.callSingle('classpath:karate-config.js')
  * url config.baseUrl
  * header Authorization = 'Bearer ' + config.authToken

  Scenario: Get IMSIs for a valid failure cause
    Given path "/eventrecord/imsi-by-failure-cause"
    And param failureClass = '1'
    When method get
    Then status 200
    # Assuming that for failureClass '1' the API returns a JSON array of IMSIs.
    And match response == '#string'

  Scenario: No IMSI records found for given failure cause
    Given path "/eventrecord/imsi-by-failure-cause"
    And param failureClass = '2'
    When method get
    Then status 200
    # When no IMSI records exist, the API returns a message string.
    And match response == "No IMSI found for failure cause: 2"
