import { expect } from '@playwright/test';
import { E2EComponentFixture } from '@e2e/e2e-component.fixture';

import { UserCardFixture } from '@app/shared/components/user-card/user-card.fixture';
import { SideBoxFixture } from '@app/shared/components/side-box/side-box.fixture';
import { SmallButtonFixture } from '@app/shared/components/small-button/small-button.fixture';
import { InnerBoxFixture } from '@app/shared/components/inner-box/inner-box.fixture';



export class ChildStatsPageFixture extends E2EComponentFixture {
    private userCard = new UserCardFixture(this.page);
    private sideBox = new SideBoxFixture(this.page);
    private smallButton = new SmallButtonFixture(this.page);
    private innerBox = new InnerBoxFixture(this.page);

    async clickOnNthNavbarButton(idx: number) {
        const navbarBtns = this.page.locator("app-navbar").locator("app-navbar-button");
        await navbarBtns.nth(idx).click();
        await this.page.waitForLoadState("networkidle");
    }

    async navigateToConfig(): Promise<void> {
        await this.clickOnNthNavbarButton(1);
    }

    async verifyPageElements(childName: string): Promise<void> {
        const navbarBtns = this.page.locator("app-navbar").locator("app-navbar-button");
        await expect(navbarBtns).toHaveCount(3);

        const profileCard = navbarBtns.nth(0).locator("app-user-card");
        await expect(profileCard).toBeVisible();

        const configBtn = navbarBtns.nth(1);
        await expect(configBtn).toBeVisible();

        const backBtn = navbarBtns.nth(2);
        await expect(backBtn).toBeVisible();

        await expect(this.userCard.locator()).toContainText(childName);
        await expect(this.sideBox.locator()).toBeVisible();
        await expect(this.smallButton.stats()).toBeVisible();
        await expect(this.page.locator('p').filter({ hasText: 'HISTORIQUE' })).toBeVisible();
        await expect(this.innerBox.mainBoxMedium()).toBeVisible();

        await expect(
            this.innerBox.scrollableBox().or(this.innerBox.invalidSectionBox())
        ).toBeVisible();
    }
}
