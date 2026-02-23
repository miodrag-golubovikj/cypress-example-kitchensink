Feature: Todo Item Counter
  As a user of the Todo app
  I want the item counter to reflect the number of active tasks
  So that I always know how much work remains

  Background:
    Given I am on the Todo application page

  Scenario Outline: Counter displays correct count for active items
    Given <total> todos exist with <completed> marked as completed
    Then the counter should display "<expected_text>"

    Examples:
      | total | completed | expected_text  |
      | 1     | 0         | 1 item left    |
      | 2     | 0         | 2 items left   |
      | 2     | 1         | 1 item left    |
      | 2     | 2         | 0 items left   |

  Scenario: Counter is hidden when no todos exist
    Given the todo list is empty
    Then the footer and counter should not be displayed