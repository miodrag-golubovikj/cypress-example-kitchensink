import { Page, Locator, expect } from '@playwright/test';

/**
 * TodoPage main POM approach to map the todo page that was needed for this assignment.
 * As it only consists of one simple todo page, only this file was needed.
 */
export class TodoPage {
  readonly page: Page;

  // ── Locators ──────────────────────────────────────────────────────────────
  readonly newTodoInput: Locator;
  readonly todoItems: Locator;
  readonly toggleAllCheckbox: Locator;
  readonly footer: Locator;
  readonly todoCount: Locator;
  readonly filterAll: Locator;
  readonly filterActive: Locator;
  readonly filterCompleted: Locator;

  constructor(page: Page) {
    this.page = page;

    this.newTodoInput    = page.getByPlaceholder('What needs to be done?');
    this.todoItems       = page.locator('.todo-list li');
    this.toggleAllCheckbox = page.getByText('Mark all as complete');
    this.footer          = page.locator('.footer');
    this.todoCount       = page.locator('.todo-count');
    this.filterAll       = page.getByRole('link', { name: 'All' });
    this.filterActive    = page.getByRole('link', { name: 'Active' });
    this.filterCompleted = page.getByRole('link', { name: 'Completed' });
  }

  // ── Navigation ────────────────────────────────────────────────────────────

  /** Navigate to the Todo app page */
  async goto(): Promise<void> {
    await this.page.goto('/todo');
  }

  // ── Adding todos ──────────────────────────────────────────────────────────

  /**
   * Type text into the new-todo input and optionally press Enter.
   * Separating typing from pressing Enter allows testing each step individually.
   */
  async typeTodo(text: string): Promise<void> {
    await this.newTodoInput.fill(text);
  }

  /** Press Enter in the new-todo input field */
  async pressEnter(): Promise<void> {
    await this.newTodoInput.press('Enter');
  }

  /**
   * Convenience: type and immediately submit a new todo.
   * Used in Background / setup helpers.
   */
  async addTodo(text: string): Promise<void> {
    await this.typeTodo(text);
    await this.pressEnter();
  }

  /**
   * Seed the list with multiple todos in one call.
   * Accepts objects so callers can also mark items completed during seeding.
   */
  async seedTodos(items: { title: string; completed?: boolean }[]): Promise<void> {
    for (const item of items) {
      await this.addTodo(item.title);
    }
    // Mark completed items after adding all — avoids filter-state side-effects
    for (const item of items) {
      if (item.completed) {
        await this.checkTodoByTitle(item.title);
      }
    }
  }

  // ── Checking / Unchecking ─────────────────────────────────────────────────

  /** Click the checkbox of the todo whose label matches `title` */
  async checkTodoByTitle(title: string): Promise<void> {
    const item = this.getTodoItem(title);
    await item.locator('.toggle').click();
  }

  /** Click the toggle-all chevron */
  async clickToggleAll(): Promise<void> {
    await this.toggleAllCheckbox.click();
  }

  // ── Filtering ─────────────────────────────────────────────────────────────

  async clickFilterAll(): Promise<void>       { await this.filterAll.click(); }
  async clickFilterActive(): Promise<void>    { await this.filterActive.click(); }
  async clickFilterCompleted(): Promise<void> { await this.filterCompleted.click(); }

  // ── Editing ───────────────────────────────────────────────────────────────

  /** Enter edit mode by double-clicking the todo label */
  async doubleClickTodo(title: string): Promise<void> {
    await this.getTodoItem(title).locator('label').dblclick();
  }

  /**
   * Get the currently-visible edit input for a todo item.
   * The app renders a separate `.edit` input inside each <li> when editing.
   */
  getEditInput(title: string): Locator {
    return this.getTodoItem(title).locator('.edit');
  }

  /** Clear the edit field and type new text */
  async clearAndType(title: string, newText: string): Promise<void> {
    const editInput = this.getEditInput(title);
    await editInput.clear();
    await editInput.fill(newText);
  }

  /** Clear the edit field completely (used for delete-by-clearing test) */
  async clearEditField(title: string): Promise<void> {
    const editInput = this.getEditInput(title);
    await editInput.clear();
  }

  async pressEscape(title: string): Promise<void> {
    await this.getEditInput(title).press('Escape');
  }

  async pressEnterOnEditInput(title: string): Promise<void> {
    await this.getEditInput(title).press('Enter');
  }

  // ── Deleting ──────────────────────────────────────────────────────────────

  /** Hover over a todo to reveal the × delete button */
  async hoverTodo(title: string): Promise<void> {
    await this.getTodoItem(title).hover();
  }

  /** Click the × delete button on a (already-hovered) todo */
  async clickDeleteButton(title: string): Promise<void> {
    await this.getTodoItem(title).locator('.destroy').click();
  }

  /** Delete all currently-visible todos one by one */
  async deleteAllTodos(): Promise<void> {
    // Re-query count each time because the list shrinks after each deletion
    while (await this.todoItems.count() > 0) {
      const first = this.todoItems.first();
      await first.hover();
      await first.locator('.destroy').click();
    }
  }

  // ── Getters / Queries ─────────────────────────────────────────────────────

  /** Return the <li> element whose label text matches `title` exactly */
  getTodoItem(title: string): Locator {
    return this.todoItems.filter({ hasText: title });
  }

  /** Return the text content of the item counter */
  async getCounterText(): Promise<string> {
    return (await this.todoCount.textContent()) ?? '';
  }

  /** Return the current value of the new-todo input */
  async getInputValue(): Promise<string> {
    return await this.newTodoInput.inputValue();
  }

  // ── Assertions (reusable) ─────────────────────────────────────────────────

  /** Assert that a todo with `title` is visible in the list */
  async assertTodoVisible(title: string): Promise<void> {
    await expect(this.getTodoItem(title)).toBeVisible();
  }

  /** Assert that a todo with `title` is NOT visible (hidden or absent) */
  async assertTodoNotVisible(title: string): Promise<void> {
    await expect(this.getTodoItem(title)).not.toBeVisible();
  }

  /** Assert that the item counter shows an exact string, e.g. "2 items left" */
  async assertCounter(expected: string): Promise<void> {
    await expect(this.todoCount).toHaveText(expected);
  }

  /** Assert that the footer (counter + filters) is hidden */
  async assertFooterHidden(): Promise<void> {
    await expect(this.footer).not.toBeVisible();
  }

  /** Assert that a specific filter link carries the "selected" class */
  async assertFilterSelected(filter: 'All' | 'Active' | 'Completed'): Promise<void> {
    const link = filter === 'All' ? this.filterAll
               : filter === 'Active' ? this.filterActive
               : this.filterCompleted;
    await expect(link).toHaveClass(/selected/);
  }

  /**
   * Clears localStorage/sessionStorage, hard-reloads the page.
   *  Call in beforeEach when the app loads to refresh the buggy site for testing.
   */
  async clearSession(): Promise<void> {
    await this.page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await this.page.reload({ waitUntil: 'networkidle' });
  }

  /**
   * Clears localStorage/sessionStorage, hard-reloads the page, then
   * deletes every existing todo. Call in beforeEach when the app loads
   * with pre-seeded "buggy" todos that would interfere with test data.
   */
  async clearAllBugs(): Promise<void> {
    await this.clearSession();
    await this.deleteAllTodos();
  }

}

