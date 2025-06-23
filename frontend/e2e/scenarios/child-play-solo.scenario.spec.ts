import { test, expect, Page } from '@playwright/test';
import { testUrl } from 'e2e/e2e.config';



////////////////////////////////////////////////////////////////////////////////
// Test :
////////////////////////////////////////////////////////////////////////////////

test.describe('Child play a game in solo and see its updated stats', () => {
    test.setTimeout(120_000);

    test('Child connect and play solo game', async ({ page }) => {
        let initialStats: {
            globalGrade?: string;
            wordsPerMinute?: string;
            sectionsCount?: number;
        } = {};
        let finalStats: {
            globalGrade?: string;
            wordsPerMinute?: string;
            sectionsCount?: number;
        } = {};

        await test.step("Child go to childs list", async () => {
            await page.goto(testUrl);
            await expect(page).toHaveURL(/.*\/home/);

            await expect(page.getByText("PIXEL TYPER")).toBeVisible();
            await expect(page.getByText("Selectionnez votre rôle !")).toBeVisible();

            const childChoiceBtn = page.locator("app-choice-button").filter({ has: page.getByText(/^Enfant$/) });
            await expect(childChoiceBtn).toBeVisible();
            await expect(childChoiceBtn).toContainText("Un rôle qui permet de jouer");

            await childChoiceBtn.click();
            await expect(page).toHaveURL(/.*\/home\/childs-list/);
            await page.waitForLoadState("networkidle");
        });

        await test.step("Child select the first child in list", async () => {
            await page.waitForSelector("app-user-list app-user-card", { state: "visible" });

            const childCard = page.locator("app-user-list app-user-card").nth(0);
            await expect(childCard).toBeVisible();

            const selectedChildName = await childCard.locator(".first-name").innerText();
            await childCard.click();

            await expect(page).toHaveURL(/.*\/child/);
            const currChildName = await page.locator("app-user-card .first-name").innerText();
            await expect(currChildName).toBe(selectedChildName);

            const navbar = page.locator("app-navbar");
            const navButtons = navbar.locator("app-navbar-button");

            await expect(navButtons).toHaveCount(3);

            const profileCard = navButtons.nth(0).locator("app-user-card");
            await expect(profileCard).toBeVisible();
            await expect(profileCard.locator(".first-name")).toHaveText(selectedChildName);

            const gamesListBtn = navButtons.nth(1);
            await expect(gamesListBtn).toContainText("Liste des parties");

            const bestiaryBtn = navButtons.nth(2);
            await expect(bestiaryBtn).toContainText("Bestiaire");

            await expect(page.getByText("Jouer seul")).toBeVisible();
            await expect(page.getByText("Ou à plusieurs")).toBeVisible();
        });

        await test.step("Capture initial stats from profile page", async () => {
            const profileBtn = page.locator("app-navbar app-navbar-button").nth(0);
            await profileBtn.click();

            await expect(page).toHaveURL(/.*\/child\/profile/);
            await page.waitForLoadState("networkidle");

            // Attendre le chargement des statistiques
            await page.waitForSelector("app-inner-box.blue.medium", { state: "visible" });

            const statsButton = page.locator("app-small-button").filter({ hasText: "Stats" });
            await expect(statsButton).toHaveClass(/active/);

            // Attendre que le chargement se termine
            await page.waitForFunction(() => {
                const loadingElements = document.querySelectorAll('p');
                for (const element of loadingElements as unknown as any[]) {
                    if (element.textContent?.includes("Chargement des statistiques...")) {
                        return false;
                    }
                }
                return true;
            }, { timeout: 10000 });

            await page.waitForTimeout(2000);

            try {
                const statsContainer = page.locator("app-inner-box.blue.medium").first();

                const gradeStatLine = statsContainer.locator("app-stat-line").filter({ hasText: "Note" });
                const wpmStatLine = statsContainer.locator("app-stat-line").filter({ hasText: "Mots par minutes" });

                if (await gradeStatLine.isVisible()) {
                    const gradeText = await gradeStatLine.textContent();
                    initialStats.globalGrade = gradeText?.trim() || "unknown";
                    console.log("Stats initiales - Note:", gradeText);
                }

                if (await wpmStatLine.isVisible()) {
                    const wpmText = await wpmStatLine.textContent();
                    initialStats.wordsPerMinute = wpmText?.trim() || "unknown";
                    console.log("Stats initiales - MPM:", wpmText);
                }

                const sectionsButtons = page.locator("app-small-button");
                initialStats.sectionsCount = await sectionsButtons.count();
                console.log("Stats initiales - Nombre de parties:", initialStats.sectionsCount);

            } catch (error) {
                console.warn("Impossible de capturer les stats initiales:", error);
            }

            // Retourner au menu principal
            const gamesBtn = page.locator("app-navbar app-navbar-button").nth(1);
            await gamesBtn.click();
            await page.waitForLoadState("networkidle");
        });

        await test.step("Child start a solo game", async () => {
            const soloContainer = page.locator(".solo-conteneur");
            const playButton = soloContainer.locator("app-big-button");

            await expect(playButton).toBeVisible();
            await expect(playButton).toContainText("Jouer");

            await playButton.click();

            // Attendre le chargement du jeu
            await page.waitForSelector("canvas.game", { state: "visible" });
            await page.waitForLoadState("networkidle");

            // Attendre la première question
            await expect(page.locator(".question p")).not.toContainText("Chargement de la question");
            await page.waitForSelector(".question p", { state: "visible" });

            console.log("Jeu démarré avec succès");
        });

        await test.step("Play the game and end it", async () => {
            // Jouer quelques tours pour établir une partie valide
            let questionsAnswered = 0;
            const maxQuestions = 1;

            while (questionsAnswered < maxQuestions) {
                // Récupérer et répondre à la question
                const questionElement = page.locator(".question p");
                if (await questionElement.isVisible()) {
                    const questionText = await questionElement.textContent();
                    console.log(`Question ${questionsAnswered + 1}:`, questionText);

                    const answerSpans = page.locator(".answer span");
                    const answerCount = await answerSpans.count();

                    if (answerCount > 0) {
                        let fullAnswer = "";
                        for (let i = 0; i < answerCount; i++) {
                            const span = answerSpans.nth(i);
                            const letter = await span.textContent();
                            if (letter && letter.trim() !== '') {
                                fullAnswer += letter;
                            }
                        }

                        console.log(`Réponse attendue: "${fullAnswer}"`);

                        if (fullAnswer) {
                            await page.keyboard.type(fullAnswer.replace(/\s+/g, ''), { delay: 50 });
                            await page.keyboard.press("Enter");
                            await page.waitForTimeout(1000);
                            questionsAnswered++;
                        }
                    }
                }
            }

            // NOUVEAU: Simuler un clic sur le bouton de retour du navigateur
            console.log("Simulation du bouton retour du navigateur...");
            await page.goBack();
        });

        await test.step("Verify updated stats in profile", async () => {
            await expect(page).toHaveURL(/.*\/child/);

            const profileBtn = page.locator("app-navbar app-navbar-button").nth(0);
            await profileBtn.click();

            await expect(page).toHaveURL(/.*\/child\/profile/);
            await page.waitForLoadState("networkidle");

            // Sometime the statistics' page need to be reloaded to see updates
            await page.reload();

            // Attendre la mise à jour des stats côté serveur
            await page.waitForTimeout(3000);

            const statsButton = page.locator("app-small-button").filter({ hasText: "Stats" });
            await expect(statsButton).toHaveClass(/active/);

            // Attendre le chargement
            await page.locator('p', { hasText: 'Chargement des statistiques...' }).waitFor({
                state: 'detached',
                timeout: 10000,
            });

            await page.waitForTimeout(2000);

            const statsContainer = page.locator("app-inner-box.blue.medium").first();

            const gradeStatLine = statsContainer.locator("app-stat-line").filter({ hasText: "Note" });
            const wpmStatLine = statsContainer.locator("app-stat-line").filter({ hasText: "Mots par minutes" });

            if (await gradeStatLine.isVisible()) {
                const gradeText = await gradeStatLine.textContent();
                finalStats.globalGrade = gradeText?.trim() || "unknown";
                console.log("Stats finales - Note:", gradeText);
            }

            if (await wpmStatLine.isVisible()) {
                const wpmText = await wpmStatLine.textContent();
                finalStats.wordsPerMinute = wpmText?.trim() || "unknown";
                console.log("Stats finales - MPM:", wpmText);
            }

            const sectionsButtons = page.locator("app-small-button");
            finalStats.sectionsCount = await sectionsButtons.count();
            console.log("Stats finales - Nombre de parties:", finalStats.sectionsCount);

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
