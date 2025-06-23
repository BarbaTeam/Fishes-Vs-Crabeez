import { test, expect } from '@playwright/test';
import { testUrl } from 'e2e/e2e.config';

test.describe('Ergo creates a new player and access it to double check', () => {
    test('Ergo creates a new player and access it to double check', async ({ page }) => {
        await test.step("go to ergo page", async () => {
            await page.goto(testUrl);
            
            const pageTitle = await page.getByText('PIXEL TYPER');
            expect(pageTitle).toBeVisible();
            
            const roleSelectionTitle = await page.getByText('Selectionnez votre rôle !');
            expect(roleSelectionTitle).toBeVisible();
            
            const ergoCard = await page.locator('app-choice-button').filter({ hasText: 'Ergothérapeute' });
            expect(ergoCard).toBeVisible();
            
            await expect(ergoCard).toContainText('Un rôle qui permet de créer des sessions multijoueur');
            
            await ergoCard.click();
            
            await expect(page).toHaveURL(/.*\/ergo/);
            
            await page.waitForLoadState('networkidle');
        });

        await test.step("check page", async () => {
            const playerListBtn = page.locator('app-navbar-button').filter({ hasText: 'Liste des joueurs' });
            await expect(playerListBtn).toBeVisible();

            const gamesManagerBtn = page.locator('app-navbar-button').filter({ hasText: 'Gestionnaire de parties' });
            await expect(gamesManagerBtn).toBeVisible();

            const homeBtn = page.locator('app-navbar-button').filter({ hasText: 'Accueil' });
            await expect(homeBtn).toBeVisible();

            await expect(page.getByText('Créer une salle d\'attente')).toBeVisible();

            const launchGameBtn = page.locator('app-big-button').filter({ hasText: 'Lancer une partie' });
            await expect(launchGameBtn).toBeVisible();

            await expect(page.getByText('Ou intéragissez avec les enfants en jeu !')).toBeVisible();

            const hasGames = await page.locator('.game-card').count();
            if (hasGames > 0) {
                await expect(page.getByText('Cliquez pour rejoindre')).toBeVisible();
            } else {
                await expect(page.getByText('Vous n\'avez pas encore créer une partie...')).toBeVisible();
            }
        });

        await test.step("go to child list", async () => {
            const playerListBtn = page.locator('app-navbar-button').filter({ hasText: 'Liste des joueurs' });
            await expect(playerListBtn).toBeVisible();

            await playerListBtn.click();

            await expect(page).toHaveURL(/.*\/ergo\/childs-list/);

            await page.waitForLoadState('networkidle');
        });

        await test.step("check page", async () => {
            const playerListBtn = page.locator('app-navbar-button', { hasText: 'Liste des joueurs' });
            await expect(playerListBtn).toBeVisible();

            const gamesManagerBtn = page.locator('app-navbar-button', { hasText: 'Gestionnaire de parties' });
            await expect(gamesManagerBtn).toBeVisible();

            const homeBtn = page.locator('app-navbar-button', { hasText: 'Accueil' });
            await expect(homeBtn).toBeVisible();

            await expect(page.locator('h3.title')).toHaveText(/Séléctionnez un enfant/i);

            const userBox = page.locator('app-inner-box.blue.scrollable');
            await expect(userBox).toBeVisible();

            const addChildButton = page.locator('app-new-child-button');
            await expect(addChildButton).toBeVisible();
        });

        await test.step("click on new child button", async () => {
            const addChildButton = page.locator('app-new-child-button');
            await expect(addChildButton).toBeVisible();

            await addChildButton.click();
            
            await expect(page).toHaveURL(/.*\/ergo\/new-child/);

            await page.waitForLoadState('networkidle');
        });

        await test.step("check page", async () => {
            const backButton = page.locator('app-navbar-button.red', { hasText: 'Retour' });
            await expect(backButton).toBeVisible();

            const configButton = page.locator('app-navbar-button', { hasText: 'Configuration' });
            await expect(configButton).toBeVisible();

            const createButton = page.locator('app-navbar-button', { hasText: 'Créer' });
            await expect(createButton).toBeVisible();
            await expect(createButton).toHaveClass(/grey/);
            await expect(createButton).not.toHaveClass(/green/);

            const mainBox = page.locator('app-inner-box.main-box.blue.scrollable.big');
            await expect(mainBox).toBeVisible();

            const userConfig = mainBox.locator('app-user-config');
            await expect(userConfig).toBeVisible();
        });
                
        await test.step('Remplir les champs utilisateur', async () => {
            const lastNameInput = page.locator('input#name').first(); 
            await lastNameInput.fill('e2eTest');

            const firstNameInput = page.locator('input#name').nth(1); 
            await firstNameInput.fill('e2eTest');

            const ageInput = page.locator('input#age');
            await ageInput.fill('9');

            const createBtn = page.locator('app-navbar-button', { hasText: 'Créer' });
            await expect(createBtn).toHaveClass(/grey/);
            await expect(createBtn).not.toHaveClass(/green/);
        });

        await test.step('Sélectionner une icône', async () => {
            const iconTrigger = page.locator('.icon-select-trigger');
            await iconTrigger.click();

            const firstIcon = page.locator('.icon-selector img').first();
            await expect(firstIcon).toBeVisible();
            await firstIcon.click();
        });

        await test.step('Check if create button is available after at least one mathematical option is toggled', async () => {
            const createBtn = page.locator('app-navbar-button', { hasText: 'Créer' });

            const getToggle = (label: string) =>
                page.locator(`span:has-text("${label}") label.settings-toggle`);

            const toggles = {
                reecriture: getToggle('Réécriture des nombres'),
                addition: getToggle('Addition'),
                soustraction: getToggle('Soustraction'),
                multiplication: getToggle('Multiplication'),
                division: getToggle('Division'),
            };

            for (const [label, toggle] of Object.entries(toggles)) {
                await expect(toggle, `${label} toggle should be visible`).toBeVisible();

                await toggle.click();
                await expect(createBtn).toHaveClass(/green/);
                await expect(createBtn).not.toHaveClass(/grey/);

                await toggle.click(); 
                await expect(createBtn).toHaveClass(/grey/);
                await expect(createBtn).not.toHaveClass(/green/);
            }

            await toggles.reecriture.click();
            await expect(createBtn).toHaveClass(/green/);
            await expect(createBtn).not.toHaveClass(/grey/);
        });

        await test.step('click on create', async () => {
            const createBtn = page.locator('app-navbar-button', { hasText: 'Créer' });
            await expect(createBtn).toHaveClass(/green/);
            await createBtn.click();

            await expect(page).toHaveURL(/.*\/ergo\/childs-list/);

            await page.waitForLoadState('networkidle');
        });
        
        await test.step('click on the freshly created user', async () => {
            const userInList = page
                .locator('app-stateful-users-list')
                .getByText('e2eTest')
                .first();
    
            await expect(userInList).toBeVisible();  

            await userInList.click();
            
            await expect(page).toHaveURL(/.*\/ergo\/child-stats/);

            await page.waitForLoadState('networkidle');
        });

        await test.step('check page', async () => {
            const backButton = page.locator('app-navbar-button.red', { hasText: 'Retour' });
            await expect(backButton).toBeVisible();
            
            const configButton = page.locator('app-navbar-button', { hasText: 'Configuration' });
            await expect(configButton).toBeVisible();
            
            const userCard = page.locator('app-navbar-button app-user-card');
            await expect(userCard).toBeVisible();
            await expect(userCard).toContainText('e2eTest');

            const sideBox = page.locator('app-side-box.button-list');
            await expect(sideBox).toBeVisible();
            
            const statsButton = sideBox.locator('app-small-button', { hasText: 'Stats' });
            await expect(statsButton).toBeVisible();
            
            const historyLabel = sideBox.locator('p', { hasText: 'HISTORIQUE' });
            await expect(historyLabel).toBeVisible();
            
            const mainBox = page.locator('app-inner-box.main-box.blue.medium');
            await expect(mainBox).toBeVisible();
            
            const scrollableBox = page.locator('app-inner-box.main-box.blue.medium.scrollable');
            const invalidSectionBox = page.locator('app-inner-box.main-box.blue.medium', { hasText: 'Contenu Inexistant' });
            
            await expect(scrollableBox.or(invalidSectionBox)).toBeVisible();
        });

        await test.step('click on config', async () => {
            const configButton = page.locator('app-navbar-button', { hasText: 'Configuration' });
            await expect(configButton).toBeVisible();
            
            configButton.click();

            await expect(page).toHaveURL(/.*\/ergo\/child-config/);

            await page.waitForLoadState('networkidle');
        });

        await test.step('Check user info', async () => {
            const lastNameInput = page.locator('input#name').first();
            await expect(lastNameInput).toHaveValue('e2eTest');
            
            const firstNameInput = page.locator('input#name').nth(1);
            await expect(firstNameInput).toHaveValue('e2eTest');
            
            const ageInput = page.locator('input#age');
            await expect(ageInput).toHaveValue('9');

            const iconTrigger = page.locator('.icon-select-trigger');
            await expect(iconTrigger).toBeVisible();
            
            const selectedIcon = iconTrigger.locator('img');
                await expect(selectedIcon).toBeVisible();
            
            const reecritureToggle = page.locator('span:has-text("Réécriture des nombres") label.settings-toggle');
            await expect(reecritureToggle).toBeVisible();
            

            //await expect(reecritureToggle).toHaveClass(/active|checked|enabled/);
            
            const reecritureCheckbox = reecritureToggle.locator('input[type="checkbox"]');
                await expect(reecritureCheckbox).toBeChecked();
        });

        await test.step('Supprimer un utilisateur avec déverrouillage', async () => {
            const deleteButton = page.locator('app-big-button.delete', { hasText: 'Supprimer' });
            await expect(deleteButton).toBeVisible();
            await expect(deleteButton).toHaveClass(/grey/);
            await expect(deleteButton).not.toHaveClass(/red/);
            
            const closedLockIcon = page.locator('img[src*="close_lock.png"].delete.icon');
            await expect(closedLockIcon).toBeVisible();
            await expect(closedLockIcon).toHaveClass(/visible/);
            
            const openLockIcon = page.locator('img[src*="open_lock.png"].cap.icon');
            await expect(openLockIcon).not.toHaveClass(/visible/);
            
            await closedLockIcon.click();
            
            await expect(deleteButton).toHaveClass(/red/);
            await expect(deleteButton).not.toHaveClass(/grey/);
            
            await expect(openLockIcon).toHaveClass(/visible/);
            
            await expect(closedLockIcon).not.toHaveClass(/visible/);
            
            await deleteButton.click();

            await expect(page).toHaveURL(/.*\/ergo\/childs-list/);
        });

        await test.step('check if user is deleted', async () => {
            const userInList = page
                .locator('app-stateful-users-list')
                .getByText('e2eTest')
                .first();
    
            await expect(userInList).not.toBeVisible();  
        });
    });
});
