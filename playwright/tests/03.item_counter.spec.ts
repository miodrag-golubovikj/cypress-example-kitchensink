import { test, expect } from 'src/helpers/todoFixture';
import * as allure from 'allure-js-commons';

/**
 * Feature: Todo Item Counter
 * Uses a data-driven approach mirroring the Scenario Outline in the feature file.
 * No code duplication: a single parameterised test covers all four Examples rows.
 */
test.describe('Item Counter', () => {
  
  test.beforeEach(async ({ todoPage }) => {
    // Refresh page to reload it so data is consistent
    // Delete all initial existing todo's that contain deliberate bugs. 
    // Crucial for next seed step in the for cycle below to complete properly without bugs.
      await allure.step('Delete existing todos that have hardcoded bugs in them', async () => {
        await todoPage.clearAllBugs();
      });
  });
    // going to 3 todo's with it's variations to go one more than the two default given by the project,
    // so we make sure nothing is broken with multiple todos.
  const counterCases = [
    { total: 1, completed: 0, expected: '1 item left'  },
    { total: 2, completed: 0, expected: '2 items left' },
    { total: 2, completed: 1, expected: '1 item left'  },
    { total: 2, completed: 2, expected: '0 items left' },
    { total: 3, completed: 0, expected: '3 items left' },
    { total: 3, completed: 1, expected: '0 items left' },
    { total: 3, completed: 2, expected: '1 items left' },
    { total: 3, completed: 3, expected: '0 items left' },
  ];

  for (const { total, completed, expected } of counterCases) {
    test(`Counter: ${total} total, ${completed} completed → "${expected}"`, async ({ todoPage }) => {
      await allure.feature('Item Counter');
      await allure.story('Counter accuracy');
      await allure.parameter('total',     String(total));
      await allure.parameter('completed', String(completed));
      await allure.parameter('expected',  expected);

      // Build a list of todo objects; mark the last `completed` ones as done
      const todos = Array.from({ length: total }, (_, i) => ({
        title:     `Todo ${i + 1}`,
        completed: i < completed,
      }));

      await allure.step('Seed todos', async () => {
        await todoPage.seedTodos(todos);
      });
      await allure.step(`Assert counter shows "${expected}"`, async () => {
        await todoPage.assertCounter(expected);
      });
    });
  }

  test('Counter and footer are hidden when list is empty', async ({ todoPage }) => {
    await allure.feature('Item Counter');
    await allure.story('Footer hidden on empty list');
    await allure.step('Assert footer is not visible', async () => {
      await todoPage.assertFooterHidden();
    });
  });
});
