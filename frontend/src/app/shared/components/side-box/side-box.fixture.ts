import { Locator } from '@playwright/test';
import { E2EComponentFixture } from 'e2e/e2e-component.fixture';

export class SideBoxFixture extends E2EComponentFixture{
  locator(): Locator {
    return this.page.locator('app-side-box.button-list');
  }
}