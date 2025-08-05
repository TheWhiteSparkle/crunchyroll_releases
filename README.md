# Crunchyroll RSS Feed (Puppeteer Version)

Ein robuster RSS-Feed-Scraper für neue Folgen auf Crunchyroll unter https://www.crunchyroll.com/de/videos/new.

## Features
- Verwendet Puppeteer (Headless-Browser) für zuverlässigeres Scraping
- Enthält Titel, Link, Vorschaubild (Thumbnail) und Veröffentlichungsdatum
- Bereit für Deployment auf Render oder anderen Node.js-fähigen Plattformen

## Start (lokal)
```
npm install
npm start
```

## Deployment
Deploy auf Render.com als Web-Service:
- Build command: `npm install`
- Start command: `node index.js`

Dann erreichst du den Feed unter `/feed`.
