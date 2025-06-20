import { test, expect } from '@playwright/test';
import { testUrl } from 'e2e/e2e.config';

import { ChoicePageFixture } from '@e2e/pages-fixtures/home/choice-page.fixture';
import { ChildsListPageFixture } from '@e2e/pages-fixtures/home/childs-list-page.fixture';

import { GamesListPageFixture } from '@e2e/pages-fixtures/child/games-list-page.fixture';
import { ProfilePageFixture, PlayerStats } from '@e2e/pages-fixtures/child/profile-page.fixture';
import { RunningGamePageFixture } from '@e2e/pages-fixtures/child/running-game-page.fixture';


////////////////////////////////////////////////////////////////////////////////
// Test :
////////////////////////////////////////////////////////////////////////////////

test.describe("Child's profile stats update after a game", () => {
    test.setTimeout(120_000);

    let choicePage: ChoicePageFixture;
    let childsListPage: ChildsListPageFixture;
    let gamesListPage: GamesListPageFixture;
    let profilePage: ProfilePageFixture;
    let runningGamePageFixture: RunningGamePageFixture;

    test.beforeEach(async ({ page }) => {
        choicePage = new ChoicePageFixture(page);
        childsListPage = new ChildsListPageFixture(page);
        gamesListPage = new GamesListPageFixture(page);
        profilePage = new ProfilePageFixture(page);
        runningGamePageFixture = new RunningGamePageFixture(page);
    });

    let initialStats: PlayerStats = {};
    let finalStats: PlayerStats = {};

    test("Child play a game in solo and see its updated stats", async ({ page }) => {
        await test.step("Child go to childs list", async () => {
            await page.goto(testUrl);
            await expect(page).toHaveURL(/.*\/home/);
            await choicePage.verifyPageElements();

            await choicePage.selectChildRole();

            await expect(page).toHaveURL(/.*\/home\/childs-list/);
            await page.waitForLoadState("networkidle");
        });

        await test.step("Child select the first child in list", async () => {
            await childsListPage.waitForChildsCards();
            const selectedChildName = await childsListPage.selectNthChild(0);
            await expect(page).toHaveURL(/.*\/child/);

            await gamesListPage.verifyPageElements();

            const currChildName = await gamesListPage.getChildName();
            await expect(currChildName).toBe(selectedChildName);
        });

        await test.step("Capture initial stats from profile page", async () => {
            await gamesListPage.clickOnNthNavbarButton(0);
            await expect(page).toHaveURL(/.*\/child\/profile/);

            await profilePage.waitForStatsToLoad();
            initialStats = await profilePage.captureStats();
        });

        await test.step("Child start a solo game", async () => {
            await profilePage.clickOnNthNavbarButton(1);
            await expect(page).toHaveURL(/.*\/child/);

            await gamesListPage.verifyPageElements();

            await gamesListPage.startSoloGame();
            await runningGamePageFixture.waitForGameToLoad();
        });

        await test.step("Play the game and end it", async () => {
            await runningGamePageFixture.playQuestions();
            await runningGamePageFixture.exitGameViaBackButton();
        });

        await test.step("Verify updated stats in profile", async () => {
            await expect(page).toHaveURL(/.*\/child/);
            await gamesListPage.verifyPageElements();

            await gamesListPage.clickOnNthNavbarButton(0);
            await expect(page).toHaveURL(/.*\/child\/profile/);

            // Sometime the statistics' page need to be reloaded to see updates
            await profilePage.reloadAndWaitForStats();

            finalStats = await profilePage.captureStats();
            if (
                typeof initialStats.sectionsCount === 'number'
                && typeof finalStats.sectionsCount === 'number'
            ) {
                expect(finalStats.sectionsCount).toBeGreaterThan(initialStats.sectionsCount);
                expect(finalStats.sectionsCount - initialStats.sectionsCount).toBe(1);
                console.log(`✓ Nombre de parties augmenté: ${initialStats.sectionsCount} -> ${finalStats.sectionsCount}`);
            } else {
                expect(finalStats.sectionsCount).toBeGreaterThan(0);
            }

            // Vérifier qu'il n'y a plus de "Statistiques Indisponibles"
            const unavailableText = page.locator('p:has-text("Statistiques Indisponibles")');
            expect(await unavailableText.isVisible()).toBe(false);
        });
    });
});
