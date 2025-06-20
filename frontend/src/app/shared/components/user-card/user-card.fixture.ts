import { Locator } from '@playwright/test';
import { E2EComponentFixture } from 'e2e/e2e-component.fixture';

export class UserCardFixture extends E2EComponentFixture{
  locator(): Locator {
    return this.page.locator('app-navbar-button app-user-card');
  }
}