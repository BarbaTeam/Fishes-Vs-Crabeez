import { E2EComponentFixture } from '@e2e/e2e-component.fixture';
import { expect } from '@playwright/test';



export type PlayerStats = {
    globalGrade?: string;
    wordsPerMinute?: string;
    sectionsCount?: number;
};



export class ProfilePageFixture extends E2EComponentFixture {
    async waitForStatsToLoad() {
        await this.page.waitForLoadState("networkidle");
        await this.page.waitForSelector("app-inner-box.blue.medium", { state: "visible" });

        const statsButton = this.page.locator("app-small-button").filter({ hasText: "Stats" });
        await expect(statsButton).toHaveClass(/active/);

        // Attendre que le chargement se termine
        await this.page.waitForFunction(() => {
            const loadingElements = document.querySelectorAll('p');
            for (const element of loadingElements as unknown as any[]) {
                if (element.textContent?.includes("Chargement des statistiques...")) {
                    return false;
                }
            }
            return true;
        }, { timeout: 10000 });

        await this.page.waitForTimeout(2000);
    }

    async clickOnNthNavbarButton(idx: number) {
        const navbarBtns = this.page.locator("app-navbar").locator("app-navbar-button");
        await navbarBtns.nth(idx).click();
        await this.page.waitForLoadState("networkidle");
    }

    async captureStats(): Promise<PlayerStats> {
        const stats: PlayerStats = {};

        try {
            const statsContainer = this.page.locator("app-inner-box.blue.medium").first();

            const gradeStatLine = statsContainer.locator("app-stat-line").filter({ hasText: "Note" });
            const wpmStatLine = statsContainer.locator("app-stat-line").filter({ hasText: "Mots par minutes" });

            if (await gradeStatLine.isVisible()) {
                const gradeText = await gradeStatLine.textContent();
                stats.globalGrade = gradeText?.trim() || "unknown";
            }

            if (await wpmStatLine.isVisible()) {
                const wpmText = await wpmStatLine.textContent();
                stats.wordsPerMinute = wpmText?.trim() || "unknown";
            }

            const sectionsButtons = this.page.locator("app-small-button");
            stats.sectionsCount = await sectionsButtons.count();

        } catch (error) {
            console.warn("Impossible de capturer les stats:", error);
        }

        return stats;
    }

    async reloadAndWaitForStats() {
        await this.page.reload();
        await this.page.waitForTimeout(3000);

        await this.page.locator('p', { hasText: 'Chargement des statistiques...' }).waitFor({
            state: 'detached',
            timeout: 10000,
        });

        await this.page.waitForTimeout(2000);
    }

    async expectStatsImprovement(initialStats: PlayerStats, finalStats: PlayerStats) {
        if (typeof initialStats.sectionsCount === 'number' && typeof finalStats.sectionsCount === 'number') {
            expect(finalStats.sectionsCount).toBeGreaterThan(initialStats.sectionsCount);
            expect(finalStats.sectionsCount - initialStats.sectionsCount).toBe(1);
        } else {
            expect(finalStats.sectionsCount).toBeGreaterThan(0);
        }

        // Vérifier qu'il n'y a plus de "Statistiques Indisponibles"
        const unavailableText = this.page.locator('p:has-text("Statistiques Indisponibles")');
        expect(await unavailableText.isVisible()).toBe(false);
    }
}