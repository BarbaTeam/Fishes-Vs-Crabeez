import { Page } from '@playwright/test';

export class E2EComponentFixture {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }
}
