Feature: Edit Todo Items
  As a user of the Todo app
  I want to edit existing task descriptions
  So that I can correct or update my tasks

  Background:
    Given I am on the Todo application page
    And a todo item "Walk the dog" exists in the list

  Scenario: Enter edit mode by double-clicking a todo
    When I double-click on "Walk the dog"
    Then the todo item should enter edit mode
    And an editable input field should appear pre-filled with "Walk the dog"

  Scenario: Save edited todo by pressing Enter
    When I double-click on "Walk the dog"
    And I clear the text and type "Walk the cat"
    And I press the "Enter" key
    Then the todo should display "Walk the cat"
    And the list should not contain "Walk the dog"

  Scenario: Cancel editing by pressing Escape
    When I double-click on "Walk the dog"
    And I clear the text and type "This is wrong"
    And I press the "Escape" key
    Then the todo should still display "Walk the dog"

  Scenario: Delete a todo by clearing its text and pressing Enter
    When I double-click on "Walk the dog"
    And I clear all text from the edit field
    And I press the "Enter" key
    Then "Walk the dog" should be removed from the list