Feature: Add Todo Items
  As a user of the Todo app
  I want to add new tasks to my list
  So that I can track what needs to be done

  Background:
    Given I am on the Todo application page
    And the todo list is empty

  Scenario: Add a single todo item
    When I type "Buy cucumbers" in the input field
    And I press the "Enter" key
    Then a todo item with the text "Buy cucumbers" should appear in the list
    And the counter should display "1 item left"

  Scenario: Add multiple todo items
    When I type "Pick Up the kids from school" in the input field
    And I press the "Enter" key
    And I type "Take the car to the carwash" in the input field
    And I press the "Enter" key
    Then the todo list should contain 2 items
    And the counter should display "2 items left"

  Scenario: Input field is cleared after adding a todo
    When I type "Read a book" in the input field
    And I press the "Enter" key
    Then the input field should be empty

  Scenario: Add todo by pressing Enter only — no button required
    When I type "Remember to press enter" in the input field
    And I press the "Enter" key
    Then "Remember to press enter" should appear in the list without clicking any button

  Scenario Outline: Prevent adding blank or whitespace-only todos
    When I type "<input>" in the input field
    And I press the "Enter" key
    Then no new todo item should be added to the list