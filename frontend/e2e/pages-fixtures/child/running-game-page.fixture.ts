import { E2EComponentFixture } from '@e2e/e2e-component.fixture';
import { expect } from '@playwright/test';

export class RunningGamePageFixture extends E2EComponentFixture {

    async waitForGameToLoad() {
        await this.page.waitForSelector("canvas.game", { state: "visible" });
        await this.page.waitForLoadState("networkidle");

        // Waiting for the 1st question :
        await expect(this.page.locator(".question p")).not.toContainText("Chargement de la question");
        await this.page.waitForSelector(".question p", { state: "visible" });

        console.log("Jeu démarré avec succès");
    }

    async playQuestions(maxQuestions: number = 1) {
        let questionsAnswered = 0;

        while (questionsAnswered < maxQuestions) {
            const questionElement = this.page.locator(".question p");

            if (await questionElement.isVisible()) {
                const questionText = await questionElement.textContent();
                console.log(`Question ${questionsAnswered + 1}:`, questionText);

                const fullAnswer = await this.getAnswerFromSpans();

                if (fullAnswer) {
                    await this.typeAnswer(fullAnswer);
                    questionsAnswered++;
                }
            }
        }
    }

    private async getAnswerFromSpans(): Promise<string> {
        const answerSpans = this.page.locator(".answer span");
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
            return fullAnswer;
        }
        return "";
    }

    private async typeAnswer(answer: string) {
        await this.page.keyboard.type(answer.replace(/\s+/g, ''), { delay: 50 });
        await this.page.keyboard.press("Enter");
        await this.page.waitForTimeout(1000);
    }

    async exitGameViaBackButton() {
        console.log("Simulation du bouton retour du navigateur...");
        await this.page.goBack();
    }
}