import { Locator, expect } from '@playwright/test';
import { E2EComponentFixture } from 'e2e/e2e-component.fixture';

export class UserConfigFixture extends E2EComponentFixture{
  locator(): Locator {
    return this.page.locator('app-user-config');
  }

  lastNameInput(): Locator {
    return this.page.locator('input#name').first();
  }

  firstNameInput(): Locator {
    return this.page.locator('input#name').nth(1);
  }

  ageInput(): Locator {
    return this.page.locator('input#age');
  }

  iconSelectTrigger(): Locator {
    return this.page.locator('.icon-select-trigger');
  }

  iconSelector(): Locator {
    return this.page.locator('.icon-selector img').first();
  }

  selectedIcon(): Locator {
    return this.page.locator('.icon-select-trigger').locator('img');
  }

  async fillUserInfo(lastName: string, firstName: string, age: string): Promise<void> {
    await this.lastNameInput().fill(lastName);
    await this.firstNameInput().fill(firstName);
    await this.ageInput().fill(age);
  }

  async selectIcon(): Promise<void> {
    await this.iconSelectTrigger().click();
    await this.iconSelector().click();
  }

  async verifyUserInfo(lastName: string, firstName: string, age: string): Promise<void> {
    await expect(this.lastNameInput()).toHaveValue(lastName);
    await expect(this.firstNameInput()).toHaveValue(firstName);
    await expect(this.ageInput()).toHaveValue(age);
    await expect(this.iconSelectTrigger()).toBeVisible();
    await expect(this.selectedIcon()).toBeVisible();
  }
}