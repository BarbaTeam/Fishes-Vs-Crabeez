import { expect } from '@playwright/test';
import { E2EComponentFixture } from '@e2e/e2e-component.fixture';

import { NavbarButtonFixture } from '@app/shared/components/navbar-button/navbar-button.fixture';
import { InnerBoxFixture } from '@app/shared/components/inner-box/inner-box.fixture';
import { UserConfigFixture } from '@app/shared/components/user-config/user-config.fixture';
import { SettingsToggleFixture } from '@app/shared/components/settings-toggle/settings-toggle.fixture';



export class NewChildPageFixture extends E2EComponentFixture {
    private navbarButton = new NavbarButtonFixture(this.page);
    private innerBox = new InnerBoxFixture(this.page);
    private userConfig = new UserConfigFixture(this.page);
    private settingsToggle = new SettingsToggleFixture(this.page);

    async fillUserInfo(lastName: string, firstName: string, age: string): Promise<void> {
        await this.userConfig.fillUserInfo(lastName, firstName, age);
    }

    async selectIcon(): Promise<void> {
        await this.userConfig.selectIcon();
    }

    async toggleMathOption(option: 'reecriture' | 'addition' | 'soustraction' | 'multiplication' | 'division'): Promise<void> {
        await this.settingsToggle.toggleOption(option);
    }

    async createChild(): Promise<void> {
        await this.navbarButton.create().click();
        await this.page.waitForLoadState('networkidle');
    }

    async verifyPageElements(): Promise<void> {
        await expect(this.navbarButton.back()).toBeVisible();
        await expect(this.navbarButton.config()).toBeVisible();
        await expect(this.navbarButton.create()).toBeVisible();
        await expect(this.innerBox.mainBox()).toBeVisible();
        await expect(this.userConfig.locator()).toBeVisible();
    }

    async verifyCreateButtonState(enabled: boolean): Promise<void> {
        if (enabled) {
            await expect(this.navbarButton.create()).toHaveClass(/green/);
            await expect(this.navbarButton.create()).not.toHaveClass(/grey/);
        } else {
            await expect(this.navbarButton.create()).toHaveClass(/grey/);
            await expect(this.navbarButton.create()).not.toHaveClass(/green/);
        }
    }
}