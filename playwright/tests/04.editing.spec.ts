import { test, expect } from 'src/helpers/todoFixture';
import * as allure from 'allure-js-commons';
/**
 * Feature: Edit Todo Items
 * Covers: enter edit mode, save on Enter, cancel on Escape, delete by clearing.
 */
test.describe('Editing Todos', () => {

  test.beforeEach(async ({ todoPage }) => {
    // Refresh page to reload it so data is consistent
    // Delete all initial existing todo's that contain deliberate bugs. 
    // Crucial for next seed step to complete properly without bugs.
    await allure.step('Delete existing todos that have hardcoded bugs in them', async () => {
      await todoPage.clearAllBugs();
    });
    await todoPage.addTodo('Walk the dog');
  });

  test('Double-click enters edit mode with pre-filled text', async ({ todoPage }) => {
    await allure.feature('Editing');
    await allure.story('Enter edit mode');
    await allure.step('Double-click "Walk the dog"', async () => {
      await todoPage.doubleClickTodo('Walk the dog');
    });
    await allure.step('Edit input is visible and pre-filled', async () => {
      const editInput = todoPage.getEditInput('Walk the dog');
      await expect(editInput).toBeVisible();
      await expect(editInput).toHaveValue('Walk the dog');
    });
  });

  test('Save edited text by pressing Enter', async ({ todoPage }) => {
    await allure.feature('Editing');
    await allure.story('Save on Enter');
    await todoPage.doubleClickTodo('Walk the dog');
    await allure.step('Clear and type new text', async () => {
      await todoPage.clearAndType('Walk the dog', 'Walk the cat');
    });
    await allure.step('Press Enter', async () => {
      await todoPage.pressEnterOnEditInput('Walk the dog');
    });
    await allure.step('"Walk the cat" is displayed', async () => {
      await todoPage.assertTodoVisible('Walk the cat');
    });
    await allure.step('"Walk the dog" is gone', async () => {
      await todoPage.assertTodoNotVisible('Walk the dog');
    });
  });

  test('Cancel editing by pressing Escape restores original text', async ({ todoPage }) => {
    await allure.feature('Editing');
    await allure.story('Cancel on Escape');
    await todoPage.doubleClickTodo('Walk the dog');
    await allure.step('Clear and type wrong text', async () => {
      await todoPage.clearAndType('Walk the dog', 'This is wrong');
    });
    await allure.step('Press Escape', async () => {
      await todoPage.pressEscape('Walk the dog');
    });
    await allure.step('Original text "Walk the dog" is restored', async () => {
      await todoPage.assertTodoVisible('Walk the dog');
    });
  });

  test('Clear edit field and press Enter removes the todo', async ({ todoPage }) => {
    await allure.feature('Editing');
    await allure.story('Delete by clearing');
    await todoPage.doubleClickTodo('Walk the dog');
    await allure.step('Clear the edit field', async () => {
      await todoPage.clearEditField('Walk the dog');
    });
    await allure.step('Press Enter', async () => {
      // After clearing, the item title is gone — press Enter on the input directly
      await todoPage.page.locator('.edit').press('Enter');
    });
    await allure.step('"Walk the dog" is removed from the list', async () => {
      await expect(todoPage.todoItems).toHaveCount(0);
    });
  });
});
