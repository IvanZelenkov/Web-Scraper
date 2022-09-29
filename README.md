# Web Scraper

The goal for this assignment is to gain practical experience with using Docker. My objective is to create a Dockerized web application that uses the Puppeteer library for taking a screenshot of a website and show it to your web application’s visitor. I need to host this application publicly on Docker Hub and provide a single “docker run” command that a user should be able to run to set up your web app. In this docker run command, the user should specify the port number on their machine where your web app should be visible.

Pull and run the image from docker hub, use the following command:

`docker run --pull=always --publish <any-port-number>:8055 10112002/web-scraper`
