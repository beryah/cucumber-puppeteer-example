Feature: Sign In

  @web @case(20052)
  Scenario: Sign in using invalid username and password
    Given I enter username "abc" with password "abc"
    When I click login on login page
    Then the user sees the error message "${INVALID_USERNAME_PASSWORD}"