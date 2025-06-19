import { test, expect, chromium, Page} from '@playwright/test';
import { testUrl } from 'e2e/e2e.config';



test.describe('Ergo change config of game lobby and child watch changes', () => {
    test.setTimeout(120_000);

    let childPage: Page;
    let ergoPage: Page;

    test.beforeAll(async () => {
        const browser = await chromium.launch();
        const ergoContext = await browser.newContext();
        const childContext = await browser.newContext();

        ergoPage = await ergoContext.newPage();
        await ergoPage.goto(testUrl);

        childPage = await childContext.newPage();
        await childPage.goto(testUrl);
    });

    // TODO : Declaring fixture :

    test.beforeEach(async ({ page }) => {
        // TODO : Initializing fixtures
    });

    test('...', async () => {
        // TODO : Defining last test :crossed-fingers:
    });
});