# Web Scraper

The goal of this assignment is to gain practical experience with using Docker. My objective was to create a Dockerized web application that uses the Puppeteer library for taking a screenshot of a website and showing it to your web application’s visitor. I hosted this application publicly on Docker Hub and provided a single “docker run” command that a user should be able to run to set up my web app. In this docker run command, the user should specify the port number on their machine where the web app should be visible.

Pull and run the image from docker hub, use the following command:

`docker run --pull=always --publish <any-port-number>:8055 10112002/web-scraper`
