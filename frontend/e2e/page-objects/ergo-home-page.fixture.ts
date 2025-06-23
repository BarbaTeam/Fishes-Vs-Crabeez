import { expect } from '@playwright/test';
import { NavbarButtonFixture } from '@app/shared/components/navbar-button/navbar-button.fixture';
import { BigButtonFixture } from '@app/shared/components/big-button/big-button.fixture';
import { E2EComponentFixture } from 'e2e/e2e-component.fixture';

export class ErgoHomePageFixture extends E2EComponentFixture{
  private navbarButton = new NavbarButtonFixture(this.page);
  private bigButton = new BigButtonFixture(this.page);

  async navigateToPlayerList(): Promise<void> {
    await this.navbarButton.playerList().click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToGamesManager(): Promise<void> {
    await this.navbarButton.gamesManager().click();
    await this.page.waitForLoadState('networkidle');
  }

  async launchGame(): Promise<void> {
    await this.bigButton.launchGame().click();
  }

  async verifyPageElements(): Promise<void> {
    await expect(this.navbarButton.playerList()).toBeVisible();
    await expect(this.navbarButton.gamesManager()).toBeVisible();
    await expect(this.navbarButton.home()).toBeVisible();
    await expect(this.page.getByText('Créer une salle d\'attente')).toBeVisible();
    await expect(this.bigButton.launchGame()).toBeVisible();
    await expect(this.page.getByText('Ou intéragissez avec les enfants en jeu !')).toBeVisible();
  }

  async checkGamesStatus(): Promise<void> {
    const hasGames = await this.page.locator('.game-card').count();
    if (hasGames > 0) {
      await expect(this.page.getByText('Cliquez pour rejoindre')).toBeVisible();
    } else {
      await expect(this.page.getByText('Vous n\'avez pas encore créer une partie...')).toBeVisible();
    }
  }
}