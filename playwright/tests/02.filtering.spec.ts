import { test, expect } from 'src/helpers/todoFixture';
import * as allure from 'allure-js-commons';

/**
 * Feature: Filter Todo Items
 * Covers: default All view, Active filter, Completed filter, switching back to All,
 *         real-time filter update, empty state.
 */
test.describe('Filtering Todos', () => {

  test.beforeEach(async ({ todoPage }) => {
    
    // Refresh page to reload it so data is consistent
    // Delete all initial existing todo's that contain deliberate bugs. 
    // Crucial for next seed step to complete properly without bugs.
     await allure.step('Delete existing todos that have hardcoded bugs in them', async () => {
      await todoPage.clearAllBugs();
    });

    // Seed: one completed, one active

    await todoPage.seedTodos([
      { title: 'Pay electric bill', completed: true },
      { title: 'Walk the dog',      completed: false },
    ]);
  });

  test('Default view shows All tab selected and all todos visible', async ({ todoPage }) => {
    await allure.feature('Filtering');
    await allure.story('Default All view');
    await allure.step('All filter tab is selected by default', async () => {
      await todoPage.assertFilterSelected('All');
    });
    await allure.step('Both todos are visible', async () => {
      await todoPage.assertTodoVisible('Pay electric bill');
      await todoPage.assertTodoVisible('Walk the dog');
    });
  });

  test('Active filter shows only incomplete todos', async ({ todoPage }) => {
    await allure.feature('Filtering');
    await allure.story('Active filter');
    await allure.step('Click Active tab', async () => {
      await todoPage.clickFilterActive();
    });
    await allure.step('Only "Walk the dog" is visible', async () => {
      await todoPage.assertTodoVisible('Walk the dog');
    });
    await allure.step('"Pay electric bill" is not visible', async () => {
      await todoPage.assertTodoNotVisible('Pay electric bill');
    });
  });

  test('Completed filter shows only completed todos', async ({ todoPage }) => {
    await allure.feature('Filtering');
    await allure.story('Completed filter');
    await allure.step('Click Completed tab', async () => {
      await todoPage.clickFilterCompleted();
    });
    await allure.step('Only "Pay electric bill" is visible', async () => {
      await todoPage.assertTodoVisible('Pay electric bill');
    });
    await allure.step('"Walk the dog" is not visible', async () => {
      await todoPage.assertTodoNotVisible('Walk the dog');
    });
  });

  test('Switching back to All restores full list', async ({ todoPage }) => {
    await allure.feature('Filtering');
    await allure.story('All filter restores view');
    await todoPage.clickFilterActive();
    await allure.step('Click All tab', async () => {
      await todoPage.clickFilterAll();
    });
    await allure.step('Both todos are visible again', async () => {
      await todoPage.assertTodoVisible('Pay electric bill');
      await todoPage.assertTodoVisible('Walk the dog');
    });
  });

  test('Active filter updates in real time when a todo is completed', async ({ todoPage }) => {
    await allure.feature('Filtering');
    await allure.story('Real-time active filter');
    await todoPage.clickFilterActive();
    await allure.step('Mark "Walk the dog" as completed', async () => {
      await todoPage.checkTodoByTitle('Walk the dog');
    });
    await allure.step('"Walk the dog" disappears from Active view', async () => {
      await todoPage.assertTodoNotVisible('Walk the dog');
    });
  });

  test('Active filter shows empty list when all todos are completed', async ({ todoPage }) => {
    await allure.feature('Filtering');
    await allure.story('Empty state on Active filter');
    // Mark the remaining active item as completed
    await todoPage.checkTodoByTitle('Walk the dog');
    await allure.step('Click Active tab', async () => {
      await todoPage.clickFilterActive();
    });
    await allure.step('Todo list shows 0 items', async () => {
      await expect(todoPage.todoItems).toHaveCount(0);
    });
  });
});
