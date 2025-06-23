import { expect } from '@playwright/test';
import { NavbarButtonFixture } from '@app/shared/components/navbar-button/navbar-button.fixture';
import { UserCardFixture } from '@app/shared/components/user-card/user-card.fixture';
import { SideBoxFixture } from '@app/shared/components/side-box/side-box.fixture';
import { SmallButtonFixture } from '@app/shared/components/small-button/small-button.fixture';
import { InnerBoxFixture } from '@app/shared/components/inner-box/inner-box.fixture';
import { E2EComponentFixture } from 'e2e/e2e-component.fixture';

export class ChildStatsPageFixture extends E2EComponentFixture {
  private navbarButton = new NavbarButtonFixture(this.page);
  private userCard = new UserCardFixture(this.page);
  private sideBox = new SideBoxFixture(this.page);
  private smallButton = new SmallButtonFixture(this.page);
  private innerBox = new InnerBoxFixture(this.page);

  async navigateToConfig(): Promise<void> {
    await this.navbarButton.config().click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyPageElements(childName: string): Promise<void> {
    await expect(this.navbarButton.back()).toBeVisible();
    await expect(this.navbarButton.config()).toBeVisible();
    await expect(this.userCard.locator()).toBeVisible();
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