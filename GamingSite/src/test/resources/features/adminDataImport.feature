Feature: Data Import Endpoint

  Background:
    * def baseUrl = 'http://localhost:9091/api'
    * def importFilePath = 'classpath:data/SampleData.xls'

    # Login as admin to get JWT token
    Given url baseUrl + '/auth/login'
    And request { username: 'admin', password: 'admin' }
    When method POST
    Then status 200
    * def adminToken = response.jwt

Scenario: Successful file import
  Given url baseUrl + '/admin/files/import'
  And header Authorization = 'Bearer ' + adminToken
  And multipart file file = { read: #(importFilePath), filename: 'SampleData.xls', contentType: 'application/vnd.ms-excel' }
  When method POST
	Then status 200

