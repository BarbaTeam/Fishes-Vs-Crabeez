import { Locator } from '@playwright/test';
import { E2EComponentFixture } from 'e2e/e2e-component.fixture';

export class SmallButtonFixture extends E2EComponentFixture{
  locator(text: string): Locator {
    return this.page.locator('app-small-button').filter({ hasText: text });
  }

  stats(): Locator {
    return this.locator('Stats');
  }
}
