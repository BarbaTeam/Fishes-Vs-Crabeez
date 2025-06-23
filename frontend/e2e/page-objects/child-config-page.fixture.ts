import { expect } from '@playwright/test';
import { UserConfigFixture } from '@app/shared/components/user-config/user-config.fixture';
import { SettingsToggleFixture } from '@app/shared/components/settings-toggle/settings-toggle.fixture';
import { BigButtonFixture } from '@app/shared/components/big-button/big-button.fixture';
import { E2EComponentFixture } from 'e2e/e2e-component.fixture';

export class ChildConfigPageFixture extends E2EComponentFixture{
    
  private userConfig = new UserConfigFixture(this.page);
  private settingsToggle = new SettingsToggleFixture(this.page);
  private bigButton = new BigButtonFixture(this.page);

  async verifyUserInfo(lastName: string, firstName: string, age: string): Promise<void> {
    await this.userConfig.verifyUserInfo(lastName, firstName, age);
  }

  async verifyToggleState(option: string, checked: boolean): Promise<void> {
    await this.settingsToggle.verifyToggleState(option, checked);
  }

  async deleteChild(): Promise<void> {
    const openLockIcon = this.page.locator('img[src*="open_lock.png"].cap.icon');
    const closedLockIcon = this.page.locator('img[src*="close_lock.png"].delete.icon');
    await expect(closedLockIcon).toBeVisible();
    await expect(closedLockIcon).toHaveClass(/visible/);
    
    await expect(openLockIcon).not.toHaveClass(/visible/);
    await closedLockIcon.click();    

    await expect(this.bigButton.delete()).toHaveClass(/red/);
    await expect(this.bigButton.delete()).not.toHaveClass(/grey/);
    await expect(openLockIcon).toHaveClass(/visible/);
    await expect(closedLockIcon).not.toHaveClass(/visible/);
    
    await this.bigButton.delete().click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyDeleteButtonLocked(): Promise<void> {
    const openLockIcon = this.page.locator('img[src*="open_lock.png"].cap.icon');
    const closedLockIcon = this.page.locator('img[src*="close_lock.png"].delete.icon');

    await expect(this.bigButton.delete()).toBeVisible();
    await expect(this.bigButton.delete()).toHaveClass(/grey/);
    await expect(this.bigButton.delete()).not.toHaveClass(/red/);
    await expect(closedLockIcon).toBeVisible();
    await expect(closedLockIcon).toHaveClass(/visible/);
    await expect(openLockIcon).not.toHaveClass(/visible/);
  }
}

    

