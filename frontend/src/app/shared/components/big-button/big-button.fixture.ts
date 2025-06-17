import { Locator } from '@playwright/test';
import { E2EComponentFixture } from 'e2e/e2e-component.fixture';

export class BigButtonFixture extends E2EComponentFixture {
  locator(text: string): Locator {
    return this.page.locator('app-big-button').filter({ hasText: text });
  }

  launchGame(): Locator {
    return this.locator('Lancer une partie');
  }

  delete(): Locator {
    return this.page.locator('app-big-button.delete').filter({ hasText: 'Supprimer' });
  }
}