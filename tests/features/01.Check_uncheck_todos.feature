Feature: Ability to Check-Uncheck Todo's
  As a user of the Todo app
  I want to mark tasks as complete or active
  So that I can track my progress

  Background:
    Given I am on the Todo application page
    And the following todos exist:
      | title                 | status    |
      | Pay electric bill     | Unchecked |
      | Walk the dog          | Unchecked |

  Scenario: Mark a todo as completed
    When I click the checkbox next to "Pay electric bill"
    Then "Pay electric bill" should be displayed with a strikethrough
    And the counter should display "1 item left"

  Scenario: Unmark a completed todo as active
    Given "Pay electric bill" is marked as completed
    When I click the checkbox next to "Pay electric bill"
    Then "Pay electric bill" should be displayed without a strikethrough
    And the counter should display "2 items left"

  Scenario: Toggle all todos as completed using the toggle-all chevron
    When I click the toggle-all chevron button
    Then all todos should be marked as completed
    And the counter should display "0 items left"

  Scenario: Toggle all todos back to active
    Given all todos are marked as completed
    When I click the toggle-all chevron button
    Then all todos should be marked as active
    And the counter should display "2 items left"
    Then no new todo item should be added to the list