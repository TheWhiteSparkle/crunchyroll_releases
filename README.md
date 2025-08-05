# Crunchyroll RSS Feed (Lightweight)

Ein einfacher Node.js-Service, der neue Episoden von Crunchyroll ausliest und als RSS-Feed zur Verfügung stellt. Optimiert für MonitoRSS.

## Features
- Titel, Link, Thumbnail, Veröffentlichungsdatum
- Leichtgewichtig (kein Puppeteer)
- Bereit für Render / Vercel Deployment

## Start (lokal)
```
npm install
npm start
```

## Deployment
Einfach bei Render als Web Service deployen, Start Command ist `node index.js`.

RSS Feed abrufbar unter `/feed`
