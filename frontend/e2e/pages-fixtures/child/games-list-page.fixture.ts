import { E2EComponentFixture } from '@e2e/e2e-component.fixture';
import { expect } from '@playwright/test';



export class GamesListPageFixture extends E2EComponentFixture {
    async getChildName(): Promise<string> {
        const currChildName = await this.page.locator("app-user-card .first-name").innerText();
        return currChildName;
    }

    async verifyPageElements() {
        const navbarBtns = this.page.locator("app-navbar").locator("app-navbar-button");
        await expect(navbarBtns).toHaveCount(3);

        const profileCard = navbarBtns.nth(0).locator("app-user-card");
        await expect(profileCard).toBeVisible();

        const gamesListBtn = navbarBtns.nth(1);
        await expect(gamesListBtn).toContainText("Liste des parties");

        const bestiaryBtn = navbarBtns.nth(2);
        await expect(bestiaryBtn).toContainText("Bestiaire");

        await expect(this.page.getByText("Jouer seul")).toBeVisible();
        await expect(this.page.getByText("Ou à plusieurs")).toBeVisible();
    }

    async startSoloGame() {
        const playSoloButton = this.page.locator(".solo-conteneur app-big-button");

        await expect(playSoloButton).toBeVisible();
        await expect(playSoloButton).toContainText("Jouer");
        await playSoloButton.click();
    }

    async clickOnNthNavbarButton(idx: number) {
        const navbarBtns = this.page.locator("app-navbar app-navbar-button");
        await navbarBtns.nth(idx).click();
        await this.page.waitForLoadState("networkidle");
    }

    async getLobbiesName(): Promise<string[]> {
        const lobbies = this.page.locator(".game-list app-game-card");

        let ret: string[] = [];
        for (let i = 0; i < (await lobbies.count()); i++) {
            const lobbyName = await lobbies.nth(i).locator(".game-header h3").innerText();
            ret.push(lobbyName);
        }

        return ret;
    }
}