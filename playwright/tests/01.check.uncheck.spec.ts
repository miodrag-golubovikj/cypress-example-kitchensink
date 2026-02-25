import { test, expect } from 'src/helpers/todoFixture';
import * as allure from 'allure-js-commons';

/**
 * Feature: Ability to Check-Uncheck Todos
 * Covers: marking complete, unmarking, toggle-all, toggle-all back to active.
 */
test.describe('Check / Uncheck Todos', () => {

  test.beforeEach(async ({ todoPage }) => {
    // Refresh page to reload it so data is consistent
      await allure.step('Refresh intial page so page will load with buggy context.', async () => {
        await todoPage.clearSession();
      });
    });

  test('Mark a todo as completed', async ({ todoPage }) => {
    await allure.feature('Check/Uncheck');
    await allure.story('Mark as completed');
    await allure.step('Click the checkbox next to "Pay electric bill"', async () => {
      await todoPage.checkTodoByTitle('Pay electric bill');
    });
    await allure.step('Verify strikethrough styling (completed class)', async () => {
      await expect(todoPage.getTodoItem('Pay electric bill')).toHaveClass(/completed/);
    });
    await allure.step('Verify counter shows 1 item left', async () => {
      await todoPage.assertCounter('1 item left');
    });
  });

  test('Unmark a completed todo back to active', async ({ todoPage }) => {
    await allure.feature('Check/Uncheck');
    await allure.story('Unmark completed');
    // Pre-condition: mark as completed first
    await todoPage.checkTodoByTitle('Pay electric bill');

    await allure.step('Click checkbox again to unmark', async () => {
      await todoPage.checkTodoByTitle('Pay electric bill');
    });
    await allure.step('Verify item no longer has completed class', async () => {
      await expect(todoPage.getTodoItem('Pay electric bill')).not.toHaveClass(/completed/);
    });
    await allure.step('Verify counter shows 2 items left', async () => {
      await todoPage.assertCounter('2 items left');
    });
  });

  test('Toggle-all completes all todos', async ({ todoPage }) => {
    await allure.feature('Check/Uncheck');
    await allure.story('Toggle all to completed');
    await allure.step('Click the toggle-all chevron', async () => {
      await todoPage.clickToggleAll();
    });
    await allure.step('All todos should carry the completed class', async () => {
      const items = todoPage.todoItems;
      const count = await items.count();
      for (let i = 0; i < count; i++) {
        await expect(items.nth(i)).toHaveClass(/completed/);
      }
    });
    await allure.step('Counter shows 0 items left', async () => {
      await todoPage.assertCounter('0 items left');
    });
  });

  test('Toggle-all back to active when all are completed', async ({ todoPage }) => {
    await allure.feature('Check/Uncheck');
    await allure.story('Toggle all back to active');
    // Pre-condition: toggle all to completed
    await todoPage.clickToggleAll();

    await allure.step('Click toggle-all again', async () => {
      await todoPage.clickToggleAll();
    });
    await allure.step('All todos should NOT have completed class', async () => {
      const items = todoPage.todoItems;
      const count = await items.count();
      for (let i = 0; i < count; i++) {
        await expect(items.nth(i)).not.toHaveClass(/completed/);
      }
    });
    await allure.step('Counter shows 2 items left', async () => {
      await todoPage.assertCounter('2 items left');
    });
  });
});
