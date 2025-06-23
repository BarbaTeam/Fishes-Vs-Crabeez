import { Locator } from '@playwright/test';
import { E2EComponentFixture } from 'e2e/e2e-component.fixture';

export class NewChildButtonFixture extends E2EComponentFixture{
  locator(): Locator {
    return this.page.locator('app-new-child-button');
  }

  async click(): Promise<void> {
    await this.locator().click();
  }
}