import { Locator } from '@playwright/test';
import { E2EComponentFixture } from 'e2e/e2e-component.fixture';

export class ChoiceButtonFixture extends E2EComponentFixture{

  locator(text: string): Locator {
    return this.page.locator('app-choice-button').filter({ hasText: text });
  }

  ergoCard(): Locator {
    return this.locator('Ergothérapeute');
  }
}
