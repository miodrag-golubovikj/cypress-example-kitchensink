import { test, expect } from 'src/helpers/todoFixture';
import * as allure from 'allure-js-commons';
/**
 * Feature: Add Todo Items
 * Covers: single add, multiple add, input cleared, Enter-only submission,
 *         blank / whitespace prevention (Scenario Outline).
 *
 * Note: "Add todo by pressing Enter only" and "Add a single todo" both assert
 * item appearance. They are intentionally kept as separate tests because they
 * verify different user intents (simple add vs. no-button requirement).
 * Counter assertions from the "Add" feature overlap with the counter spec —
 * here they are lightweight confirmations embedded in the workflow, not
 * standalone counter tests.
 */
test.describe('Adding Todos', () => {
  test.beforeEach(async ({ todoPage }) => {
    // Refresh page to reload it so data is consistent
    // Delete all initial existing todo's that contain deliberate bugs. 
    // Crucial for next seed step to complete properly without bugs.
    await allure.step('Delete existing todos that have hardcoded bugs in them', async () => {
      await todoPage.clearAllBugs();
    });
  });

  test('Add a single todo item', async ({ todoPage }) => {
    await allure.feature('Adding');
    await allure.story('Single add');
    await allure.step('Type "Buy cucumbers" and press Enter', async () => {
      await todoPage.addTodo('Buy cucumbers');
    });
    await allure.step('"Buy cucumbers" appears in the list', async () => {
      await todoPage.assertTodoVisible('Buy cucumbers');
    });
    await allure.step('Counter shows 1 item left', async () => {
      await todoPage.assertCounter('1 item left');
    });
  });

  test('Add multiple todo items', async ({ todoPage }) => {
    await allure.feature('Adding');
    await allure.story('Multiple adds');
    await allure.step('Add two todos', async () => {
      await todoPage.addTodo('Pick Up the kids from school');
      await todoPage.addTodo('Take the car to the carwash');
    });
    await allure.step('List contains 2 items', async () => {
      await expect(todoPage.todoItems).toHaveCount(2);
    });
    await allure.step('Counter shows 2 items left', async () => {
      await todoPage.assertCounter('2 items left');
    });
  });

  test('Input field is cleared after submitting a todo', async ({ todoPage }) => {
    await allure.feature('Adding');
    await allure.story('Input cleared after add');
    await allure.step('Add "Read a book"', async () => {
      await todoPage.addTodo('Read a book');
    });
    await allure.step('Input field value is empty', async () => {
      await expect(todoPage.newTodoInput).toHaveValue('');
    });
  });

  test('Todo is added by pressing Enter — no button required', async ({ todoPage }) => {
    await allure.feature('Adding');
    await allure.story('Enter-only submission');
    await allure.step('Type without clicking any button, then press Enter', async () => {
      await todoPage.typeTodo('Remember to press enter');
      await todoPage.pressEnter();
    });
    await allure.step('"Remember to press enter" appears in the list', async () => {
      await todoPage.assertTodoVisible('Remember to press enter');
    });
  });

  // Scenario Outline: blank / whitespace inputs should NOT add a todo
  const blankInputCases = [
    { label: 'empty string',      input: ''   },
    { label: 'single space',      input: ' '  },
    { label: 'multiple spaces',   input: '   '},
  ];

  for (const { label, input } of blankInputCases) {
    test(`Prevent adding a "${label}" todo`, async ({ todoPage }) => {
      await allure.feature('Adding');
      await allure.story('Blank input prevention');
      await allure.parameter('input', JSON.stringify(input));
      await allure.step(`Type "${label}" and press Enter`, async () => {
        await todoPage.typeTodo(input);
        await todoPage.pressEnter();
      });
      await allure.step('No todo item is added', async () => {
        await expect(todoPage.todoItems).toHaveCount(0);
      });
    });
  }
});
