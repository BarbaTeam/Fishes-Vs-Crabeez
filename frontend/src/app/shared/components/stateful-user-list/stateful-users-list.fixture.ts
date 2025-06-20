import { Locator, expect } from '@playwright/test';
import { E2EComponentFixture } from 'e2e/e2e-component.fixture';

export class StatefulUsersListFixture extends E2EComponentFixture{
  locator(): Locator {
    return this.page.locator('app-stateful-users-list');
  }

  userInList(name: string): Locator {
    return this.locator().getByText(name).first();
  }

  async selectUser(name: string): Promise<void> {
    await this.userInList(name).click();
  }

  async verifyUserExists(name: string): Promise<void> {
    await expect(this.userInList(name)).toBeVisible();
  }

  async verifyUserDoesNotExist(name: string): Promise<void> {
    await expect(this.userInList(name)).not.toBeVisible();
  }
}