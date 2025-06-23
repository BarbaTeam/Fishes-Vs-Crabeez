import { PlaywrightTestConfig } from '@playwright/test';



const config: PlaywrightTestConfig = {
    outputDir: '/e2e-results/tests-results',
    reporter: [['html', { open: 'never', outputFolder: '/e2e-results/playwright-report'}]],
    testMatch: ['e2e/**/*.spec.ts'],
    use: {
        headless: true,
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
        video: 'on',
        screenshot: 'on',
        launchOptions: {
            slowMo: 1000,
        }
    },
};

export default config;