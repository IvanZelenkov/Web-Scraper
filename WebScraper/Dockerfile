# Pull and run the image from docker hub, use the following command:
# docker run --pull=always --publish <any-port-number>:8055 10112002/web-scraper

FROM node:16

RUN apt-get update \
 && apt-get install -y chromium \
    fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
    --no-install-recommends
    
ENV NODE_ENV production \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true \
    PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium

WORKDIR /

COPY ["package.json", "package-lock.json", "./"]

RUN npm install --production

COPY . .

EXPOSE 8055

CMD ["node", "server.js"]