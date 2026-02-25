import { test, expect } from 'src/helpers/todoFixture';
import * as allure from 'allure-js-commons';

/**
 * Feature: Delete Todo Items
 * Covers: delete button visibility on hover, delete single item, delete all items.
 */
test.describe('Deleting Todos', () => {

  test.beforeEach(async ({ todoPage }) => {
    // Refresh page to reload it so data is consistent
    // Delete all initial existing todo's that contain deliberate bugs. 
    // Crucial for next seed step to complete properly without bugs.
    await allure.step('Delete existing todos that have hardcoded bugs in them', async () => {
      await todoPage.clearAllBugs();
    });
    await todoPage.seedTodos([
      { title: 'Pay electric bill' },
      { title: 'Walk the dog' },
      { title: 'To Be Deleted' },
    ]);
  });

  test('Delete (X) button appears on hover', async ({ todoPage }) => {
    await allure.feature('Deleting');
    await allure.story('Hover reveals delete button');
    await allure.step('Hover over "To Be Deleted"', async () => {
      await todoPage.hoverTodo('To Be Deleted');
    });
    await allure.step('The X button is visible', async () => {
      const destroyBtn = todoPage.getTodoItem('To Be Deleted').locator('.destroy');
      await expect(destroyBtn).toBeVisible();
    });
  });

  test('Delete a single todo using the X button', async ({ todoPage }) => {
    await allure.feature('Deleting');
    await allure.story('Delete single item');
    await allure.step('Hover and click X on "To Be Deleted"', async () => {
      await todoPage.hoverTodo('To Be Deleted');
      await todoPage.clickDeleteButton('To Be Deleted');
    });
    await allure.step('"To Be Deleted" is removed', async () => {
      await todoPage.assertTodoNotVisible('To Be Deleted');
    });
    await allure.step('Counter shows 2 items left', async () => {
      await todoPage.assertCounter('2 items left');
    });
  });

  test('Delete last remaining todo hides footer and counter', async ({ todoPage }) => {
    await allure.feature('Deleting');
    await allure.story('Delete all items');
    await allure.step('Delete all todos one by one', async () => {
      await todoPage.deleteAllTodos();
    });
    await allure.step('Footer and counter are hidden', async () => {
      await todoPage.assertFooterHidden();
    });
    await allure.step('Todo list is empty', async () => {
      await expect(todoPage.todoItems).toHaveCount(0);
    });
  });
});
