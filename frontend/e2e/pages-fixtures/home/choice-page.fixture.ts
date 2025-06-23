import { E2EComponentFixture } from '@e2e/e2e-component.fixture';
import { expect } from '@playwright/test';



export class ChoicePageFixture extends E2EComponentFixture {
    async verifyPageElements() {
        await expect(this.page.getByText("PIXEL TYPER")).toBeVisible();
        await expect(this.page.getByText("Selectionnez votre rôle !")).toBeVisible();
    }

    async selectChildRole() {
        const childChoiceBtn = this.page.locator("app-choice-button").filter({
            has: this.page.getByText(/^Enfant$/)
        });
        await expect(childChoiceBtn).toBeVisible();
        await expect(childChoiceBtn).toContainText("Un rôle qui permet de jouer");
        await childChoiceBtn.click();
    }

    async selectErgoRole() {
        const ergoChoiceBtn = this.page.locator("app-choice-button").filter({
            has: this.page.getByText(/^Ergothérapeute$/)
        });
        await expect(ergoChoiceBtn).toBeVisible();
        await expect(ergoChoiceBtn).toContainText('Un rôle qui permet de créer des sessions multijoueur');
        await ergoChoiceBtn.click();
    }
}