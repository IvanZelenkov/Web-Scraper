import express from 'express';
import path from 'path';
import puppeteer from 'puppeteer';

const PORT = process.env.PORT || 8055;
const HOST = '0.0.0.0';
const IMAGE_PATH = 'images';
const min = 100000;
const max = 999999;

const app = express();

app.get("/kitty", async (request, response) => {
    console.log('User requested a cat image.');

    const website = 'https://genrandom.com/cats/';
    const filename = "cat.png";
    const filepath = path.join(IMAGE_PATH, filename);
    console.log('The image is saved in the following path: ' + filepath);

    (async () => {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox'],
            headless: true,
        });
        const page = await browser.newPage();
        // If below waitunitl is not added, then the code might take screenshot even before all resources load
        // networkidle2 is heuristic that "thinks" site is loaded if no more than 2 requests happen in 500 ms;
        await page.goto(website, {waitUntil: 'networkidle2'}); 
        await page.waitForSelector('#gatsby-focus-wrapper > div > div > div > div > div > div > div > div > img');
        const image =  await page.$('#gatsby-focus-wrapper > div > div > div > div > div > div > div > div > img');
        await image.screenshot({path: filepath});
        await browser.close();
        response.sendFile(path.resolve(filepath));
    })();
});

app.get("/puppy", async (request, response) => {
    console.log('User requested a dog image.');

    const website = 'https://random.dog/';
    const filename = "dog.png";
    const filepath = path.join(IMAGE_PATH, filename);
    console.log('The image is saved in the following path: ' + filepath);

    const defaultViewport = {
        height: 1920,
        width: 1280
    };

    (async () => {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox'],
            headless: true,
        });
        const page = await browser.newPage();
        // If below waitunitl is not added, then the code might take screenshot even before all resources load
        // networkidle2 is heuristic that "thinks" site is loaded if no more than 2 requests happen in 500 ms;
        await page.goto(website, {waitUntil: 'networkidle2'}); 
        await page.waitForSelector('#dog-img');

        // Resize the viewport to screenshot elements outside of the viewport
        const bodyHandle = await page.$('body');
        const boundingBox = await bodyHandle.boundingBox();
        const newViewport = {
            width: Math.max(defaultViewport.width, Math.ceil(boundingBox.width)),
            height: Math.max(defaultViewport.height, Math.ceil(boundingBox.height)),
        };
        await page.setViewport(Object.assign({}, defaultViewport, newViewport));

        const image =  await page.$('#dog-img');
        await image.screenshot({path: filepath});
        await browser.close();
        response.sendFile(path.resolve(filepath));
    })();
});

app.get("/www.*", async (request, response) => {
    const website = 'http://' + request.url.substring(1);
    console.log('User requested the following website screenshot: ' + website);
    const filename = "screenshot.png";
    const filepath = path.join(IMAGE_PATH, filename);
    console.log('The screenshot is saved in the following path: ' + filepath);

    (async () => {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox'],
            headless: true,
        });
        const page = await browser.newPage();
        // If below waitunitl is not added, then the code might take screenshot even before all resources load
        // networkidle2 is heuristic that "thinks" site is loaded if no more than 2 requests happen in 500 ms;
        await page.goto(website, {waitUntil: 'networkidle2'}); 
        await page.screenshot({path: filepath});
        await browser.close();
        response.sendFile(path.resolve(filepath));
    })();
});

app.get('*', async (request, response) => {
    response.send('<h1>Error: please enter a valid request.</h1>');
});

app.listen(PORT, () => {
    console.log(`Running on http://${HOST}:${PORT}`);
});
