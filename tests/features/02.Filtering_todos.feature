Feature: Filter Todo Items
  As a user of the Todo app
  I want to filter tasks by status (All, Active, Completed)
  So that I can focus on the relevant subset of my work

  Background:
    Given I am on the Todo application page
    And the following todos exist:
      | title               | status    |
      | Pay electric bill   | Checked   |
      | Walk the dog        | Unchecked |

  Scenario: Default view shows all todos
    Then the "All" filter tab should be selected by default
    And both "Pay electric bill" and "Walk the dog" should be visible

  Scenario: Active filter shows only incomplete todos
    When I click the "Active" filter tab
    Then only "Walk the dog" should be visible in the list
    And "Pay electric bill" should not be visible

  Scenario: Completed filter shows only completed todos
    When I click the "Completed" filter tab
    Then only "Pay electric bill" should be visible in the list
    And "Walk the dog" should not be visible

  Scenario: All filter restores full list view
    Given I am on the "Active" filter tab
    When I click the "All" filter tab
    Then both "Pay electric bill" and "Walk the dog" should be visible

  Scenario: Active filter view reflects real-time completion changes
    Given I am on the "Active" filter tab
    When I mark "Walk the dog" as completed
    Then "Walk the dog" should disappear from the active list

  Scenario: Empty state message when no todos match the filter
    Given all todos are completed
    When I click the "Active" filter tab
    Then the todo list should display no items