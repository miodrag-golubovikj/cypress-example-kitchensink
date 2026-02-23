Feature: Delete Todo Items
  As a user of the Todo app
  I want to remove individual tasks from my list
  So that I can keep my list relevant

  Background:
    Given I am on the Todo application page
    And the following todos exist:
      | title             |
      | Pay electric bill |
      | Walk the dog      |
      | To Be Deleted     |

  Scenario: Delete button appears on hover
    When I hover over "To Be Deleted"
    Then a delete (×) button should become visible on the right side of the item

  Scenario: Delete a single todo using the delete button
    When I hover over "To Be Deleted"
    And I click the delete (×) button
    Then "To Be Deleted" should be removed from the list
    And the counter should display "1 item left"

  Scenario: Delete the last remaining todo
    When I delete all items one by one
    Then the todo list, footer, and counter should no longer be visible