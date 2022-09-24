import express from 'express';
import path from 'path';
import puppeteer from 'puppeteer';
import fs from 'fs';
import { fileURLToPath } from 'url';

const PORT = process.env.PORT || 8055;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(__dirname + '/images'));

app.get("/kitty", (request, response) => {
    downloadImage('https://genrandom.com/cats/');
    response.sendFile(__dirname + '/views/image.html');
});

app.get("/puppy", (request, response) => {
    downloadImage('https://random.dog/');
    response.sendFile(__dirname + '/views/screenshot.html');
});

app.get("/www.*", (request, response) => {
    console.log(request.protocol);
    try {
        console.log(request.originalUrl.substring(1));
        if (request.protocol === 'https')
            captureScreenshot('https://' + request.originalUrl);
        else if (request.protocol === 'http')
            captureScreenshot('http://' + request.originalUrl);
    } catch (error) {
        console.log(`Error: unable to visit ${request.originalUrl} website.`);
    }
    response.sendFile(__dirname + "/views/screenshot.html");
});

app.get('/^(?!(kitty|puppy|www.*))', (request, response) => {
    console.log('Error: please enter the correct input.')
});

app.listen(PORT, () => {
    console.log(`Express is running on port ${PORT}`);
})

async function downloadImage(url) {
    if (!fs.existsSync("images")) {
        fs.mkdirSync("images");
    }

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    page.on('response', async response => {
        const url = response.url();
        if (response.request().resourceType() === 'image') {
            response.buffer()
            .then(file => {
                const fileName = url.split('/').pop().substring(0, 10);
                const filePath = path.resolve('images', fileName);
                const writeStream = fs.createWriteStream(filePath);
                writeStream.write(file);
            }).catch((error) => {
                console.error(error.message);
            }) 
        }
    });
    await page.goto(url, { waitUntil: 'networkidle0' });
    await browser.close();
}

async function captureScreenshot(url) {
    if (!fs.existsSync("images")) {
        fs.mkdirSync("images");
    }

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        // set viewport width and height
        await page.setViewport({ width: 1440, height: 1080 });
        await page.goto(url, { waitUntil: 'networkidle0' });
        await page.screenshot({ path: `images/screenshot.jpeg` });
    } catch (error) {
        console.log(`Error: ${error.message}`);
    } finally {
        await browser.close();
        console.log(`\nScreenshot captured.`);
    }
}