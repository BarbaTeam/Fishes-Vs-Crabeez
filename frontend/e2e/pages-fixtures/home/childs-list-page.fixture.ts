import { E2EComponentFixture } from '@e2e/e2e-component.fixture';
import { expect } from '@playwright/test';



export class ChildsListPageFixture extends E2EComponentFixture {
    async waitForChildsCards() {
        await this.page.waitForSelector("app-user-list app-user-card", { state: "visible" });
    }

    async selectNthChild(idx: number): Promise<string> {
        const childCard = this.page.locator("app-user-list app-user-card").nth(idx);
        await expect(childCard).toBeVisible();

        const selectedChildName = await childCard.locator(".first-name").innerText();
        await childCard.click();

        return selectedChildName;
    }
}