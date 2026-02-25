import { test as base } from '@playwright/test';
import { TodoPage } from '../pages/TodoPage';

/**
 * Extend Playwright's base `test` with a `todoPage` fixture.
 * Every test that uses this fixture gets a fresh TodoPage already
 * navigated to /todo — no copy-paste boilerplate in each test file.
 */
type Fixtures = {
  todoPage: TodoPage;
};

export const test = base.extend<Fixtures>({
  todoPage: async ({ page }, use) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();
    await use(todoPage);
  },
});

export { expect } from '@playwright/test';
