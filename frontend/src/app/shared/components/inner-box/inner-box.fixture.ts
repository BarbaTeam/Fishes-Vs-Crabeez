import { Locator } from '@playwright/test';
import { E2EComponentFixture } from 'e2e/e2e-component.fixture';

export class InnerBoxFixture extends E2EComponentFixture{
  locator(classes: string = ''): Locator {
    return this.page.locator(`app-inner-box${classes}`);
  }

  mainBox(): Locator {
    return this.locator('.main-box.blue.scrollable.big');
  }

  mainBoxMedium(): Locator {
    return this.locator('.main-box.blue.medium');
  }

  scrollableBox(): Locator {
    return this.locator('.main-box.blue.medium.scrollable');
  }

  invalidSectionBox(): Locator {
    return this.locator('.main-box.blue.medium').filter({ hasText: 'Contenu Inexistant' });
  }

  userBox(): Locator {
    return this.locator('.blue.scrollable');
  }
}