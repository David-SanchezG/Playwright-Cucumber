import { Before, After } from '@cucumber/cucumber';
import { Browser, BrowserContext, chromium } from '@playwright/test';
import { pw } from './pw';
import * as fs from 'fs-extra';

let browser: Browser;
let context: BrowserContext;
let includeVideo = process.env.VIDEO;

Before({}, async function () {
    browser = await chromium.launch({ headless: false });
    context = includeVideo ? await browser.newContext({
        recordVideo: {
            dir: 'test-results/videos',
        },
    }) : await browser.newContext();
    const page = await context.newPage();
    pw.page = page;
});

After(async function ({ pickle }) {
    let img: Buffer;
    img = await pw.page.screenshot(
        { path: `./test-results/screenshots/${pickle.name}.png`, type: 'png' });

    this.attach(
        img, 'image/png'
    );
    if (includeVideo) {
        const videoPath = await pw.page.video().path();
        this.attach(
            fs.readFileSync(videoPath),
            'video/webm'
        );
    }
    await pw.page.close();
    await context.close();
    await browser.close();
});
