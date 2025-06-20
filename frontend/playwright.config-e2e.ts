import { PlaywrightTestConfig } from '@playwright/test';

// TODO : Isolating reports ...


const config: PlaywrightTestConfig = {
    reporter: [['html', { open: 'always' }]], // To remove maybe
    use: {
        headless: false,
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
        video: 'on-first-retry',
        screenshot: 'only-on-failure',
        launchOptions: {
            slowMo: 1000,
        }
    },
};

export default config;