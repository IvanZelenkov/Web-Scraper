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

app.get("/kitty", async (request, response) => {
    downloadImage('https://genrandom.com/cats/', 'cat');
    response.sendFile(__dirname + '/views/catPNG.html');
});

app.get("/puppy", async (request, response) => {
    downloadImage('https://random.dog/', 'dog', response);
});

app.get("/www.*", async (request, response) => {
    console.log(request.protocol);
    try {
        console.log(request.originalUrl.substring(1));
        await captureScreenshot('http://' + request.originalUrl);
    } catch (error) {
        console.log(`Error: unable to visit ${request.originalUrl} website.`);
    }
    response.sendFile(__dirname + "/views/screenshot.html");
});

app.get('*', async (request, response) => {
    response.sendFile(__dirname + '/views/error.html');
});

app.listen(PORT, () => {
    console.log(`Express is running on port ${PORT}`);
});

async function downloadImage(url, type, expressResponse) {
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
                const fileName = url.split('/').pop();
                if (!(fileName.includes('gen') || fileName.includes('sodar')) && type === 'cat') {
                    const filePath = path.resolve(__dirname, 'images', 'cat.png');
                    const writeStream = fs.createWriteStream(filePath);
                    writeStream.write(file);
                } else if (type === 'dog') {
                    const extension = fileName.substring(fileName.indexOf('.'));
                    console.log(extension);
                    const filePath = path.resolve(__dirname, 'images', 'dog' + extension);
                    const writeStream = fs.createWriteStream(filePath);
                    writeStream.write(file);
                    try {
                        expressResponse.sendFile(__dirname + '/views/dog' + extension.replace('.', '').toUpperCase() + '.HTML');
                    } catch (errorFormat) {
                        console.log('Video format is not supported');
                    }
                }
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