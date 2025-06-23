import { test, expect } from '@playwright/test';
import { testUrl } from '../e2e.config';

import { ChoiceButtonFixture } from '@app/shared/components/choice-button/choice-button.fixture';
import { ErgoHomePageFixture } from '@e2e/pages-fixtures/ergo-home-page.fixture';
import { ChildListPageFixture } from '@e2e/pages-fixtures/child-list-page.fixture';
import { NewChildPageFixture } from '@e2e/pages-fixtures/new-child-page.fixture';
import { ChildConfigPageFixture } from '@e2e/pages-fixtures/child-config-page.fixture';
import { ChildStatsPageFixture } from '@e2e/pages-fixtures/child-stats-page.fixture';



test.describe('Ergo creates a new player and access it to double check', () => {
    test.setTimeout(120_000);

    let choiceButton: ChoiceButtonFixture;
    let ergoHomePage: ErgoHomePageFixture;
    let childrenListPage: ChildListPageFixture;
    let newChildPage: NewChildPageFixture;
    let childConfigPage: ChildConfigPageFixture;
    let childStatsPage: ChildStatsPageFixture;

    const testChildData = {
        lastName: 'e2eTest',
        firstName: 'e2eTest',
        age: '9'
    };

    test.beforeEach(async ({ page }) => {
        choiceButton = new ChoiceButtonFixture(page);
        ergoHomePage = new ErgoHomePageFixture(page);
        childrenListPage = new ChildListPageFixture(page);
        newChildPage = new NewChildPageFixture(page);
        childConfigPage = new ChildConfigPageFixture(page);
        childStatsPage = new ChildStatsPageFixture(page);
    });

    test('Ergo creates a new player and access it to double check', async ({ page }) => {
        await test.step("Navigate to ergo page", async () => {
            await page.goto(testUrl);

            await expect(page.getByText('PIXEL TYPER')).toBeVisible();
            await expect(page.getByText('Selectionnez votre rôle !')).toBeVisible();
            await expect(choiceButton.ergoCard()).toBeVisible();
            await expect(choiceButton.ergoCard()).toContainText('Un rôle qui permet de créer des sessions multijoueur');

            await choiceButton.ergoCard().click();
            await expect(page).toHaveURL(/.*\/ergo/);
            await page.waitForLoadState('networkidle');
        });

        await test.step("Verify ergo home page", async () => {
            await ergoHomePage.verifyPageElements();
            await ergoHomePage.checkGamesStatus();
        });

        await test.step("Navigate to children list", async () => {
            await ergoHomePage.navigateToPlayerList();
            await expect(page).toHaveURL(/.*\/ergo\/childs-list/);
        });

        await test.step("Verify children list page", async () => {
            await childrenListPage.verifyPageElements();
        });

        await test.step("Navigate to new child creation", async () => {
            await childrenListPage.navigateToNewChild();
            await expect(page).toHaveURL(/.*\/ergo\/new-child/);
        });

        await test.step("Verify new child page", async () => {
            await newChildPage.verifyPageElements();
            await newChildPage.verifyCreateButtonState(false);
        });

        await test.step('Fill user information', async () => {
            await newChildPage.fillUserInfo(
                testChildData.lastName,
                testChildData.firstName,
                testChildData.age
            );
            await newChildPage.verifyCreateButtonState(false);
        });

        await test.step('Select icon', async () => {
            await newChildPage.selectIcon();
        });

        await test.step('Test mathematical options toggles', async () => {
            const mathOptions = ['reecriture', 'addition', 'soustraction', 'multiplication', 'division'] as const;

            // Test each toggle individually
            for (const option of mathOptions) {
                await newChildPage.toggleMathOption(option);
                await newChildPage.verifyCreateButtonState(true);

                await newChildPage.toggleMathOption(option);
                await newChildPage.verifyCreateButtonState(false);
            }

            // Enable one option for creation
            await newChildPage.toggleMathOption('reecriture');
            await newChildPage.verifyCreateButtonState(true);
        });

        await test.step('Create child', async () => {
            await newChildPage.createChild();
            await expect(page).toHaveURL(/.*\/ergo\/childs-list/);
        });

        await test.step('Select the newly created child', async () => {
            await childrenListPage.verifyChildExists(testChildData.firstName);
            await childrenListPage.selectChild(testChildData.firstName);
            await expect(page).toHaveURL(/.*\/ergo\/child-stats/);
        });

        await test.step('Verify child stats page', async () => {
            await childStatsPage.verifyPageElements(testChildData.firstName);
        });

        await test.step('Navigate to child configuration', async () => {
            await childStatsPage.navigateToConfig();
            await expect(page).toHaveURL(/.*\/ergo\/child-config/);
        });

        await test.step('Verify saved child information', async () => {
            await childConfigPage.verifyUserInfo(
                testChildData.lastName,
                testChildData.firstName,
                testChildData.age
            );
            await childConfigPage.verifyToggleState('Réécriture des nombres', true);
        });

        await test.step('Delete child with unlock mechanism', async () => {
            await childConfigPage.verifyDeleteButtonLocked();
            await childConfigPage.deleteChild();
            await expect(page).toHaveURL(/.*\/ergo\/childs-list/);
        });

        await test.step('Verify child is deleted', async () => {
            await childrenListPage.verifyChildDoesNotExist(testChildData.firstName);
        });
    });
});