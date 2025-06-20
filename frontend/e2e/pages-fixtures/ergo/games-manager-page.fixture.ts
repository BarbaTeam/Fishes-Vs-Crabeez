import { expect } from '@playwright/test';
import { E2EComponentFixture } from '@e2e/e2e-component.fixture';

import { BigButtonFixture } from '@app/shared/components/big-button/big-button.fixture';



export class GamesManagerPageFixture extends E2EComponentFixture{
    private bigButton = new BigButtonFixture(this.page);

    async clickOnNthNavbarButton(idx: number) {
        const navbarBtns = this.page.locator("app-navbar").locator("app-navbar-button");
        await navbarBtns.nth(idx).click();
        await this.page.waitForLoadState("networkidle");
    }

    async navigateToPlayerList(): Promise<void> {
        await this.clickOnNthNavbarButton(0);
    }

    async navigateToGamesManager(): Promise<void> {
        await this.clickOnNthNavbarButton(1);
    }

    async naviguateToHome(): Promise<void> {
        await this.clickOnNthNavbarButton(2);
    }

    async launchGame(): Promise<void> {
        await this.bigButton.launchGame().click();
    }

    async verifyPageElements(): Promise<void> {
        const navbarBtns = this.page.locator("app-navbar").locator("app-navbar-button");
        await expect(navbarBtns).toHaveCount(3);

        const childsList = navbarBtns.nth(0);
        await expect(childsList).toContainText("Liste des joueurs");

        const gamesManagerBtn = navbarBtns.nth(1);
        await expect(gamesManagerBtn).toContainText("Gestionnaire de parties");

        const homeBtn = navbarBtns.nth(2);
        await expect(homeBtn).toContainText("Accueil");

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
