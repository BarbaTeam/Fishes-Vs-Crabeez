import { test, expect, chromium, Page} from '@playwright/test';
import { testUrl } from 'e2e/e2e.config';

import { ChoicePageFixture } from '@e2e/pages-fixtures/home/choice-page.fixture';
import { ChildsListPageFixture } from '@e2e/pages-fixtures/home/childs-list-page.fixture';

import { GamesListPageFixture } from '@e2e/pages-fixtures/child/games-list-page.fixture';

import { GamesManagerPageFixture } from '@e2e/pages-fixtures/ergo/games-manager-page.fixture';



test.describe("Ergo can change game's config in real-time", () => {
    test.setTimeout(120_000);

    let ergoPage: Page;
    let childPage: Page;

    test.beforeAll(async () => {
        const browser = await chromium.launch();
        const ergoContext = await browser.newContext();
        const childContext = await browser.newContext();

        ergoPage = await ergoContext.newPage();
        await ergoPage.goto(testUrl);

        childPage = await childContext.newPage();
        await childPage.goto(testUrl);
    });


    // Ergo Pages Fixture :
    let ergoChoicePage: ChoicePageFixture;
    let ergoGamesManagerPage: GamesManagerPageFixture;
    // let ergoGameLobbyPage: GameLobbyPageFixture;

    // Child Pages Fixture :
    let childChoicePage: ChoicePageFixture;
    let childChildsListPage: ChildsListPageFixture;
    let childGamesListPage: GamesListPageFixture;

    test.beforeEach(async ({ page }) => {
        ergoChoicePage = new ChoicePageFixture(ergoPage);
        ergoGamesManagerPage = new GamesManagerPageFixture(ergoPage);

        childChoicePage = new ChoicePageFixture(childPage);
        childChildsListPage = new ChildsListPageFixture(childPage);
        childGamesListPage = new GamesListPageFixture(childPage);
    });


    let ergoLobbyName: string;
    let childLobbyName: string;

    test('Ergo change config of game lobby and child watch changes', async ({ page }) => {
        await test.step("Ergo connect", async () => {
            await expect(ergoPage).toHaveURL(/.*\/home/);
            await ergoChoicePage.verifyPageElements();

            await ergoChoicePage.selectErgoRole();

            await expect(ergoPage).toHaveURL(/.*\/ergo\//);
            await ergoPage.waitForLoadState("networkidle");

            await ergoGamesManagerPage.verifyPageElements();
        });

        await test.step("Child connect", async () => {
            await expect(childPage).toHaveURL(/.*\/home/);
            await childChoicePage.verifyPageElements();

            await childChoicePage.selectChildRole();

            await expect(childPage).toHaveURL(/.*\/home\/childs-list/);
            await childPage.waitForLoadState("networkidle");
            await childChildsListPage.waitForChildsCards();

            await childChildsListPage.selectNthChild(0);
            await expect(childPage).toHaveURL(/.*\/child/);

            await childGamesListPage.verifyPageElements();
        });

        await test.step("Ergo open a game lobby", async () => {
            await expect(ergoPage).toHaveURL(/.*\/ergo\/games-manager/);
            await ergoGamesManagerPage.verifyPageElements();

            await ergoGamesManagerPage.launchGame();
            await expect(ergoPage).toHaveURL(/.*\/ergo\/game-lobby/);
            await ergoPage.waitForLoadState("networkidle");

            const lobbyName = "Lobby e2e";
            const lobbyNameInput = await ergoPage.locator("input#name");
            await lobbyNameInput.fill(lobbyName);
            await expect(lobbyNameInput).toHaveValue(lobbyName);

            ergoLobbyName = lobbyName;
        });

        await test.step("Child watch lobby", async () => {
            await expect(childPage).toHaveURL(/.*\/child\/games-list/);
            await childGamesListPage.verifyPageElements();

            const lobbiesName = await childGamesListPage.getLobbiesName();
            await expect(lobbiesName.length).toEqual(1);

            childLobbyName = lobbiesName[0];
        });
    });
});